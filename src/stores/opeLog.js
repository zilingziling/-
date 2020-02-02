import { observable, action } from "mobx";
import { opeLog } from "../api/help";

class OpeLog {
  @observable data = []; //数据
  @observable total = null;
  @observable pageNo = 1;
  @observable pageSize = 10;
  @observable search = {
    username: "",
    begintime: "",
    selsign: "",
    endtime: ""
  };

  @action list = async () => {
    const p = {
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      ...this.search
    };
    let r = await opeLog(p);
    if (r.code === 200) {
      if (r.data.rows.length > 0) {
        this.data = r.data.rows;
        this.total = r.data.total;
      }
    }
  };
}
export default new OpeLog();
