import takePhoto from "./takePhoto";
import readCert from "./readcert";
import serviceutil from "./serviceWebsocket";
console.log("takePhoto ", takePhoto);


// service.js
const service = {};
//SAM读证
service.readIntegratedCard = function (retcode) {
    readCert.rcOpenCertDevice(function (cert) {
        // console.log('retcode====,,,', cert)
        retcode(cert);
    });
};

//Sdt读证
service.readSdtCard = function (retcode) {
    readCert.rcSdtCertDevice(function (cert) {
        // console.log('retcode====,,,', cert)
        retcode(cert);
    });
};

// 读证秘钥
service.setAppParamEx = function (appKey, appSecret, password, retcode) {
    console.log("秘钥", appKey, appSecret, password);
    readCert.rcSetAppParamEx(appKey, appSecret, password, function (cert) {
        retcode(cert);
    });
};
// 读证
service.readCardEx = function (retcode) {
    readCert.rcReadCardEx(function (cert) {
        retcode(cert);
    });
};

// 读证(无需合成图)
service.readCardExNoNeedPic = function (retcode) {
    readCert.rcReadCardExNoNeedPic(function (cert) {
        retcode(cert);
    });
};

//获取设备型号
service.getDevModel = function (retcode) {
    // readCert.rcGetDevModel(function (cert) {
    //     retcode(cert);
    // });
    // 改成调用国龙的新接口
    serviceutil.getDeviceModel(function (cert) {
        retcode(cert);
    });
};

//获取设备信息
service.getDevInfo = function (retcode) {
    serviceutil.getDeviceInfo(function (cert) {
        retcode(cert);
    });
};

/*
读卡流程
*/
//获取设备
service.ListCard = function (retcode) {
    readCard.rdListCard(function (cert) {
        retcode(cert);
    });
};
//连接卡
service.ConnectCard = function (retcode) {
    var isSuccess = false;
    readCard.rdConnectCard(function (cert) {
        if (cert.err_code != -290 && isSuccess != true) {
            isSuccess = true;
            retcode(cert);
        } else {
            readCard.rdListCard(function (cert) {
                retcode(cert);
                readCard.rdConnectCard(function (cert) {
                    retcode(cert);
                });
            });
        }
    });
};
//发送APDU
service.TransmitCard = function (Apdu, CardName, retcode) {
    readCard.rdTransmitCard(Apdu, CardName, function (cert) {
        retcode(cert);
    });
};
//断开卡
service.DisconnectCard = function (retcode) {
    readCard.rdDisconnectCard(function (cert) {
        retcode(cert);
    });
};
// 获取视频设备信息
service.getVideoInfo = function (retcode) {
    takePhoto.tpGetVideoInfo(function (cert) {
        retcode(cert);
    });
};
//打开视频
service.masterOpenVideo = function (videoParams, cutStatus, retcode) {
    // console.log('servicevideoParams', videoParams)
    takePhoto.tpMasterOpenVideo(videoParams, cutStatus, function (cert) {
        retcode(cert);
    });
};
//关闭视频
service.closeVideo = function (retcode) {
    takePhoto.tpCloseVideo(function (cert) {
        retcode(cert);
    });
};
// 主头拍照
service.masterTakePhoto = function (text, is_compress, compress_size, margins, rotate_angle, is_cut, retcode) {
    takePhoto.tpMasterTakePhoto(text, is_compress, compress_size, margins, rotate_angle, is_cut, function (cert) {
        retcode(cert);
    });
};

export function masterTakePhoto(text, is_compress, compress_size, margins, rotate_angle, is_cut, retcode){
    takePhoto.tpMasterTakePhoto(text, is_compress, compress_size, margins, rotate_angle, is_cut,(cert) => {
        retcode(cert);
    })
}
// 副头拍照
service.slaveTakePhoto = function (text, is_compress, compress_size, margins, rotate_angle, is_cut, retcode) {
    takePhoto.tpslaveTakePhoto(text, is_compress, compress_size, margins, rotate_angle, is_cut, function (cert) {
        retcode(cert);
    });
};
//照片旋转角度
service.roteAngle = function (angleValue) {
    takePhoto.tpRoteAngle(angleValue);
};
//照片文件格式
service.picType = function (pic_type) {
    takePhoto.tpPicType(pic_type);
};
//评价功能
service.evaluateSign = function (params, callback, retcode) {
    sign.sEvaluateSign(params, function (cert) {
        retcode(cert);
    });
};

