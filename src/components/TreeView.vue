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

  //TODO : lors de l'intégration au projet, à supprimer et à intégrer directement au fichier 
  created() {
      axios
        .get('http://localhost:3000/items') 
        .then(response => {

          console.log(response.data)
          this.items = response.data 

        })
        .catch(error => {
          console.log('Il y a eu une erreur', error.response)
        })
    },

  data: () => ({
  //permet de se souvenir du dernier fichier ouvert, à modifier
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

    //TODO : faire passer ici en props les éléments du fichier parent (SideBar) 
    items: [],
    tree: [],
    
  }),
}
</script>