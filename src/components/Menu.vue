<template>
    <ul id="nav-menu">
        <li class="dropdown" v-for="(menu, index) in menus" :key="index">{{ menu.category }}
            <div class="dropdown-content">
                <p v-for="(subcategory, index) in menu.subcategories" :key="index">{{ subcategory }}</p>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';

    @Component({
        name: "Menu",
        props: {
            menus: Array,
        },
        components: { Menu }
    })
    export default class Menu extends Vue {

    }
</script>

<style lang="stylus">
    @import "../main.styl";
    #nav-menu
        list-style-type none
        margin 0 30px 0 90px
        padding 0
        overflow hidden
        border-bottom 1px solid grey 
        cursor pointer
    
    #nav-menu li 
        float left 
        display block
        text-align center 
        padding 5px 6px
        
    #nav-menu li:hover 
        background-color #fafafa

    li.dropdown 
        display inline-block

    .dropdown-content 
        display none 
        position absolute 
        min-width 200px
        background-color #eee 
        box-shadow 0px 8px 16px 0px rgba(0,0,0,0.2)
        z-index 1
        margin-left -6px
        margin-top 6px

    .dropdown-content p 
        color #333 
        padding 5px 6px
        display block
        text-align left 

    .dropdown-content p:hover 
        background-color #fafafa
    
    .dropdown:hover .dropdown-content 
        display block

</style>