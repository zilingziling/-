/* eslint-disable indent */
// @flow
import React, {Component} from "react";
import Api from "./../../../api";
import {Icon} from "antd";
import {inject, observer} from "mobx-react";
import {debounce} from "../../component/function/formatDateReturn";

type Props = {
  OPS: Array
};
type State = {
  visible: Boolean,
  displayBtn: Boolean
};
// 渲染剩下的按钮
const RenderRest=({data,pcView})=>{
      return (
          <div className="buttons">{
            data.map(pcView)
          }</div>
      )
    }
@inject("DeviceDetection")
@observer
class DeviceViode extends Component<Props, State> {
  state = {
    visible: false,
    displayBtn: false,
    rest:false,
    data:[]
  };
  componentDidMount() {
    this._infos(); //监听视频播放
  }
  _infos = () => {
    window.YjFPlayer = {
      onEvent: str => {
        console.log(str);
        if (str == "PLAYER_INIT_DONE") {
          //默认情况下播放
          setTimeout(() => {
            this.props.DeviceDetection.refreshPlay();
          }, 1);
        } else if (str == "PLAYER_SCREEN_FULL") {
          //全屏情况下播放
          setTimeout(() => {
            this.props.DeviceDetection.FullScreen();
          }, 1);
        } else if (str == "PLAYER_SCREEN_NORMAL") {
          //退出全屏情况下播放
          setTimeout(() => {
            this.props.DeviceDetection.refreshPlay();
          }, 1);
        }
      }
    };
  };

  render() {
    const { displayBtn,rest,data } = this.state;
    const { videoLive } = this.props.DeviceDetection;
    const {
      InteractiveTablet,
      projector,
      curtainControl,
      pc,
      OPS
    } = this.props;
    const restProps={
        data,
      pcView:this.pcView
    }
    return (
      <div className="devCtl-row-div">
      {/* 视频 */}
      <div>
        <div className="devCtl-row-div-vide">
          {/* flash更新过后防止页面缓存的是上个版本falsh版本设置?param=0.0xx  */}
          <object
              classID="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
              width="550"
              height="240"
              id="XKFlashPlayer"
          >
            <param name="movie" value="HWFlashPlayer.swf?param=2.0" />
            <param name="quality" value="high" />
            <param name="bgcolor" value="#000000" />
            <param name="allowScriptAccess" value="always" />
            <param name="allowFullScreen" value="true" />
            <param name="wmode" value="window" />
            {/* <!--[if !IE]>--> */}
            <object
                type="application/x-shockwave-flash"
                data="HWFlashPlayer.swf?param=2.0"
                width="550"
                height="240"
                id="XKFlashPlayer"
            >
              <param name="quality" value="high" />
              <param name="bgcolor" value="#000000" />
              <param name="allowScriptAccess" value="always" />
              <param name="allowFullScreen" value="true" />
              <param name="wmode" value="window" />
              {/* <!--<![endif]-->
            		<!--[if gte IE 6]>--> */}
              <p>
                请点击下面图标，选择允许
                {/* Either scripts and active content are not permitted to run or Adobe Flash Player version
									10.0.0 or greater is not installed. */}
              </p>
              {/* <!--<![endif]--> */}
              <a href="http://www.adobe.com/go/getflashplayer">
                <img
                    src={require("../../../assets/img/get_flash_player.gif")}
                    alt="Get Adobe Flash Player"
                />
              </a>
              {/* <!--[if !IE]>--> */}
            </object>
            {/* <!--<![endif]--> */}
          </object>
        </div>
      </div>
      {/* 按钮 */}
      <div
          className="devCtl-row-div-pc"
          style={displayBtn === true ? { width: "47rem" } : { width: "25rem" }}
      >
        <div className="devCtl-row-div-pc-div">
            <span className="devCtl-row-div-pc-psan">
              {OPS.length > 0 ? OPS[0].equip_type_name : "电脑"}
            </span>
          <a
              className="devCtl-row-div-pc-div-img"
              href={null}
              onClick={this.folding}
          >
            {!this.state.displayBtn ? (
                <img src={require("../../../assets/img/right.png")} />
            ) : (
                <img src={require("../../../assets/img/left.png")} />
            )}
          </a>
          <div className="devMap">
            {OPS.length > 0 && OPS.map(this.pcView)}
          </div>
          {/* 投影 */}
          <span className="devCtl-row-div-pc-psan">
              {projector.length > 0 ? projector[0].equip_type_name : "投影"}
            </span>
          <div className="devMap">
            {/*{this.renderButtons(projector.concat(curtainControl))}*/}
            {projector.concat(curtainControl).map(this.pcView)}
          </div>
        </div>

        {/* 折叠隐藏  */}
        <div className="devCtl-row-div-pc-divs">
            <span className="devCtl-row-div-pc-psan">
              {pc.length > 0 ? pc[0].equip_type_name : " "}
            </span>
          <div className="devMap ">
            {pc.length > 0 ? pc.map(this.pcView) : " "}
          </div>
          {/* 交互平板 */}
          <span className="devCtl-row-div-pc-psan">
              {InteractiveTablet.length > 0 &&
              InteractiveTablet[0].equip_type_name}
            </span>
          <div className="devMap">{InteractiveTablet.map(this.pcView)}</div>
        </div>
      </div>
      {rest?<RenderRest {...restProps}/>:null}
    </div>
  );
  }
  //折叠展开
  folding = () => {
    if (!this.state.displayBtn) {
      this.setState({ displayBtn: true });
    } else {
      this.setState({ displayBtn: false });
    }
  };
  renderButtons = data => {
    if (data.length > 4) {
      return this.gooey(data);
    } else return data.map(this.pcView);
  };

  //按钮遍历
  gooey = (data, index) => {
    console.log(data)
    return (
      <>
        {data.slice(0, 3).map(this.pcView)}
        <div
          key={index}
          className="plus"
          href={null}
		  onClick={()=>{
		    this.setState({
              rest:!this.state.rest,
              data:data.slice(3)
            })
          }}
          // onClick={this.btnSwitch.bind(this, data)}
          // style={data.highlight == '1' ? styles : null}
        >
          <Icon type="plus" className="plusIcon" />
        </div>

      </>
    );
  };
  pcView = (data: any, index: number) => {
    try {
      let img = require("./../../../assets/img/" + data.key_img + ".png");
      let styles = { background: "rgba(37, 147, 251, 0.88)" };
      if (typeof data !== "undefined") {
        return (
          <a
            key={index}
            className="devCtl-row-div-pc-a"
            href={null}
            onClick={this.btnSwitch.bind(this, data)}
            style={data.highlight == "1" ? styles : null}
          >
            <img src={typeof img !== "undefined" ? img : ""} />
            <span>
              {typeof data.key_name !== "undefined" ? data.key_name : null}
            </span>
          </a>
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  //发送数据
  btnSwitch = debounce(async (data: any) => {
    const { handleSpin } = this.props;
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
      // handleSpin()
    } else
      window._guider.Utils.alert({
        message: res.msg,
        type: "error"
      });
  });
}
export default DeviceViode;

export const diff = (obj1, obj2) => {
  var o1 = obj1 instanceof Object;
  var o2 = obj2 instanceof Object;
  if (!o1 || !o2) {
    /*  判断不是对象  */
    return obj1 === obj2;
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object;
    var t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
};

//这个页面视频url放在store里面， DeviceDetection
