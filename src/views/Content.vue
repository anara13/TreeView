<template>
    <div>
        <h2 class="h2">Gestion de documents</h2>

        <div class="main-content">
            <!--<audio v-if="pathExtension=='wav'" :src="pathItem" controls width="100%" height="auto" style="display:block; margin: 30vh auto" />
            <video v-if="pathExtension=='avi' || pathExtension=='mp4' " :src="pathItem" controls width="100%" height="auto" /> 
            <div v-if="pathExtension=='pdf' || pathExtension=='html' || pathExtension=='txt'" style="display:flex; justify-content:center;align-item:center;">
                <iframe :src="source" style="width: 100%; height:100vh" />
            </div>
            <div v-if="pathExtension=='jpg' || pathExtension=='png' || pathExtension=='gif' || pathExtension=='bmp' || pathExtension=='ico'">
                <img :src="pathItem" style="display:block; margin: 30vh auto" />
            </div>-->
            
            <!-- Rendering the loaded file -->
            <div v-if="resultLoaded" id="file-preview" style="width:100%;height:800px;">
                <audio v-if="fileType === 'wav'" :src="source" type="audio/wav" controls="controls"></audio>
                <video v-else-if="fileType === 'mp4'" type="video/mp4" :src="source" controls="controls" width="1280" height="800"></video>
                <img v-else-if="fileType === 'bmp' || fileType === 'png'" :src="source" alt="Fichier téléchargé" height="auto" width="auto">
                <iframe v-else :src="source" style="width:99%;height:100%;" id="printf" name="printf"></iframe>
            </div>

            <!-- Waiting screen before server response-->
            <div v-if="calculatingResponse">
                <svg class="rotator" style="width:120px;height:120px; margin: 130px auto 20px auto; display: block" viewBox="0 0 24 24">
                    <path fill="#ddd" d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                </svg>
                <h2 class="h2" style="text-align: center; color: #888;">Récupération du fichier...</h2>
            </div>

            <!-- Initial screen -->
            <div v-if="source.length === 0">
                <div style="font-size: 24px; text-align: center;">
                    <i class="far fa-file fa-10x" style="transform: rotate(-3deg);width:240px;height:240px; margin: 130px auto 20px auto; display: block; color: #ddd" viewBox="0 0 24 24"></i>
                </div>
                <h2 class="h2" style="text-align: center; color: #888;">Recherchez un fichier à afficher dans l'arborescence</h2>
            </div>

            <!--Error screen-->
            <div v-if="error">
                <div style="font-size: 24px; text-align: center;">
                    <i class="far fa-file fa-10x" style="transform: rotate(-3deg);width:240px;height:240px; margin: 130px auto 20px auto; display: block; color: #ddd" viewBox="0 0 24 24"></i>
                </div>
                <h2 class="h2" style="text-align: center; color: #888;">Le fichier que vous avez sélectionné n'a pas été trouvé</h2>
            </div>
    </div>
</div>
</template>

