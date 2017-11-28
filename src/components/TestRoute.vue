<template>
<div id="backend">
  <div class="container main-container">
    <div class="row">
      <div class="col-sm col-lg-12">
        
        <div class="jumbotron jumbotron-fluid">
    <div class="container">
        <h1 class="display-3">Time for testing</h1>
        <p>You will be able to enable realtime compilation for your projects and to debug errors.</p>
    </div>
</div>
        
      </div>
    </div>
  </div>
</div>
</template>§

<script>

import BackendDashboardBar from './BackendDashboardBar.vue';



export default {
  name: 'backend',
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
    BackendDashboardBar:BackendDashboardBar
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
