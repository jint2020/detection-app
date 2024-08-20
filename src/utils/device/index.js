import service from './service';

// 签字
let  canvasSign,ctxSign, checkStatus;
let signType = 0;//0 白屏签名 1 PDF，图片签名  2 html签名
// 画板宽高
var iWidth = 800;
var iHeight = 490;
//设备宽高
var deviceHeight = 0,
    deviceWidth = 0,
    deviceX = 0,
    deviceY = 0;
var startSign = false; // 签字状态
var isFirst = false; //签字状态
var signData = "";
var signFileType = "";
var signUrl = "";
var points = [];
var beginPoint = null;
let isDown = true;

//视频参数
let videoParams = {
    cameraType: 0,
    camera_name: "",
    camera_path: "",
    video_frame_w: 0,
    video_frame_h: 0,
};
let showPicStatus = false;
const fileType = "jpeg";
let photoTemp = '';
const photoFix = "photo_";
/**
 *  、、
 */
var is_compress = 0;
/**
 * 、、
 */
var compress_size = 200;
var isNeedClearCanvas = false;
var cutStatus = 1; //0代表裁切，1代表不裁切
var margins = 0;
let openStatus = true;
let changeStatus = false;
let rotate_angle = 0;
export function readServiceAbility() {
    service.getServiceAbility(function (res) {
        // 显示支持功能的按钮
        showAbilityButton(res.ability)
    })
}



// 显示支持功能的按钮
function showAbilityButton(ability) {
    let abilityList = ability.split("|");
    console.log(abilityList);
}
export function getVideoEvent(cameraType) {
    // console.log("打开视频", openStatus);
    openStatus = false;
    videoParams = {
        cameraType: 0,
        video_frame_w: 0,
        video_frame_h: 0,
    };
    console.log("哪个摄像头", cameraType);
    videoParams.cameraType = cameraType;
    mmasterOpenVideoEvent();
}

