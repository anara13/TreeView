<!--Contient ici l'ensemble des éléments à afficher par la route /ged sans passer par vue router-->
<template>
    <div>
        <Header />
        <SideBar />
        <Content />
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import SideBar from '@/views/SideBar.vue';
import Header from '@/views/Header.vue';
import Content from '@/views/Content.vue';

  @Component({
      name: "Essai",
      components: { Essai, SideBar, Header, Content }
  })

export default class Essai extends Vue {
}
</script>

<style lang="scss" scoped>

</style>