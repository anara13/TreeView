<template>
  <v-treeview
    v-model="tree"
    :open="initiallyOpen"
    :items="items"
    activatable
    item-key="name"
    open-on-click
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
  </v-treeview>
</template> 

<script>
import { Vue, Component } from 'vue-property-decorator';

  @Component({
      name: "TreeView",
      props: {
          //TODO : intégrer les props à l'usage
          items: [Array, Object],
      },
      components: { TreeView }
  })

export default class TreeView extends Vue {

  data() 
  {
    return {
    //permet de se souvenir du dernier fichier ouvert, à modifier
    initiallyOpen: ['public'],
    //TODO : ajouter l'ensemble des extensions nécessaires pour les extensions de fichier les plus courants
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',//pour remplacer les documents textes
      xls: 'mdi-file-excel',
      
    },

    tree: [],
    
    }
  }
}
</script>