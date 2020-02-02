/* eslint-disable no-mixed-spaces-and-tabs */
// @flow
import { observable, action, autorun } from "mobx";
import Api from "../api";
class Update {
  @observable listData = [];
  @observable total = null;
  @observable current = 1;
  @observable selid = [];
  @action
  _list = async (id: string, sign: string, page, size) => {
    let res = await Api.Device.get_upgrade_room(id, sign, page, size);
    // console.log(res);
    if (res.code === 200) {
      if (res.data.tabledata.rows.legnth !== 0) {
        this.listData = formatTable(res.data.tabledata.rows);
        this.total = res.data.tabledata.total;
        this.selid = res.data.selid;
      } else {
        this.listData = [];
        this.total = 0;
        this.current = 1;
      }
    }
  };
}
export default new Update();
//表格数据
const formatTable = (data: Array<Object>) => {
  let ant = [];
  data.forEach((res, index) => {
    ant.push({
      classroomid: res.classroomid,
      id: res.id,
      imei_no: res.imei_no,
      key: res.classroomid,
      school_room: res.school_room,
      versionname: res.versionname,
      versionno: res.versionno,
      isupgradequeue: res.isupgradequeue
    });
  });
  return ant;
};
