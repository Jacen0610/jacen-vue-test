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

      // 添加渲染器到DOM
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
      } else {
        // 开始创建箭头
        this.isCreatingArrow = true;

        // 等待200ms后开始监听鼠标点击事件
        setTimeout(() => {
          window.addEventListener('click', this.onClick);
        }, 200);
      }
    },
    onClick(event) {
      if (this.isCreatingArrow) {
        // 清除之前的箭头
        this.removeArrow();

        // 计算鼠标与平面的交点作为arrowhelper的origin
        const mouse = new THREE.Vector2();
        const canvasRect = this.$refs.canvasContainer.getBoundingClientRect();
        mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
        mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObject(this.plane);

        if (intersects.length > 0) {
          const origin = intersects[0].point;
          const direction = new THREE.Vector3(1, 0, 0); // 初始方向，你可以根据实际需求更改

          // 创建ArrowHelper
          this.arrowHelper = new THREE.ArrowHelper(direction, origin, 3, 0x00ff00);
          this.scene.add(this.arrowHelper);

          // 开始监听鼠标实时移动的位置与平面的交点
          window.addEventListener('mousemove', this.onMouseMove);
        }
      }
    },
    onMouseMove(event) {
      if (this.isCreatingArrow && this.arrowHelper) {
        // 计算实时更新arrowhelper
        const mouse = new THREE.Vector2();
        const canvasRect = this.$refs.canvasContainer.getBoundingClientRect();
        mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
        mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObject(this.plane);

        if (intersects.length > 0) {
          const direction = new THREE.Vector3().subVectors(intersects[0].point, this.arrowHelper.position);
          this.arrowHelper.setDirection(direction.normalize());
          this.renderer.render(toRaw(this.scene), this.camera);
        }
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

</style>
