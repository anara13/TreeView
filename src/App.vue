<template>
  <v-app>
    <v-main>
      <v-app-bar>
          <v-btn><router-link to="/ged">Header + Content + SideBar</router-link></v-btn>
          <v-btn><router-link to="/SideBar">SideBar (avec TreeView)</router-link></v-btn>
          <v-btn><router-link to="/Header">Header</router-link></v-btn>
          <v-btn><router-link to="/Content">Content</router-link></v-btn>
      </v-app-bar>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {
},

};
</script>

<style scoped>
.Liens {
  text-align: center;
}
</style>