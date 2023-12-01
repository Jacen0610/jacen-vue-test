<template>
  <div>
    <h1 style="color: green; text-align: center;">This is Scene</h1>
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
          function (error) {
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
    }
  }
}
</script>

<style scoped>
/* Add your styles if needed */
</style>
