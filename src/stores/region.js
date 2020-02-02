/* eslint-disable no-mixed-spaces-and-tabs */
import { inject } from "mobx-react";

("user strict");
//@flow
import { observable, action, autorun } from "mobx";
import Api from "./../api";
import { Modal } from "antd";
import Police from "./police";
import DeviceState from "./devicesState";
import DeviceDetection from "./deviceDetection";
const { confirm } = Modal;
/**
 * 	dataList 数据列表或者下拉选择数据接口
 */
class Regions {
  @observable type = null; //选择中的code来判断
  @observable data = []; //数据
  @observable visible = false; //model
  @observable title = ""; //model
  @observable parentId = ""; //父ID 就是当前的ID
  @observable TypeData = []; //树形code
  @observable treeData = []; //树形菜单数据
  @observable treeID = []; //树形菜id
  @observable current = 1; //页数
  @observable total = null; //总数
  @observable schoolType = []; //学校类型数据
  @observable administrativelList = []; //行政数据
  @observable FormValue = {
    address: "", //在这里初始化定义一些值，在编辑或者保存中参数不会出现undefined ，在必填选项中可以不用在这里填写，
    fax: "",
    region1: "",
    region2: "",
    region3: "",
    email: ""
  }; //编辑表单的值
  @observable mark = null; //form判断标志
  @observable markName = null; //form判断标志
  //教室
  @observable teachingBuilding = null; //所属教学楼
  @observable classroom_typeData = []; //数据
  @observable classrommInfo = {};

  //列表数据 dataList
  @action list = async (id, page) => {
    try {
      let res = await Api.setUp.get_schools(id, page);
      if (res.code === 200) {
        console.log(res);
        if (res.data.rows.length > 0) {
          this.data = dataFormat(res.data.rows);
          this.total = res.data.total;
        } else if (res.data.pageNo > "1" && res.data.rows.length === 0) {
          this.current = parseInt(res.data.pageNo) - 1;
          this.list(id, parseInt(res.data.pageNo) - 1);
        } else {
          this.data = [];
          this.total = null;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //教室数据 dataList
  @action classRommList = async (id, page) => {
    try {
      let res = await Api.setUp.get_classroom_by_school(id, page);
      if (res.code === 200) {
        if (res.data.rows.length > 0) {
          this.data = dataFormat(res.data.rows);
          this.total = res.data.total;
        } else if (res.data.pageNo > "1" && res.data.rows.length === 0) {
          console.log(parseInt(res.data.pageNo) - 1);
          this.current = parseInt(res.data.pageNo) - 1;
          this.classRommList(id, parseInt(res.data.pageNo) - 1);
        } else {
          this.data = [];
          this.total = null;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //树形菜单	dataList
  @action TreeList = async () => {
    let userName = window.localStorage.getItem("userName");
    let res =
      userName !== "admin"
        ? await Api.Device.schoolList()
        : await Api.Device.adminSchoolist();
    if (res.code === 0) {
      this.treeData = formatData(res.data);
    }
  };
  //学校类型 dataList
  @action schoolTypeData = async () => {
    try {
      let res = await Api.setUp.get_by_parentcode("schoolType");
      if (res.code === 200) {
        this.schoolType = res.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  //行政 dataList
  @action administrative = async () => {
    try {
      let res = await Api.setUp.get_level1();
      this.administrativelList = res.data;
    } catch (error) {
      console.log(error);
    }
  };
  //教室类型 dataList
  @action classrommType = async () => {
    try {
      let res = await Api.setUp.get_by_parentcode("classroom_type");
      if (res.code === 200) {
        this.classroom_typeData = res.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //删除、编辑
  @action operation = async (e, text, row) => {
    if (e === 1) {
      //编辑
      let res = await Api.setUp.get_school_by_id(text);
      if (res.code === 200) {
        this.markName = res.data.typename;
        this.mark = res.data.code;
        this.FormValue = res.data;
        this.visible = true;
        this.title = "编辑信息";
      }
    } else if (e === 2) {
      //删除
      confirm({
        centered: true,
        title: `删除${row.locationname}下的${row.name}吗？`,
        onOk: async () => {
          let res = await Api.setUp.del_school(text);
          if (res.code === 200) {
            window._guider.Utils.alert({
              message: res.msg,
              type: "success"
            });
            this.newDataSource(); //刷新数据
            // 刷新其他页面的数据
            await DeviceState.schoolList();
            await Police.list(0, 1);
            let classid = window.localStorage.getItem(
              "devicesStateClassroomid"
            );
            if (classid !== null) {
              await DeviceDetection.list(classid, 1);
            }
          } else {
            window._guider.Utils.alert({
              message: res.msg,
              type: "error"
            });
          }
        },
        onCancel() {}
      });
      window.localStorage.setItem("operateRegion", true);
    }
  };
  //教室删除、编辑
  @action operationClass = async (e, text) => {
    if (e === 1) {
      let res = await Api.setUp.get_classroom_by_id(text.id);
      if (res.code === 200) {
        this.title = "编辑教室";
        this.visible = true;
        this.classrommInfo = res.data;
      }
    } else if (e === 2) {
      confirm({
        title: `删除${text.name}吗？`,
        centered: true,
        onOk: async () => {
          let res = await Api.setUp.del_classroom(text.id);
          if (res.code === 200) {
            window._guider.Utils.alert({
              message: res.msg,
              type: "success"
            });
            this.newClassRoomList(); //刷新数据
            // 刷新其他页面的数据
            await DeviceState.schoolList();
            await Police.list(0, 1);
            let classid = window.localStorage.getItem(
              "devicesStateClassroomid"
            );
            if (classid !== null) {
              await DeviceDetection.list(classid, 1);
            }
          } else {
            window._guider.Utils.alert({
              message: res.msg,
              type: "error"
            });
          }
        },
        onCancel() {}
      });
    }
  };
  //新增
  @action _add = () => {
    this.visible = true;
    this.title = "新增";
  };
  //关闭
  @action _clear = () => {
    this.visible = false;
    this.title = "";
    this.FormValue = {
      address: "",
      fax: "",
      region1: "",
      region2: "",
      region3: "",
      email: ""
    };
    this.mark = null;
    this.markName = null;
    // classroom
    this.classrommInfo = {};
  };
  //下拉
  @action seleList = async () => {
    try {
      let res = await Api.setUp.get_by_parentcode("school_type"); //get_by_parentcode('school_type');
      if (res.code === 200) {
        this.TypeData = res.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  //新增或者删除过后从新啦数据
  @action newDataSource = () => {
    //
    this.TreeList();
    this.newlist();
  };

  //刷新table数据
  @action newlist = () => {
    this.list(this.treeID, this.current);
  };
  //刷新教室数据
  @action newClassRoomList = () => {
    this.classRommList(this.treeID, this.current);
  };
}
export default new Regions();
const dataFormat = data => {
  return data.map(item => {
    return { key: item.id, ...item };
  });
};
const formatData = (res: Array<Object>) => {
  let ant = [];
  res.forEach(e => {
    if (e.children) {
      ant.push({
        title: e.name,
        key: e.id,
        value: e.id,
        code: e.code,
        children: formatData(e.children),
        row: e
      });
    } else {
      ant.push({ title: e.name, key: e.id, value: e.id, code: e.code, row: e });
    }
  });
  return ant;
};
window.localStorage.setItem("operateRegion", true);
