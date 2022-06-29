<template>
    <div class="nav" style="display:flex;margin-top:1px;">

      <!--<Modal v-show="isModalVisible" @close="closeModal">
        <template v-slot:header>
          <h1>Edition des types d'arborescence </h1>
          <span @click="openConfirmBox(0)" style="cursor:pointer;"><i class="fas fa-times-circle"></i></span>
        </template>

        <template v-slot:body>
          <div v-if="alertMessage != ''" class="modal-alert alert-box success">{{alertMessage}}</div>

          <div v-if="isConfirmBoxVisible" class="modal-box confirm-box">
            <div class="message">{{ confirmMessage }}</div>

            <div class="action-btn">
              <button @click="isConfirmBoxVisible = false" class="btn cancel-btn">Annuler</button>
              <button @click="actionConfirmBox(confirmResult)" class="btn confirm-btn">Confirmer</button>
            </div>
          </div>

          <nav class="modal-nav">
            <div class="modal-nav_item">
              <label for="arboName">Nom :</label>
              <select id="arboName" name="arboName" @change="selectedArbo($event)">
                <option value="default"></option>
                <option v-for="(list, index) in Store.Applications.GED.data.listArbo" :key="index" :value="list.title" :id="index">{{list.title}}</option>
              </select>
            </div>
            <div class="modal-nav_btn" id="createButton" @click="createArbo(0)">Nouveau</div>
            <div class="modal-nav_btn" id="duplicateButton" style="opacity:0.5;" @click="createArbo(1)">Dupliquer</div>
            <div class="modal-nav_btn" id="deleteButton" style="opacity:0.5;" @click="openConfirmBox(1)">Supprimer</div>
          </nav>

          <section id="modal-content">

            <div class="modal-content_column modal-content_levelDepth" style="width:24%;">
              <div class="level-arbo">
                <h3>Nom: </h3>
                <span v-if="arborescence != null" @dblclick="editName" id="currentArboName">{{arborescence.title}}</span>                
              </div>
              <div class="level-arbo droptarget" data-prop=0 @dragover="dragOver($event)" @dragenter="dragEnter($event)" @dragleave="dragLeave($event)" @drop="dragDrop($event)">
                <h3>1er niveau : </h3>
                <span v-if="arborescence != null">{{arborescence.levels[0]}}</span>                
              </div>
              <div class="level-arbo droptarget" data-prop=1 @dragover="dragOver($event)" @dragenter="dragEnter($event)" @dragleave="dragLeave($event)" @drop="dragDrop($event)">
                <h3>2eme niveau : </h3>
                <span v-if="arborescence != null">{{arborescence.levels[1]}}</span>                
              </div>
              <div class="level-arbo droptarget" data-prop=2 @dragover="dragOver($event)" @dragenter="dragEnter($event)" @dragleave="dragLeave($event)" @drop="dragDrop($event)">
                <h3>3eme niveau : </h3>
                <span v-if="arborescence != null">{{arborescence.levels[2]}}</span>                
              </div>
              <div class="level-arbo droptarget" data-prop=3 @dragover="dragOver($event)" @dragenter="dragEnter($event)" @dragleave="dragLeave($event)" @drop="dragDrop($event)">
                <h3>4eme niveau : </h3>
                <span v-if="arborescence != null">{{arborescence.levels[3]}}</span>                
              </div>
              <div class="level-arbo droptarget" data-prop=4 @dragover="dragOver($event)" @dragenter="dragEnter($event)" @dragleave="dragLeave($event)" @drop="dragDrop($event)">
                <h3>5eme niveau : </h3>
                <span v-if="arborescence != null">{{arborescence.levels[4]}}</span>
              </div>
              <div class="level-arbo droptarget" data-prop="path" @dragover="dragOver($event)" @dragenter="dragEnter($event)" @dragleave="dragLeave($event)" @drop="dragDrop($event)">
                <h3>Désignation fichiers: </h3>
                <span v-if="arborescence != null">{{arborescence.path}}</span>
              </div>
            </div>

            <div class="modal-content_column" style="width:38%;display:flex;flex-direction:column;justify-content:space-around;">
              <h3>Informations disponibles</h3>
              <div id="availableInformation" style="overflow:auto;text-align:left;padding-left:5px;opacity:0.5">
                <div v-for="(property, index) in Store.Applications.GED.data.treeProperties" :key="index" class="arbo-property" draggable="false" @dragstart="dragStart($event)" @dragend="dragEnd($event)">{{ property }}</div>
              </div>
            </div>

            <div class="modal-content_column" style="width:38%;display:flex;flex-direction:column;justify-content:space-around;">
              <h3>Aperçu de l'arborescence</h3>
              <div id="overviewArbo">
                <ul v-if="arborescence != null" style="text-align:left;padding-left:5px;">
                  <li>&#9654; {{arborescence.levels[0]}}</li>
                    <ul v-if="arborescence.levels[1] != ''" style="text-align:left;padding-left:5px;">
                      <li>&#9654; {{arborescence.levels[1]}}</li>
                      <ul v-if="arborescence.levels[2] != ''" style="text-align:left;padding-left:5px;">
                        <li>&#9654; {{arborescence.levels[2]}}</li>
                          <ul v-if="arborescence.levels[3] != ''" style="text-align:left;padding-left:5px;">
                            <li>&#9654; {{arborescence.levels[3]}}</li>
                              <ul v-if="arborescence.levels[4] != ''" style="text-align:left;padding-left:5px;">
                                <li>&#9654; {{arborescence.levels[4]}}</li>
                                <ul><li>{{arborescence.path}}</li></ul>
                              </ul>
                              <ul v-else><li>{{arborescence.path}}</li></ul>
                          </ul>
                          <ul v-else><li>{{arborescence.path}}</li></ul>
                      </ul>
                      <ul v-else> <li>{{arborescence.path}}</li></ul>
                    </ul>
                    <ul v-else><li>{{arborescence.path}}</li></ul>
                </ul>
              </div>
            </div>
          </section>          
        </template>
        
        <template v-slot:footer>
          <div @click="openConfirmBox(0)" style="cursor:pointer;border:1px solid transparent;padding:10px;width:70px;text-align:center;border-radius:5px;color:#383ea5;margin-right:5px;">ANNULER</div>
          <div @click="clearData" style="cursor:pointer;border:1px solid transparent;padding:10px;width:70px;text-align:center;margin-right:5px;border-radius:5px;background:#383ea5;color:#fff;">VALIDER</div>

        </template>
      </Modal>-->

        <context-menu ref="menu" id="context-menu">
        <ul class="options">          
          <li @click="printFile()" id="print-file"><i class="fas fa-print" style="margin-right:5px;color:black"></i> Imprimer le fichier</li>
          <li @click="tagItem()" id="tag-event"><i class="fas fa-check" style="margin-right:5px;color:green"></i> Marquer le fichier</li>
          <li @click="untagItem()" id="untag-event"><i class="fas fa-times" style="margin-right:5px;color:red"></i> Annuler le marquage</li>
          <!-- TODO: ajouter commande pour supprimer le fichier -->
          <li id="delete-file"><i class="fas fa-trash" style="margin-right:5px;color:black"></i> Supprimer le fichier</li>
        </ul>
      </context-menu>
      <!--<div style="width:90%;">
        <button @click="showModal" class="btn open-modal" type="button" style="margin-top:5px;">Editer types d'arborescence</button>

        <div class="type-arbo-menu">
          <label for="arboTitle" style="margin-left:3px;">Sélectionner un type d'arborescence :</label>
          <select id="arboTitle" name="arboTitle" style="width:100%;" @change="selectTypeArbo($event)">
            <option v-if="typeArbo.length > 0" value="default">- {{ typeArbo }}</option>
            <option v-for="(list, index) in Store.Applications.GED.data.listArbo" :key="index" :value="list.title" :id="index">{{list.title}}</option>
          </select>
        </div>-->   

        <TreeView v-if="dataLoaded" :items='tree' />
        <div v-else>Chargement ...</div>
      <!--</div>-->

      <div class="resizer"></div>

    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import  axios  from 'axios'
