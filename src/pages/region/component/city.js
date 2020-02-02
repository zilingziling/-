import React, { Component } from "react";
import { Table, Divider } from "antd";
import { observable, toJS, autorun } from "mobx";
import { observer, inject } from "mobx-react";
import Region from "../../../stores/region";
import Api from "../../../api";
import { Models } from "../../component/Model/model";

let columns;
autorun(() => {
  if (Region.type !== "school_academic_building") {
    columns = [
      { title: "名称", dataIndex: "name", key: "name" },
      {
        title: "位置",
        dataIndex: "locationname",
        key: "locationname"
      },

      {
        title: "类型",
        dataIndex: "schooltypename",
        key: "schooltypename"
      },
      { title: "负责人", dataIndex: "charge", key: "charge" },
      { title: "联系电话", dataIndex: "phone", key: "phone" },
      { title: "单位地址", dataIndex: "address", key: "address" },
      {
        title: "操作",
        dataIndex: "key",
        key: "key",
        render: (text, row) => {
          return (
            <div>
              <a
                onClick={() => {
                  Region.operation(1, text);
                }}
                className="all-a"
                href={null}
              >
                编辑
              </a>
              <Divider
                style={{ background: "rgb(0, 160, 233)" }}
                type="vertical"
              />
              <a
                onClick={() => {
                  Region.operation(2, text, row);
                }}
                className="all-a"
                href={null}
              >
                删除
              </a>
            </div>
          );
        }
      }
    ];
  } else if (Region.type === "school_academic_building") {
    columns = [
      {
        title: "学校名称",
        dataIndex: "schoolname",
        key: "schoolname"
      },
      { title: "教学楼", dataIndex: "buildname", key: "buildname" },
      { title: "教室号", dataIndex: "name", key: "name" },
      {
        title: "教室类型",
        dataIndex: "roomtypename",
        key: "roomtypename"
      },
      {
        title: "操作",
        dataIndex: "key",
        key: "key",
        render: (text, row) => {
          return (
            <div>
              <a
                onClick={Region.operationClass.bind(this, 1, row)}
                className="all-a"
                href={null}
              >
                编辑
              </a>
              <Divider
                style={{ background: "rgb(0, 160, 233)" }}
                type="vertical"
              />
              <a
                onClick={Region.operationClass.bind(this, 2, row)}
                className="all-a"
                href={null}
              >
                删除
              </a>
            </div>
          );
        }
      }
    ];
  }
});
@inject("Region")
@observer
class City extends Component {
  render() {
    const { data } = this.props.Region;
    console.log(toJS(data));
    return (
      <div className="city">
        <div className="city-table">
          <Table
            pagination={false}
            dataSource={toJS(data)}
            bordered
            className="device-tables-table"
            rowClassName="device-tables-tableRow"
            columns={columns}
          />
        </div>
      </div>
    );
  }
}
export default City;
