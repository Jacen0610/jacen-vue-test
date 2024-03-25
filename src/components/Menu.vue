<template>
  <div class="menu-demo">
    <a-menu mode="horizontal" theme="dark" :default-selected-keys="['1']">

      <a-image src="https://img2.imgtp.com/2024/03/22/YpQLVmxQ.jpg" width="80" fit="contain" style="float: left" />

      <router-link to="/">
        <a-menu-item key="1" >主页</a-menu-item>
      </router-link>
      <router-link to="/cargroup">
        <a-menu-item key="2">车辆编队</a-menu-item>
      </router-link>
      <router-link to="/carview">
        <a-menu-item key="3">车辆视图</a-menu-item>
      </router-link>
    </a-menu>
  </div>
</template>
<style scoped>
.menu-demo {
  box-sizing: border-box;
  width: 100%;
  padding: 40px;

}
</style>
<script setup>
import {left} from "core-js/internals/array-reduce";
</script>