import TreeView from '@/components/TreeView.vue';
import ContextMenu from 'vue-lil-context-menu';

    @Component({
        name: "SideBar",
        components: { SideBar, TreeView, 'context-menu': ContextMenu }

    })

export default class SideBar extends Vue { 
        dataLoaded = false;   
        isModalVisible = false;   

//ici, permet de récupérer les données depuis un serveur
    created() {
      axios
        .get('http://localhost:3000/items') 
        .then(response => {

          //console.log(response.data)
          this.tree = response.data 
          this.dataLoaded =  true;

        })
        .catch(error => {
          console.log('Il y a eu une erreur', error.response)
        })
    }

    data() {
        return {
            tree: []
        }
    }

    mounted(){
        
        this.$root.$on('item-right-clicked', (DOMElementRightClicked) => {this.displayContextMenu(DOMElementRightClicked, event);});
    }

     /**
     * Affiche le menu pour marquer les items selon l'emplacement du curseur
     * Initialise la méthode closeMenu()
     */
    displayContextMenu(DOMElementRightClicked) {
        this.itemTagged = DOMElementRightClicked;
        const menu = window.document.getElementById('context-menu');
        const tagEl = window.document.getElementById("tag-event");
        const untagEl = window.document.getElementById("untag-event");
        const printEl = window.document.getElementById("print-file");

        // Utilisé pour désactiver l'action "imprimer" du menu contextuel selon le type de document (ex. sur les fichiers vidéos et audio)
        /*let fileType = event.target.innerText.split('.').pop();
        switch (fileType) {
        case 'bmp':
        case 'pdf':
        case 'png': 
            printEl.classList.remove("disabled");
            break;
        default:
            printEl.classList.add("disabled");
        }*/

        if (this.itemTagged.classList.contains('tagged')) {
        tagEl.classList.add("disabled");
        untagEl.classList.remove("disabled");
        } else {
        untagEl.classList.add("disabled");
        tagEl.classList.remove("disabled");
        }

        // #1 positionner le menu à côté du curseur
        const left = event.pageX + 10;
        const top = event.pageY - 40;
        menu.style.left = left + "px";
        menu.style.top = top + "px";

        menu.style.display = "block";

        this.closeMenu();
    }

