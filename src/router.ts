import Vue from 'vue';
import Router from 'vue-router';
import AppTemplateDefault from '@/components/AppTemplateDefault.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [

    {
    path: '/ged',
    component: AppTemplateDefault,
    children: [
    {
        path: '',
        components: {
        header: () => import('./views/app.ged/Header.vue'),
        sidepanel: () => import('./views/app.ged/SideBar.vue'),
        content: () => import('./views/app.ged/Content.vue'),
        },
    },
    ],
    },

],
});