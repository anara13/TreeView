<template>
    <div>
        <h1>Header à remplacer dans le projet</h1>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

    @Component({
        name: "Header",
        components: { Header,}
    })
    export default class Header extends Vue {
        
    }
</script>

<style lang="scss" scoped>

</style>