    printFile() {
        const action = 'print';
        this.$root.$emit('open-and-print-item', action);
        //window.print();
    }

    /**
     * Ajoute un fond rouge sur l'item sélectionné
     */
    tagItem() {
        this.itemTagged.style.backgroundColor = "#DC143C";
        this.itemTagged.style.borderRadius = "5px";
        this.itemTagged.classList.add("tagged");

    }

    /**
     * Enlève le fond rouge sur l'item sélectionné
     */
    untagItem() {
        this.itemTagged.style.backgroundColor = "transparent";
        this.itemTagged.classList.remove("tagged");

    }

    /**
     * Ferme le menu lorsqu'un click est détecté sur la fenêtre 
     */
    closeMenu() {
        document.addEventListener("click", function() {
        let menu = window.document.getElementById('context-menu');
        menu.style.display = "none";

        })

    }
}
</script>

<style lang="css">
.app > .side-panel {
  width: 400px;
}

@media (max-width: 500px){
  .app > .side-panel {
    width: 100%;
  }
}

.app > .side-panel .container .filigran {
  display: none;
}

.resizer {
  width: 4%;
  height: calc(100vh - 70px);
  border-right:2px solid rgb(136, 136, 136);
  margin: 0 10px;
  cursor: ew-resize;
}

#arborescence {
  width: 100%;
}

ul, #treeview {
  list-style-type: none;
  margin-left: 20px;
}

.tree-caret, .item {
  cursor: pointer; 
  user-select: none; 
}

.caret::before {
  content: '';
}

#arborescence .item {
  width: 100%;
  text-align: left;
}

.Jaune, .jaune, .JAUNE {
  color: #cece49;
}

.Vert, .vert, .VERT {
  color: green;
}

.Rouge, .rouge, .ROUGE {
  color: red;
}

.Orange, .ORANGE, .orange {
  color: orange;
}

.Bleu, .bleu, .BLEU {
  color: blue;
}

.Violet, .VIOLET, .violet {
  color: purple;
}

.Rose, .rose, .ROSE {
  color: pink;
}

.Marron, .MARRON, .marron {
  color: brown;
}

.Gris, .gris, .GRIS {
  color: grey;
}

.Noir, .NOIR, .noir {
  color: black;
}

.BLANC, .blanc, .Blanc {
  color: white;
  box-shadow: 0 0px 1px rgba(0, 0, 0, 0.37);
}

.magenta, .MAGENTA, .Magenta {
  color: magenta;
}

.Normal {
  font-style: normal;
}

.Gras {
  font-weight: bolder;
}

.Italique {
  font-style: italic;
}

.item {
  width: 70%;
  text-align: center;
  display: flex;
  padding: 3px;
}

.item i {
  margin-right: 3px;
}

