<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    
        <router-link class="navbar-brand" to="/">Web Application Development Environment</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                      </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item" v-show="false">
                    <router-link :class="classLink('backend')" to="/backend">Backend</router-link>
                </li>
                <li class="nav-item" v-show="false">
                    <router-link :class="classLink(['library','editor'])" to="/library">Library</router-link>
                </li>
                <li class="nav-item">
                    <router-link :class="classLink('modules')" to="/modules">Editor</router-link>
                </li>
                <li class="nav-item">
                    <router-link :class="classLink('backend')" to="/backend">Frontend</router-link>
                </li>
                <li class="nav-item" v-show="false">
                    <router-link :class="classLink('backend')" to="/backend">Backend</router-link>
                </li>
                <li class="nav-item">
                    <router-link :class="classLink('test')" to="/test">Test</router-link>
                </li>
                <li class="nav-item" v-show="false">
                    <router-link :class="classLink('publish')" to="/publish">Publish</router-link>
                </li>
                <li class="nav-item" v-show="false">
                    <router-link :class="classLink('documentation')" to="/documentation">Documentation</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script>
    import { getParameterByName } from 'lib/common';
    export default {
        name: 'Header',
        data() {
            return {

            }
        },
        methods: {
            classLink: function(names) {
                if (typeof names == 'string') names = [names];
                let current = this.$store.getters.currentRoute;
                return {
                    'nav-link': true,
                    'nav-link-active': current && names.includes(current.name)
                };
            }
        },
        components: {

        }
    };
</script>

<style lang="scss" scoped>
</style>
