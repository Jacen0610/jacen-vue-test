
<template>
  <a-row justify="end">
    <a-affix :offsetTop="50" >
      <a-button type="primary" status="danger" :disabled="isCreatingArrow" @click="commonGoalStart" >设置共同目标点</a-button>
    </a-affix>
    <a-affix :offsetTop="50" >
      <a-button type="primary" status="success" @click="commonGoalSend">发送共同目标点</a-button>
    </a-affix>
  </a-row>
  <a-row>
    <a-space>
      <template #split>
        <a-divider direction="vertical" />
      </template>
      <a-space>
        <a-typography-text>MQTT服务器连接状态：</a-typography-text>
        <a-space :style="{color: mqttServerStatus?'green':'red'}">{{ mqttServerStatus ? '已连接':'未连接' }}</a-space>
      </a-space>
      <a-space>
        <router-link class="btn-container" to="/">
          <a-button type="primary" shape="round" size="small" status="success">返回主页</a-button>
        </router-link>
      </a-space>
    </a-space>
  </a-row>

  <div ref="canvasContainer" id="myCanvas"></div>
</template>

<script>

import * as THREE from 'three';
import MQTT from 'mqtt';
import RandomString from 'random-string'
import { toRaw } from 'vue';
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {Modal} from "@arco-design/web-vue";
import { Notification } from '@arco-design/web-vue';



