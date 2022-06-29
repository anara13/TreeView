<template>
    <div>
        <TreeView :items='tree' />

        <context-menu ref="menu" id="context-menu">
        <ul class="options">          
          <li @click="printFile()" id="print-file"><i class="fas fa-print" style="margin-right:5px;color:black"></i> Imprimer le fichier</li>
          <li @click="tagItem()" id="tag-event"><i class="fas fa-check" style="margin-right:5px;color:green"></i> Marquer le fichier</li>
          <li @click="untagItem()" id="untag-event"><i class="fas fa-times" style="margin-right:5px;color:red"></i> Annuler le marquage</li>
          <!-- TODO: ajouter commande pour supprimer le fichier -->
          <li id="delete-file"><i class="fas fa-trash" style="margin-right:5px;color:black"></i> Supprimer le fichier</li>
        </ul>
      </context-menu>

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
    currentElement;

//ici, permet de récupérer les données depuis un serveur
  created() {
      axios
        .get('http://localhost:3000/items') 
        .then(response => {

          //console.log(response.data)
          this.tree = response.data 

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
        this.$root.$on('item-right-clicked', DOMElementRightClicked => {
            this.currentElement = DOMElementRightClicked;
            this.displayContextMenu(this.currentElement);
            
        });
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
        // window.print();
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
