<template>
  <div>
    <button @click="toggleArrowCreation">{{ isCreatingArrow ? '结束创建箭头' : '开始创建箭头' }}</button>
    <div ref="canvasContainer"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import {toRaw} from "vue";

export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      arrowHelper: null,
      plane: null,
      isCreatingArrow: false,
      arrowOrigin: null,
      arrowDirection: new THREE.Vector3(),
      mouseMoveEventListener: null,
      clickEventListenerA: null,
      clickEventListenerC: null,
      clickTimeout: null,
    };
  },
  mounted() {
    this.initializeScene();
    this.createPlane();
    this.animate();
  },
  methods: {
    initializeScene() {
      // 初始化场景
      this.scene = new THREE.Scene();

      // 初始化相机
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 5;

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // 添加渲染器到 DOM
      this.$refs.canvasContainer.innerHTML = '';
      this.$refs.canvasContainer.appendChild(this.renderer.domElement);

      // 渲染场景
      this.renderer.render(toRaw(this.scene), this.camera);
    },
    createPlane() {
      // 初始化平面
      const geometry = new THREE.PlaneGeometry(10, 10);
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
      this.plane = new THREE.Mesh(geometry, material);
      this.scene.add(this.plane);
    },
    toggleArrowCreation() {
      if (this.isCreatingArrow) {
        // 结束创建箭头
        this.isCreatingArrow = false;

        // 清除箭头
        this.removeArrow();

        // 停止监听 click 事件和 mousemove 事件
        if (this.clickEventListenerA) {
          window.removeEventListener('click', this.clickEventListenerA);
          this.clickEventListenerA = null;
        }
        if (this.mouseMoveEventListener) {
          window.removeEventListener('mousemove', this.mouseMoveEventListener);
          this.mouseMoveEventListener = null;
        }
        if (this.clickEventListenerC) {
          window.removeEventListener('click', this.clickEventListenerC);
          this.clickEventListenerC = null;
        }
        if (this.clickTimeout) {
          clearTimeout(this.clickTimeout);
          this.clickTimeout = null;
        }
      } else {
        // 开始创建箭头
        this.isCreatingArrow = true;

        // 等待200ms后开始监听鼠标点击事件A
        setTimeout(() => {
          this.clickEventListenerA = this.onClickA;
          window.addEventListener('click', this.clickEventListenerA);
        }, 200);
      }
    },
    onClickA(event) {
      if (this.isCreatingArrow) {
        // 结束监听鼠标点击事件A
        window.removeEventListener('click', this.clickEventListenerA);
        this.clickEventListenerA = null;

        // 计算鼠标与平面的交点作为箭头的起点
        const mouse = new THREE.Vector2();
        const canvasRect = this.$refs.canvasContainer.getBoundingClientRect();
        mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
        mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObject(this.plane);

        if (intersects.length > 0) {
          this.arrowOrigin = intersects[0].point;

          // 创建 ArrowHelper
          this.arrowHelper = new THREE.ArrowHelper(this.arrowDirection, this.arrowOrigin, 3, 0x00ff00);
          this.scene.add(this.arrowHelper);

          // 开始监听鼠标移动事件B
          this.mouseMoveEventListener = this.onMouseMoveB;
          window.addEventListener('mousemove', this.mouseMoveEventListener);

          // 开始监听鼠标点击事件C
          this.clickEventListenerC = this.onClickC;
          window.addEventListener('click', this.clickEventListenerC);
        }
      }
    },
    onMouseMoveB(event) {
      if (this.isCreatingArrow && this.arrowHelper) {
        // 计算实时更新 ArrowHelper
        const mouse = new THREE.Vector2();
        const canvasRect = this.$refs.canvasContainer.getBoundingClientRect();
        mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
        mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObject(this.plane);

        if (intersects.length > 0) {
          this.arrowDirection.subVectors(intersects[0].point, this.arrowOrigin).normalize();
          this.arrowHelper.setDirection(this.arrowDirection);
          this.renderer.render(toRaw(this.scene), this.camera);
        }
      }
    },
    onClickC(event) {
      if (this.isCreatingArrow) {
        // 打印箭头方向
        console.log('Arrow Direction Vector:', this.arrowDirection);

        // 结束监听鼠标点击事件C
        window.removeEventListener('click', this.clickEventListenerC);
        this.clickEventListenerC = null;

        // 结束监听鼠标移动事件B
        window.removeEventListener('mousemove', this.mouseMoveEventListener);
        this.mouseMoveEventListener = null;

        // 结束创建箭头
        this.isCreatingArrow = false;

        // 清除箭头
        this.removeArrow();
      }
    },
    removeArrow() {
      if (this.arrowHelper) {
        this.scene.remove(this.arrowHelper);
        this.arrowHelper = null;
        this.renderer.render(toRaw(this.scene), this.camera);
      }
    },
    animate() {
      // 请求下一帧动画
      requestAnimationFrame(this.animate);

      // 渲染场景
      this.renderer.render(toRaw(this.scene), this.camera);
    },
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
