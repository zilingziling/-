import React, {useEffect, useState} from "react";
import {Form, Input, Modal, Select,DatePicker } from 'antd'
import {getBrand, getBuildings, getClassroom, getEquip, getPersons} from "../../../api/faultR";
import moment from "moment";
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const FormItem=Form.Item
const OpeModal=({title,setAddV,editInfo, addV,handleOk,setEditInfo,form:{getFieldDecorator,validateFields,resetFields}})=>{
    const [building,setBuilding]=useState([])
    const [classroom,setClassroom]=useState([])
    const [equip,setEquip]=useState([])
    const [equipId,setEquipId]=useState("")
    const [classroomId,setClassroomId]=useState("")
    const [brand,setBrand]=useState({})
    const [persons,setPersons]=useState([])
    const [id,setId]=useState("")
    useEffect(()=>{
        if(Object.keys(editInfo).length>0){
            setBrand(editInfo)
            setId(editInfo.id)
            reqClassroom(editInfo.schoolId)
            reqEquip(editInfo.classroomId)
        }
    },[editInfo])
    useEffect(()=>{
        getBuildings().then(r=>{
            if(r.data){
               setBuilding(r.data)
            }
        })
        getPersons().then(r=>{
            if(r.data){
                setPersons(r.data)
            }
        })
    },[])
    const handleCancel=()=>{
        setAddV(false)
        setAddV(false)
        setBrand({})
        resetFields()
    }
    const onselectBuilding=v=>{
        reqClassroom(v)
    }
    const reqClassroom=v=>{
        getClassroom(v).then(r=>{
            if(r.data){
                setClassroom(r.data)
            }
        })
    }
    const reqEquip=(v)=>{
        getEquip(v).then(r=>{
            if(r.data){
                let a=r.data
                a.push({
                    equipClassroom:-1,
                    equip_name:"其他"
                })
                setEquip(r.data)
            }
        })
    }
    const onselectClassroom=v=>{
        setClassroomId(v)
        reqEquip(v)
    }
    const onselectEquip=v=>{
        setEquipId(v)
        getBrand(v).then(r=>{
            if(r.data){
                setBrand(r.data)
            }else setBrand({})
        })
    }
    const onOk=()=>{
        validateFields((errors, values) => {
            if(!errors){
                let a=values
                delete  a.school
                delete a.classroom
                a.classroomId=classroomId
                handleOk(a,resetFields,setBrand,setClassroomId)
            }
        });
    }
    return (
        <Modal onOk={onOk} onCancel={handleCancel} title={title} visible={addV} width={600}>
            <Form {...formItemLayout}>
                {
                    title&&title.includes("处理完成")?
                        <FormItem label="处理人">
                        {
                            getFieldDecorator("handler",{
                            })(
                                <Select style={{width:300}} >
                                    {
                                        persons.map(person=><Select.Option key={person.userId} value={person.userId}>{person.name}</Select.Option>)
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                        :
                        <>
                        <FormItem label="故障位置">
                            {
                                getFieldDecorator("school",{
                                    rules:[{
                                        required:true,
                                        message:"请选择故障位置！"
                                    }]
                                })(
                                    <Select style={{width:300}} onSelect={onselectBuilding}>
                                        {
                                            building.map(building=><Select.Option key={building.id} value={building.id}>{building.name}</Select.Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="故障教室">
                {
                    getFieldDecorator("classroom",{
                    rules:[{
                    required:true,
                    message:"请选择故障教室！"
                }]
                })(
                    <Select style={{width:300}}  onSelect={onselectClassroom}>
                    {
                        classroom.map(classroom=><Select.Option key={classroom.id} value={classroom.id}>{classroom.name}</Select.Option>)
                    }
                    </Select>
                    )
                }
                    </FormItem>
                    <FormItem label="故障设备">
                    {
                    getFieldDecorator("equipClassroom",{
                    rules:[{
                    required:true,
                    message:"请选择故障设备！"
                    }]
                    })(
                    <Select style={{width:300}}  onSelect={onselectEquip}>
                    {
                    equip.map(equip=><Select.Option key={equip.equipClassroom} value={equip.equipClassroom}>{equip.equip_name}</Select.Option>)
                    }
                    </Select>
                    )
                    }
                    </FormItem>
                    <FormItem label="设备品牌">
                    <Input value={brand.brand||""} style={{width:300}} readOnly/>
                    </FormItem>
                    <FormItem label="设备型号">
                    <Input value={brand.equip_model||brand.model||""} style={{width:300}} readOnly/>
                    </FormItem>
                    <FormItem label="故障原因">
                    {
                    getFieldDecorator("reason",{
                    rules:[{
                    required:true,
                    message:"请输入故障原因！"
                    }]
                    })(
                    <Input style={{width:300}} placeholder="请输入故障原因！"/>
                    )
                    }
                    </FormItem>
                    <FormItem label="维修人">
                    {
                    getFieldDecorator("repairUserId",{
                    })(
                    <Select style={{width:300}} >
                    {
                    persons.map(person=><Select.Option key={person.userId} value={person.userId}>{person.name}</Select.Option>)
                    }
                    </Select>
                    )
                    }
                    </FormItem>
                    <FormItem label="维修时间">
                    {
                    getFieldDecorator("handleTime",{
                    rules:[{
                    required:true,
                    message:"请选择维修时间！"
                    }]
                    })(
                    <DatePicker  style={{width:300}} placeholder="请选择维修时间！"/>
                    )
                    }
                    </FormItem>
                        </>
                }

                <FormItem label="备注">
                    {
                        getFieldDecorator("remarks",{

                        })(
                            <Input.TextArea style={{width:300}} placeholder="请输入备注！"/>
                        )
                    }
                </FormItem>
            </Form>
        </Modal>
    )
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            school: Form.createFormField({
                value: props.editInfo.schoolId,
            }),
            classroom: Form.createFormField({
                value: props.editInfo.classroomId,
            }),
            reason: Form.createFormField({
                value: props.editInfo.reason,
            }),
            repairUserId: Form.createFormField({
                value: props.editInfo.repairUserId,
            }),
            handler: Form.createFormField({
                value: props.editInfo.handlerId,
            }),
            equipClassroom: Form.createFormField({
                value: props.editInfo.equipClassroom,
            }),
            handleTime: Form.createFormField({
                value: props.editInfo.handletime&&moment(props.editInfo.handletime),
            }),
            remarks: Form.createFormField({
                value: props.editInfo.remarks,
            }),
        };
    },
})(OpeModal)
