<template>
  <div id="app">
    <paste-select :params="{fieid: 'subject', label: '姓名', required: true}"/>
    <paste-select :params="{fieid: 'jobNumber', label: '工号', required: true}"/>
    <!-- <multi-table /> -->

    <!-- <multi-tree/> -->

    <merge-table />
  </div>
</template>

<script>
import { topBar } from './config';
import MultiTable from './components/MultiTable'
import PasteSelect from './components/PasteSelect'
import MultiTree from './components/Tree'
import MergeTable from './components/mergeTable'
export default {
  name: 'App',
  components: {MultiTable,PasteSelect, MultiTree, MergeTable},
  created() {
    console.log(topBar);
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
