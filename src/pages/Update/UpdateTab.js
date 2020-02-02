/* eslint-disable indent */
//@flow

import React, { Component } from "react";
import Api from "./../../api";
import Bar from "../component/Bar/deviceSeleclass";
import Pagination from "../component/Paginations/Paginations";
import { Table, Button, Badge } from "antd";
import { observable, toJS, autorun } from "mobx";
import { observer, inject } from "mobx-react";
import "./update.scss";

const updateStyle = {
  width: "80rem"
};
type Props = {
  match: Object,
  history: Object,
  location: Object
};

@inject("Update")
@observer
class DeviceSele extends Component<Props> {
  @observable school = null;
  @observable classid = null;
  @observable size = 10;
  @observable columns = [
    { title: "位置", dataIndex: "school_room", key: "school_room" },
    { title: "中控ID号", dataIndex: "imei_no", key: "imei_no" },
    { title: "当前固件版本", dataIndex: "versionname", key: "versionname" }
  ];
  @observable count = null;
  @observable selectedRowKeys = [];
  async componentDidMount() {
    let school = window.localStorage.getItem("devicesStateClassroomid");
    let classid = window.localStorage.getItem("devicesStateschool");
    let url = window.location.pathname;
    if (school !== null && classid !== null) {
      this.props.Update._list(school, "1", 1); //'1' 代表中控升级 '2'固件升级 '3'升级
      this.classid = classid;
      this.school = school;
    }
    autorun(() => {
      this.selectedRowKeys = toJS(this.props.Update.selid).map(Number);
      this.count = toJS(this.props.Update.selid).length;
    });
  }
  onShowSizeChange = (current, pageSize) => {
    this.props.Update.current = 1;
    this.size = pageSize;
    this.props.Update._list(this.school, "1", 1, this.size);
  };
  render() {
    const { total, listData, current } = this.props.Update;
    const { selectedRowKeys } = this;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div className="UpdateTable">
        <Bar renderValue={this.onchang} />
        <div className="UpdateTable-left">
          <Badge className="UpdateTable-left-number" count={this.count}>
            <Button
              onClick={this._UpdateSeve}
              type="primary"
              className="UpdateTable-left-number-button"
            >
              保存当前页
            </Button>
          </Badge>
          <Button
            onClick={this._UpdategoBanck}
            type="primary"
            className="UpdateTable-left-number-button rights"
          >
            返回升级页面
          </Button>
          <Table
            rowSelection={rowSelection}
            className="device-tables-table"
            rowClassName="device-tables-tableRow"
            columns={toJS(this.columns)}
            dataSource={toJS(listData)}
            bordered
            pagination={false}
          />
          <Pagination
            current={current}
            total={total}
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            pageSize={this.size}
            paging={e => {
              this.props.Update.current = e;
              this.props.Update._list(this.school, "1", e, this.size);
            }}
          />
        </div>
      </div>
    );
  }
  //返回上一级
  _UpdategoBanck = () => {
    this.props.history.replace({
      pathname: "/update"
    });
  };
  //保存
  _UpdateSeve = async () => {
    const { listData } = this.props.Update;
    let ids = [];
    let status = [];
    toJS(listData).forEach(i => ids.push(i.classroomid));
    let arr = toJS(listData);
    arr.forEach(i=>i.isupgradequeue=0)
    arr.forEach(i =>
      toJS(this.selectedRowKeys).forEach(j => {
        console.log(i.classroomid===j)
        if(i.classroomid===j)i.isupgradequeue = 1
      })
    );
    arr.forEach(i => status.push(i.isupgradequeue));
    console.log(ids);
    console.log(status);
      try {
        let res = await Api.Device.upgrade_room(ids,status, 1); //'1' 代表中控升级 '2'固件升级 '3'升级
        console.log(res);
        if (res.code === 200) {
          window._guider.Utils.alert({
            message: res.msg,
            type: "success"
          });
        }
      } catch (error) {
        console.log(error);
      }
  };
  onSelectChange = key => {
    this.selectedRowKeys = key;
    this.count = key.length;
  };
  //选择
  onchang = (id: Number) => {
    this.school = id;
    if (typeof id !== "undefined") {
      this.props.Update._list(id, "1", 1);
      this.count = null;
      this.selectedRowKeys = [];
      this.props.Update.current = 1;
    } else {
      this.props.Update.listData = [];
      this.props.Update.total = null;
    }
  };
}

export default DeviceSele;
