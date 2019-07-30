import VueRouter from 'vue-router';
import Editor from '@/layouts/Editor.vue';
import MainMenu from '@/layouts/MainMenu.vue';

const routes = [
  {
    path: '/',
    component: MainMenu,
    name: 'MainMenu',
  },
  {
    path: '/editor',
    component: Editor,
    name: 'Editor',
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
