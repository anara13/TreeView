<template>
    <div>
        <TreeView :items='tree' />
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import  axios  from 'axios'
import TreeView from '@//components/TreeView.vue';

    @Component({
        name: "SideBar",
        components: { SideBar, TreeView }

    })

export default class SideBar extends Vue { 

//ici, permet de récupérer les données depuis un serveur
  created() {
      axios
        .get('http://localhost:3000/compilerOptions') 
        .then(response => {

          console.log(response.data)
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

}
</script>
