<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    
        <router-link class="navbar-brand" to="/">SLTI Release</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                      </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <router-link :class="classLink()" to="/new-update">New update</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script>
    export default {
        name: 'Header',
        data() {
            return {
               
            }
        },
        methods:{
           classLink:function(route){
                console.log(route)
                return {
                    'nav-link':true
                };
           }
        },
        components: {
            
        }
    };
</script>

<style lang="scss" scoped>
    
</style>