<template>
    <div>
        <h2 class="h2">Gestion de documents</h2>

        <div class="main-content">
            <audio v-if="pathExtension=='wav'" :src="pathItem" controls width="100%" height="auto" style="display:block; margin: 30vh auto" />
            <video v-if="pathExtension=='avi' || pathExtension=='mp4' " :src="pathItem" controls width="100%" height="auto" /> 
            <div v-if="pathExtension=='pdf' || pathExtension=='html' || pathExtension=='txt' " style="display:flex; justify-content:center;align-item:center;">
                <iframe :src="pathItem" style="width: 100%; height:100vh" />
            </div>
            <div v-if="pathExtension=='jpg' || pathExtension=='png' || pathExtension=='gif' || pathExtension=='bmp' || pathExtension=='ico'">
                <img :src="pathItem" style="display:block; margin: 30vh auto" />
            </div>
            
            <!-- Rendering the loaded file 
            <div v-if="resultLoaded" id="file-preview" style="width:100%;height:800px;">
                <audio v-if="fileType === 'wav'" :src="source" type="audio/wav" controls="controls"></audio>
                <video v-else-if="fileType === 'mp4'" type="video/mp4" :src="source" controls="controls" width="1280" height="800"></video>
                <img v-else-if="fileType === 'bmp' || fileType === 'png'" :src="source" alt="Fichier téléchargé" height="auto" width="auto">
                <iframe v-else :src="source" style="width:99%;height:100%;" id="printf" name="printf"></iframe>
            </div>

            Waiting screen before server response
            <div v-if="calculatingResponse">
                <svg class="rotator" style="width:120px;height:120px; margin: 130px auto 20px auto; display: block" viewBox="0 0 24 24">
                    <path fill="#ddd" d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
                </svg>
                <h2 class="h2" style="text-align: center; color: #888;">Récupération du fichier...</h2>
            </div>

            Initial screen 
            <div v-if="source.length === 0">
                <div style="font-size: 24px; text-align: center;">
                    <i class="far fa-file fa-10x" style="transform: rotate(-3deg);width:240px;height:240px; margin: 130px auto 20px auto; display: block; color: #ddd" viewBox="0 0 24 24"></i>
                </div>
                <h2 class="h2" style="text-align: center; color: #888;">Recherchez un fichier à afficher dans l'arborescence</h2>
            </div>-->
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
        mounted() {
            this.addFontAwesome();
            this.$root.$on('item-left-clicked', itemPath => {
                //this.resultLoaded = false;
                //this.calculatingResponse = true;
                this.pathItem = itemPath;
                this.pathExtension = itemPath.split('.').pop();
                this.$emit('clicked', 'true')
                // TODO: sur l'exemple de https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript
                // this.source = 'https://docs.google.com/gview?url='+'http://dictee.zenidoc.com:9000/cache/123456789.pdf';
                //this.source = "loading";
                //this.fileType = "pdf";
                
                // const action = 'read';
                // this.fetchAndReadFile(itemPath);
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

        /**
         * Récupère et affiche le fichier sélectionné 
         * TODO: intégrer un message d'erreur si le fichier n'a pas été trouvé (pour plus tard quand on aura accès au serveur)
         */
        /*fetchAndReadFile(filePath) {     
            let searchURL = '';
            PortalAPI.visuarbc_getfile(filePath)
                .then((response) => {
                    searchURL = response[0];
                    this.source = searchURL;
                })
                .catch((error) => {
                    this.source = '';
                })


            setTimeout(()=> {
                this.resultLoaded = true; 
                this.calculatingResponse = false;
            }, 3000);

            
        }*/

        fetchAndPrintFile() {
            // TODO: "SecurityError: Permission denied to access property "print" on cross-origin object"
            // Erreur à cause de Firefox (aussi sur IE apparemment)
            // Check ici https://bugzilla.mozilla.org/show_bug.cgi?id=911444
            // iframe.src = "./fake_files/lorem_ipsum.pdf";
            // iframe.src = 'https://docs.google.com/gview?url='+'http://dictee.zenidoc.com:9000/cache/123456789.pdf';
            let iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.src = 'http://dictee.zenidoc.com:9000/cache/123456789.pdf';
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
         * Méthode pour utiliser FontAwesome (icônes des fichiers)
         */
        addFontAwesome() {
            let head = window.document.querySelector('head');
            let linkFontAwesome = '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">';
            head.innerHTML += linkFontAwesome;
        }

    }
</script>

<!--<style lang="stylus">
    @import '../../main.styl';
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

</style>-->

<style scoped>
.main-content{
    display:grid;
    align-content: center;
}

@media (max-width: 500px){  

}

</style>