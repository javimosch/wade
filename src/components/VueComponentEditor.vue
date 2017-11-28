<template>
     <div class="container-fluid">
         <div class="container">
             <div class="row">
                 <div class="col-sm-12">
<div class="jumbotron jumbotron-fluid">
    <div class="container">
        <h1 class="display-3">Component Editor</h1>
        <p>You will be able to create and edit vue components in ES6 mode.</p>
    </div>
</div>
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
                    contents: "",
                    space: "",
                    name: ""
                },
                editor: null
            };
        },
        components: {

        },
        methods: Object.assign({

        }, mapActions({
            openFile: 'openFile',
            saveFile: 'saveFile'
        })),
        computed: {
            fileNamespace:function(){
              return this.file.space?this.file.space+'.':'';
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

            var saveFileInterval = async function() {
                if (vm.dirty && Date.now() - vm.lastSaveTimestamp > 5000) {
                    await vm.saveFile({
                        item: vm.file
                    });
                    vm.lastSaved = moment().format("HH:mm:ss");
                    vm.lastSaveTimestamp = Date.now();
                    vm.dirty = false;
                }
            };
            setInterval(saveFileInterval, 5000);


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
