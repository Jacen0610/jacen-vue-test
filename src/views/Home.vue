<template>
  <div class="real-center-container">
    <div class="large-text" >This is Home Page</div>
    <h1 style="color: #42b983">Welcome to Jacen's Vue test Project</h1>
    <h2 style="color: cadetblue">Most power by Three.js</h2>
    <div>
      <router-link class="btn-container" to="/myScene">
        <el-button size="large" type="warning" round>Go to MyScene</el-button>
      </router-link>
      <router-link class="btn-container" to="/partScene">
        <el-button size="large" type="success" round>Go to TestScene</el-button>
      </router-link>
    </div>

  </div>
</template>

<script>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
export default {
  name: 'Home'
}
</script>

<style scoped>

  .rounded-btn {
    border-radius: 10px;
    padding: 15px;
    font-size: 18px;
  }

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
