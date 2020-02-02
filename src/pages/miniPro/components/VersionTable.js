import React from "react";
import { Table, Divider, Popconfirm } from "antd";
import { del } from "../../../api/miniPro";

const VersionTable = ({ setInfo, setT, setV, list, initData }) => {
  const handleEdit = info => {
    setT("编辑");
    setInfo(info);
    setV(true);
  };
  const column = [
    {
      title: "ID",
      width: 150,
      dataIndex: "id"
    },
    {
      title: "字段名",
      width: 300,
      dataIndex: "fieldName"
    },
    {
      title: "审核时名",
      width: 300,
      dataIndex: "examineName"
    },
    {
      title: "发布名称",
      width: 300,
      dataIndex: "releaseName"
    },
    {
      title: "操作",
      width: 300,
      render: (t, r) => {
        return (
          <>
            <a href={null} onClick={() => handleEdit(r)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除吗？" onConfirm={() => handleDel(r)}>
              <a href={null}>删除</a>
            </Popconfirm>
          </>
        );
      }
    }
  ];
  const handleDel = r => {
    del(r.id).then(res => {
      if (res.code === 200) {
        initData();
        window._guider.Utils.alert({
          message: res.msg,
          type: "success"
        });
      }
    });
  };
  return (
    <Table
      dataSource={list}
      columns={column}
      pagination={false}
      className="table"
      rowKey="id"
      rowClassName="device-tables-tableRow"
    />
  );
};
export default VersionTable;
