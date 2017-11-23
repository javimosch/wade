<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    
        <router-link class="navbar-brand" to="/">WADE</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                      </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item" v-show="false">
                    <router-link :class="classLink('backend')" to="/backend">Backend</router-link>
                </li>
                <li class="nav-item">
                    <router-link :class="classLink('functions')" to="/functions">Library</router-link>
                </li>
                <li class="nav-item">
                    <router-link :class="classLink('editor')" to="/editor">Components</router-link>
                </li>
                <li class="nav-item">
                    <router-link :class="classLink('editor')" to="/editor">Backend</router-link>
                </li>
                <li class="nav-item">
                    <router-link :class="classLink('editor')" to="/editor">Test</router-link>
                </li>
                <li class="nav-item">
                    <router-link :class="classLink('editor')" to="/editor">Publish</router-link>
                </li>
                <li class="nav-item">
                    <router-link :class="classLink('editor')" to="/editor">Documentation</router-link>
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
            classLink: function(name) {
                let current = this.$store.getters.currentRoute;
                return {
                    'nav-link': true,
                    'nav-link-active': current && current.name == name
                };
            }
        },
        components: {

        }
    };
</script>

<style lang="scss" scoped>
</style>
