/* eslint-disable no-useless-escape */
/* eslint-disable indent */
//@flow
import React, { Component, useState } from "react";
import Bar from "../component/Bar/bar";
import { Switch, Checkbox, Button, Row, Modal, Badge, Spin, Alert,Progress } from "antd";
import Video from "./components/DeviceViode";
import Btn from "./components/DeviceBtn";
import Api from "./../../api";
import {
  ArrayDataFormat,
  handleProjector,
  stateCtrLight
} from "../component/function/formatDateReturn";
import { observable, toJS, autorun, action } from "mobx";
import { observer, inject } from "mobx-react";
import { RouterPmi } from "../component/function/routerPmi";
import "./deviceControl.scss";
import { makeRequest } from "../../api/config";
import { handleAutom } from "../../api/ctrl";
const confirm = Modal.confirm;
type Props = {
  match: Object,
  history: Object,
  location: Object
};
const top = {
  display: "flex"
};
const alertStyle = {
  height: "36px",
  marginTop: "2.36rem",
  marginLeft: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "red",
  fontSize: "18px"
};
let Istrue = true;
@inject("Police", "Socke", "DeviceDetection", "userInfo")
@observer
class DeviceControl extends Component<Props, State> {
  @observable isRestart = false;
  constructor(props: any) {
    super(props);
    //OPS or  pc 都是电脑
    this.state = {
      selectedId:null,
      sele: null, //属性菜单ID classroomid
      SwitchOf: false, //上下课
      conditioning: [], //空调
      pc: [], //电脑*
      equip_code: null, //空调equip_code
      voice: [], //音量
      OPS: [], //电脑*
      lights: [], //灯光按钮
      curtains: [], //窗帘
      projector: [], //投影，
      curtainControl: [], //幕布
      screen: [], //屏幕1
      screen2: [], //屏幕2
      hot: "", // 温度
      we: "", //湿度
      light: "", //光照
      PM: "", //pm
      InteractiveTablet: [], //交互屏蔽
      _info: RouterPmi(), //[], //权限
      spin: false,
      eroomid: "",
      mcstatus: ""
    };
  }
  componentDidMount() {
    // setTimeout(() => {
    if (window.localStorage.getItem("userName") !== null) {
      this._infomsg();
    }
    // }, 500);
    this.info(); //data
    window.addEventListener("online", () => {
      this._infomsg();
    });
    window.addEventListener("scroll", this.handleScroll);
  }
  //接受websock消息
  _infomsg = () => {
    window.ws.onmessage = evt => {
      try {
        if (Object.keys(evt).length > 0) {
          this.setState({
            spin: false
          });
        }
        let msg_id =
          this.state.selectedId !== null
            ? this.state.selectedId
            : getCaption(window.localStorage.getItem("CtrClassrommid"), 0); //获取当前的classroomID来判断提示
        let msg = new window.proto.com.yj.itgm.protocol.BaseMsg.deserializeBinary(
          evt.data
        );
        let dataMsg = new window.proto.com.yj.itgm.protocol.BaseDataMsg.deserializeBinary(
          msg.getData()
        );

        if (dataMsg.getCommand() === 2000) {
          //发送设备响应的返回
          let promptMsg = new window.proto.com.yj.itgm.protocol.EquipResponse.deserializeBinary(
            dataMsg.getData()
          );
          if (msg_id == promptMsg.toObject().classroomId) {
            window._guider.Utils.alert({
              message: promptMsg.toObject().msg,
              type: "success"
            });
          }
        } else if (dataMsg.getCommand() === 2001) {
          //设备状态上报返回信息
          let obj = new window.proto.com.yj.itgm.protocol.EquipStatusReport.deserializeBinary(
            dataMsg.getData()
          );
          if (obj.toObject().detailList.length > 0) {
            //处理设备状态返回，这个页面状态主要是这这里面判断
            let res = obj.toObject().detailList;
            if (res.length > 0) {
              if (res[0].equipStatus !== "视频板故障") {
                if (this.state.sele === res[0].classroomid) {
                  //是当前教室id
                  switch (res[0].equipType) {
                    case "1": {
                      //上课下课
                      console.log("fromWs", res[0].keyId);
                      this.setState({
                        SwitchOf: res[0].keyId === "78" ? true : false
                      });
                      break;
                    }
                    case "2": {
                      //空调
                      let param = {
                        statusdata: res[0].statusValue,
                        equipstatus: res[0].equipStatus
                      };
                      console.log(res[0])
                      this.setState({
                        conditioning: [param],
                        equip_code: res[0].equipCode
                      });
                      break;
                    }
                    case "3": {
                      // 显示屏关
                      this.setState({
                        projector: handleProjector(this.state.projector, res[0])
                      });
                      break;
                    }
                    case "4": {
                      //电脑pc
                      this.setState({
                        pc: stateCtrLight(this.state.pc, res[0])
                      });
                      break;
                    }
                    case "5": {
                      //屏幕 2 输入源
                      this.setState({
                        curtainControl: stateCtrLight(
                          this.state.curtainControl,
                          res[0]
                        )
                      });
                      break;
                    }
                    case "6": {
                      //灯光控制
                      this.setState({
                        lights: stateCtrLight(this.state.lights, res[0])
                      });
                      break;
                    }
                    case "7": {
                      //窗帘控制
                      this.setState({
                        curtains: stateCtrLight(this.state.curtains, res[0])
                      });
                      break;
                    }
                    case "8": {
                      //温度
                      this.setState({
                        hot: res[0].statusValue,
                        we: res[1].statusValue
                      });
                      break;
                    }
                    case "9": {
                      //光照
                      this.setState({ light: res[0].statusValue });
                      break;
                    }
                    case "10": {
                      //pm
                      this.setState({ PM: res[0].statusValue });
                      break;
                    }
                    case "14": {
                      //音频
                      let obj = this.state.voice;
                      obj["statusdata"] = res[0].statusValue;
                      obj["equipstatus"] = res[0].equipStatus;
                      this.setState({ voice: obj });
                      break;
                    }
                    case "16": {
                      //ops
                      this.setState({
                        OPS: stateCtrLight(this.state.OPS, res[0])
                      });
                      break;
                    }
                    case "17": {
                      //交互平板
                      this.setState({
                        InteractiveTablet: stateCtrLight(
                          this.state.InteractiveTablet,
                          res[0]
                        )
                      });
                    }
                  }

                  if (res[0].equipStatus.indexOf("屏1") != -1) {
                    this.setState({
                      screen: stateCtrLight(this.state.screen, res[0])
                    });
                  } else if (res[0].equipStatus.indexOf("屏2") != -1) {
                    this.setState({
                      screen2: stateCtrLight(this.state.screen2, res[0])
                    });
                  }
                }
              }
            }
          }
        } else if (dataMsg.getCommand() === 2002) {
          //设备跳转控制页面
          let obj = new window.proto.com.yj.itgm.protocol.IntercomCall.deserializeBinary(
            dataMsg.getData()
          );
          let detailList = obj.toObject().detailList;
          if (window.location.href.includes("devicectl")) {
            if (detailList[detailList.length - 1].id != msg_id) {
              this.props.Socke.jumpCtr(detailList,1);
            }
          } else {
            this.props.Socke.jumpCtr(detailList);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  };
  handleSpin = () => {
    this.setState({
      spin: true
    });
  };
  handleAutom = async e => {
    let res = await handleAutom(this.state.sele, e.target.checked ? 1 : 0);
    if (res.code === 200) {
      window._guider.Utils.alert({
        message: res.msg,
        type: "success"
      });
    } else
      window._guider.Utils.alert({
        message: res.msg,
        type: "error"
      });
  };
  render() {
    const {
      spin,
      lights,
      curtains,
      pc,
      projector,
      curtainControl,
      screen,
      screen2,
      voice,
      we,
      hot,
      light,
      PM,
      conditioning,
      equip_code,
      sele,
      InteractiveTablet,
      eroomid
    } = this.state;
    return (
      <div className="devCtl" style={top}>
        <Bar Seleshcool={this.Bars} />
        {/*<Modal visible={true} title='' footer='' className="progressModal">*/}
        {/*  <div>*/}
        {/*    <div className="info"><img className='noticeIcon' src={require('../../assets/img/notice.png')}/><span>设备正在执行中，请稍后！</span></div>*/}
        {/*    <Progress*/}
        {/*        size="small"*/}
        {/*        strokeColor={{*/}
        {/*          '0%': '#19D5B8',*/}
        {/*          '100%': '#2786F5',*/}
        {/*        }}*/}
        {/*        percent={100}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</Modal>*/}
        <div className="devCtl-row">
          <Row type="flex">
            <Spin spinning={spin} size="default" className="spin" />
            <div className="devCtl-row-switch">
              <div>
                <span className="devCtl-row-switch-span">下课</span>
                <Switch
                  disabled={!this.state._info.includes("Adding_dropping")}
                  checked={this.state.SwitchOf}
                  onChange={this.onChange}
                />
                <span className="devCtl-row-switch-spans">上课</span>
              </div>
              <Checkbox
                className="devCtl-row-switch-box"
                value="1"
                disabled={!this.state._info.includes("Automatically_equipment")}
                onChange={this.handleAutom}
              >
                <span className="devCtl-row-switch-box-span">
                  按课表自动开启设备
                </span>
              </Checkbox>
            </div>
            <Button
              disabled={!this.state._info.includes("return_config")}
              className="devCtl-row-switch-btn"
              type="primary"
              onClick={this._returnPage}
            >
              返回配置页面
            </Button>
            {/* <Button className="devCtl-row-switch-btn" type="primary" onClick={this.computer} >远程电脑</Button> */}
            <div style={alertStyle}>
              <span className="alertSpan">
                {this.state.mcstatus ? "*" : null}
              </span>
              <p className="alertP">{this.state.mcstatus}</p>
            </div>
          </Row>
          {/*视频、右边按钮*/}
          <div className="contentWrap">
            <div className="controlBtn">
              <Video
                handleSpin={this.handleSpin}
                getInfo={this.info}
                projector={projector}
                curtainControl={curtainControl}
                OPS={this.state.OPS}
                classSwitch={this.state.classSwitch}
                classid={this.state.sele}
                pc={pc}
                InteractiveTablet={InteractiveTablet}
                ref="videoPyl"
              />
              {/*下边的按钮*/}
              <div className="devCtl-rows">
                <Btn
                  screen={screen}
                  screen2={screen2}
                  curtain={curtains}
                  lights={lights}
                  classid={sele}
                  conditioning={conditioning}
                  equip_code={equip_code}
                  eroomid={eroomid}
                  voice={voice}
                />
              </div>
            </div>
            {/*status*/}
            <div className="rightStatus">
            {/*  <div className="status">*/}
            {/*    <ul>*/}
            {/*      <li>教室名称：</li>*/}
            {/*      <li>教室座位：</li>*/}
            {/*      <li>*/}
            {/*        电脑网络：<span>已断开</span>*/}
            {/*      </li>*/}
            {/*      <li>*/}
            {/*        中控网络：<span>已连接</span>*/}
            {/*      </li>*/}
            {/*      <li>电脑IP：</li>*/}
            {/*      <li>中控IP：</li>*/}
            {/*      <li>灯光：</li>*/}
            {/*      <li>空调：</li>*/}
            {/*      <li>投影：</li>*/}
            {/*      <li>幕布：</li>*/}
            {/*      <li>屏幕1视频：</li>*/}
            {/*      <li>屏幕2视频：</li>*/}
            {/*    </ul>*/}
            {/*  </div>*/}
              {/*温湿度*/}
              <div className="devCtl-text">
                <div className="devCtl-text-imgs">
                  <div className="devCtl-text-imgs-top">
                    <div className="devCtl-text-imgs-top-p borderp-b">
                      <img
                        className="devCtl-text-imgs-top-p-img1"
                        src={require("./../../assets/img/temperature.png")}
                      />
                      {hot !== "" ? (
                        <span style={{ marginTop: 10 }}>
                          <Badge
                            overflowCount={9999}
                            style={{
                              fontSize: 14,
                              marginTop: "-2px",
                              background: "rgba(0,0,0,0.1)",
                              color: "#A4D2FDFF",
                              boxShadow: "0 0 0 1px #d9d9d9 inset"
                            }}
                            count={parseInt(hot)}
                          />{" "}
                          °C
                        </span>
                      ) : null}
                    </div>
                    <div className="devCtl-text-imgs-top-p borderp-d">
                      <img
                        className="devCtl-text-imgs-top-p-img2"
                        src={require("./../../assets/img/temperature2.png")}
                      />
                      {we !== "" ? (
                        <span style={{ marginTop: 10 }}>
                          <Badge
                            overflowCount={9999}
                            style={{
                              fontSize: 14,
                              marginTop: "-2px",
                              background: "rgba(0,0,0,0.1)",
                              color: "#A4D2FDFF",
                              boxShadow: "0 0 0 1px #d9d9d9 inset"
                            }}
                            count={parseInt(we)}
                          />
                          %RH
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="devCtl-text-imgs-top">
                    <div className="devCtl-text-imgs-top-p borderp-c">
                      <img
                        style={{ height: 40, width: 40 }}
                        src={require("./../../assets/img/pm.png")}
                      />
                      {PM !== "" ? (
                        <span style={{ marginTop: 10 }}>
                          <Badge
                            overflowCount={9999}
                            style={{
                              fontSize: 14,
                              marginTop: "-2px",
                              background: "rgba(0,0,0,0.1)",
                              color: "#A4D2FDFF",
                              boxShadow: "0 0 0 1px #d9d9d9 inset"
                            }}
                            count={parseInt(PM)}
                          />
                          μg/m3
                        </span>
                      ) : null}
                    </div>
                    <div className="devCtl-text-imgs-top-p ">
                      <img
                        className="devCtl-text-imgs-top-p-img2"
                        src={require("./../../assets/img/temperature3.png")}
                      />
                      {light !== "" ? (
                        <span style={{ marginTop: 10 }}>
                          <Badge
                            overflowCount={9999}
                            style={{
                              fontSize: 14,
                              marginTop: "-2px",
                              background: "rgba(0,0,0,0.1)",
                              color: "#A4D2FDFF",
                              boxShadow: "0 0 0 1px #d9d9d9 inset"
                            }}
                            count={parseInt(light)}
                          />
                          Lux
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  //电脑
  computer = () => {};
  //返回上级页面
  _returnPage = () => {
    window._guider.History.history.push({
      pathname: "/deviceAdd"
    });
  };
  //上下课
  onChange = async (SwitchOf: Boolean) => {
    if (SwitchOf) {
      confirm({
        className: "modles",
        centered: true,
        title: "上课会打开本教室里相关的设备，确认开启？",
        onOk: async () => {
          this.setState({ SwitchOf });
          if (this.state.sele !== null) {
            if (SwitchOf) {
              let res = await Api.Ctrl.one_key_class_begin(this.state.sele);
              // console.log(res);
              if (res.code === 200) {
                window._guider.Utils.alert({
                  message: res.msg,
                  type: "success"
                });
              } else {
                window._guider.Utils.alert({
                  message: "请选择教室",
                  type: "error"
                });
              }
            } else {
              let res = await Api.Ctrl.one_key_class_over(this.state.sele);
              // console.log(res);
              if (res.code === 200) {
                window._guider.Utils.alert({
                  message: res.msg,
                  type: "success"
                });
              } else {
                window._guider.Utils.alert({
                  message: "请选择教室",
                  type: "error"
                });
              }
            }
          } else {
            window._guider.Utils.alert({
              message: "请选择教室",
              type: "error"
            });
          }
        },
        onCancel: () => {
          this.setState({ SwitchOf: false });
        }
      });
    } else {
      confirm({
        centered: true,
        className: "modles",
        title: "下课会关闭本教室里相关的设备，确认关闭？",
        onOk: async () => {
          this.setState({ SwitchOf });
          if (this.state.sele !== null) {
            if (SwitchOf) {
              let res = await Api.Ctrl.one_key_class_begin(this.state.sele);
              // console.log(res);
              if (res.code === 200) {
                window._guider.Utils.alert({
                  message: res.msg,
                  type: "success"
                });
              } else {
                window._guider.Utils.alert({
                  message: "请选择教室",
                  type: "error"
                });
              }
            } else {
              let res = await Api.Ctrl.one_key_class_over(this.state.sele);
              // console.log(res);
              if (res.code === 200) {
                window._guider.Utils.alert({
                  message: res.msg,
                  type: "success"
                });
              } else {
                window._guider.Utils.alert({
                  message: "请选择教室",
                  type: "error"
                });
              }
            }
          } else {
            window._guider.Utils.alert({
              message: "请选择教室",
              type: "error"
            });
          }
        },
        onCancel: () => {
          this.setState({ SwitchOf: true });
        }
      });
    }
  };
  //树形组件返回ID
  Bars = (e: String) => {
    let val = e.split(":");
    this.setState({
      selectedId:val[0]
    })
    if (val[1] === "classroom") {
      if (typeof e !== "undefined") {
        this.props.DeviceDetection.videList(val[0]); //视频地址
        this.setState({ sele: val[0] });
        this.allInfo(val[0]);
        // this.refs.videoPyl.wrappedInstance.refreshPlay();
        // this.props.DeviceDetection.refreshPlay();
      } else {
        this.setState({
          conditioning: [],
          pc: []
        });
      }
    }
  };
  //来自不同页面请求数据
  info = () => {
    this.allInfo(window.localStorage.getItem("classroomid")); //data
    this.setState({ sele: window.localStorage.getItem("classroomid") });
    this.props.DeviceDetection.videList(
      window.localStorage.getItem("classroomid")
    ); //视频地址
    // if (this.props.location.routerName === '/deviceAdd') {  //设备添加
    // 	let classroomId = window.localStorage.getItem('classroomid');
    // 	this.allInfo(classroomId);
    // 	this.setState({ sele: classroomId });
    // 	this.props.DeviceDetection.videList(classroomId); //视频地址
    // } else if (this.props.location.routerName === '/devicesate') { //设备状态跳转
    // 	let stateClassID = window.localStorage.getItem('stateClassID');
    // 	if (stateClassID !== null) {
    // 		this.allInfo(stateClassID);
    // 		this.setState({ sele: stateClassID });
    // 		this.props.DeviceDetection.videList(stateClassID);	//视频地址
    // 	} else {
    // 		this.allInfo(this.props.location.classroomid);
    // 		this.setState({ sele: this.props.location.classroomid });
    // 		this.props.DeviceDetection.videList(this.props.location.classroomid);
    // 	}
    // } else {
    // 	this.allInfo(window.localStorage.getItem('classroomid'));
    // 	this.setState({ sele: window.localStorage.getItem('classroomid') });
    // 	this.props.DeviceDetection.videList(window.localStorage.getItem('classroomid')); //视频地址
    // }
  };
  //所有数据处理
  allInfo = async (id: string) => {
    try {
      if (id !== null && typeof id !== "undefined") {
        let res = await Api.Ctrl.get_equips(id); //api
        if (res.code === 200) {
          if (JSON.stringify(res.data) !== "{}") {
            //判断数据
            let Switch = false;
            if (res.data[1]) {
              if (res.data[1].length > 0) {
                Switch = res.data[1][0].highlight === "1" ? true : false;
              }
            }
            if (typeof res.data[2] !== "undefined") {
              // this.setState({ equip_code: res.data[2].aircode.length > 0 ? res.data[2].aircode[0].equipcode : [] });
              this.setState({
                conditioning:
                  res.data[2].airstatus.length > 0 ? res.data[2].airstatus : [],
                equip_code:
                  res.data[2].aircode.length > 0
                    ? res.data[2].aircode[0].equipcode
                    : null,
                eroomid:
                  res.data[2].airstatus.length > 0
                    ? res.data[2].airstatus[0].eroomid
                    : ""
              });
            } else {
              this.setState({
                conditioning: [],
                equip_code: null,
                eroomid: ""
              });
            }

            // let equip_code = typeof (res.data[2]) !== 'undefined' && res.data[2].length > 0 ? res.data[2] : [];
            let projector =
              typeof res.data[3] !== "undefined" ? res.data[3] : []; //投影
            let curtainControl =
              typeof res.data[5] !== "undefined" ? res.data[5] : []; //幕布
            let pc =
              typeof res.data[4] !== "undefined" && res.data[4].length > 0
                ? res.data[4]
                : []; //电脑
            let OPS =
              typeof res.data[16] !== "undefined" && res.data[16].length > 0
                ? res.data[16]
                : []; //OPS
            let curtains =
              typeof res.data[7] !== "undefined" && res.data[7].length > 0
                ? res.data[7]
                : []; //窗帘
            let lights =
              typeof res.data[6] !== "undefined" && res.data[6].length > 0
                ? res.data[6]
                : []; //灯光

            let VideoMatrix =
              typeof res.data[12] !== "undefined" && res.data[12].length > 0
                ? res.data[12]
                : []; //all 屏幕
            let screen =
              typeof VideoMatrix.slice(0, 4) !== "undefined"
                ? VideoMatrix.slice(0, 4)
                : [];
            let screen2 =
              typeof VideoMatrix.slice(4, 8) !== "undefined"
                ? VideoMatrix.slice(4, 8)
                : [];
            let voice =
              typeof res.data[14] !== "undefined" && res.data[14].length > 0
                ? res.data[14][0]
                : []; //音量
            let we =
              typeof res.data[8] !== "undefined" && res.data[8].length > 0
                ? res.data[8][1].statusdata
                : ""; //湿度
            let hot =
              typeof res.data[8] !== "undefined" && res.data[8].length > 0
                ? res.data[8][0].statusdata
                : ""; //温度
            let light =
              typeof res.data[9] !== "undefined" && res.data[9].length > 0
                ? res.data[9][0].statusdata
                : ""; //光照度
            let PM =
              typeof res.data[10] !== "undefined" && res.data[10].length > 0
                ? res.data[10][0].statusdata
                : ""; //pm
            let InteractiveTablet =
              typeof res.data[17] !== "undefined" && res.data[17].length > 0
                ? res.data[17]
                : []; //交互平板
            this.setState({
              PM,
              light,
              we,
              hot,
              lights,
              curtains,
              OPS,
              pc,
              SwitchOf: Switch,
              projector,
              curtainControl,
              screen,
              screen2,
              voice,
              InteractiveTablet,
              mcstatus: res.data.mcstatus.mcstatus
            });
          } else {
            this.clearData(); //数据不在清楚状态
          }
        } else {
          this.clearData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //清楚状态
  clearData = () => {
    this.props.DeviceDetection.videoLive = {
      //清楚store目录下的DeviceDetection.JS文件里面的视频状态
      teacher: [],
      students: [],
      desktop: []
    };
    this.setState({
      lights: [],
      curtains: [],
      SwitchOf: false,
      conditioning: [],
      pc: [],
      voice: null,
      OPS: [],
      projector: [],
      curtainControl: [],
      screen: [],
      screen2: []
    });
  };
}

export default DeviceControl;

const getCaption = (obj, state) => {
  var index = obj.lastIndexOf(":");
  if (state == 0) {
    obj = obj.substring(0, index);
  } else {
    obj = obj.substring(index + 1, obj.length);
  }
  return obj;
};

// onMsgSocket = () => {
// 	let msg_id = this.state.sele !== null ? this.state.sele : getCaption(window.localStorage.getItem('CtrClassrommid'), 0); //获取当前的classroomID来判断提示
// 	autorun(() => {
// 		const { res } = this.props.Socke;
// 		console.log(toJS(res));
// 		if (res) {
// 			if (res[0].equipStatus !== '视频板故障') {
// 				if (this.state.sele === res[0].classroomid) {
// 					switch (res[0].equipType) {
// 						case '1': { //上课下课
// 							this.setState({ SwitchOf: res[0].keyId === '78' ? true : false });
// 							break;
// 						}
// 						case '2': { //空调
// 							let param = {
// 								statusdata: res[0].statusValue,
// 								equipstatus: res[0].equipStatus,
// 							};
// 							this.setState({
// 								conditioning: [param],
// 								equip_code: res[0].equipCode
// 							});
// 							break;
// 						}
// 						case '3': { // 显示屏关
// 							this.setState({ projector: stateCtrLight(this.state.projector, res[0]) });
// 							break;
// 						}
// 						case '4': { //电脑pc
// 							this.setState({ pc: stateCtrLight(this.state.pc, res[0]) });
// 							break;
// 						}
// 						case '5': { //屏幕 2 输入源
// 							this.setState({ curtainControl: stateCtrLight(this.state.curtainControl, res[0]) });
// 							break;
// 						}
// 						case '6': { //灯光控制
// 							this.setState({ lights: stateCtrLight(this.state.lights, res[0]) });
// 							break;
// 						}
// 						case '7': { //窗帘控制
// 							this.setState({ curtains: stateCtrLight(this.state.curtains, res[0]) });
// 							break;
// 						}
// 						case '8': { //温度
// 							this.setState({ hot: res[0].statusValue, we: res[1].statusValue });
// 							break;
// 						}
// 						case '9': {	//光照
// 							this.setState({ light: res[0].statusValue });
// 							break;
// 						}
// 						case '10': { //pm
// 							this.setState({ PM: res[0].statusValue });
// 							break;
// 						}
// 						case '14': { //音频
// 							let obj = this.state.voice;
// 							obj['statusdata'] = res[0].statusValue;
// 							obj['equipstatus'] = res[0].equipStatus;
// 							this.setState({ voice: obj });
// 							break;
// 						}
// 						case '16': { //ops
// 							this.setState({ OPS: stateCtrLight(this.state.OPS, res[0]) });
// 							break;
// 						}
// 						case '17': { //交互平板
// 							this.setState({ InteractiveTablet: stateCtrLight(this.state.InteractiveTablet, res[0]) });
// 						}
// 					}
// 					if (res[0].equipStatus.indexOf('屏1') != -1) {
// 						this.setState({ screen: stateCtrLight(this.state.screen, res[0]) });
// 					} else if (res[0].equipStatus.indexOf('屏2') != -1) {
// 						this.setState({ screen2: stateCtrLight(this.state.screen2, res[0]) });
// 					}
// 				}
// 			}
// 		}
// 	});
// }
