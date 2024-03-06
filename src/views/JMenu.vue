<template>
<el-menu
    default-active="0"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    :router="true"
>
<el-menu-item index="0">
  LOGO
</el-menu-item>
<div class="flex-grow" />
<el-menu-item index="1">Processing Center</el-menu-item>
<el-sub-menu index="2">
  <template #title>Workspace</template>
  <el-menu-item index="/myScene">My Scene</el-menu-item>
  <el-menu-item index="/partScene">Part Scene</el-menu-item>
  <el-menu-item index="/mqttTest">MQTT Test</el-menu-item>
  <el-sub-menu index="2-4">
    <template #title>item four</template>
    <el-menu-item index="2-4-1">item one</el-menu-item>
    <el-menu-item index="2-4-2">item two</el-menu-item>
    <el-menu-item index="2-4-3">item three</el-menu-item>
  </el-sub-menu>
</el-sub-menu>
</el-menu>
</template>


<script>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting, ChatRound, House, Tools, ElementPlus,
} from '@element-plus/icons-vue'

export default {
  name: 'JMenu',
  data() {
    return {

    }
  },
  props: {

  },
  methods: {

  }
}
</script>

<style scoped>


.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
  min-height: 600px;
}


 .flex-grow {
   flex-grow: 1;
 }



</style>
