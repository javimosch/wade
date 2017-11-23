<template>
<div id="app">
  <div class="container main-container">
    <div class="row">
      <div class="col-sm-12">
        <div class="jumbotron">
          <h1 class="display-3">Hello, world!</h1>
          <p class="lead">Coding a Web platform has never been so simple.</p>
          <hr class="my-4">
          <p class="lead">
            <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
          </p>
        </div>
        
        <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-3">WEDEV</h1>
    <p class="lead">Web Applications Development Enviroment for alternative projects.</p>
  </div>
</div>


<div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-3">What?</h1>
    <hr class="my-4">
    <p>Imaginate utilizar las ultimas tecnologias como Webpack, NodeJS, MongoDB o VueJS y realizar todo en la nube, en simples pasos.</p>
  </div>
</div>

      </div>
    </div>
  </div>
</div>
</template>

<script>

import JsonEditor from './JsonEditor.vue';
import AceEditor from './AceEditor.vue';


export default {
  name: 'home',
  methods:{
   
  },
  computed:{
    
  },
  data () {
    return {
      
      msg: 'Welcome to Yod'
    }
  },
  components:{

    JsonEditor:JsonEditor,
    AceEditor:AceEditor
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
