<template>
    <div class="nav" style="display:flex;margin-top:1px;">

      <context-menu ref="menu" id="context-menu">
        <ul class="options">          
          <li @click="printFile()" id="print-file"><i class="fas fa-print" style="margin-right:5px;color:black"></i> Imprimer le fichier</li>
          <li @click="tagItem()" id="tag-event"><i class="fas fa-check" style="margin-right:5px;color:green"></i> Marquer le fichier</li>
          <li @click="untagItem()" id="untag-event"><i class="fas fa-times" style="margin-right:5px;color:red"></i> Annuler le marquage</li>
          <!-- TODO: ajouter commande pour supprimer le fichier -->
          <li id="delete-file"><i class="fas fa-trash" style="margin-right:5px;color:black"></i> Supprimer le fichier</li>
        </ul>
      </context-menu>

      <TreeView v-if="dataLoaded" :items='tree' />
      <div v-else>Chargement ...</div>

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
      
      this.$root.$on('item-right-clicked', (DOMElementRightClicked, itemName) => {this.displayContextMenu(DOMElementRightClicked, event, itemName);});
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