// 打开视频流
function mmasterOpenVideoEvent() {
    //获取设备信息
    service.getVideoInfo(function (retcode) {
        console.log("设备信息1217", retcode);
        if (retcode.err_code == 0) {
            console.log("retcode", retcode);

            var cameraInfo = retcode.data;
            console.log("videoParams.cameraType", videoParams.cameraType);
            if (-1 == videoParams.cameraType) {
                for (var i = 0; i < cameraInfo.length; i++) {
                    device_select.options[i] = new Option(cameraInfo[i].camera_name, cameraInfo[i].camera_type);
                }
                videoParams.cameraType = device_select.value;
            }

            for (var i = 0; i < cameraInfo.length; i++) {
                console.log('22222', cameraInfo, 'cam_type =>', cameraInfo[i].camera_type, 'videoParam_type =>', videoParams.cameraType);
                if (cameraInfo[i].camera_type == videoParams.cameraType) {
                    console.log("下标值", i);
                    var resIndex = i;
                    var resolution_info = cameraInfo[resIndex].resolution_info;
                    console.log("分辨率", resolution_info, videoParams);
                    // 数组去重
                    for (var i = 0; i < resolution_info.length; i++) {
                        for (var j = i + 1; j < resolution_info.length; j++) {
                            if (resolution_info[i].width == resolution_info[j].width && resolution_info[i].height == resolution_info[j].height) {
                                resolution_info.splice(j, 1);
                                j--;
                            }
                        }
                    }
                    // console.log("数组去重", resolution_info);
                    var pixelIndex = 0;
                    var resWidth, resHeight;
                    // 第一个分辨率就是默认分辨率
                    resWidth = parseInt(resolution_info[pixelIndex].width);
                    resHeight = parseInt(resolution_info[pixelIndex].height);
                    // 数组排序
                    for (var i = 0; i < resolution_info.length - 1; i++) {
                        for (var j = i + 1; j < resolution_info.length; j++) {
                            if (resolution_info[i].width > resolution_info[j].width) {
                                var temp = resolution_info[i];
                                resolution_info[i] = resolution_info[j];
                                resolution_info[j] = temp;
                            }
                        }
                    }
                    // console.log("数组排序", resolution_info);
                    var pixel;
                    for (var i = 0; i < resolution_info.length; i++) {
                        pixel = resolution_info[i].width + "*" + resolution_info[i].height;
                    }

                    // if (
                    //     videoParams.video_frame_w == 0 ||
                    //     videoParams.video_frame_w ==
                    //     parseInt(resolution_info[pixelIndex].width)
                    // ) {
                    if (videoParams.video_frame_w == 0) {
                        for (var i = 0; i < resolution_info.length; i++) {
                            if (resWidth == parseInt(resolution_info[i].width)
                                && resHeight == parseInt(resolution_info[i].height)) {
                                //排序前取的第一个分辨率就是默认分辨率
                                pixelIndex = i;
                                break;
                            }
                        }
                    } else {
                        resWidth = videoParams.video_frame_w;
                        resHeight = videoParams.video_frame_h;
                        // resWidth = 2592
                        // resHeight = 1944;
                        // resolute_select.options[selectIndex].selected = true;
                    }
                    console.info("play_rotate_angle", rotate_angle);
                    var masterRes = {
                        camera_type: cameraInfo[resIndex].camera_type,
                        video_frame_w: resWidth,
                        video_frame_h: resHeight,
                        margins: margins,
                        play_rotate_angle: rotate_angle,
                    };
                    // console.log("参数", masterRes, videoutil.websocketSc);
                    var checkPicID = document.getElementById("checkPicID"); //视频
                    checkPicID.width = resWidth;
                    checkPicID.height = resHeight;
                    var ctx = checkPicID.getContext("2d");
                    checkPicID.style.display = "block";
                    ctx.clearRect(0, 0, resWidth, resHeight);
                    var Img = new Image();
                    // console.log("ctx.width:" + checkPicID.width);
                    // console.log("ctx.height:" + checkPicID.height);
                    //打开视频
                    service.masterOpenVideo(masterRes, cutStatus, function (retcode) {
                        // console.log('打开视频回调', resolute_select.disabled)
                        if (!changeStatus) {
                            openStatus = true;
                        }
                        if (retcode.err_code == 0) {
                            var imgData = retcode.data;
                            Img.src = "data:image/jpeg;base64," + imgData;
                            Img.onload = function () {
                                if (Img.height > Img.width) {
                                    //旋转90度或者270度的图像
                                    if (!isNeedClearCanvas) {
                                        isNeedClearCanvas = true;
                                        ctx.clearRect(0, 0, resWidth, resHeight);
                                    }
                                    var width = checkPicID.getAttribute('width');
                                    var height = checkPicID.getAttribute('height');
                                    console.log('打开视频回调', width, height)
                                    var canvasWidth = height / Img.height * Img.width;
                                    ctx.drawImage(Img, 0, 0, Img.width, Img.height, (width - canvasWidth) / 2, 0, canvasWidth, height);
                                } else {
                                    if (isNeedClearCanvas) {
                                        isNeedClearCanvas = false;
                                        ctx.clearRect(0, 0, resWidth, resHeight);
                                    }
                                    ctx.drawImage(Img, 0, 0, Img.width, Img.height);
                                }
                            };
                        } else {
                            // textarea.value += "打开视频：" + JSON.stringify(retcode) + "\r\n";
                            // textarea.scrollTop = textarea.scrollHeight;
                            closeVideoDialog();
                            // showVideoDialog.style.display = "none";
                        }
                    });
                    break;
                } else {
                    console.log("视频参数与摄像头参数不对称");
                    closeVideoDialog();
                }
            }
        } else {
            console.log('摄像头类型', cameraInfo[i].camera_type == videoParams.cameraType);
            closeVideoDialog();
        }
    });
}
// 副头拍照
export function slaveTakePhotoEvent(isClose) {
    // console.log("状态", openStatus);
    if (!openStatus) {
        alert("视频正在播放中，请稍候！！");
        return false;
    }
    compress_size = parseInt(document.getElementById("compress_size").value);
    margins = parseInt(document.getElementById("margins").value);

    service.slaveTakePhoto(text, is_compress, compress_size, margins, rotate_angle, is_cut, function (retcode) {
        // console.log("副头拍照返回", retcode);
        if (retcode.err_code == 0) {
            if (!showPicStatus) {
                textarea.value += "副头拍照：拍照成功";
                var checkPicID = document.getElementById("checkPicID"); //视频

                if (isClose) {
                    // 关闭视频链接
                    // closeVideoDialog();
                }
                //下载图片
                var content = "data:image/" + fileType + ";base64," + retcode.data;
                photoTemp = retcode.data;
                // 显示照片base64
                // textarea.value += photoTemp + "\r\n";

                var myDate = new Date();
                var hh = myDate.getHours(); //获取系统时，
                var mm = myDate.getMinutes(); //分
                var ss = myDate.getSeconds(); //秒
                var fileName = photoFix + hh + mm + ss;
                downloadFile(content, fileName);
            }
        } else {
            closeVideoDialog();
        }
    });
}
export function closeVideoDialog() {
    service.closeVideo(function (res) {
        console.log("关闭视频", res);
    });
}
function downloadFile(content, fileName) {
    console.log("下载");
    var base64ToBlob = function (code) {
        var parts = code.split(";base64,");
        var contentType = parts[0].split(":")[1];
        // console.log(contentType);
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {
            type: contentType,
        });
    };
    var aLink = document.createElement("a");
    var blob = base64ToBlob(content);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);
    aLink.download = fileName + "." + fileType;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}

