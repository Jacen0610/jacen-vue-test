<template>
  <div class="real-center-container">
    <div class="large-text" >This is Home Page</div>
    <h1 style="color: #42b983">Welcome, Jacen</h1>
    <div>
      <router-link class="btn-container" to="/myScene">
        <button class="rounded-btn">Go to MyScene</button>
      </router-link>
      <router-link class="btn-container" to="/partScene">
        <button class="rounded-btn">Go to PartScene</button>
      </router-link>
      <router-link class="btn-container" to="/mouseScene">
        <button class="rounded-btn">Go to MouseScene</button>
      </router-link>
    </div>

  </div>
</template>

<script>
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
