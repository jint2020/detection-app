<script setup>
import { ref,onMounted } from 'vue'

defineProps({
  msg: String,
})

import { getDeviceInfoByHand,masterTakePhotoEvent,readServiceAbility,getVideoEvent } from '../utils/device/index.js'
  const clickOk = (e) =>{
    console.log(e);
    const isClose = false;
    masterTakePhotoEvent(isClose)
  }

const show = ref(false)

const showDialog =(e)=> {
  show.value = true;
  getVideoEvent(0);
}

onMounted(()=>{
  readServiceAbility()
})

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="clickOk(true)"> 拍照</button>
  </div>
  <div class="card">
    <button type="button" @click="getDeviceInfoByHand"> 设备信息</button>
  </div>

  
  <div class="card">
    <button type="button" @click="showDialog"> dialog</button>
  </div>
  <van-dialog v-model:show="show" title="标题" width="auto" show-cancel-button>
    <canvas alt='' id='checkPicID' class="checkImg" style="width: 100%; height: 100%; display: block;"></canvas>
    <div class="card">
    <button type="button" @click="clickOk(true)"> 拍照</button>
  </div>
  </van-dialog>
  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
