import Vue from 'vue';
import Router from 'vue-router';
import AppTemplateDefault from '@/components/AppTemplateDefault.vue';
import SideBar from './views/SideBar.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [

    {
    path: '/ged',
    component: AppTemplateDefault,
    children: [
    {
        path: '',
        components: {
        header: () => import('./views/Header.vue'),
        sidepanel: () => import('./views/SideBar.vue'),
        content: () => import('./views/Content.vue'),
        },
    },
    ],
    },

    {
        path: '/treeView',
        name: "tree",
        component : SideBar
    }

],
});