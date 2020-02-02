import React, {useState} from "react";
import { Table } from "antd";



const NotTable = ({ notData ,notPagination,setTitle,setNotCur,setEditInfo,selectedRowKeys,setKeys,setAddV}) => {
  const handleTableChange=(pagination)=>{
    setNotCur(pagination.current)
  }
  const onSelectChange = selectedRowKeys => {
    setKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
const onEdit=(record)=>{
    setTitle("编辑")
    setEditInfo(record)
    setAddV(true)
}
  const columns = [
    {
      title: "故障位置",
      dataIndex: "name"
    },
    {
      title: "记录时间",
      dataIndex: "handletime"
    },
    {
      title: "故障设备",
      dataIndex: "equipTypeName"
    },
    {
      title: "故障原因",
      dataIndex: "reason"
    },
    {
      title: "设备品牌",
      dataIndex: "brand"
    },
    {
      title: "设备型号",
      dataIndex: "model"
    },
    {
      title: "备注",
      dataIndex: "remarks"
    },
    {
      title: "操作",
      render: (text,record) => <a className="all-a" onClick={()=>onEdit(record)}>修改</a>
    }
  ];
  return <Table rowSelection={rowSelection} onChange={handleTableChange} rowKey="id" pagination={notPagination} dataSource={notData} columns={columns} />;
};
export default NotTable;
