import Vue from 'vue';
import Editor from '@/layouts/Editor.vue';
import MainMenu from '@/layouts/MainMenu.vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      path: '/',
      component: MainMenu,
      name: 'MainMenu'
    },
    {
      path: '/editor',
      component: Editor,
      name: 'Editor'
    },
    {
      path: '/editor',
      props: true,
      component: Editor,
      name: 'EditorWithLoad'
    }
  ]
});
