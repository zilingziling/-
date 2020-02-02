// @flow

import React, { Component } from "react";
import { Table, Icon, Divider, Modal } from "antd";
import Api from "./../../../api";
import Modles from "./Modles";
import { observable, toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { RouterPmi } from "../../component/function/routerPmi";
const confirm = Modal.confirm;
let count = 0;

type Props = {
  match: Object,
  history: Object,
  location: Object,
  data: Function
};
type State = {};
@inject("Devices")
@observer
class Tables extends Component<Props, State> {
  state = {
    infoData: null,
    title: "",
    visible: false,
    deviceType: [],
    columns: [
      { title: "设备类型", dataIndex: "equiptypename", key: "equiptypename" },
      { title: "品牌", dataIndex: "brandcnname", key: "brandcnname" },
      { title: "型号", dataIndex: "equipmodel", key: "equipmodel" },
      { title: "控制方式", dataIndex: "connname", key: "connname" },
      { title: "创建时间", dataIndex: "createtime", key: "createtime" },
      {title: "添加人员", dataIndex: "account", key: "account" },
      {
        title: "操作",
        dataIndex: "key",
        key: "key",
        render: (text, record) => {
          return (
            <span className="device-tables-table-span">
              <span
                className={
                  this.state._info.includes("edit") ? "pointer" : "notAllowed"
                }
              >
                <a
                  disabled={!this.state._info.includes("edit")}
                  className="all-a"
                  href={null}
                  onClick={() => {
                    this.editor(text);
                  }}
                >
                  编辑
                </a>
              </span>
              <Divider
                style={{ background: "rgba(0, 160, 233, 1)" }}
                type="vertical"
              />
              <span  className={
				  this.state._info.includes("delete") ? "pointer" : "notAllowed"
			  }>
                <a
                  disabled={!this.state._info.includes("delete")}
                  className="all-a"
                  onClick={() => {
                    this.Delete(record);
                  }}
                  href={null}
                >
                  删除
                </a>
              </span>
            </span>
          );
        }
      }
    ],
    _info: RouterPmi() //[]
  };

  async componentDidMount() {
    this.setState({
      deviceType: toJS(this.props.Devices._validation)
      // _info: RouterPmi(),
    });
  }
  render() {
    return (
      <div className="device-tables">
        <Table
          onRow={record => {
            return {
              onClick: this.RowTable.bind(this, record)
            };
          }}
          className="device-tables-table"
          rowClassName="device-tables-tableRow"
          columns={this.state.columns}
          dataSource={toJS(this.props.data)}
          // bordered
          pagination={false}
        />
        <Modles
          width={650}
          title={this.state.title}
          visible={this.state.visible}
          data={this.state.deviceType}
          itme={this.state.infoData}
          handleOk={() => {
            // console.log(1);
          }}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        />
      </div>
    );
  }
  RowTable = e => {
    if (!this.state._info.includes("edit")) return;
    count += 1;
    setTimeout(() => {
      if (count === 2) {
        this.editor(e.key);
      }
      count = 0;
    }, 300);
  };
  //编辑
  editor = async (id: strign) => {
    let res = await Api.Device.editor(id);
    if (res.code === 200) {
      this.setState({
        infoData: res.data,
        visible: true,
        title: "编辑控制码 "
      });
    }
  };
  //删除
  Delete = (record: object) => {
    confirm({
      title: " 删除不可恢复，确定删除" + record.equiptypename + "的设备吗？ ",
      centered: true,
      onOk: () => {
        this.props.DeleteDevice(record.key);
      },
      onCancel() {}
    });
  };
}

export default Tables;
