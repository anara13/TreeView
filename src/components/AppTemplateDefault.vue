<template>
    <section class="app">

        <div v-if="width>500" class="desktop-view">
            <div class="desktop-nav">
                <div class="brand">
                    <img src="../assets/logos/zenidoccloud-dark.svg" alt="Logo Nuage Zenidoc">
                    <h1>Zenidoc</h1>
                </div>
                <div>
                </div>

            </div>

            <div class="desktop-content">

                <aside v-if="showSideMenu" class="side-panel">
                    <div class="container">
                        <img class="filigran" src="../assets/logos/zenidoc-cloud-light.svg" alt="">
                    </div>
                </aside>

                <main class="content">
                </main>

            </div>


        </div>






        <div v-else class="mobile-view">
            <div class="mobile-nav">
                <div class="brand">
                    <img src="../assets/logos/zenidoccloud-dark.svg" alt="Logo Nuage Zenidoc">
                    <h1>Zenidoc</h1>
                </div>
                <div class="div-img">
                    <img  @click="showMenu" src="../assets/logos/menu-open.svg" alt="Menu open">
                </div>

            </div>

            <div class="header">
                <router-view name="header"/>
            </div>

            <aside v-if="showSideMenu" class="side-panel">
                <div class="container">
                    <router-view name="sidepanel"
                    />
                    <img class="filigran" src="../assets/logos/zenidoc-cloud-light.svg" alt="">
                </div>
            </aside>

            <main class="content">
                <router-view @clicked="onClickChild" name="content"/>
            </main>
        </div>




    </section>
</template>

<script>
export default {
    data(){
        return {
            width: "",
            showSideMenu:true,
        }
    },
    methods:{
        showMenu() {
            this.showSideMenu = !this.showSideMenu;         
        },
        onClickChild() {
            this.showSideMenu = false;
        }
    },
    mounted() {
        var largeur = window.innerWidth;
        this.width = largeur;
    }
}
</script>

<style scoped>

    .desktop-nav {
        display:grid;
        grid-template-columns: 50% 50%;
        justify-content: space-between;
        padding: 1% 5%;
    }

    .desktop-content {
        display:grid;
        grid-template-columns: 25% 75%;
        justify-content: space-between;
        padding: 1%;
    }

    @media (max-width: 500px){   

        .mobile-nav {
            display:grid;
            grid-template-columns: 45% 45%;
            justify-content: space-between;
            align-items: center;
            padding: 3% 5%;
            position: fixed;
            width:100%;
            z-index: 3;
            background-color: white;
            border-radius: 5px;
        }

            .mobile-nav .div-img {
                display:grid;
                justify-content: end;
            }

        .mobile-view .header {
            padding-top:25%;
        }
            
    }

</style>