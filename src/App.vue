<template>
  <v-app>
    <v-main>
      <SideBar />     
    </v-main>
  </v-app>
</template>

<script>
import SideBar from '@/views/SideBar.vue';


export default {
  name: 'App',

  components: {
    SideBar
},

};
</script>