.type-arbo-menu {
  position: relative;
  display: inline-block;
  margin-left: 11px;
  margin-bottom: 15px;
  width: 100%;
  padding-bottom: 15px;
  border-bottom: 1px solid #333;
}

.type-arbo-menu #arboTitle {
  appearance: none;
  padding-right: 10px;
  outline: none;
  margin-top: 5px;
  padding: 3px;
}

.type-arbo-menu::after {
  content: '';
  position: absolute;
  right: 7px;
  top: 32px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #00000082;
  pointer-events: none;  
}

.open-modal {
  color: #fff;
  background: #383ea5;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  border-radius: 32px;
  font-size: 0.8em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  padding: 10px 30px;
  cursor: pointer;
  width: 100%;
  margin-left: 11px;
  margin-bottom: 15px;
}

.open-modal:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 1);
  transition: all 0.1s ease;
  background: #fff;
  color: #383ea5;
  transition: all 0.3 ease;
  border: 1px solid #383ea5;
  border-radius: 5px;
}

.modal {
  width: 70%;
  height: 85%;
  border-radius: 5px;
  overflow: auto;
}

.modal-header {
  height: 3%;
  background-color: #383ea5;
  padding: 15px;
  margin: 0;
}

.modal-header h1, .modal-header i {
  color: white;
  font-size: 1.1em;
}

.modal-nav {
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-nav_item {
  width: 45%;
  position: relative;
  display: inline-block;
}

.modal-nav_item::after {
  content: '';
  position: absolute;
  right: 24%;
  top: 40%;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #00000082;
  pointer-events: none; 
}

.modal-nav label {
  margin-right: 5px;
}

.modal-nav select {
  width: 70%;
  background: #eee;
  padding: 5px;
  appearance: none;
}

.modal-nav_btn {
  width: 10%;
  border: 1px solid #383ea5;
  padding: 10px;
  border-radius: 3px;
  cursor: pointer;
  text-align: center;
  margin-left: 35px;
  color: #383ea5;
}

.modal-body {
  height: 92%;
  padding: 0;
  overflow:hidden;
}

.modal-body #modal-content {
  height: 90%;
  display: flex;
  padding: 10px;
  overflow: auto;
}

.modal-body #modal-content .modal-content_column {
  height:100%;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.modal-footer {
  height: 5%;
  padding: 5px;
  margin-right: 0px !important;
}

.modal-content_levelDepth .level-arbo {
  margin-bottom: 15px;
  background: #eee;
  border: 1px solid transparent;
  width: 90%;
  height: 12%;
  padding: 2px;
}

.modal-content_levelDepth .level-arbo h3 {
  padding: 5px 0 10px 0;
}

.hovered {
  border: 1px dashed #383ea5 !important; 
  background: white !important;
}

.modal-content_column #overviewArbo, .modal-content_column #availableInformation {
  border: 1px solid #555;
  width: 85%;
  height: 90%;
}

.arbo-property {
  cursor: pointer;
  border-bottom: 1px dashed #716868;
  padding: 5px 0;
}

.arbo-property:hover {
  background-color: #eee;
}

.modal-footer {
  margin-top: 5px;
  margin-right: 30px;
}

.grabbing {
  cursor: grabbing;
  cursor: -webkit-grabbing;
}

.alert-box {
  text-align: center;
  position: absolute;
  padding: 20px;
  background-color: #eee;
  color: #333;
  width: 200px;
  height: 23px;
  margin-top: -50px;
  margin-left: -50px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 1);
}

.confirm-box {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
  position: absolute;
  padding: 10px;
  background-color: white;
  color: #333;
  width: 50%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 115px;
  margin-top: -50px;
  margin-left: -50px;
  margin: auto;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 1);
  border: 1px solid black;
}

.confirm-box .action-btn {
  display: flex;
  justify-content: space-evenly;
}

.cancel-btn {
  color: #383ea5;
  background: #fff;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 1px solid #383ea5;
  border-radius: 32px;
  font-size: 1em;
  padding: 5px 15px;
  cursor: pointer;
  width: 40%;
  height: 100%;
  margin: 5px;
}

.confirm-btn {
  color: #fff;
  background: #383ea5;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  border-radius: 32px;
  font-size: 1em;
  padding: 5px 15px;
  cursor: pointer;
  width: 40%;
  height: 100%;
  margin: 5px;
}

.confirm-btn:hover, .cancel-btn:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 1);
  border: 1px solid transparent;
  border-radius: 5px;
}
</style>