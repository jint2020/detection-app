<template>
  <h1>{{ msg }}</h1>
  <div class="card">
    <van-button type="primary" @click="getDeviceInfo"> 设备信息</van-button>
  </div>
  <div class="card">
    {{ deviceInfo.brand_name }}
    {{ deviceInfo.company_name }}
    {{ deviceInfo.credit_code }}
  </div>
  <div class="card">
    <van-button type="primary" @click="readIdCard">读取证件</van-button>
  </div>

  <div class="card">
    <van-button type="primary" @click="showMasterDialog"> 主摄拍照</van-button>
  </div>
  <div class="card">
    <van-button type="primary" @click="showSlaveDialog"> 辅摄拍照</van-button>
  </div>
  <van-dialog v-model:show="show" title="拍照" width="auto" @closed="closeVideoConn" show-cancel-van-button>
    <canvas alt='' id='checkPicID' class="checkImg" style="width: 100%; height: 100%; display: block;"></canvas>
    <div class="card">
      <van-button type="primary" @click="takePhotoOnRecord(true)"> 拍照 </van-button>
    </div>
  </van-dialog>
</template>


<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getDeviceInfoByHand,
  masterTakePhotoEvent,
  slaveTakePhotoEvent,
  readServiceAbility, 
  getVideoEvent, 
  readCardExEvent,
  closeVideoDialog,
} from '../utils/device/index.js'
import { showNotify } from 'vant';
defineProps({
  msg: String,
})

const deviceInfo = reactive({
  brand_name: '',
  company_name: '',
  credit_code: ''
});

const getDeviceInfo = (event) => {
  getDeviceInfoByHand().then((res) => {
    if (res.code === 0) {
      showNotify({ type: 'success', message: '获取设备信息成功' });
      // result.camera_info
      const result = res.result;
      if (result.camera_info.length > 0) {
        const { brand_name, company_name, credit_code } = result.camera_info[0];
        deviceInfo.brand_name = brand_name
        deviceInfo.company_name = company_name
        deviceInfo.credit_code = credit_code
      }
    }
  }).catch((err) => {
    console.log(err);
  })
}

const readIdCard = () => {
  readCardExEvent().then((res) => {
    if (res.code === 0) {
      showNotify({ type: 'success', message: '读取成功' });
    } else {
      showNotify({ type: 'danger', message: '读取成功失败-1' });
    }
  }).catch((err) => {
    showNotify({ type: 'danger', message: '读取成功失败' });
  });
}

const takePhotoOnRecord = (e) => {
  masterTakePhotoEvent(e);
  slaveTakePhotoEvent(e);
}

const show = ref(false)

const showMasterDialog = (e) => {
  show.value = true;
  // 
  getVideoEvent(0);
}

const showSlaveDialog = (e) => {
  show.value = true;
  getVideoEvent(1)
} 

const closeVideoConn =()=>{
  closeVideoDialog();
}

onMounted(() => {
  readServiceAbility()
})

</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
