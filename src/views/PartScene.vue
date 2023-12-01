<template>
  <div>
    <h1 style="color: green; text-align: center;">This is PartScene</h1>
    <div ref="scene"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default {
  name: 'PartScene',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      cube: null,
      controls: null
    };
  },
  mounted() {
    // 初始化场景
    this.initScene();

    // 在适当的时机调用动画执行方法
    this.startAnimation();
  },
  methods: {
    initScene() {
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x404040) ;// 使用RGB表示灰色，这里的值为0x404040

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 5;

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // 将渲染器添加到DOM中
      this.$refs.scene.appendChild(this.renderer.domElement);

      // 添加坐标轴辅助线
      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);

      // 创建立方体
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x888888 });// 使用RGB表示灰色，这里的值为0x888888
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);

      // 添加 OrbitControls 控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    startAnimation() {
      // 动画循环
      const animate = () => {
        requestAnimationFrame(animate);

        // 使立方体旋转
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        // 更新 OrbitControls
        this.controls.update();

        // 渲染场景
        this.renderer.render(this.scene, this.camera);
      }

      animate();
    }
  }
}
</script>

<style scoped>
/* Add your styles if needed */
</style>