//签字获取设备在线状态
service.getSignStatus = function (retcode) {
    sign.sGetSignStatus(function (cert) {
        retcode(cert);
    });
};
//打开签字
service.signOpen = function (status, signData, retcode) {
    sign.sSignOpen(status, signData, function (cert) {
        retcode(cert);
    });
};
//获取坐标
service.getCoordinate = function (retcode) {
    sign.sGetCoordinate(function (cert) {
        retcode(cert);
    });
};
//签字
service.signFile = function (retcode) {
    sign.sSignFile(function (cert) {
        retcode(cert);
    });
};
//重签
service.resetSign = function (retcode) {
    sign.sResetSign(function (cert) {
        retcode(cert);
    });
};
//取消签名
service.closeSign = function (retcode) {
    sign.sCloseSign(function (cert) {
        retcode(cert);
    });
};
// 关闭签名设备
service.closeSignDevice = function (retcode) {
    sign.sCloseDevice(function (cert) {
        retcode(cert);
    });
};
//识别条码
service.scanBarcodeFromPhoto = function (params, retcode) {
    takePhoto.scanBarcodeFromPhoto(params, function (cert) {
        retcode(cert);
    });
};
//ocr证件信息
service.ocrTextFromPhoto = function (params, retcode) {
    takePhoto.ocrTextFromPhoto(params, function (cert) {
        retcode(cert);
    });
};
//ocr证件信息(在线)
service.ocrTextFromPhotoOnline = function (params, retcode) {
    takePhoto.ocrTextFromPhotoOnline(params, function (cert) {
        retcode(cert);
    });
};

// 活体检测开始
// 获取设备信息
service.lcGetDeviceInfo = function (retcode) {
    liveCheck.lcGetDeviceInfo(function (cert) {
        retcode(cert);
    });
};
// 打开视频
service.lcSingleVideoCheck = function (params, callback, callback1) {
    liveCheck.lcSingleVideoCheck(
        params,
        function (cert) {
            callback(cert);
        },
        function (cert1) {
            callback1(cert1);
        }
    );
};
// 人脸检测
service.lcOpenFaceCheck = function (callback, callback1) {
    liveCheck.lcOpenFaceCheck(
        function (cert) {
            callback(cert);
        },
        function (cert1) {
            callback1(cert1);
        }
    );
};
// 活体检测
service.lcOpenLiveCheck = function (callback, callback1) {
    liveCheck.lcOpenLiveCheck(
        function (cert) {
            callback(cert);
        },
        function (cert1) {
            callback1(cert1);
        }
    );
};

// 人脸比对
service.lcComparisonCheck = function (params, callback, callback1) {
    liveCheck.lcComparisonCheck(
        params,
        function (cert) {
            callback(cert);
        },
        function (cert1) {
            callback1(cert1);
        }
    );
};

// 断开活体模块接口
service.lcCloseLiveCheck = function (retcode) {
    liveCheck.lcCloseLiveCheck(function (cert) {
        retcode(cert);
    });
};

// 关闭活体检测功能
service.lcLivenessDetectStop = function (retcode) {
    liveCheck.lcLivenessDetectStop(function (cert) {
        retcode(cert);
    });
};

// 关闭活体视频流
service.liveStopVideoEvent = function (retcode) {
    liveCheck.lcVideoStop(function (cert) {
        retcode(cert);
    });
};

service.liveRestartEvent = function () {
    liveCheck.liveRestart();
}

// 合成pdf
service.combinePDFCheck = function (picData, retcode) {
    takePhoto.tpcombinePDFCheck(picData, function (cert) {
        retcode(cert);
    });
};

// 开始录像
service.startRecord = function (params, callback) {
    takePhoto.startRecord(params, callback);
};

// 停止录像
service.stopRecord = function (params, callback) {
    takePhoto.stopRecord(params, callback);
};

// 获取信息
service.getServiceInfo = function (callback) {
    serviceutil.getServiceInfo(callback);
};

// 获取能力集
service.getServiceAbility = function (callback) {
    serviceutil.getServiceAbility(callback);
};

// 修改通讯协议，默认ws，可选wss
service.changeProtocol = function (protocol) {
    cardutil.changeProtocol(protocol);
    liveutil.changeProtocol(protocol);
    serviceutil.changeProtocol(protocol);
    signutil.changeProtocol(protocol);
    videoutil.changeProtocol(protocol);

};

//设置是否开启静态边缘检测  statuCode:1为开启，0为关闭
service.isOpenStaticEdge = function (params, callback) {
    takePhoto.isOpenStaticEdge(params, function (cert) {
        callback(cert);
    });
};

//设置视频旋转角度  rotate_angle: 0-不做旋转 1-旋转90度 2-旋转180度 3-旋转270度
service.configVideoRotateAngle = function (params, callback) {
    takePhoto.configVideoRotateAngle(params, function (cert) {
        callback(cert);
    });
};

export default service;