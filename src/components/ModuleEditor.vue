<template>
<div class="container-fluid">
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="jumbotron jumbotron-fluid">
                    <div class="container">
                        <h1 class="display-3">Module Editor</h1>
                        <p>You will be able to create and edit ES6 modules for browser and server. Or Both.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <form id="form" class="mw-50 d-block mx-auto">
                    <div class="form-group">
                        <label>Unique Identifier</label>
                        <input type="text" :disabled="true" v-bind:value="file._id" class="form-control" placeholder="Unique identifier">
                    </div>
                    <div class="form-group">
                        <label>Namespace</label>
                        <input type="text" v-model="file.namespace" class="form-control" aria-describedby="emailHelp" placeholder="E.G. utilities">
                    </div>
                    <div class="form-group">
                        <label>Module name</label>
                        <input type="text" v-model="file.name" class="form-control" aria-describedby="emailHelp" placeholder="Module name">
                    </div>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <h4>Click to remove</h4>
            </div>
            <div class="col-sm-12">
                <ul class="list-group">
                    <li class="list-group-item" v-for="(item, index) in modules" @click="removeModule(item)" v-html="item.name"></li>
                </ul>
            </div>
        </div>
        <div class="row">
                 <div class="col-sm-12">
                     <h1 class="text-center"><span v-show="fileNamespace" class="namespace-text" v-html="fileNamespace"></span><span v-html="file.name">station-block</span></h1>
                 </div>
             </div>
    </div>
    <div class="row">
        <pre name="code" id="editor" style="border: none;"></pre>
    </div>
</div>
</template>
<script>
    //import load from 'async-script-promise';
    import * as ace from 'brace';
    import 'brace/mode/javascript';
    import 'brace/theme/monokai';
    import { mapActions } from 'vuex';
    import moment from 'moment';
    import VueNotifications from 'vue-notifications';

    export default {
        name: 'AceEditor',
        notifications: {
            showFileLoadedNotification: {
                type: VueNotifications.types.success,
                title: 'Hello there',
                message: 'That\'s the success, your file is loaded!'
            },
            showError: {
                type: VueNotifications.types.error,
                title: 'Heads up!',
                message: 'Ups, seems like something crash....'
            }
        },
        props: {

        },
        data() {
            return {
                lastSaveTimestamp: Date.now() - 1000 * 9999,
                lastSaved: null,
                dirty: false,
                file: {
                    _id: "",
                    contents: "",
                    namespace: "",
                    name: ""
                },
                editor: null
            };
        },
        components: {

        },
        methods: Object.assign({
            handleError: function(details) {
                let vm = this;
                return function(err) {
                    console.error(err);
                    vm.showError({ message: details });
                };
            },
            removeModule: async function(item) {
                let vm = this;
                vm.$store.dispatch('removeModule', { item }).catch(vm.handleError('Unable to remove document'));
            }
        }, mapActions({
            openFile: 'openFile',
            saveFile: 'saveModule'
        })),
        computed: {
            modules: function() {
                return this.$store.getters.modules;
            },
            fileNamespace: function() {
                return this.file.namespace ? this.file.namespace + '.' : '';
            },
            fileContents: function() {
                return this.file.contents;
            }
        },
        watch: {
            fileContents: async function(val) {
                this.dirty = true;
            }
        },
        mounted: async function() {
            let vm = this;
            console.log('ready');
            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/monokai");
            editor.setShowPrintMargin(false);
            editor.session.setMode("ace/mode/javascript");
            editor.getSession().setUseWrapMode(true);
            editor.setValue('');
            editor.clearSelection();
            this.editor = editor;
            editor.on('change', function() {
                vm.file.contents = editor.getValue();
            });

            if (vm.$store.getters.currentRoute && vm.$store.getters.currentRoute.name === 'blankEditor') {
                console.log('BLANK!');
            }
            else {
                console.log('LOAD_FILE!');
                let file = await vm.$store.dispatch("loadFile", {
                    space: vm.$route.params.space,
                    name: vm.$route.params.name
                });
                if (file) {
                    Object.assign(this.file, file);
                    console.log('FILE LOADED!', file.contents);
                    vm.showFileLoadedNotification();
                    this.editor.setValue(this.file.contents);
                }
            }



            vm.$store.dispatch('syncModulesList').catch(vm.handleError('Unable to sync modules'));

            var saveFileInterval = function() {
                (async() => {
                    if (vm.dirty && Date.now() - vm.lastSaveTimestamp > 5000) {
                        let savedDoc = await vm.saveFile({
                            item: vm.file
                        });
                        vm.lastSaved = moment().format("HH:mm:ss");
                        vm.lastSaveTimestamp = Date.now();
                        vm.dirty = false;
                        vm.file._id = savedDoc._id;
                        setTimeout(saveFileInterval, 5000);
                    }
                    else {
                        setTimeout(saveFileInterval, 5000);
                    }
                })().catch(vm.handleError('Unable to save module'));
            };
            setTimeout(saveFileInterval, 5000);


        }
    };
</script>
<style lang="scss" scoped>
    #editor {
        margin: 0;
        width: 100%;
        height: 32em;
        margin-top: 5px;
        font-size: 14px;
    }

    .ace_gutter {
        min-width: 50px;
    }

    .ace_scroller {
        margin-left: 5px;
    }
</style>
