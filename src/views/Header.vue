<template>
    <Menu :menus="menus">
        
    </Menu>
</template>

<script>
    import { Vue, Component } from 'vue-property-decorator';
    import Store from '@/store.ts';
    import PortalAPI from '@/api/portal';
    import Menu from '@/components/Menu.vue';

    @Component({
        components: {
            Menu,
        }
    })
    export default class Header extends Vue {
        Store = Store; 
        menus = [];

        mounted() {
            this.getMenuCategories();
        }

        /**
         * TODO: Dans menu, élément "recherche transversale" permet de faire une recherche parmis tous les fichiers sur un texte entré par l'utilisateur
         */

        getMenuCategories() {
            PortalAPI.client_getvisuarbini()
                .then((response) => {
                    Store.Applications.GED.data.menuCategories = response;
                    //console.log(response[0].menus[1][0]) // Panier:panier.exe auteur;patient;ordre;dossier;c:\IZD1;1;;;%IPP%;

                    this.readSubcategories();
                })
        }

        readSubcategories() {
            let menuData = Store.Applications.GED.data.menuCategories;
                        
            let category;

            for (let element of menuData) {
                category = element.menus[0];

                let subcategories = [];

                for (let subelement of element.menus[1]) {
                    let subcategory = subelement.split(':')[0];

                    subcategories.push(subcategory);

                }

                this.menus.push({
                    category: category,
                    subcategories: subcategories
                })

            }

        }

    }
</script>

<style lang="stylus">
    #nav-menu {
        margin-left 235px
        transition width 0.6s ease
    }

    @media (max-width: 500px){
        #nav-menu {
            margin-left 0
        }
    }
</style>

<style scoped>

    
         

</style>