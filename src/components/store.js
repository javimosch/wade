import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage';
Vue.use(Vuex)
// root state object.
// each Vuex instance is just a single state tree.
const state = {
  count: 0,
  selectedFile:'',
  content:''
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  saveFile (state,payload) {
    localforage.setItem('fileContent_'+payload.fileName,payload.content);
  },
  setContent (state,content) {
    state.content = content;
  },
  selectFile (state, file) {
    state.selectedFile = file;
  },
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  openFile:({commit},fileName)=>{
    (async()=>{
      let content = await localforage.getItem('fileContent_'+fileName);
      if(content){
        commit('setContent',content);
      }else{
        setTimeout(function(){
          commit('setContent','//new-content');
        });
      }
    })().catch(err=>console.error);
  },
  increment: ({ commit }) => commit('increment'),
  decrement: ({ commit }) => commit('decrement'),
  incrementIfOdd ({ commit, state }) {
    if ((state.count + 1) % 2 === 0) {
      commit('increment')
    }
  },
  incrementAsync ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment')
        resolve()
      }, 1000)
    })
  }
}

// getters are functions
const getters = {
  evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})