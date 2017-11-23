/*global firebase*/
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import './styles/layout.scss';
import './styles/texts.scss';

import BackendRoute from './BackendRoute.vue';
import HomeRoute from './HomeRoute.vue';
import LoginRoute from './LoginRoute.vue';
import FunctionsRoute from './FunctionsRoute.vue';
import FileEditor from './FileEditor.vue';


import Header from './Header.vue';
import store from './store';

import io from 'socket.io-client';
const socket = io();

import localforage from 'localforage';

//NOTIFICAITONS
import VueNotifications from 'vue-notifications'
import iziToast from 'izitoast'// https://github.com/dolce/iziToast
import 'izitoast/dist/css/iziToast.min.css'
function toast ({title, message, type, timeout, cb}) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return iziToast[type]({title, message, timeout})
}
const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}
Vue.use(VueNotifications, options)
//-----

socket.on('connect', () => {
  console.log(socket.id); // 'G5p5...'
  socket.on('news', (m) => {
    console.log('news:', m);
  });
});

const routes = [
  { name: "root", path: '/', component: HomeRoute },
  { name: 'backend', path: '/backend', component: BackendRoute, meta: { auth: true } },
  { name: 'library', path: '/library', component: FunctionsRoute, meta: { auth: true } },
  { name: 'blankEditor', path: '/editor', component: FileEditor, meta: { auth: true } },
  { name: 'editor', path: '/editor/:space/:name', component: FileEditor, meta: { auth: true } },
  { name: "login", path: '/login', component: LoginRoute }
];
const router = new VueRouter({
  routes // short for `routes: routes`
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (!store.getters.userIsLogged) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      });
    }
    else {
      next();
    }
  }
  else {
    next();
  }
});
router.afterEach((to, from) => {
  store.commit('currentRouteChange',to);
});
const app = new Vue({
  store,
  router,
  components: {
    AppHeader: Header
  },
  mounted:()=>{
    setUserLoggedState();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  app.$mount('#app');
});


localforage.config({
  //driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
  name: 'vueapp',
  //version     : 1.0,
  //size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'vueapp', // Should be alphanumeric, with underscores.
  //description : 'some description'
});

function setUserLoggedState() {
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    store.commit('markUserAsLogged');
  }
  else {
    // No user is signed in.
  }
}
