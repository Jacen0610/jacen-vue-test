<template>
  <div>
    <h1 style="color: green; text-align: center;">This is PartScene</h1>
    <button class="rounded-btn" @click="initPoseButton">Init Pose</button>
    <div ref="scene"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {toRaw} from "vue";
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";

export default {
  name: 'PartScene',
  data() {
    return {
      //基本环境变量
      scene: null,
      camera: null,
      renderer: null,
      cube: null,
      controls: null,
      plane: null,

      //initPose的变量
      firstClickFlag: false,
      firstPoint: null,
      secondPoint: null,
      initPoseFlag: false,
      firstPointMarker: null
    };
  },
  mounted() {
    // 初始化场景
    this.initScene();

    // 加载PCD
    this.loadPcd();

    // 在适当的时机调用动画执行方法
    this.startAnimation();
  },
  methods: {

    // 初始化场景实现函数
    initScene() {
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x404040) ;// 使用RGB表示灰色，这里的值为0x404040

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 40;

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // 将渲染器添加到DOM中
      this.$refs.scene.appendChild(this.renderer.domElement);

      // 添加坐标轴辅助线
      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);

      //创建平面
      const planeGeometry = new THREE.PlaneGeometry(500, 500);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide ,transparent: true, opacity: 0});
      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.scene.add(this.plane);


      // 添加 OrbitControls 控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },

    // 执行动画实现函数
    startAnimation() {
      // 动画循环
      const animate = () => {
        requestAnimationFrame(animate);



        // 更新 OrbitControls
        this.controls.update();

        // 渲染场景
        this.renderer.render(toRaw(this.scene), this.camera);
      }

      animate();
    },

    //加载PCD实现函数
    loadPcd() {
      const pcdLoader = new PCDLoader();
      const scene = this.scene;
      pcdLoader.load('20230710all.pcd',
          function(points) {
            scene.add(points);
          },function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          function (e) {
            console.log('Error Occurred',e);
          }
      );
    },

    // initPose按钮按下后执行函数
    initPoseButton() {
      console.log('Button Clicked.')
      if (this.initPoseFlag) {
        window.removeEventListener('click',this.poseCalculation);
      }
      setTimeout(() => {
        window.addEventListener('click',this.poseCalculation);
      },200);
    },

    // 计算两次点击的向量以及第一次点击的位置
    poseCalculation(event) {
      this.initPoseFlag = true;
      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      const rect = event.target.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // 设置Raycaster的起点和方向
      raycaster.setFromCamera(mouse, this.camera);

      // 获取射线与平面的交点
      const intersects = raycaster.intersectObject(this.plane);

      if (intersects.length > 0) {
        const clickPoint = intersects[0].point;

        if (!this.firstClickFlag) {
          // 第一次点击
          this.firstPoint = clickPoint.clone();
          console.log('First Click Point:', this.firstPoint);
          this.firstClickFlag = true;

          //添加第一次点击可视化位置
          const firstPosMarkerGeo = new THREE.CircleGeometry(0.5,32);
          const firstPosMarkerMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
          this.firstPointMarker = new THREE.Mesh(firstPosMarkerGeo,firstPosMarkerMat);
          this.firstPointMarker.position.set(this.firstPoint.x, this.firstPoint.y, 0);
          this.scene.add(this.firstPointMarker);
        } else {
          // 第二次点击
          this.secondPoint = clickPoint.clone();
          console.log('Second Click Point:', this.secondPoint);

          // 计算第一个点到第二个点的方向
          const direction = new THREE.Vector3().subVectors(this.secondPoint, this.firstPoint).normalize();
          console.log('Direction:', direction);

          // 重置第一次点击
          this.firstClickFlag = false;
          this.initPoseFlag = false;

          //移除第一个点的标记
          this.scene.remove(this.firstPointMarker);
          this.firstPointMarker = null;
          window.removeEventListener('click',this.poseCalculation);
        }
      }
    },

  }
}
</script>

<style scoped>
/* Add your styles if needed */
.rounded-btn {
  border-radius: 10px;
  padding: 15px;
  font-size: 20px;
}
</style>
