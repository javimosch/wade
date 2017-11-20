<template>
<div id="jsone">

    <div id="jsoneditor" class="w-100">

    </div>
    
</div>
</template>
<script>
    import JSONEditor from 'jsoneditor';
    import 'jsoneditor.svg';
    import 'jsoneditor.css';
    import './JsonEditor.scss';
    import { mapMutations } from 'vuex';

    function mounted() {
        var vm = this;
        var container = document.getElementById("jsoneditor");
        var options = {};
        var editor = new JSONEditor(container, options);

        // set json
        var json = {
            projects: {
                todoList: {
                    files: {
                        "index.js": ""
                    }
                }
            }
        };
        editor.set(json);

        $('#jsoneditor').on('click', '[contenteditable]', function() {
            let node = this.innerHTML;
            if (node.indexOf('.js') !== -1) {


                vm.selectFile(node)
            }
        })

        // get json
        //var json = editor.get();
    }

    export default {

        name: 'JsonEditor',
        data() {
            return {}
        },
        methods: Object.assign({}, mapMutations([
            'selectFile',
        ])),
        components: {

        },
        mounted: mounted,

    }
</script>
