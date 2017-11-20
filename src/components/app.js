import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)


import App from './App.vue'
import Login from './Login.vue';


import Header from './Header.vue';
import store from './store';

import io from 'socket.io-client';
const socket = io();

socket.on('connect', () => {
  console.log(socket.id); // 'G5p5...'
  socket.on('news',(m)=>{
    console.log('news:',m);
  });
});

const routes = [
  { path: '/', component: App },
  { path: '/login', component: Login }
];
const router = new VueRouter({
  routes // short for `routes: routes`
});
const app = new Vue({
  store,
  router,
  components:{
      AppHeader:Header
  }
})

document.addEventListener('DOMContentLoaded', function () {
  app.$mount('#app')
})
