<template>
    <div>
        <h2 class="h2">Gestion de documents</h2>

        <div class="main-content">
            <!-- Rendering the loaded file -->
            <div v-if="resultLoaded" id="file-preview" style="width:100%;height:800px;">
                <audio v-if="pathExtension === 'avi' || fileType === 'wav'" :src="source" type="audio/wav" controls="controls"></audio>
                <video v-else-if="fileType === 'mp4'" type="video/mp4" :src="source" controls="controls" width="1280" height="800"></video>
                <img v-else-if="fileType === 'bmp' || fileType === 'png' || pathExtension=='ico' || pathExtension=='gif' || pathExtension=='jpg'" :src="source" alt="Fichier téléchargé" height="auto" width="auto">
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
            <div v-show="source.length === 0 && isError === false && pathItem.length === 0">
                <div style="font-size: 24px; text-align: center;">
                    <i class="far fa-file fa-10x" style="transform: rotate(-3deg);width:240px;height:240px; margin: 130px auto 20px auto; display: block; color: #ddd" viewBox="0 0 24 24"></i>
                </div>
                <h2 class="h2" style="text-align: center; color: #888;">Recherchez un fichier à afficher dans l'arborescence</h2>
            </div>

            <!--Error screen-->
            <div v-if="isError">
                <div style="font-size: 24px; text-align: center;">
                    <i class="fas fa-exclamation-triangle fa-10x" style="transform: width:240px;height:240px; margin: 130px auto 20px auto; display: block; color: #ddd" viewBox="0 0 24 24"></i>
                </div>
                <h2 class="h2" style="text-align: center; color: #888;">Le fichier sélectionné n'a pas été trouvé</h2>
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
        fileType = '';
        pathItem ="";
        pathExtension="";
        isError = false;
        searchURL = '';

        mounted() {
            this.addFontAwesome();
            //on récupère ici l'élément sélectionné depuis le TreeView
            this.$root.$on('item-left-clicked', itemPath => {
                this.pathItem = itemPath.toString();
                console.log(this.pathItem)
                var hasType = this.pathItem.split('.');

                //Sytème de récupération d'url du noeud sélectionné 
                //Compatible avec la version statique de récupération d'url
                //this.fetchAndReadFile(this.pathItem);

                //Compatible nouveau système de récupération d'url avec appel vers fausse API
                //Savoir si le noeud sélectionné est un noeud "dossier" a été sélectionné ou pas
                //Si non, on exécute la fonction de récupération d'url
                if(hasType.length > 1)
                {
                    this.selected = true;
                    this.fetchFileUrl(this.pathItem);
                }

                //Si oui, pas la peine de l'exécuter
                else
                {
                    //on remet tous les paramètres à zéro puisqu'aucun noeud n'est sélectionné
                    this.isError = false;
                    this.source = '';
                    this.resultLoaded = false;
                
                    this.searchURL = '';
                }
            });                

            this.$root.$on('open-and-print-item', action => {
                this.fetchAndPrintFile();
            });
        }

        created() {
            this.addFontAwesome();           
        }

        
        /**
         * Méthode pour utiliser FontAwesome 
         */
        addFontAwesome() {
            let head = window.document.querySelector('head');
            let linkFontAwesome = '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">';
            head.innerHTML += linkFontAwesome;
        }

        /**
         * Permet de récupérer et d'imprimer de le fichier en cours
         */
        fetchAndPrintFile() {

            window.frames["printf"].focus();
            window.frames["printf"].contentWindow.print();

        }

        /**
         * Récupère l'url du fichier sélectionné depuis le serveur
         */
        fetchFileUrl(itemPath){

            this.isError = false;
            this.calculatingResponse = true;
            this.pathExtension = itemPath.split('.').shift();
            this.fileType = itemPath.split('.').pop();
            this.source = '';
            this.resultLoaded = false;
                
            this.searchURL = '';

            axios
                .get('http://localhost:3000/url?name=' + itemPath) 
                    .then(response => {
                        
                        //l'adresse du lien dans le fichier json
                        this.searchURL = response.data[0].path;
                        this.readFile(this.searchURL);

                    })
                    .catch(error => {
                        console.log('Il y a eu une erreur', error.response)
                        this.isError = true;
                        this.calculatingResponse = false;

                    })
        }

        /**
         * Affiche le fichier sélectionné 
         */
        readFile(pathFile){

            //le lien vers le fichier
                
            //si c'est un document pouvant être visualisé par microsoft office, alors il a un lien spécial
            if(this.fileType == "docx" || this.fileType == "doc" || this.fileType == "docm" || this.fileType == "dotm" || this.fileType == "dotx" || this.fileType == "xlsx" || this.fileType == "xlsb" || this.fileType == "xls" || this.fileType == "xlsm" || this.fileType == "pptx" || this.fileType == "ppsx" || this.fileType == "ppt" || this.fileType == "pps" || this.fileType == "pptm" || this.fileType == "potm" || this.fileType == "ppam" || this.fileType == "potx" || this.fileType == "ppsm")
            {
                //TODO: choisir le visuel souhaité                
                //avec le bandeau microsoft 
                //this.source = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.searchURL;
                                
                //sans le bandeau microsoft 
                this.source = 'https://view.officeapps.live.com/op/embed.aspx?src=' + pathFile;

            }

            else
            {
                this.source = pathFile;
            }
            
            //indiquer au template que le fichier a bien été chargé, possiblement à supprimer?
            this.resultLoaded = true;
            this.calculatingResponse = false;

        }

        /**
         * Récupère et affiche le fichier sélectionné 
         */
        //avec récupération d'url statique
        /*fetchAndReadFile(itemPath){

            this.isError = false;
            this.calculatingResponse = true;
            this.pathExtension = itemPath.split('.').shift();
            this.fileType = itemPath.split('.').pop();
            this.source = '';
            this.resultLoaded = false;
             
            let searchURL = '';

            //le lien vers le fichier
            //si c'est un document pouvant être visualisé par microsoft office, alors il a un lien spécial
            if(this.fileType == "docx" || this.fileType == "doc" || this.fileType == "docm" || this.fileType == "dotm" || this.fileType == "dotx" || this.fileType == "xlsx" || this.fileType == "xlsb" || this.fileType == "xls" || this.fileType == "xlsm" || this.fileType == "pptx" || this.fileType == "ppsx" || this.fileType == "ppt" || this.fileType == "pps" || this.fileType == "pptm" || this.fileType == "potm" || this.fileType == "ppam" || this.fileType == "potx" || this.fileType == "ppsm")
            {
                //TODO: choisir le visuel souhaité
                searchURL = 'https://github.com/poychang/blog.poychang.net/raw/master/assets/post-files/THIS-IS-WORD.docx'
                //avec le bandeau Microsoft
                //this.source = 'https://view.officeapps.live.com/op/view.aspx?src=' + searchURL;
                //ou en fonction du rendu visuel que l'on souhaite avoir
                //sans le bandeau Microsoft
                this.source = 'https://view.officeapps.live.com/op/embed.aspx?src=' + searchURL;
                this.resultLoaded = true;

            }

            else if(this.fileType == "pdf")
            {
                searchURL = 'https://www.soundczech.cz/temp/lorem-ipsum.pdf';
                this.source = searchURL;
                this.resultLoaded = true;

            }

            else if(this.fileType == "mp4")
            {
                searchURL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4';
                this.source = searchURL;
                this.resultLoaded = true;

            }

            else if(this.fileType == "png")
            {
                searchURL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Google_Images_2015_logo.svg/640px-Google_Images_2015_logo.svg.png';
                this.source = searchURL;
                this.resultLoaded = true;

            }

            //pour simuler un écran d'erreur
            else if(this.fileType == "html")
            {
                this.isError = true;

            }
            
            //indiquer au template que le fichier a bien été chargé
            this.calculatingResponse = false;

        }*/
        
        /**
         * Récupère et affiche le fichier sélectionné 
         */
        //TODO : à afficher lorsque l'on aura accès au serveur (avec récupération url fichier via API)
        /*fetchAndReadFile(itemPath){

            this.isError = false;
            this.calculatingResponse = true;
            this.pathExtension = itemPath.split('.').shift();
            this.fileType = itemPath.split('.').pop();
            this.source = '';
            this.resultLoaded = false;
             
            let searchURL = '';
            PortalAPI.visuarbc_getfile(itemPath)
                .then((response) => {
                    searchURL = response[0];
                    //this.source = searchURL;
                })
                .catch((error) => {
                    this.source = '';
                    console.log('Fichier non trouvé' + error)
                    this.isError = true;
                    this.calculatingResponse = false;
                })

            setTimeout(()=> {
                this.resultLoaded = true; 
                this.calculatingResponse = false;
            }, 3000);

            //le lien vers le fichier

            //si c'est un document pouvant être visualisé par microsoft office, alors il a un lien spécial
            if(this.fileType == "docx" || this.fileType == "doc" || this.fileType == "docm" || this.fileType == "dotm" || this.fileType == "dotx" || this.fileType == "xlsx" || this.fileType == "xlsb" || this.fileType == "xls" || this.fileType == "xlsm" || this.fileType == "pptx" || this.fileType == "ppsx" || this.fileType == "ppt" || this.fileType == "pps" || this.fileType == "pptm" || this.fileType == "potm" || this.fileType == "ppam" || this.fileType == "potx" || this.fileType == "ppsm")
            {
                //TODO: choisir le visuel souhaité                
                //avec le bandeau microsoft 
                //this.source = 'https://view.officeapps.live.com/op/view.aspx?src=' + searchURL;
                                
                //sans le bandeau microsoft 
                this.source = 'https://view.officeapps.live.com/op/embed.aspx?src=' + searchURL;

            }

            else
            {
                this.source = searchURL;
            }
        

            this.resultLoaded = true;
            this.calculatingResponse = false;

        }*/

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