<script>
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import axios from 'axios';
    //import PortalAPI from '../../api/portal';

    @Component({})
    export default class Content extends Vue {
        resultLoaded = false;
        calculatingResponse = false;
        source = '';
        fileType;
        pathItem ="";
        pathExtension="";
        isError = false;
        mounted() {
            this.addFontAwesome();
            //on récupère ici l'élément sélectionné dans le treeView
            this.$root.$on('item-left-clicked', itemPath => {
                //this.resultLoaded = false;
                //this.calculatingResponse = true;
                this.pathItem = itemPath.toString();
                //this.pathExtension = itemPath.split('.').pop();
                //this.$emit('clicked', 'true')
                // TODO: sur l'exemple de https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript
                // this.source = 'https://docs.google.com/gview?url='+'http://dictee.zenidoc.com:9000/cache/123456789.pdf';
                //this.source = "loading";
                //this.fileType = "pdf";
                
                // const action = 'read';
                this.fetchAndReadFile(this.pathItem);
            });                

            this.$root.$on('open-and-print-item', action => {
                /*this.source = 'http://dictee.zenidoc.com:9000/cache/123456789.pdf';
                this.fileType = "pdf";*/
                this.fetchAndPrintFile();
            });
        }

        created() {
            this.addFontAwesome();
        }

        fetchAndPrintFile() {
            // TODO: "SecurityError: Permission denied to access property "print" on cross-origin object"
            // Erreur à cause de Firefox (aussi sur IE apparemment)
            // Check ici https://bugzilla.mozilla.org/show_bug.cgi?id=911444
            // iframe.src = "./fake_files/lorem_ipsum.pdf";
            // iframe.src = 'https://docs.google.com/gview?url='+'http://dictee.zenidoc.com:9000/cache/123456789.pdf';
            let iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            // iframe.src = 'http://dictee.zenidoc.com:9000/cache/123456789.pdf';
            iframe.style.visibility = 'hidden';
            iframe.onload = function() {
                console.log("file loaded");
                setTimeout(function() {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                    //iframe.contentWindow.document.getElementById('print').click();
                }, 3000);
            };
        }

        /**
         * Récupère et affiche le fichier sélectionné 
         * TODO: intégrer un message d'erreur si le fichier n'a pas été trouvé (pour plus tard quand on aura accès au serveur)
         */
        fetchAndReadFile(itemPath){

            //on récup le nom du fichier sélectionné
            this.calculatingResponse = true;
            //le nom du fichier
            this.pathExtension = itemPath.split('.').shift();
            //l'extension du fichier
            this.fileType = itemPath.split('.').pop();
             
            //TODO: à afficher lorsque l'on aura accès au serveur
            let searchURL = '';
            /*PortalAPI.visuarbc_getfile(filePath)
                .then((response) => {
                    searchURL = response[0];
                    this.source = searchURL;
                })
                .catch((error) => {
                    this.source = '';
                    console.log('Fichier non trouvé' + error)
                    isError = true;
                })


            setTimeout(()=> {
                this.resultLoaded = true; 
                this.calculatingResponse = false;
            }, 3000);*/


            //le lien vers le fichier

            //si c'est un document pouvant être visualisé par microsoft office, alors il a un lien spécial
            if(this.fileType == "docx" || this.fileType == "doc" || this.fileType == "docm" || this.fileType == "dotm" || this.fileType == "dotx" || this.fileType == "xlsx" || this.fileType == "xlsb" || this.fileType == "xls" || this.fileType == "xlsm" || this.fileType == "pptx" || this.fileType == "ppsx" || this.fileType == "ppt" || this.fileType == "pps" || this.fileType == "pptm" || this.fileType == "potm" || this.fileType == "ppam" || this.fileType == "potx" || this.fileType == "ppsm")
            {
                //TODO: searchURL à supprimer quand on aura accès au serveur
                searchURL = 'https://github.com/poychang/blog.poychang.net/raw/master/assets/post-files/THIS-IS-WORD.docx'
                //this.source = 'https://view.officeapps.live.com/op/view.aspx?src=' + searchURL;
                //ou
                this.source = 'https://view.officeapps.live.com/op/embed.aspx?src=' + searchURL;

            }
            //TODO : à des fins de test uniquement, à supprimer lorsque l'on pourra avoir accès aux fichiers sur le serveur
            else if(this.fileType == "pdf")
            {
                this.source = 'https://www.soundczech.cz/temp/lorem-ipsum.pdf';
            }

            else if(this.fileType == "mp4")
            {
                this.source = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';
            }

            else if(this.fileType == "png")
            {
                this.source = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/640px-Google_Images_2015_logo.svg.png';
            }

            
            //indiquer au template que le fichier a bien été chargé
            this.resultLoaded = true;
            this.calculatingResponse = false;

        }

        /**
         * Méthode pour utiliser FontAwesome (icônes des fichiers)
         */
        addFontAwesome() {
            let head = window.document.querySelector('head');
            let linkFontAwesome = '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">';
            head.innerHTML += linkFontAwesome;
        }

    }
</script>

<style lang="stylus">
    @import '../main.styl';
    .app > .content {
        width: calc(100% - 470px);
    }

    .rotator {
        animation: rotating 1.1s linear infinite;
    }

    @-webkit-keyframes rotating {
        from{
            -webkit-transform: rotate(360deg);
        }
        to{
            -webkit-transform: rotate(0deg);
        }
    }

</style>

<style scoped>
.main-content{
    display:grid;
    align-content: center;
}

@media (max-width: 500px){  

}

</style>