<template>
  <a-space direction="vertical" size="large">
    <a-space>
      <a-space size="large">请选择主控车辆：</a-space>
      <a-select :style="{width:'320px'}" v-model="rulerCar" size="large" :disabled="mainCarStatus" placeholder="请选择...">
        <a-option>TJ001</a-option>
        <a-option>TJ002</a-option>
        <a-option>TJ003</a-option>
      </a-select>
      <a-space>
        <a-button type="primary" :disabled="mainCarStatus" @click="handleMainCarSubmit">确认主车</a-button>
        <a-button type="primary" status="warning"  @click="recoverMainCarSubmit">重新选定</a-button>
      </a-space>
    </a-space>
  </a-space>
  <a-space direction="vertical" size="large" fill>
    <a-table row-key="name" :columns="columns" :data="data" :row-selection="groupSelectStatus ? rowSelection : undefined"
             v-model:selectedKeys="selectedKeys" :pagination="pagination" />
  </a-space>
  <a-space direction="vertical" size="large" style="margin-left: 10px">
    <a-row>
      <a-space size="large" style="margin: auto">自定义速度(单位KM/H)：</a-space>
      <a-input v-model="candidateSpeed" :style="{width:'320px'}" placeholder="非必填项，默认值为5" :disabled="speedStatus"/>
      <a-button type="primary" :disabled="speedStatus" @click="handleSpeedSubmit">确认速度</a-button>
      <a-button type="primary" status="warning"  @click="recoverSpeedSubmit">重新启用</a-button>
    </a-row>
    <a-row>
      <a-space size="large" style="margin: auto">自定义距离(单位M)：</a-space>
      <a-input v-model="candidateDistance" :style="{width:'320px'}" placeholder="非必填项，默认值为3" :disabled="distanceStatus" />
      <a-button type="primary" :disabled="distanceStatus" @click="handleDistanceSubmit">确认距离</a-button>
      <a-button type="primary" status="warning"  @click="recoverDistanceSubmit">重新启用</a-button>
    </a-row>
  </a-space>
  <a-space direction="vertical" :align="'center'" :fill="true" style="margin-top: 20px">
    <a-space>
      <a-button type="primary" shape="round" :disabled="submitStatus" @click="handleSubmit">发送车辆编队</a-button>
      <a-button type="primary" shape="round" status="warning"  @click="recoverMainCarSubmit">重新启用发送</a-button>
      <router-link class="btn-container" to="/">
        <a-button type="primary" shape="round" size="large" status="success">返回主页</a-button>
      </router-link>
    </a-space>
  </a-space>

</template>

<script>
import { reactive } from 'vue';
import {Modal} from "@arco-design/web-vue";
import RandomString from "random-string"
import MQTT from 'mqtt'


export default {
  data() {
    return {
      rowSelection : reactive({
        type: 'checkbox',
        showCheckedAll: true,
        onlyCurrent: false,
      })
      ,
      pagination: {pageSize: 5}
      ,
      columns : [
        {
          title: '车辆型号',
          dataIndex: 'name',
        },
        {
          title: '链接',
          dataIndex: 'link',
        },
      ]
      ,
      data : reactive([{
        key: '1',
        name: 'TJ001'
      }, {
        key: '2',
        name: 'TJ002',
      }, {
        key: '3',
        name: 'TJ003'
      }])
      ,
      selectedKeys: [],
      rulerCar: '',
      submitStatus: false,
      groupSelectStatus: false,
      mainCarStatus: false,
      groupMsg: [],

      speedStatus: false,
      candidateSpeed: null,
      speed: 5,
      candidateDistance: null,
      distanceStatus: false,
      distance: 3,

      mqttURL: 'ws://47.95.223.220:8083/mqtt'
    }
  },
  methods: {
    handleMainCarSubmit() {
      if(this.rulerCar !== ''){
        this.mainCarStatus = true;
        this.selectedKeys = [this.rulerCar];
        this.groupSelectStatus = true;
      }else{
        this.$notification.error('未选定主车');
      }
    },
    recoverMainCarSubmit() {
      this.rulerCar = '';
      this.selectedKeys = [];
      this.mainCarStatus = false;
      this.groupSelectStatus = false;
      this.submitStatus = false;
    },
    handleSpeedSubmit() {
      if(this.candidateSpeed){
        this.speed = parseInt(this.candidateSpeed,10);
      }else{
        this.$notification.error('未填写自定义速度');
        return;
      }
      this.speedStatus = true;
    },
    recoverSpeedSubmit() {
      this.speedStatus = false;
    },
    handleDistanceSubmit() {
      if(this.candidateDistance){
        this.distance = parseInt(this.candidateDistance,10);
      }else{
        this.$notification.error('未填写自定义距离');
        return;
      }
      this.distanceStatus = true;
    },
    recoverDistanceSubmit() {
      this.distanceStatus = false;
    },

    handleSubmit() {
      if(this.rulerCar === '' || this.selectedKeys.length === 0){
        this.$notification.error('未选定主车或未选中编队');
      }else if(this.selectedKeys.indexOf(this.rulerCar) === -1){
        this.$notification.error('编队中未包含主控车');
      }else{
        this.submitStatus = true;
        Modal.success({
          title: '车辆编队发送成功',
          content: `主控车：${this.rulerCar},
          车辆编队： ${this.selectedKeys},
          速度： ${this.speed},
          距离： ${this.distance}`,
          width: "auto"
        });

        // MQTT发送编队消息
        const clientID = RandomString().toString();
        const options = {
          clean: true, // true: 清除会话, false: 保留会话
          connectTimeout: 4000, // 超时时间
          // 认证信息
          clientId: clientID,
        }
        const MQTTClient = MQTT.connect(this.mqttURL,options);
        MQTTClient.on('reconnect', (error) => {
          console.log('正在重连:', error)
        });

        MQTTClient.on('error', (error) => {
          console.log('连接失败:', error);
        });
        MQTTClient.on('connect', () => {
          console.log('连接成功');
          const topic = '/CarGroup';
          const msg = JSON.stringify({
            headcar: this.rulerCar,
            group: this.selectedKeys,
            speed: this.speed,
            distance: this.distance
          });
          MQTTClient.publish(topic,msg);
        });
      }
    },
  }
}
</script>
