"user strict";
//@flow
import { observable, action, autorun } from "mobx";
import Api from "./../api";
class DeviceState {
  @observable list = []; //学校Tree
  @observable classRoomList = []; //教室
  @observable classRoomListSelect = []; //教室 select
  @observable dictionaryList = null; //all字典
  @observable location = []; //学生机位置
  @observable _UpdateList = [];
  @observable _Version = null;
  @observable hdmiconn = []; //dmi连接口
  constructor(props: any) {}
  //学校教室列表
  @action schoolList = async () => {
    try {
      if (JSON.parse(window.localStorage.getItem("data"))) {
        let userName = window.localStorage.getItem("userName");
        let id = JSON.parse(window.localStorage.getItem("data")).userid;
        let res =
          userName !== "admin"
            ? await Api.Device.schoolList(id)
            : await Api.Device.adminSchoolist();
        let data =
          userName !== "admin"
            ? await Api.Device.get_classroom_tree()
            : await Api.Device.amdinget_classroom_tree();
        if (data.code === 0) {
          if (data.data.length > 0) {
            this.classRoomList = formatDatas(data.data);
            this.classRoomListSelect = formatDataSelct(data.data);
          }
        }
        if (res.code === 0) {
          this.list = formatData(res.data);

        }
      }
    } catch (error) {
      console.log(error)
    }
  };
  //典类型查询字典数据(获取波特率、数据位、停止位、校验、编码方式，分别传值)
  @action _allDictionary = async () => {
    try {
      let res = await Api.Device.alldictionary();
      // console.log(res);
      if (res.code === 200) {
        this.dictionaryList = res.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 摄像机位置
  @action _location = async () => {
    try {
      let res = await Api.Device.locations("camera_type");
      let hdmiconn = await Api.Device.locations("hdmi_conn");
      // console.log(hdmiconn);
      if (res.code === 200) {
        this.location = res.data.result;
        this.hdmiconn = hdmiconn.data.result;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //触摸屏升级 中控固件升级 AI升级
  @action _updatelists = async sign => {
    let res = await Api.Device.get_upgrades("1", "6", sign);
    if (res.code === 200) {
      this._UpdateList = res.data.tabledata.rows;
      this._Version = res.data.ver_name;
    } else {
      this._UpdateList = [];
      this._Version = null;
    }
  };
}
export default new DeviceState();
//学校
const formatData = (res: Array<Object>,isCopy=false) => {
  let ant = [];
  res.forEach((e, index) => {
    if (e.children) {
      ant.push({
        title: e.name,
        key:`${e.id}:${e.code}`,
        parent: e.parent,
        row: e,
        children:isCopy?formatData(e.children,true): formatData(e.children),
        value:isCopy?e.uuid: e.id
      });
    } else {
      ant.push({
        title: e.name,
        key:`${e.id}:${e.code}`,
        parent: e.parent,
        row: e,
        value:isCopy? e.uuid: e.id
      });
    }
  });
  return ant;
};

const formatDataSelct = (res: Array<Object>) => {
  let ant = [];
  res.forEach(e => {
    // console.log(e);
    if (e.children) {
      ant.push({
        title: e.name,
        key: e.id,
        value: e.uuid,
        code: e.code,
        parent: e.parent,
        children: formatData(e.children,true)
      });
    } else {
      ant.push({
        title: e.name,
        key: e.id,
        value: e.uuid,
        code: e.code,
        parent: e.parent
      });
    }
  });
  return ant;
};
const formatDatas = (res: Array<Object>) => {
  let ant = [];
  res.forEach((e, index) => {
    if (e.children) {
      ant.push({
        title: e.name,
        key: `${e.id}:${e.code}`,
        parent: "",
        row: e,
        children: formatDatas(e.children),
        value: e.id
      });
    } else {
      ant.push({
        title: e.name,
        key: `${e.id}:${e.code}`,
        parent: "",
        row: e,
        value: e.id
      });
    }
  });
  return ant;
};
