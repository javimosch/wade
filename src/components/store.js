/*global firebase*/
import Vue from 'vue';
import Vuex from 'vuex';
import localforage from 'localforage';
import { getParameterByName, fileContentCacheUniqueId } from 'lib/common';
import io from 'socket.io-client';
const socket = io({
  autoConnect: false
});
import fetch from 'unfetch';



Vue.use(Vuex);

const state = {
  user: {
    isLogged: false
  },
  router: {
    redirect: '',
    current: ''
  },
  files: [],
  modules: [{
    name: "holaZapato",
    _id: "123123123FFFF"
  }]
};


const mutations = {
  markUserAsLogged(state) {
    state.user.isLogged = true;
    state.router.redirect = getParameterByName('redirect');
    console.log('User is logged');
  },
  currentRouteChange(state, current) {
    state.router.current = current;
  }
};


function uniqueID() {
  function chr4() {
    return Math.random().toString(16).slice(-4);
  }
  return chr4() + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() + chr4() + chr4();
}

function resolveSocketIoPromisedAction(name, data = {}) {
  const TIMEOUT = 10000;
  return new Promise((resolve, reject) => {
    let identifier = uniqueID();
    let resolved = false;
    setTimeout(() => {
      if (resolved) return;
      resolved = true;
      return reject(new Error('remove_module timeout (' + identifier + ')'));
    }, TIMEOUT);
    socket.once(name + '_resolve_' + identifier, res => {
      if (resolved) return;
      resolved = true;
      console.log('response', name, identifier, res);
      resolve(res);
    });
    socket.once(name + '_reject_' + identifier, err => {
      if (resolved) return;
      resolved = true;
      console.log('response (reject)', name, identifier, err);
      reject(err);
    });
    console.log('request', name, identifier, data);
    socket.emit(name, {
      data: data,
      identifier: identifier
    });
  });
}

const actions = {
  connectSocket: connectSocket,
  ensureSession: ensureSession,
  async syncModulesList({ state, commit }) {
    let docs = await resolveSocketIoPromisedAction('module_list');
    state.modules = docs;
  },
  async removeModule({ commit, state }, { item }) {
    if (!item._id) throw new Error('item._id required');
    let rta = await resolveSocketIoPromisedAction('remove_module', item);
    state.modules = state.modules.filter(m => m._id != item._id);
  },
  async loadFile({ commit, state }, item) {
    return await localforage.getItem(fileContentCacheUniqueId(item));
  },
  async saveModule({ commit, state }, { item }) {
    let doc = await resolveSocketIoPromisedAction('save_module', item);
    if (!item._id) {
      state.modules.push(item);
    }
    return doc;
  },
  async saveFile({ commit }, { item }) {
    if (!item) throw new Error('file required');
    if (!item.space) throw new Error('file.space required');
    if (!item.name) throw new Error('file.name required');
    let cache = await localforage.getItem(fileContentCacheUniqueId(item));
    item = Object.assign(cache || {}, item);
    await localforage.setItem(fileContentCacheUniqueId(item), item);
    return;
  },
  openFile: ({ commit }, fileObject) => {
    (async() => {
      if (!fileObject) throw new Error('fileObject requried');
      let contents = await localforage.getItem(fileContentCacheUniqueId(fileObject));
      if (contents) {
        fileObject.contents = contents;
        commit('selectFile', fileObject);
      }
      else {
        //remote data
        setTimeout(function() {
          commit('setContent', fileObject);
        }, 1000);
      }
    })().catch(console.error);
  },
  incrementAsync({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment');
        resolve();
      }, 1000);
    });
  }
};


const getters = {
  userIsLogged: state => state.user.isLogged,
  routerRedirect: state => state.router.redirect,
  currentRoute: state => state.router.current,
  modules: state => state.modules
};


var store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
export default store;


function connectSocket({ commit }) {
  return new Promise((resolve, reject) => {

    (() => {
      let compiler = io("https://tmp-javoche.c9users.io:8080/");
      compiler.on('compile_resolve', (files) => console.warn('FILES', files));
      window.compile = () => {
        compiler.emit('compile');
      };
    })();


    console.log('connectSocket');
    socket.open();
    socket.on('constructor_resolve', () => {
      console.log("connectSocket: Socket contructor success");
      commit('markUserAsLogged');
      resolve();
    });
    socket.on('connect', () => {
      console.log('connectSocket: Socket connection granted', socket.id); // 'G5p5...'

    });
    socket.on('disconnect', () => {
      console.log('connectSocket: Socket connection lost, reconnecting...');
      socket.open();
    });
    socket.on('reconnect', (attemptNumber) => {
      console.log('connectSocket: Socket reconnection success');
    });
  });
}


function ensureSession({ commit, state }) {
  return new Promise((resolve, reject) => {

    console.log('ensureSession');
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
      if(!firebase.auth().currentUser){
        console.log('Auth no detected');
        resolve();
      }
      firebase.auth().currentUser.getIdToken( /* forceRefresh */ true).then(function(idToken) {
        console.log('ensureSession token', idToken.length);
        var options = {
          method: 'POST',
          //mode:"cors",
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "include",
          body: JSON.stringify({ token: idToken })
        };
        fetch(window.origin + '/api/v1/verify-login', options)
          .then(function(res) {
            res.json().then(r => console.log('ensureSession', r));

            fetch("/api/v1/me/session", {
              credentials: "include"
            }).then(res => res.json().then(r => console.warn('SESSION', r)));

            store.dispatch('connectSocket').then(() => {
              resolve();
            }).catch(err => {
              console.error('Without sockets app is not available', err);
              resolve();
            });

          })
          .catch(function(err) {
            resolve();
            console.warn('ensureSession', err);
          });
      }).catch(function(error) {
        resolve();
        console.error('ensureSession', error);
      });
    }).catch(err => {
      resolve();
      console.error('ensureSession setPersistence', err);
    });
  });
}
