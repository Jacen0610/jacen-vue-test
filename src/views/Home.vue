<template>
  <el-container>
    <el-header height="80px">
      <JMenu></JMenu>
    </el-header>

    <el-container>
      <el-main>
        <div class="large-text" >Jacen Holdings</div>
        <h1 style="color: #42b983">Welcome to Jacen's Vue test Project</h1>
        <h2 style="color: cadetblue;">Power by </h2>
        <el-icon size="80px" style="margin: 0 auto"><ChromeFilled /><ElementPlus /></el-icon>

      </el-main>
    </el-container>

  </el-container>
</template>

<script>
import JMenu from "@/views/JMenu.vue";
import {ChromeFilled, ElementPlus} from "@element-plus/icons-vue";

export default {
  name: 'Home',
  components: {ChromeFilled, ElementPlus, JMenu},
  data() {
    return {
      isCollapse: false
    }
  }
}
</script>

<style scoped>


.real-center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.large-text {
  font-size: 80px;
  color: aquamarine;
}

.btn-container {
  flex-direction: row;
  margin: 20px;

}
</style>