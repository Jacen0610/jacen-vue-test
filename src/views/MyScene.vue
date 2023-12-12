<template>
  <div>
    <h1 style="color: green; text-align: center;">This is Scene</h1>
    <button @click="initPose">Init Pose</button>
    <div ref="scene"></div>

  </div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";

export default {
  name: 'MyScene',
  mounted() {
    this.initScene();
  },
  methods: {
    initScene() {
      // 创建场景
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x404040) // 使用RGB表示灰色，这里的值为0x404040

      // 创建相机
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 50;
      camera.lookAt(new THREE.Vector3(0,0,0));

      //创建平面
      const planeGeometry = new THREE.PlaneGeometry(300, 300);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      scene.add(plane);

      //监听鼠标点击事件
      window.addEventListener('click', onClick, false);

      const mouse = new THREE.Vector2();
      let firstClick = null;
      const raycaster = new THREE.Raycaster();
      function onClick(event) {
        const rect = event.target.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // 设置Raycaster的起点和方向
        raycaster.setFromCamera(mouse, camera);

        // 获取射线与平面的交点
        const intersects = raycaster.intersectObject(plane);

        if (intersects.length > 0) {
          const clickPoint = intersects[0].point;

          if (!firstClick) {
            // 第一次点击
            firstClick = clickPoint.clone();
            console.log('First Click Point:', firstClick);
          } else {
            // 第二次点击
            const secondClick = clickPoint.clone();
            console.log('Second Click Point:', secondClick);

            // 计算第一个点到第二个点的方向
            const direction = new THREE.Vector3().subVectors(secondClick, firstClick).normalize();
            console.log('Direction:', direction);

            // 重置第一次点击
            firstClick = null;
          }
        }
      }

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)

      // 将渲染器添加到DOM中
      this.$refs.scene.appendChild(renderer.domElement)

      // 添加坐标轴辅助线
      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)

      //相机控制器
      const controls = new OrbitControls(camera,renderer.domElement);

      //车辆模型，先用长方体表示
      const boxgeo = new THREE.BoxGeometry( 1, 1, 1 );
      const boxmat = new THREE.MeshBasicMaterial( {color: 0xff0000} );
      const carModel = new THREE.Mesh( boxgeo, boxmat );
      carModel.position.set(3,0,0);
      scene.add(carModel);

      const pcdLoader = new PCDLoader();
      pcdLoader.load('20230710all.pcd',
      function(points) {
            scene.add(points);
            },function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
          function () {
            console.log('Error Occurred');
      });


      // 动画循环
      const animate = () => {
        requestAnimationFrame(animate)


        /*carModel.position.x += 0.01;*/

        //更新控制
        controls.update();
        // 渲染场景
        renderer.render(scene, camera)
      }

      animate()
    },
    initPose() {

    }
  }
}
</script>

<style scoped>
/* Add your styles if needed */
</style>
