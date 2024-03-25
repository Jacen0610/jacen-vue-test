<template>
  <Menu/>

    <a-carousel
        autoPlay="interval: 2000"
        animation-name="card"
        show-arrow="never"
        indicator-position="outer"
        :style="{
      width: '100%',
      height: '500px',
    }"
    >
      <a-carousel-item v-for="image in images" :style="{ width: '60%' }">
        <img
            :src="image"
            :style="{
          width: '100%',
          height: '100%'
        }"
        />
      </a-carousel-item>
    </a-carousel>

</template>

<script>
import Menu from "@/components/Menu.vue";

export default {
  name: 'Home',
  components: {Menu},
  setup() {
    const images = [
      'https://img2.imgtp.com/2024/03/22/1HvbBrQ4.jpg',
      'https://img2.imgtp.com/2024/03/22/4FtgKJ6N.jpg',
      'https://img2.imgtp.com/2024/03/22/OCuVGGPd.jpg',
    ];
    return {
      images
    }
  },
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
