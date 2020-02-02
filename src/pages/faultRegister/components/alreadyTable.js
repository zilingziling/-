import React, {useState} from "react";
import {Table} from "antd";

const columns=[
    {
        title:"故障位置",
        dataIndex: "name"
    },
    {
        title:"记录时间",
        dataIndex: "eventtime"
    },
    {
        title:"故障设备",
        dataIndex: "equipTypeName"
    },
    {
        title:"故障原因",
        dataIndex: "reason"
    },
    {
        title:"设备品牌",
        dataIndex: "brand"
    },
    {
        title:"设备型号",
        dataIndex: "model"
    },
    {
        title:"维修人员",
        dataIndex: "repairUser"
    },
    {
        title:"维修完成时间",
        dataIndex: "handletime"
    },{
        title:"备注",
        dataIndex: "remarks"
    },{
        title:"操作",
        render:text=><a className='all-a'>删除</a>
    },
]
const AlreadyTable=({already,ardPagination,ardCur,setArdCur})=>{
    const [selectedRowKeys,setKeys]=useState([])
    const onSelectChange = selectedRowKeys => {
        setKeys(selectedRowKeys)
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const handleTableChange=(pagination)=>{
        setArdCur(pagination.current)
    }
    return (
        <Table
            rowSelection={rowSelection}
            rowKey="id"
            onChange={handleTableChange}
            pagination={ardPagination}
            dataSource={already} columns={columns}/>
    )
}
export default AlreadyTable
