<template>
  <v-treeview
    v-model="tree"
    :open="initiallyOpen"
    :items="items"
    activatable
    item-key="name"
    open-on-click
    @update:active="leftClick"
  >
    <template v-slot:prepend="{ item, open }">
      <v-container>
        <v-icon v-if="!item.file">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-else>
          {{ files[item.file] }}
        </v-icon>
      </v-container>
    </template>

    <!--Pour l'affichage du context menu-->
    <template v-slot:label="{ item }">
      <div @contextmenu.prevent="rightClick($event, item)">{{ item.name }}</div>
    </template>
    
  </v-treeview>  
</template> 

<script>
import { Vue, Component } from 'vue-property-decorator';

  @Component({
      name: "TreeView",
      props: {
          items: [Array, Object],
      },
      components: { TreeView }
  })

export default class TreeView extends Vue {

  data() {
    return {
    //TODO: permet de se souvenir du dernier fichier ouvert, à modifier pour que ce soit dynamique en fonction de la dernière session utilisateur
    initiallyOpen: ['public'],
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      pdf: 'mdi-file-pdf-box',
      png: 'mdi-file-image',
      jpg: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      wav: 'mdi-filmstrip',
      mp4: 'mdi-filmstrip',
      bmp: 'mdi-file-image',
      docx: 'mdi-file-document',
      docm: 'mdi-file-document', 
      dotm: 'mdi-file-document', 
      dotx: 'mdi-file-document', 
      doc: 'mdi-file-document',
      xls: 'mdi-file-excel',
      xlsx: 'mdi-file-excel', 
      xlsb: 'mdi-file-excel', 
      xlsm: 'mdi-file-excel',
      pptx: 'mdi-file-powerpoint', 
      ppsx: 'mdi-file-powerpoint', 
      ppt: 'mdi-file-powerpoint', 
      pps: 'mdi-file-powerpoint', 
      pptm: 'mdi-file-powerpoint', 
      potm: 'mdi-file-powerpoint', 
      ppam: 'mdi-file-powerpoint', 
      potx: 'mdi-file-powerpoint', 
      ppsm: 'mdi-file-powerpoint',

      //TODO : implémenter une icône basique pour tous les autres fichiers qui ne sont pas des dossiers et dont file ne serait pas rempli
      else: 'mdi-file-outline'//peut-être définir comme valeur par défaut 
      
    },

    tree: [],
    
    }
  }

  /**
   * Emet l'événement @click au composant parent
   */
  //permet la récupération du nom de l'élément en cours sélectionné pour l'affichage dans l'explorateur
  leftClick(value) {
    let itemPath = value;
    this.$root.$emit('item-left-clicked', itemPath);
    // this.$emit('item-left-clicked', itemPath);
  }

  /**
   * Emet l'événement @contextmenu au composant parent
   */
  //permet la récupération de l'élément en cours pour affichage du context menu
  rightClick($event, item) {
      let DOMElementRightClicked = $event.target;
      $event.preventDefault();
      let itemName = item.name;
      this.$root.$emit('item-right-clicked', DOMElementRightClicked, itemName);
      // this.$emit('item-right-clicked', event);
  }
}
</script>