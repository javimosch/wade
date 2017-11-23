import Vue from 'vue';
import Vuex from 'vuex';
import localforage from 'localforage';
import {getParameterByName,fileContentCacheUniqueId} from 'lib/common';
Vue.use(Vuex);

const state = {
  user:{
    isLogged:false
  },
  router:{
    redirect:'',
    current:''
  },
  files:[]
};


const mutations = {
  markUserAsLogged (state) {
    state.user.isLogged=true;
    state.router.redirect = getParameterByName('redirect');
    console.log('User is logged');
  },
  currentRouteChange(state,current){
    state.router.current=current;
  }
};


const actions = {
  async loadFile({commit,state},item){
    return await localforage.getItem(fileContentCacheUniqueId(item));
  },
  async saveFile ({commit},{item}) {
    if(!item) throw new Error('file required');
    if(!item.space) throw new Error('file.space required');
    if(!item.name) throw new Error('file.name required');
    let cache = await localforage.getItem(fileContentCacheUniqueId(item));
    item = Object.assign(cache,item);
    await localforage.setItem(fileContentCacheUniqueId(item),item);
    return;
  },
  openFile:({commit},fileObject)=>{
    (async()=>{
      if(!fileObject) throw new Error('fileObject requried');
      let contents = await localforage.getItem(fileContentCacheUniqueId(fileObject));
      if(contents){
        fileObject.contents = contents;
        commit('selectFile',fileObject);
      }else{
        //remote data
        setTimeout(function(){
          commit('setContent',fileObject);
        },1000);
      }
    })().catch(console.error);
  },
  incrementAsync ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment');
        resolve();
      }, 1000);
    });
  }
};


const getters = {
  userIsLogged: state=> state.user.isLogged,
  routerRedirect: state=>state.router.redirect,
  currentRoute:state=>state.router.current
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})