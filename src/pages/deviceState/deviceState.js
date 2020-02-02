//@flow
import React, { Component } from "react";
import Bar from "../component/Bar/deviceSeleclass";
import Table from "./component/table";
import Paginations from "../component/Paginations/Paginations";
import "./deviceState.scss";
import Api from "./../../api";
import { uint8Buff2Str } from "../component/function/formatDateReturn";
import { observable, toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { RouterPmi } from "../component/function/routerPmi";

type Props = {
  match: Object,
  history: Object,
  location: Object,
  DeviceDetection: Function,
  Police: Function
};

const styles = {
  display: "flex"
};
const leftStyle = {
  width: "85vw",
  marginTop: "30px",
  marginLeft: "15px"
};
@inject("Police", "DeviceDetection", "Socke")
@observer
class DeviceState extends Component<Props> {
  componentDidMount() {
    // setTimeout(() => {
    // 	this.props.Socke.onMsg(); //获取socket信息
    // }, 1000);
    if (this.props.DeviceDetection.arrayData.length === 0) {
      let classid = window.localStorage.getItem("devicesStateClassroomid");
      if (classid !== null) {
        this.props.DeviceDetection.list(classid, 1);
        this.props.DeviceDetection.classroomId = classid;
      }
    }
  }
  render() {
    const {
      arrayData,
      total,
      pageNo,
      classroomId
    } = this.props.DeviceDetection;
    return (
      <div style={styles}>
        <Bar renderValue={this.onchang} />
        <div style={leftStyle}>
          <Table shcoolId={classroomId} data={toJS(arrayData)} />
          <Paginations current={pageNo} total={total} paging={this.onChange} />
        </div>
      </div>
    );
  }
  //学校选择
  onchang = async (id: Number) => {
    this.props.DeviceDetection.classroomId = id;
    if (typeof id !== "undefined") {
      this.props.DeviceDetection.list(id, this.props.DeviceDetection.pageNo);
    } else {
      this.props.DeviceDetection.arrayData = [];
    }
  };
  //分页
  onChange = (e: number) => {
    this.props.DeviceDetection.pageNo = e;
    this.props.DeviceDetection.list(this.props.DeviceDetection.classroomId, e);
  };
}
export default DeviceState;
