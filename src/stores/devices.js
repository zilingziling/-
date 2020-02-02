/* eslint-disable no-mixed-spaces-and-tabs */
"user strict";
//@flow
import { observable, action, autorun } from "mobx";
import Api from "./../api";
import { Modal } from "antd";
class Device {
  @observable dataSrouce = [];
  @observable current = 1;
  @observable total = null;
  @observable search = {
    type: "",
    brandType: "",
    deviceValue: "",
    spinning: true,
    brandTypeId: ""
  };
  @observable _validation = [];
  @observable _brands = [];
  @observable _StringNo = null;
  @observable _validationNet = false;
  @observable _msg = "";
  @action list = async (
    pages: number,
    equipType: string,
    equipBrand: string,
    equipModel: string,
    brandTypeId: string
  ) => {
    try {
      let res = await Api.Device.DeviceList(
        pages,
        equipType,
        equipBrand,
        equipModel,
        brandTypeId
      );
      if (res.data.rows.length !== 0) {
        this.dataSrouce = this.dataRow(res.data.rows);
        this.total = res.data.total;
      } else if (res.data.pageNo > "1" && res.data.rows.length === 0) {
        this.list(
          res.data.pageNo - 1,
          equipType,
          equipBrand,
          equipModel,
          brandTypeId
        );
        this.current = parseInt(res.data.pageNo) - 1;
      } else {
        this.dataSrouce = [];
        this.total = null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  @action dataRow = (obj: Array<object>) => {
    let ant = [];
    obj.forEach(element => {
      ant.push({
        brandcnname: element.brandcnname,
        connecttype: element.connecttype,
        connname: element.connname,
        createtime: element.createtime,
        creator: element.creator,
        equipbrand: element.equipbrand,
        equipmodel: element.equipmodel,
        equiptype: element.equiptype,
        equiptypename: element.equiptypename,
        key: element.id,
        account: element.account
      });
    });
    return ant;
  };

  @action validation = async () => {
    try {
      let res = await Api.Device.validation();
      let data = await Api.Device.Devicebrand();
      this._validation = res.data;
      this._brands = data.data;
    } catch (error) {
      console.log(error);
    }
  };

  //	通过教室id获取串号
  @action get_imei_by_room = async v => {
    console.log(v);
    try {
      let res = await Api.Device.get_imei_by_room(v);
      if (res.code === 200) {
        console.log(res.data);
        if (typeof res.data !== "undefined") {
          this._StringNo = res.data;
          this._validationNet = false;
          this._msg = null;
        } else {
          this._validationNet = true;
          this._msg = res.msg;
          Modal.warning({
            centered: true,
            title: res.msg
          });
        }
      } else {
        window._guider.Utils.alert({
          message: res.msg,
          type: "error"
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
}
export default new Device();
