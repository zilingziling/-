import React, { Component, useEffect, useState } from "react";
import {Button, message, Radio} from "antd";
import "./index.less";
import NotTable from "./components/notTable";
import AlreadyTable from "./components/alreadyTable";
import {complete, getDatas, ope} from "../../api/faultR";
import OpeModal from "./components/opeModal";
const FaultRegister = () => {
  const [clicked, setClick] = useState(0);
  const onSelectType = e => {
      if(e.target.value===0){
          setNotCur(1)
      }else setArdCur(1)
    setClick(e.target.value);
  };
  const [notData, setNot] = useState([]);
    const [notCur, setNotCur] = useState(1);
    const [notTotal, setNotTotal] = useState("");
    const [notSize, setNotSize] = useState(10);
  const [already, setAlready] = useState([]);
    const [ardCur, setArdCur] = useState(1);
    const [ardTotal, setArdTotal] = useState("");
    const [ardSize, setArdSize] = useState(10);

    const[notAllP,setNotAll]=useState('')
    const[ardAllP,setArdAll]=useState('')

    const[addV,setAddV]=useState(false)
    const[title,setTitle]=useState("")

    const[editInfo,setEditInfo]=useState({})

    const [selectedRowKeys,setKeys]=useState([])

    const ardInit=()=>{
        getDatas({
            handlestatus:1,
            pageSize:ardSize,
            pageNo:ardCur,
        }).then(r => {
            if (r.code === 200) {
                setAlready(r.data.rows);
                setArdTotal(r.data.total)
                setArdAll(r.data.pageTotalNum)
            }
        });
    }
    const notInit=()=>{
        getDatas({
            handlestatus:0,
            pageSize:notSize,
            pageNo:notCur
        }).then(r => {
            if (r.code === 200) {
                setNot(r.data.rows);
                setNotTotal(r.data.total)
                setNotAll(r.data.pageTotalNum)
            }
        });
    }
  useEffect(() => {
    //  已处理
    if (clicked === 1) {
      ardInit()
    //   未处理
    }else if(clicked === 0){
        notInit()
    }
  }, [clicked,notCur,ardCur]);
    const notPagination={
      total:notTotal,
        pageSize:notSize,
        current:notCur,
        showQuickJumper:true,
        showTotal:()=><p className="totalData">共<span> {notAllP} </span>页/<span> {notTotal} </span>条数据</p>
    }
    const ardPagination={
        total:ardTotal,
        pageSize:ardSize,
        current:ardCur,
        showQuickJumper:true,
        showTotal:()=><p className="totalData">共<span> {ardAllP} </span>页/<span> {ardTotal} 条数据</span></p>
    }
    // props
    const notProps={
        notData,notPagination,notCur,setNotCur,setEditInfo,title,setAddV,setTitle,selectedRowKeys,setKeys
    }
    const alreadyProps={
        already,ardPagination,ardCur,setArdCur
    }
    const handleAdd=()=>{
        setEditInfo({})
        setAddV(true)
        setTitle("新增")
    }

    const handleOk=(values,resetFields,setBrand,setClassroomId)=>{
        const handleResult=r=>{
            if(r.code===200){
                window._guider.Utils.alert({
                    message: r.msg,
                    type: "success"
                });
                notInit()
                resetFields()
                setBrand({})
                setClassroomId("")
                setAddV(false)
                setEditInfo({})
                setKeys([])
            }else {
                window._guider.Utils.alert({
                    message: r.msg,
                    type: "error"
                });
            }
        }
        for(let key in values){
            if(!values[key]){
                delete values[key]
            }
        }
        if(title.includes("处理完成")){
            if(selectedRowKeys.length===0){
                message.info("你还未选择！")
            }else {
                complete({remarks: values.remarks,handler:values.handler,id:selectedRowKeys}).then(r=>handleResult(r))
            }
        }else {
            let params={}
            if(title.includes("新增")){
                params={...values,isHandle:0}
            }else if(title.includes("编辑")){
                params={...values,isHandle:0,id:editInfo.id}
            }
            ope(params).then(r=>handleResult(r))
        }
    }
    const handleDown=()=>{
        setEditInfo({})
        setAddV(true)
        setTitle("处理完成")
    }
    const addModalProps={
        addV,title,setAddV,handleOk,editInfo,setEditInfo
    }
  return (
    <div className="faultWrap">
        <OpeModal {...addModalProps}/>
      <div className="topBtn">
        <Button type="primary" icon="plus-circle" onClick={handleAdd} disabled={clicked === 1}>
          新增记录
        </Button>
        <Button type="primary" onClick={handleDown} icon="check-circle" disabled={clicked === 1}>
          处理完成
        </Button>
      </div>
      <div className="tableContent">
        <Radio.Group onChange={onSelectType} defaultValue={0}>
          <Radio.Button value={0}>未处理</Radio.Button>
          <Radio.Button value={1}>已处理</Radio.Button>
        </Radio.Group>
        {clicked === 1 ?
          <AlreadyTable {...alreadyProps}/>
         :
          <NotTable {...notProps}/>
        }
      </div>
    </div>
  );
};

export default FaultRegister;
