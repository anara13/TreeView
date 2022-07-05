import Vue from 'vue';
import Router from 'vue-router';
import AppTemplateDefault from '@/components/AppTemplateDefault.vue';
import SideBar from './views/SideBar.vue';
import Header from './views/Header.vue';
import Content from './views/Content.vue';


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
                    header: () => import('@/views/Header.vue'),
                    sidepanel: () => import('@/views/SideBar.vue'),
                    content: () => import('@/views/Content.vue'),
                },
            },
        ],
    },

    {
        path: '/SideBar',
        name: "SideBarS",
        component : SideBar
    },

    {
        path: '/Header',
        name: "HeaderS",
        component : Header
    },

    {
        path: '/Content',
        name: "ContentS",
        component : Content
    },

],
});