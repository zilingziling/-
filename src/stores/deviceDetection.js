"user strict";
//@flow
import { observable, action, autorun, toJS } from "mobx";
import Api from "./../api";
class DeviceDetection {
  @observable arrayData = [];
  @observable total = null;
  @observable pageNo = 1;
  @observable classroomId = null;
  @observable videoLive = {
    //视频
    teacher: [],
    students: [],
    desktop: []
  };
  //列表数据
  list = async (id: Number, page: number) => {
    let res = await Api.DeviceState.get_status_monitor(id, page);
    if (res.code === 200) {
      if (res.data.rows.length > 0) {
        this.arrayData = format(res.data.rows);
        this.total = res.data.total;
        this.pageNo = parseInt(res.data.pageNo);
      } else {
        this.arrayData = [];
        this.total = null;
        this.pageNo = 1;
      }
    }
  };

  //视频uir
  // getVideoLive
  videList = async (id: String) => {
    try {
      let res = await Api.Ctrl.get_camera(id);
      if (res.code === 200) {
        if (JSON.stringify(res.data) !== "{}") {
          let camera = res.data.camera;
          let pc = res.data.pc;
          this.videoLive = {
            teacher: typeof camera[1] !== "undefined" ? camera[1] : [],
            students: typeof camera[2] !== "undefined" ? camera[2] : [],
            desktop: typeof pc[0] !== "undefined" ? pc[0] : []
          };
          this.refreshPlay(); //自动播放
        }
      } else {
        this.videoLive = {
          teacher: [],
          students: [],
          desktop: []
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  //小屏幕情况下播放底清视频
  @action refreshPlay() {
    try {
      let videoLive = this.videoLive;
      let arrayUlr = [];
      arrayUlr.push(
        videoLive.teacher.n1url,
        videoLive.students.n1url,
        videoLive.desktop
      );
      let url = arrayUlr.filter(d => d); //去除数组中的null
      this.myFlash("XKFlashPlayer").refreshDisplay(JSON.stringify(url));
    } catch (error) {
      console.log(error);
    }
  }
  //大屏幕下播放高清视频
  @action FullScreen() {
    try {
      let videoLive = this.videoLive;
      let arrayUlr = [];
      arrayUlr.push(
        videoLive.teacher.n2url,
        videoLive.students.n2url,
        videoLive.desktop
      );
      this.myFlash("XKFlashPlayer").refreshDisplay(JSON.stringify(arrayUlr));
    } catch (error) {
      console.log(error);
    }
  }
  myFlash(pP) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
      return window[pP];
    } else {
      return document[pP];
    }
  }
}
export default new DeviceDetection();
const format = data => {
  let array = [];
  data.forEach((element, index) => {
    array.push({
      classroomid: element.classroomid,
      equipstatusname: element.equipstatusname,
      hostip: element.hostip,
      school_room: element.school_room,
      usestatusname: element.usestatusname,
      key: index,
      buildingid: element.buildingid
    });
  });
  return array;
};
