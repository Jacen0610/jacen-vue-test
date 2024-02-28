<template>
  <div>
    <h1 style="color: green; text-align: center;">This is Scene</h1>
    <div ref="scene"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import ROSLIB from 'roslib'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader";
import {toRaw} from "vue";

export default {
  name: 'MyScene',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      cube: null,
      controls: null,


      rosClient: null
    };
  },
  mounted() {
    this.initScene();
    this.loadPCD();
    this.initRos();
    this.startAnimation();
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 5;

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // 将渲染器添加到DOM中
      this.$refs.scene.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
    ,
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
    }
    ,
    loadPCD(){
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
    }
    ,
    initRos() {
      this.rosClient = new ROSLIB.Ros(
          {url: 'ws://localhost:9090'}
      );
      this.rosClient.on('connection', function() {
        console.log('Connected to websocket server.');
      });

      this.rosClient.on('error', function(error) {
        console.log('Error connecting to websocket server: ', error);
      });

      this.rosClient.on('close', function() {
        console.log('Connection to websocket server closed.');
      });
      let pointTopic = new ROSLIB.Topic({
        ros: this.rosClient,
        name: '/points_raw',
        messageType: 'sensor_msgs/PointCloud2'
      });
      pointTopic.subscribe(function (msg) {
        console.log(1);
      })
    }
  }
}
</script>

<style scoped>
/* Add your styles if needed */
</style>
