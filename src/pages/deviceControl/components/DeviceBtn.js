//@flow
import React, { Component } from "react";
import { Slider } from "antd";
import voiceOk from "./../../../assets/img/voiceok.png";
import voiceNo from "./../../../assets/img/voiceno.png";
import Api from "./../../../api";
import { debounce } from "./../../component/function/formatDateReturn";
import("../index.module.scss");
const DateArray = [
  { key_name: "开机", key_img: "air_c_open.png", open: true },
  { key_name: "关机", key_img: "air_c_close.png", open: "" },
  { key_name: "制热", key_img: "heating.png", open: true },
  { key_name: "制冷", key_img: "refrigeration.png", open: false }
];
let styles = { background: "rgba(37, 147, 251, 0.88)" };
let conditioningStyle = {
  background: "rgba(37, 147, 251, 0.88)",
  color: "#fff"
};

let firstTime = true;
let conditioning = true;

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `key_name-${k}`,
    key_name: `key_name ${k}`
  }));
class DeviceBtn extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      volume: 0, //音量val
      mrakVolume: true, //音量控制
      conditioning: 24, //空调进度条value
      conditioningInfo: "", //自控，空调状态显示
      controlName: null //获取状态判断是制热还是制冷
    };
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps) {
      if (nextProps.voice !== null) {
        //音量 info
        this.setState({
          volume: nextProps.voice.statusdata,
          mrakVolume: nextProps.voice.equipstatus === "静音" ? false : true
        });
      }
      if (nextProps.conditioning.length > 0) {
        let name =
          nextProps.conditioning[0].equipstatus === "制冷"
            ? true
            : nextProps.conditioning[0].equipstatus === "制热";
        this.setState({
          conditioning: nextProps.conditioning[0].statusdata, //进度条value
          conditioningInfo: nextProps.conditioning[0].equipstatus, //显示那个按钮 name
          controlName: {
            open: name,
            key_name: nextProps.conditioning[0].equipstatus
          }
        });
      }
    }
  }

  render() {
    const { volume, conditioning, mrakVolume, conditioningInfo } = this.state;
    return (
      <div className="devCtl-row-btn">
        {/* 输入源1-2 */}
        <div className="devCtl-row-btn-to">
          <div className="devCtl-row-btn-to-left">
            <span className="devCtl-row-btn-to-left-span">屏幕 A 输入源</span>
            <div className="devMap bntrow">
              {this.props.screen.map(this.pcView)}
            </div>
          </div>
          <div className="devCtl-row-btn-to-right">
            <span className="devCtl-row-btn-to-left-span">屏幕 B 输入源</span>
            <div className="devMap bntrow">
              {this.props.screen2.map(this.pcView)}
            </div>
          </div>
        </div>
        {/* 灯控窗帘控制 2*/}
        <div className="devCtl-row-btn-control">
          <div className="devCtl-row-btn-control-lightCtr">
            <span className="devCtl-row-btn-control-lightCtr-span">
              灯光控制
            </span>
            <div className="devMaps bntrow">
              {" "}
              {this.props.lights.slice(0, 2).map(this.pcView)}
            </div>
          </div>
          <div
            className="devCtl-row-btn-control-lightCtr"
            style={{ marginLeft: "2rem" }}
          >
            <span className="devCtl-row-btn-control-lightCtr-span">
              窗帘控制
            </span>
            <div className="devMaps bntrow">
              {" "}
              {this.props.curtain.slice(0, 2).map(this.pcView)}
            </div>
          </div>
          {/* 音量 */}
          <div className="devCtl-row-btn-control-ctry" style={{ left: "39%" }}>
            <img onClick={this._mute} src={!mrakVolume ? voiceNo : voiceOk} />
            <Slider
              style={{ width: 280, marginTop: 9 }}
              max={100}
              min={0}
              onChange={this.change}
              value={typeof volume !== "undefined" ? volume : 0}
              tooltipVisible={false}
              onAfterChange={this._voice.bind(this)}
              ref={ele => (this.element = ele)}
            />
            <span className="devCtl-row-btn-control-ctry-span">
              {typeof volume !== "undefined" ? volume : 0}%
            </span>
          </div>
        </div>
        {/* 空调 */}
        <div className="devCtl-row-btn-tos">
          <div className="devCtl-row-btn-tos-left">
            <span className="devCtl-row-btn-tos-left-span">空调</span>
            <div className="conditioningview">
              {DateArray.map(this.conditioningview)}
            </div>
            <div className="devCtl-row-btn-tos-ctry">
              <span className="devCtl-row-btn-tos-ctry-span">
                {conditioning}°C
              </span>
              <div className="devCtl-row-btn-tos-ctry-ctry">
                <img
                  style={{ marginRight: "0.5rem" }}
                  src={require("./../../../assets/img/-.png")}
                />
                <Slider
                  style={{ width: 280, marginTop: 9 }}
                  max={30}
                  min={16}
                  onChange={this.changes}
                  value={conditioning}
                  onAfterChange={this.after.bind(this)}
                  tooltipVisible={false}
                  ref={r => (this.conditioning_ = r)}
                  disabled={
                    conditioningInfo !== "" && conditioningInfo !== "关机"
                      ? false
                      : true
                  }
                />
                <img
                  style={{ marginLeft: "0.2em" }}
                  src={require("./../../../assets/img/+.png")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  //静音
  _mute = async () => {
    //keyId 静音是41 …… 不静音 是43
    try {
      if (typeof this.props.voice === "object") {
        let keyId;
        if (!this.state.mrakVolume) {
          this.setState({
            mrakVolume: true
          });
          keyId = 43;
        } else {
          this.setState({
            mrakVolume: false
          });
          keyId = 41;
        }
        let obj = this.props.voice;
        let param = [
          {
            equip_code: obj.equipcode,
            key_id: keyId,
            key_value: this.state.volume,
            equip_type_id: obj.equiptype
          }
        ];
        let res = await Api.Ctrl.equipment_control(this.props.classid, param);
        if (res.code === 200) {
          window._guider.Utils.alert({
            message: res.msg,
            type: "success"
          });
        } else {
          window._guider.Utils.alert({
            message: res.msg,
            type: "error"
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //音量
  _voice = async (e: string) => {
    if (firstTime) {
      firstTime = false;
      this.element.blur();
      try {
        let obj = this.props.voice; //obj.keyid;
        if (typeof obj.equipcode !== "undefined") {
          console.log("设备类型", obj.equiptype);
          let param = [
            {
              equip_code: obj.equipcode,
              key_id: 43,
              key_value: this.state.volume,
              equip_type_id: obj.equiptype
            }
          ];
          let res = await Api.Ctrl.equipment_control(this.props.classid, param);
          if (res.code === 200) {
            window._guider.Utils.alert({
              message: res.msg,
              type: "success"
            });
          } else {
            window._guider.Utils.alert({
              message: res.msg,
              type: "error"
            });
          }
        } else {
          window._guider.Utils.alert({
            message: "该教室没有功放",
            type: "warning"
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      firstTime = true;
    }
  };
  //音量监听
  change = (volume: String) => {
    this.setState({ volume, mrakVolume: true });
  };
  //窗帘、灯控 .... 按钮 渲染
  pcView = (data: Object, index: number) => {
    if (typeof data !== "undefined") {
      let ofo = data.highlight;
      return (
        <a
          className={
            data.key_name.includes("屏")
              ? ["devCtl-row-div-pc-a", "margin0"].join(" ")
              : "devCtl-row-div-pc-a"
          }
          href={null}
          onClick={this.btnSwitch.bind(this, data)}
          key={index}
          style={ofo == "1" ? styles : null}
        >
          <img
            src={
              typeof data === "undefined"
                ? null
                : require("../../../assets/img/" + data.key_img + ".png")
            }
          />
          <span>{typeof data !== "undefined" ? data.key_name : null}</span>
        </a>
      );
    }
  };
  // //灯控、窗帘、按钮发送数据

  btnSwitch = debounce(async (data: Object) => {
    let array = [];
    array.push({
      equip_code: data.equip_code,
      key_id: data.key_id,
      equip_type_id: data.equip_type
    });
    let res = await Api.Ctrl.equipment_control(this.props.classid, array);
    if (res.code === 200) {
      window._guider.Utils.alert({
        message: res.msg,
        type: "success"
      });
    } else {
      window._guider.Utils.alert({
        message: res.msg,
        type: "error"
      });
    }
  });
  //空调控制
  after = () => {
    if (conditioning) {
      conditioning = false;
      this.conditioning_.blur();
      this.itmeConditioning(this.state.controlName);
    } else {
      conditioning = true;
    }
  };
  //空调监听
  changes = (conditioning: String) => {
    this.setState({ conditioning });
  };
  //空调渲染按钮以及状态判断
  conditioningview = (data: Object<String>, index: number) => {
    try {
      let name =
        this.state.conditioningInfo === null
          ? "关机"
          : this.state.conditioningInfo;
      let state =
        typeof name !== "undefined"
          ? data.key_name == name
            ? conditioningStyle
            : {} && name.indexOf("制") === 0
            ? index === 0
              ? conditioningStyle
              : {}
            : {}
          : null;
      return (
        <a
          className="conditioningview-a"
          href={null}
          onClick={this.itmeConditioning.bind(this, data)}
          key={index}
          style={state}
        >
          <img src={require("../../../assets/img/" + data.key_img)} />
          <span>{data.key_name}</span>
        </a>
      );
    } catch (error) {
      console.log(error);
    }
  };
  //空调发送数据
  itmeConditioning = debounce(async (data: Object) => {
    if (data !== null) {
      this.setState({ controlName: data, conditioningInfo: data.key_name });
      let temperature;
      let row = this.state.conditioning.toString();
      if (this.props.equip_code !== null) {
        if (data.open === true) {
          temperature = hotMapKey[temper(row)];
        } else if (data.open === false) {
          temperature = ColdmapKey[temper(row)];
        } else {
          temperature = 73;
        }

        //空调 equip_type_id 写死2 不可能会变的
        let param = [
          {
            equip_code: this.props.equip_code,
            key_id: data.key_name === "开机" ? "airopen" : temperature,
            key_value: row,
            equip_type_id: 2,
            eroomid: data.key_name === "开机" ? this.props.eroomid : ""
          }
        ];
        let res = await Api.Ctrl.equipment_control(this.props.classid, param);
        if (res.code === 200) {
          window._guider.Utils.alert({
            message: res.msg,
            type: "success"
          });
        } else {
          window._guider.Utils.alert({
            message: res.msg,
            type: "error"
          });
        }
      } else {
        window._guider.Utils.alert({
          message: "该教室没有空调信息",
          type: "error"
        });
      }
    }
  });
}
export default DeviceBtn;
//冷
let ColdmapKey = {
  "16": "27",
  "17": "28",
  "18": "45",
  "19": "46",
  "20": "47",
  "21": "48",
  "22": "49",
  "23": "50",
  "24": "51",
  "25": "52",
  "26": "53",
  "27": "54",
  "28": "55",
  "29": "56",
  "30": "57"
};
//热
const hotMapKey = {
  "16": "58",
  "17": "59",
  "18": "60",
  "19": "61",
  "20": "62",
  "21": "63",
  "22": "64",
  "23": "65",
  "24": "66",
  "25": "67",
  "26": "68",
  "27": "69",
  "28": "70",
  "29": "71",
  "30": "72"
};
const temper = (text: String) => {
  //text 是温度
  const match = text.match(/\d\d\d?/gi);
  return match.length ? match[0] : "";
};