// 主头拍照
export function masterTakePhotoEvent(isClose) {
    if (!openStatus) {
        alert("视频正在播放中，请稍候！！");
        return false;
    }
    let text = "测试";
    let compress_size = 200;
    let margins = 5;
    let is_compress = 0; //拍照是否压缩：0-否，1-是
    let rotate_angle = 0; //拍照角度 0-0 1-90 2-180 3-270
    let is_cut = 0; //拍照是否裁剪  0-不裁剪  1-自动裁剪

    service.masterTakePhoto(text, is_compress, compress_size, margins, rotate_angle, is_cut, (retcode) => {
        // console.log("主头拍照返回", retcode);
        if (retcode.err_code == 0) {
            if (!showPicStatus) {
                if (isClose) {
                    // 关闭视频链接
                    // closeVideoDialog();
                }
                //下载图片
                var content = "data:image/" + fileType + ";base64," + retcode.data;
                photoTemp = retcode.data;

                // 显示照片base64
                // textarea.value += photoTemp + "\r\n";

                var myDate = new Date();
                var hh = myDate.getHours(); //获取系统时，
                var mm = myDate.getMinutes(); //分
                var ss = myDate.getSeconds(); //秒
                var fileName = photoFix + hh + mm + ss;

                downloadFile(content, fileName);
            }
        } else {
            // 可选择是否断开websocket链接
            // closeVideoDialog();
            console.log("可选择是否断开websocket链接");
            
        }
    });
}


export function getDeviceInfoByHand() {
    return new Promise((resolve, reject) => {
        service.getDevInfo(function (retcode) {
            if (retcode.statuCode === 0) {
                resolve({
                    code: 0,
                    result: retcode,
                    msg: ''
                });
            } else {
                reject({
                    code: 0,
                    result: null,
                    msg: 'error'
                });
            }
        });
    });
}

// 分离式读证
export function readCardExEvent() {
    // 秘钥参数，以下appKey 等密钥信息仅测试可用，随时到期，如须集成到系统上请联系售前技术工程师申请正式密钥信息集成
    var appKey = "B2DFC06508BA46BAB4C42836D6CA3BC6";
    var appSecret = "88974F519C804BBE8E20FB8C3B4065A5";
    var password = "0F8AF5C047D949CCB2708838B322BC87";
    //设置秘钥
    service.setAppParamEx(appKey, appSecret, password, function (retcode) {
        // console.log("秘钥的返回", retcode);
        console.log("设置秘钥：" + JSON.stringify(retcode));
        if (retcode.resultFlag == 0) {
            return new Promise((resolve, reject) => {
                service.readCardEx(function (retcode) {
                    // console.log("读证返回", retcode);
                    if (retcode.resultFlag == 0) {
                        resolve({
                            code:0,
                            result:{
                                idInfo: JSON.parse(retcode.resultContent),
                                photoFront: retcode.photoFront,
                                photoBack: retcode.photoBack,
                            },
                            msg:''
                        })
                    } else {
                        reject({
                            code: -1,
                            result:null,
                            msg:retcode.err_msg,
                        })
                    }
                });  
            })
        }
    });
}