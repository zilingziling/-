/* eslint-disable no-mixed-spaces-and-tabs */
import { observable, computed, useStrict, action } from "mobx";
import { observer } from "mobx-react";
import { notification, Modal, Divider } from "antd";
import {
  decodeUtf8,
  Bytes2Str,
  uint8Buff2Str
} from "../pages/component/function/formatDateReturn";
import DeviceDetection from "./deviceDetection";
import _userinfo from "./userinfo";
import Police from "./police";
import { skip } from "../api/device";
const dst = "ytj_logic"; //后端
const { confirm } = Modal;

class Socke {
  constructor() {
    let logStatus = window.sessionStorage.getItem("status");
    if (logStatus && !window.location.href.includes("login")) {
      this.Socke();
    }
  }
  @observable my_id = window.localStorage.getItem("userName");
  @observable seqno = 0;
  @observable reconnectionNumber = 0;

  @action Socke = () => {
    try {
      let ws = new WebSocket(window.url);
      window.ws = ws;
      ws.onopen = () => {
        console.log("open");
        ws.binaryType = "arraybuffer";
        this.send(ws, {}, proto.cn.yjtianxia.im.protocol2.MSGTYPE.HANDSHAKE); //
      };
      ws.onmessage = evt => {
        let baseMsg = proto.cn.yjtianxia.im.protocol2.BaseMsg.deserializeBinary(evt.data);
        let objdata;
        try{
          objdata = uint8Buff2Str(baseMsg.getData());
        }catch(error){

        }
      };
      ws.onerror = e => {
        console.log(e);
        console.log("WebSocket发生错误: onerror" );
      };
      ws.onclose = e => {
        console.log(
          "websocket 断开:onclose " + e.code + " " + e.reason + " " + e.wasClean
        );
        if (e.code === 4900) {
          console.log("被挤下线了");
          notification["warning"]({
            message: "提示！",
            duration: 10,
            description: "该账号已下线，请重新登录"
          });
            _userinfo.outLogin();
        }
      };
    } catch (error) {
      console.log(error);
    }
  };

  @action send = (ws, msg, datatype) => {
    //HANDSHAKE
    if (ws && ws.readyState === 1) {
      let jsonStr = msg;
      let baseMsg = new proto.cn.yjtianxia.im.protocol2.BaseMsg();
      baseMsg.setSrc(window.localStorage.getItem("userName"));
      baseMsg.addDst("ytj_logic");
      baseMsg.setMsgType(datatype);
      baseMsg.setData(str2Uint8Buff(jsonStr));
      baseMsg.setSeqNo(this.seqno++);
      let crc = "webcrc";
      baseMsg.setCrc(str2Uint8Buff(crc));
      ws.send(baseMsg.serializeBinary());
    } else {
      console.log("send error, websocket is not ready");
    }
  };
  //开始学习红外、 send数据
  _sendHardware = dst => {
    if (window.ws && window.ws.readyState === 1) {
      let baseDataMsg_ = new proto.cn.yjtianxia.im.protocol2.BaseDataMsg();
      baseDataMsg_.setCommand(391);
      baseDataMsg_.hasData(false);
      let baseMsg = new proto.cn.yjtianxia.im.protocol2.BaseMsg();
      baseMsg.setSrc(window.localStorage.getItem("userName"));
      baseMsg.setMsgType(proto.cn.yjtianxia.im.protocol2.MSGTYPE.DATA);
      baseMsg.setDstList([dst]);
      baseMsg.setSeqNo(this.seqno++); //Math.ceil(Math.random() * 1000);随机数字
      baseMsg.setCrc(str2Uint8Buff("1"));
      baseMsg.setNeedAck(0); //proto.cn.yjtianxia.im.protocol2.MSGTYPE.ACK
      baseMsg.setData(baseDataMsg_.serializeBinary());
      window.ws.send(baseMsg.serializeBinary());
    }
  };

  //跳转到设备控制
  @action jumpCtr = async (detailList, mark) => {
    let timer_ = 30;
    let last = detailList[detailList.length - 1];
    let array = [];
    detailList.forEach(element => {
      // array.push(element.id + ":" + element.code);
      array.push(element.idcode);
    });
    let schoolInfo =
      detailList.length > 0
        ? detailList.find(i => i.code === "school_academic_building")
        : null;
    let p = {
      buildingid: schoolInfo && schoolInfo.id,
      schoolid: window.localStorage.getItem("schoolid"),
      account: window.localStorage.getItem("userName")
    };
    let res = await skip(p);
    if (res.code === 200 && res.data === 1) {
      let Conf = confirm({
        centered: true,
        title: `是否需要跳转到${last.name}教室?`,
        onOk() {
          array.pop();
          window.localStorage.setItem("CtrSchoole", JSON.stringify(array));
          window.localStorage.setItem("stateE", JSON.stringify(array));
          window.localStorage.setItem(
            "CtrClassrommid",
            last.id + ":" + last.code
          );

          window.localStorage.setItem("classroomid", last.id);
          if (mark === 1) {
            window.location.reload();
          } else {
            window._guider.History.history.push({
              //设备控制
              pathname: "/devicectl"
            });
          }
        },
        onCancel() {}
      });
      let Time = setInterval(() => {
        timer_--;
        Conf.update({
          cancelText: `取消(${timer_})`
        });
        if (timer_ <= 0) {
          Conf.destroy();
          timer_ = 30;
          clearInterval(Time);
        }
      }, 1000);
    }
  };
}

const str2Uint8Buff = strData => {
  //发送格式数据
  var x2 = new Uint8Array(strData.length);
  for (var i = 0; i < strData.length; i++) {
    x2[i] = strData.charCodeAt(i);
  }
  return x2;
};
export default new Socke();

// @observable heartCheck = {
// 	timeout: 5000,
// 	timeoutObj: null,
// 	serverTimeoutObj: null,
// 	reset: function(){
// 		clearTimeout(this.timeoutObj);
// 		clearTimeout(this.serverTimeoutObj);
// 		this.start();
// 	},
// 	start:()=>{
// 		this.timeoutObj = setTimeout(()=>{
// 			console.log('心跳中');
// 			let ws = new WebSocket('ws://172.16.3.207:18880/room');
// 			// window.ws = ws;
// 			this.Socke();
// 			// this.send(ws, {}, proto.cn.yjtianxia.im.protocol2.MSGTYPE.HANDSHAKE); //握手
// 			this.serverTimeoutObj = setTimeout(function(){
// 				ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
// 			}, this.timeout);
// 		}, this.timeout);
// 	},
// }
