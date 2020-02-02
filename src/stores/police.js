"user strict";
//@flow
import { observable, action, autorun } from "mobx";
import Api from "./../api";

class DeviceState {
  @observable policeTaol = 0;
  @observable untreatedData = [];
  @observable total = 0;
  @observable current = 1;
  @observable mark = true;
  @observable untreated = null;
  @action list = async (states: Number, page: String) => {
    const schoolid = window.localStorage.getItem("schoolid");
    let res = await Api.Police.get_alarm_view(states, { page, schoolid });
    if (states === 0) {
      if (res.code === 200) {
        if (res.data.rows.length > 0) {
          this.untreatedData = untreated(res.data.rows);
          this.total = res.data.total;
          this.untreated = res.data.total;
        } else if (res.data.pageNo > "1" && res.data.rows.length === 0) {
          this.list(0, parseInt(res.data.pageNo) - 1);
          this.current = parseInt(res.data.pageNo) - 1;
        } else {
          this.untreatedData = [];
          this.total = null;
          this.untreated = null;
        }
      }
    } else if (states === 1) {
      // console.log('已处理');
      // console.log(res);
      if (res.code === 200) {
        if (res.data.rows.length > 0) {
          this.untreatedData = Have(res.data.rows);
          this.total = res.data.total;
        } else if (res.data.pageNo > "1" && res.data.rows.length === 0) {
          this.list(1, parseInt(res.data.pageNo) - 1);
          this.current = parseInt(res.data.pageNo) - 1;
        } else {
          this.untreatedData = [];
          this.total = 0;
        }
      }
    }
  };

  @action pageNumber = (pages: number) => {
    this.current = pages;
  };
  @action markfu = (mark: Boolean) => {
    this.mark = mark;
  };
}
export default new DeviceState();

const untreated = data => {
  let ant = [];
  data.forEach(element => {
    ant.push({
      event_time: element.event_time,
      eventtypename: element.eventtypename,
      handler: element.handler,
      handletime: element.handletime,
      key: element.id,
      schoolroom: element.schoolroom
    });
  });
  return ant;
};
const Have = data => {
  let ant = [];
  data.forEach(e => {
    ant.push({
      event_time: e.event_time,
      eventtypename: e.eventtypename,
      handler: e.handler,
      handletime: e.handletime,
      key: e.id,
      schoolroom: e.schoolroom
    });
  });
  return ant;
};
