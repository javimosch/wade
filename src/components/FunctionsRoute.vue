<template>
<div class="functions">
  <div class="container main-container">
    <div class="row">
      <div class="col-sm col-lg-12">
      <form>
        <input class="form-control" type="search" placeholder="Filter"/>
        <input-tag v-show="false" :on-change="tagsChange" :tags="tags" class="tags"></input-tag>
        <h3>Your functions</h3>
        <ul class="list-group">
          <li class="list-group-item" v-for="(item, index) in items" @dblclick="openFunction(item)">
            <span class="namespace-text" v-html="itemSpace(item)"></span><span v-html="item.name"></span>
            <div class="pin" v-show="itemTagged(item)" @click="pinItem(item)"><i class="fa fa-thumb-tack" aria-hidden="true"></i></div>
          </li>
        </ul>
      </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
/*global $*/
import InputTag from 'vue-input-tag';

export default {
  name: 'functions',
  methods:{
    async openFunction(item){
      
      await this.$store.dispatch("saveFile",{
        item
      });
      
      this.$router.push({
        name:"editor",
        params:{
          space:item.space,
          name:item.name,
        }
      });
      
    },
    itemTagged:function(item){
      return !(this.tags.includes(this.itemDescription(item)));
    },
    itemDescription:(item)=>item.space+(item.space?'.':'')+item.name,
    tagsChange:function(){
      if(this.tags.length===0)return;
      let tagName = this.tags[this.tags.length-1];
      if(tagName==this.lastPinned)return;
      let space = tagName.substring(0,tagName.lastIndexOf('.'));
      let name = tagName.substring(tagName.lastIndexOf('.')+1);
      if(this.items.filter(i=>i.name==name&&i.space==space).length==0){
        this.items.unshift({
          name:name,
          space:space||'common',
          contents:'/*global $, firebase*/'
        });
        this.tags[this.tags.length-1] = space||'common';
      }
    },
    pinItem:function(item){
      let description = this.itemDescription(item);
      if(this.tags.includes(description)) return;
      this.lastPinned=description;
      this.tags.push(description);
    },
    itemSpace:(item)=>item.space+(item.space?'.':'')
  },
  computed:{
    
  },
  data () {
    return {
      lastPinned:'',
      items:[
        {
          space:"cache",
          name:"clearItems"
        }
        ],
      tags:[]
    }
  },
  components:{
    InputTag:InputTag
  },
  mounted:()=>{
    $('.vue-input-tag-wrapper').on('click','.input-tag',function(){
      console.log($(this).find('span').html());
    });
  }
}
</script>

<style lang="scss" scoped>
.functions {
  background-color:transparent;
}

.tags{
  margin-top:5px;
}
.pin{
  float:right;
}
</style>
