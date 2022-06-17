<template>
  <v-treeview
    v-model="tree"
    :open="initiallyOpen"
    :items="items"
    activatable
    item-key="name"
    open-on-click
  >
  <!--Rajouter ici le fichier -->
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="!item.file">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>
        {{ files[item.file] }}
      </v-icon>
    </template>
  </v-treeview>
</template> 

<script>
import  axios  from 'axios'

  export default {
    props: {
        fichierJSON: [Object, Array, JSON]
    },

    created() {
        axios
          .get('http://localhost:3000/items') 
          .then(response => {
            console.log(response.data) 
          })
          .catch(error => {
            console.log('There was an error:', error.response)
          })
      },

    data: () => ({
    //permet de se souvenir du dernier fichier ouvert
      initiallyOpen: ['public'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      tree: [],
      //faire passer ici en props les éléments du fichier parent (SideBar) 
    }),
  }
</script>