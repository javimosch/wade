<template>
<div class="backend-dashboard-bar">
  <div class="container">
    <div class="row">
      <div class="col-sm col-lg-12">
      <div class="links">
        <router-link :class="'nav-link'" to="/backend/create-new-project">Create new project</router-link>
      </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>


export default {
  name: 'backend-dashboard-bar',
  methods:{
   
  },
  computed:{
    
  },
  data () {
    return {
   
    }
  },
  components:{

  }
}
</script>

<style lang="scss" scoped>
.backend-dashboard-bar {
  background-color:transparent;
}
.links{
  float:right;
}
.links .nav-link{
  text-align:right;
  font-family: monospace;
  color: black;
  font-size: medium;
}
</style>
