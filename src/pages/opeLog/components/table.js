import React, { useEffect, useState } from "react";
import { Table } from "antd";
import OpeLog from "../../../stores/opeLog";
import { toJS } from "mobx";
import { opeLog } from "../../../api/help";
const column = [
  {
    title: "时间",
    dataIndex: "operatetime",
    width: 300
  },
  {
    title: "用户",
    dataIndex: "username",
    width: 300
  },
  {
    title: "IP",
    dataIndex: "ip",
    width: 300
  },

  {
    title: "操作结果",
    dataIndex: "operateresult",
    width: 300
  },
  {
    title: "操作类型",
    dataIndex: "operatetype"
  }
];
const Content = ({ search, pageNo, setCurrent }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [pageSize, setPage] = useState(10);
  useEffect(() => {
    const list = async () => {
      let r = await opeLog({
        pageSize: pageSize,
        pageNo: pageNo,
        ...search
      });
      if (r.code === 200) {
        setData(r.data.rows);
        setTotal(r.data.total);
      }
    };
    list();
  }, [pageSize, pageNo, search]);
  const pagination = {
    total,
    pageSize,
    current: pageNo
  };
  const onChange = p => {
    setCurrent(p.current);
    setPage(p.pageSize);
  };
  return (
    <Table
      columns={column}
      pagination={pagination}
      dataSource={data}
      onChange={onChange}
      className="table"
      rowKey="id"
      rowClassName="device-tables-tableRow"
    />
  );
};
export default Content;
