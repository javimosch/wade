<template>
     <div>
         <!-- Editor -->
         <p>Saved at <span v-if="lastSaved" v-text="lastSaved"></span></p>
            <pre name="code" id="editor" style="border: none;"></pre>
           
     </div>
</template>
<script>
    import load from 'async-script-promise';
    import * as ace from 'brace';
    import 'brace/mode/javascript';
    import 'brace/theme/monokai';
    import { mapGetters, mapActions } from 'vuex';
    import moment from 'moment';

    function mounted() {
        let vm = this;
        console.log('ready');
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.setShowPrintMargin(false);
        editor.session.setMode("ace/mode/javascript");
        editor.getSession().setUseWrapMode(true);
        editor.setValue('//empty2');
        editor.clearSelection();
        this.editor = editor;
        editor.on('change', function() {
            vm.content = editor.getValue()
            console.log('C', vm.content);
        });

    }
    export default {
        name: 'AceEditor',
        props: {

        },
        data() {
            return {
                lastSaveTimestamp: Date.now() - 1000 * 9999,
                lastSaved: null,
                content: null,
                editor: null
            }
        },
        components: {

        },
        methods: Object.assign({

        }, mapActions({
            openFile: 'openFile'
        })),
        computed: {
            selectedFile: function() {
                return this.$store.state.selectedFile;
            },
            editorContent: function() {
                return this.$store.state.content;
            }
        },
        watch: {
            editorContent: function(val) {
                this.editor.setValue(val);
            },
            selectedFile: function(val) {
                this.openFile(val);
            },
            content: function(val) {
                if (this.selectedFile && Date.now() - this.lastSaveTimestamp > 5000) {
                    this.$store.commit('saveFile', {
                        fileName: this.selectedFile,
                        content: val
                    });
                    this.lastSaved = moment().format("HH:mm:ss");
                }
            }
        },
        mounted: mounted
    }
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
