
<template>
  <h1 style="color: #42b983; text-align: center">Welcome to MQTT Test Page</h1>
  <el-input v-model="inputTopic1" placeholder="Please input topic" />
  <el-row>
    <el-col :span="4">
      <el-button @click="topic1Confirm" type="primary" style="float: left;margin: 20px ">确定Topic</el-button>
    </el-col>
    <el-col :span="8">
      <el-text class="mx-2" type="success" style="float: left;margin: 30px" size="large">{{topic1Alert}}</el-text>
    </el-col>
  </el-row>


</template>

<script>
import mqtt from 'mqtt';
import RandomString from 'random-string'
  export default {
    name: 'MqttTest',
    data() {
      return {
        ClientMQTT: null,
        MQTTFlag: 0,
        inputTopic1: '',
        topic1: '',
        topic1Alert: ''

      }
    },
    methods: {
      initMqttClient() {
        const clientID = 'mqtt_' + RandomString(5);
        const connectUrl = 'ws://47.95.223.220:8083/mqtt'
        const options = {
          clean: true,
          connectTimeout: 5000,
          clientId: clientID
        }
        this.ClientMQTT = mqtt.connect(connectUrl,options);

        this.ClientMQTT.on('reconnect', (error) => {
          console.log('正在重连:', error)
        })

        this.ClientMQTT.on('error', (error) => {
          console.log('连接失败:', error)
          this.MQTTFlag = 0;
        })

        this.ClientMQTT.on('connect', () => {
          console.log('连接服务器成功')
          this.MQTTFlag = 1;
        })
        this.ClientMQTT.on('message', (topic, message) => {
          console.log('收到消息：', topic, message.toString())
        })
      },
      topic1Confirm() {
        this.topic1 = this.inputTopic1;
        this.topic1Alert = '当前订阅：' + this.topic1;
        if(this.MQTTFlag === 1){
          this.ClientMQTT.subscribe(this.topic1);
        }
      }
    },
    mounted() {
      this.initMqttClient();
    }
  }
</script>
<style scoped>

</style>