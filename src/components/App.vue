<template>
  <div id="app">
    
    <h1>{{ msg }}</h1>
    
    
    <div class="container main-container">
  <div class="row">
    <div class="col-sm col-lg-8">
      <Ace-editor></Ace-editor>
    </div>
    <div class="col-sm col-lg-4">
     <Json-editor></Json-editor>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import Login from './Login.vue'
import JsonEditor from './JsonEditor.vue';
import AceEditor from './AceEditor.vue';
console.log('Login',Login)

export default {
  name: 'app',
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
    Login:Login,
    JsonEditor:JsonEditor,
    AceEditor:AceEditor
  }
}
</script>

<style lang="scss" scoped>
.main-container{
  outline: 2px dashed black;
}
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