export default {
  data() {
    return {
      // MQTT客户端
      MQTTClient: null,
      mqttServerStatus: false,
      clientID: 'mqtt_000000',
      connectURL: 'ws://47.95.223.220:8083/mqtt',
      subTopic1: null,
      CarPosition1: [],
      CarPosition2: [],
      CarPosition3: [],


      plane: null,
      goalPosition: null,
      goalDirection: new THREE.Vector3(),
      arrowHelper: null,
      isCreatingArrow: false,
      clickEventListenerA: null,
      mouseMoveEventListener: null,
      clickEventListenerC: null,

      // THREE全局变量
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      car1: null,
      car2: null,
      car3: null
    };
  },
  mounted() {
    this.connectMQTTClient();
    this.initScene();
    this.loadPCD();
    this.startAnimation();
  },
  methods: {
    connectMQTTClient(){

      // 随机生成连接名，否则多人连接时会使用同一个ID导致无法连接
      this.clientID = RandomString().toString();

      const options = {
        clean: true, // true: 清除会话, false: 保留会话
        connectTimeout: 4000, // 超时时间
        // 认证信息
        clientId: this.clientID,
      }

      this.MQTTClient = MQTT.connect(this.connectURL,options);

      this.MQTTClient.on('reconnect', (error) => {
        console.log('正在重连:', error);
      });

      this.MQTTClient.on('error', (error) => {
        this.mqttServerStatus = false;
        console.log('连接失败:', error)
      });

      this.MQTTClient.on('connect', () => {
        this.mqttServerStatus = true;
        console.log('连接成功');
        this.MQTTClient.subscribe('/CarPose/TJ001');
        this.MQTTClient.subscribe('/CarPose/TJ002');
        this.MQTTClient.subscribe('/CarPose/TJ003');
      });

      this.MQTTClient.on('message', (topic,msg) => {
        if(topic === '/CarPose/TJ001') {
          this.CarPosition1 = JSON.parse(msg.toString()).pose;
          console.log(this.CarPosition1);
        }
        if(topic === '/CarPose/TJ002') {
          this.CarPosition2 = JSON.parse(msg.toString()).pose;
          console.log(this.CarPosition2);

        }
        if(topic === '/CarPose/TJ003') {
          this.CarPosition3 = JSON.parse(msg.toString()).pose;
          console.log(this.CarPosition3);

        }
      });



    },
    initScene(){
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x404040) ;
      const canvasWidth = window.innerWidth-16;
      const canvasHeight = window.innerHeight;


      this.camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
      this.camera.position.z = 70;
      this.camera.position.x = -10;
      this.camera.position.y = -30;

      const planeGeometry = new THREE.PlaneGeometry(500, 500);
      const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide ,transparent: true, opacity: 0});
      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.scene.add(this.plane);

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(canvasWidth, canvasHeight);

      this.$refs.canvasContainer.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera,this.renderer.domElement);
      this.controls.enableRotate = false;

      const carGeo = new THREE.BoxGeometry(3,1.5,2);
      const carMat1 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
      const carMat2 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      const carMat3 = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
      this.car1 = new THREE.Mesh(carGeo,carMat1);
      this.car2 = new THREE.Mesh(carGeo,carMat2);
      this.car3 = new THREE.Mesh(carGeo,carMat3);
      if(this.CarPosition1){
        this.scene.add(this.car1);
      }
      if(this.CarPosition2){
        this.scene.add(this.car2);
      }
      if(this.CarPosition3){
        this.scene.add(this.car3);
      }
    },
    startAnimation() {
      // 动画循环
      const animate = () => {
        requestAnimationFrame(animate);

        // 更新 OrbitControls
        this.controls.update();
        this.camera.lookAt(this.camera.position.x,this.camera.position.y,0);

        // 更新车辆位置
        this.car1.position.set(this.CarPosition1[0],this.CarPosition1[1],this.CarPosition1[2]);
        this.car1.quaternion.set(this.CarPosition1[3],this.CarPosition1[4],this.CarPosition1[5],this.CarPosition1[6]);
        this.car2.position.set(this.CarPosition2[0],this.CarPosition2[1],this.CarPosition2[2]);
        this.car2.quaternion.set(this.CarPosition2[3],this.CarPosition2[4],this.CarPosition2[5],this.CarPosition2[6]);
        this.car3.position.set(this.CarPosition3[0],this.CarPosition3[1],this.CarPosition3[2]);
        this.car3.quaternion.set(this.CarPosition3[3],this.CarPosition3[4],this.CarPosition3[5],this.CarPosition3[6]);

        // 渲染场景
        this.renderer.render(toRaw(this.scene), this.camera);
      }

      animate();
    },
    loadPCD() {
      const pcdL = new PCDLoader();
      const theScene = this.scene;
      pcdL.load(
          'Teemo.pcd',
          function (points) {
            theScene.add(points);
            Notification.success({
              id: 'mapLoaded',
              title: 'Success',
              content: '地图加载完成',
            });
          },
          function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100);
            Notification.warning({
              id: 'mapLoaded',
              title: 'Loading',
              content: `正在加载中：${xhr.loaded / xhr.total * 100}%`,
            })

          },
          function (error) {
            console.log(error)
          }
      );
    },
    commonGoalStart(){
      if (this.isCreatingArrow) {
        // 结束创建箭头
        this.isCreatingArrow = false;

        // 清除箭头
        if (this.arrowHelper) {
          this.scene.remove(this.arrowHelper);
          this.arrowHelper = null;
          this.renderer.render(toRaw(this.scene), this.camera);
        }

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
          this.clickEventListenerA = this.commonGoalConfirm;
          window.addEventListener('click', this.clickEventListenerA);
        }, 200);
      }
    },
    commonGoalConfirm(event){
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
          this.goalPosition = intersects[0].point;

          // 创建 ArrowHelper
          this.arrowHelper = new THREE.ArrowHelper(this.goalDirection, this.goalPosition, 8, 0x00ff00,5,2);
          this.scene.add(this.arrowHelper);

          // 开始监听鼠标移动事件B
          this.mouseMoveEventListener = this.directionConfirm;
          window.addEventListener('mousemove', this.mouseMoveEventListener);

          // 开始监听鼠标点击事件C
          this.clickEventListenerC = this.clickConfirm;
          window.addEventListener('click', this.clickEventListenerC);
        }
      }
    },
    directionConfirm(event){
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
          this.goalDirection.subVectors(intersects[0].point, this.goalPosition).normalize();
          this.arrowHelper.setDirection(this.goalDirection);
          this.renderer.render(toRaw(this.scene), this.camera);
        }
      }
    },
    clickConfirm(){
      if (this.isCreatingArrow) {
        // 打印箭头方向
        console.log('Arrow Direction Vector:', this.goalDirection);

        // 结束监听鼠标点击事件C
        window.removeEventListener('click', this.clickEventListenerC);
        this.clickEventListenerC = null;

        // 结束监听鼠标移动事件B
        window.removeEventListener('mousemove', this.mouseMoveEventListener);
        this.mouseMoveEventListener = null;

        // 结束创建箭头
        this.isCreatingArrow = false;

        // 清除箭头
        if (this.arrowHelper) {
          this.scene.remove(this.arrowHelper);
          this.arrowHelper = null;
          this.renderer.render(toRaw(this.scene), this.camera);
        }
      }
    },
    commonGoalSend(){
      if(!this.goalPosition){
        this.$notification.error('无目标点');
        return;
      }
      if(this.goalDirection.x === 0 && this.goalDirection.y === 0 && this.goalDirection.z === 0){
        this.$notification.error('未确定方向');
        return;
      }
      const goalArray = {
        goal: [this.goalPosition.x,this.goalPosition.y,this.goalPosition.z],
        direction: [this.goalDirection.x,this.goalDirection.y,this.goalDirection.z]
      };
      console.log(goalArray);
      const goalPayload = JSON.stringify(goalArray);
      console.log(goalPayload);
      this.MQTTClient.publish('/SendGoal',goalPayload);
      Modal.success({
        title: '车辆编队目标点发送成功',
        content: `目标点：${this.goalPosition.x.toFixed(2)},
        ${this.goalPosition.y.toFixed(2)},
        ${this.goalPosition.z.toFixed(2)} |
          方向： ${this.goalDirection.x.toFixed(2)},
          ${this.goalDirection.y.toFixed(2)},
          ${this.goalDirection.z.toFixed(2)}`,
        width: "auto"
      });
    }
  }
}
</script>




<style scoped lang="less">

</style>