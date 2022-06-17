<template>
  <v-app>
    <v-main>
      <TreeView />      
    </v-main>
  </v-app>
</template>

<script>
import TreeView from './components/TreeView';


export default {
  name: 'App',

  components: {
    TreeView,
  },

};
</script>
