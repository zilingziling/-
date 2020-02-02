/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Component } from "react";
import { observable, toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { Form, Input, Select, Row, Button } from "antd";
import Api from "../../api";
import "./region.scss";
import City from "./component/city"; //市教育 区教育 学校 教学楼 教室
import Paginations from "../component/Paginations/Paginations";
import SchoolBar from "../component/Bar/schoolBar";
import { Models } from "../component/Model/model";
import { checkBe } from "../component/function/formatDateReturn";
import { schoolList } from "../../api/device";
const FormItem = Form.Item;
const Option = Select.Option;
@inject("Region", "DeviceState", "Police", "DeviceDetection")
@observer
class Region extends Component {
  componentDidMount() {
    if (toJS(this.props.Region.treeData.length) === 0) {
      this.props.Region.TreeList();
      this.props.Region.seleList(); //所属类型
      this.props.Region.schoolTypeData(); //学校类型
      this.props.Region.administrative(); //学校区域
      this.props.Region.classrommType(); //教室类型
    }
    //缓存数据
    let id = window.localStorage.getItem("SelectRegion");
    let type = window.localStorage.getItem("regionType"); //类型
    let Title = window.localStorage.getItem("regionTitle"); //教学楼名字
    let TreeId = window.localStorage.getItem("regionTeachingId");
    if (id) {
      this.props.Region.type = type;
      if (type !== "school_academic_building") {
        this.props.Region.list(id, 1);
      } else if (type === "school_academic_building") {
        this.props.Region.classRommList(id, 1);
      }
      this.props.Region.teachingBuilding = Title;
      this.props.Region.treeID = TreeId;
    }
  }
  render() {
    const { current, total, visible, title, type } = this.props.Region;
    return (
      <div className="region">
        <SchoolBar Selevalue={this.selectType} />
        <div className="region-Table">
          {type && (
            <Button
              onClick={this.props.Region._add}
              className="all-btn"
              type="primary"
            >
              新增
            </Button>
          )}
          {type && <City type={type} />}
          {total !== null && (
            <Paginations paging={this.paging} current={current} total={total} />
          )}
        </div>
        <Models
          handleOk={this.handleOk}
          onCancel={this.props.Region._clear}
          visible={visible}
          title={title}
          width={1000}
        >
          <TablsInfoForm ref="infos" />
        </Models>
      </div>
    );
  }

  //选中trees树形菜单，后发送数据
  selectType = async (e, node) => {
    this.props.Region.treeID = e; //获取当前ID
    this.props.Region.current = 1; //初始化
    this.props.Region.total = null;
    this.props.Region.type = node.dataRef.code; //初始化
    // window.localStorage.setItem("regionType", node.dataRef.code); //treeTitle
    window.localStorage.setItem("regionTeachingId", e); //treeId
    //教学楼
    this.props.Region.teachingBuilding = node.dataRef.title;
    window.localStorage.setItem("regionTitle", node.dataRef.title);
    if (node.dataRef.code !== "school_academic_building") {
      this.props.Region.list(e, 1);
    } else if (node.dataRef.code === "school_academic_building") {
      this.props.Region.classRommList(e, 1);
    }
  };
  //分页
  paging = e => {
    this.props.Region.current = e;
    if (this.props.Region.type !== "school_academic_building") {
      this.props.Region.list(this.props.Region.treeID, e);
    } else if (this.props.Region.type === "school_academic_building") {
      this.props.Region.classRommList(this.props.Region.treeID, e);
    }
  };
  //添加编辑
  handleOk = () => {
    let res = this.refs.infos;
    try {
      res.validateFields(async (err, val) => {
        if (!err) {
          //市区
          console.log(this.props.Region.type);
          if (this.props.Region.type !== "school_academic_building") {
            if (val.first) {
              let first = val.first;
              let second = val.second;
              let third = val.third;
              if (first !== "" && second !== "" && third !== "") {
                val["region.region"] = third;
              } else if (first !== "" && second !== "" && third === "") {
                val["region.region"] = second;
              } else if (first !== "" && second === "" && third === "") {
                val["region.region"] = first;
              }
              delete val.first;
              delete val.second;
              delete val.third;
            }
            val["parent.id"] = this.props.Region.treeID;
            if (typeof toJS(this.props.Region.FormValue.id) !== "undefined") {
              val["id"] = toJS(this.props.Region.FormValue.id);
            }
            let param = JSON.parse(
              JSON.stringify(val).replace(/type/g, "type.id")
            );
            let obj = JSON.parse(
              JSON.stringify(param).replace(/schoolType/g, "schoolType.id")
            );
            let suc = await Api.setUp._save(checkBe(obj));
            if (suc.code === 200) {
              window._guider.Utils.alert({
                message: suc.msg,
                type: "success"
              });
              this.props.Region._clear();
              this.props.Region.newDataSource();
              //   设备状态
              await this.props.DeviceState.schoolList();
              await this.props.Police.list(0, 1);
              let classid = window.localStorage.getItem(
                "devicesStateClassroomid"
              );
              if (classid !== null) {
                await this.props.DeviceDetection.list(classid, 1);
              }
            } else {
              window._guider.Utils.alert({
                message: suc.msg,
                type: "error"
              });
            }
          } else if (this.props.Region.type === "school_academic_building") {
            //教室
            console.log(toJS(this.props.Region.treeID));
            let param = JSON.parse(
              JSON.stringify(val).replace(/type/g, "type.id")
            );
            param["school.id"] = this.props.Region.treeID;
            if (JSON.stringify(this.props.Region.classrommInfo) !== "{}") {
              param["id"] = this.props.Region.classrommInfo.id;
            }
            let res = await Api.setUp.save_classroom(param);
            if (res.code === 200) {
              window._guider.Utils.alert({
                message: res.msg,
                type: "success"
              });
              this.props.Region._clear();
              this.props.Region.newClassRoomList();
              await this.props.DeviceState.schoolList();
              await this.props.Police.list(0, 1);
              let classid = window.localStorage.getItem(
                "devicesStateClassroomid"
              );
              if (classid !== null) {
                await this.props.DeviceDetection.list(classid, 1);
              }
            } else {
              window._guider.Utils.alert({
                message: res.msg,
                type: "error"
              });
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export default Region;

const formItemLayout = {
  labelCol: {
    xs: { span: 28 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 28 },
    sm: { span: 8 }
  }
};

export const TablsInfoForm = Form.create()(
  @inject("Region")
  @observer
  // eslint-disable-next-line indent
  class extends Component {
    @observable valData = [];
    @observable sonData = [];
    async componentDidMount() {
      if (this.props.Region.FormValue.region1) {
        let res = await Api.setUp.get_level_by_parent(
          this.props.Region.FormValue.region1
        );
        let data = await Api.setUp.get_level_by_parent(
          this.props.Region.FormValue.region2
        );
        if (res.code === 200) {
          this.valData = res.data;
          this.sonData = data.data;
        }
      }
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      const {
        TypeData,
        administrativelList,
        schoolType,
        FormValue,
        mark,
        markName,
        teachingBuilding,
        type,
        classroom_typeData,
        classrommInfo
      } = this.props.Region;
      return (
        <Form className onSubmit={this.handleSubmit}>
          {type !== "school_academic_building" && (
            <FormItem {...formItemLayout} label="所属类型" className="tiems">
              {getFieldDecorator("type", {
                rules: [{ required: true, message: "请选择所属类型" }],
                initialValue: FormValue.typeid
              })(
                <Select
                  onChange={this._Change}
                  placeholder="请选择所属类型"
                  className="regionInput"
                >
                  {TypeData.map(foramView)}
                </Select>
              )}
            </FormItem>
          )}
          {markName !== null && (
            <FormItem
              className="tiems"
              {...formItemLayout}
              label={`${markName}名称`}
            >
              {getFieldDecorator("name", {
                rules: [{ required: true, message: `请填写${markName}` }],
                initialValue: FormValue.name
              })(
                <Input
                  placeholder={`请输入${markName}名称`}
                  className="regionInput"
                />
              )}
            </FormItem>
          )}
          {mark === "school" && (
            <div>
              <FormItem className="tiems" {...formItemLayout} label="学校类型">
                {getFieldDecorator("schoolType", {
                  rules: [{ required: true, message: "请选择学校类型" }],
                  initialValue: FormValue.schooltype
                })(
                  <Select className="regionInput" placeholder="请选择学校类型">
                    {toJS(schoolType).map(foramView)}
                  </Select>
                )}
              </FormItem>
              <FormItem className="tiems" {...formItemLayout} label="负责人">
                {getFieldDecorator("charge", {
                  rules: [{ required: true, message: "请填写负责人" }],
                  initialValue: FormValue.charge
                })(
                  <Input
                    maxLength={20}
                    placeholder="请输入负责人"
                    className="regionInput"
                  />
                )}
              </FormItem>
              <FormItem className="tiems" {...formItemLayout} label="联系电话">
                {getFieldDecorator("phone", {
                  rules: [
                    {
                      required: true,
                      message: "请填写联系电话",
                      pattern: new RegExp(/^[1-9]\d*$/, "g")
                    },
                    { validator: this.checkAccount }
                  ],
                  initialValue: FormValue.phone,
                  getValueFromEvent: event => {
                    return event.target.value.replace(/\D/g, "");
                  }
                })(
                  <Input
                    maxLength={11}
                    placeholder="请输入联系电话"
                    className="regionInput"
                  />
                )}
              </FormItem>
              <FormItem className="tiems" {...formItemLayout} label="单位地址">
                {getFieldDecorator("address", {
                  initialValue: FormValue.address
                })(
                  <Input
                    maxLength={30}
                    placeholder="请输入单位地址"
                    className="regionInput"
                  />
                )}
              </FormItem>
              <FormItem className="tiems" {...formItemLayout} label="电子邮箱">
                {getFieldDecorator("email", {
                  initialValue: FormValue.email
                })(
                  <Input
                    maxLength={30}
                    placeholder="请输入电子邮箱"
                    className="regionInput"
                  />
                )}
              </FormItem>
              <FormItem className="tiems" {...formItemLayout} label="传真电话">
                {getFieldDecorator("fax", {
                  initialValue: FormValue.fax
                })(
                  <Input
                    maxLength={30}
                    placeholder="请输入传真电话"
                    className="regionInput"
                  />
                )}
              </FormItem>
            </div>
          )}
          {mark === "school" && (
            <Row type={"flex"} className="row-select-all">
              <FormItem className="xzrow" label="行政区域">
                {getFieldDecorator("first", {
                  initialValue: FormValue.region1
                })(
                  <Select
                    onChange={e => {
                      this.firstChange(e, 1);
                    }}
                    style={{ width: 138 }}
                    placeholder="请选择行政区域"
                  >
                    <Option value="">全部</Option>
                    {toJS(administrativelList).map(foramSele)}
                  </Select>
                )}
              </FormItem>

              <FormItem className="tiems">
                {getFieldDecorator("second", {
                  initialValue: FormValue.region2
                })(
                  <Select
                    onChange={e => {
                      this.firstChange(e, 2);
                    }}
                    style={{ width: 100 }}
                    placeholder="请选择"
                  >
                    <Option value="">全部</Option>
                    {toJS(this.valData).map(foramSele)}
                  </Select>
                )}
              </FormItem>

              <FormItem className="tiems">
                {getFieldDecorator("third", {
                  initialValue: FormValue.region3
                })(
                  <Select style={{ width: 100 }} placeholder="请选择">
                    <Option value="">全部</Option>
                    {toJS(this.sonData).map(foramSele)}
                  </Select>
                )}
              </FormItem>
            </Row>
          )}
          {/* 教室添加or修改 */}
          {type === "school_academic_building" && (
            <div>
              <FormItem className="tiems" {...formItemLayout} label="教学楼">
                {getFieldDecorator("lo", {
                  initialValue: teachingBuilding
                })(<Input disabled className="regionInput" />)}
              </FormItem>
              <FormItem className="tiems" {...formItemLayout} label="教室号">
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "请填写教室号" }],
                  initialValue: classrommInfo.name
                })(
                  <Input
                    maxLength={20}
                    placeholder="请输入教室号"
                    className="regionInput"
                  />
                )}
              </FormItem>

              <FormItem className="tiems" {...formItemLayout} label="教室类型">
                {getFieldDecorator("type", {
                  rules: [{ required: true, message: "请选择教室类型" }],
                  initialValue: classrommInfo.typeid
                })(
                  <Select placeholder="请选择教室类型">
                    {classroom_typeData.map(foramView)}
                  </Select>
                )}
              </FormItem>
            </div>
          )}
        </Form>
      );
    }
    //请选择所属类型
    _Change = (e, row) => {
      this.props.Region.mark = row.props.code;
      this.props.Region.markName = row.props.children;
    };
    firstChange = async (e, mark) => {
      if (e) {
        let res = await Api.setUp.get_level_by_parent(e);
        if (res.code === 200) {
          if (res.data.length > 0) {
            if (mark === 1) {
              this.props.form.resetFields(["second", "third", []]);
              this.valData = res.data;
              this.sonData = [];
              this.props.Region.FormValue.region2 = "";
            } else if (mark === 2) {
              this.props.form.resetFields("third", [""]);
              this.sonData = res.data;
              this.props.Region.FormValue.region3 = "";
            }
          }
        }
      } else {
        this.props.form.resetFields("second", []);
        this.props.form.resetFields("third", []);
        this.valData = [];
        this.sonData = [];
      }
    };
    //电话
    checkAccount = (rule, value, callback) => {
      if (value) {
        if (value.length === 11) {
          callback();
        } else {
          callback("请输入11位数子的手机号码");
        }
      }
      //  callback
    };
  }
);
const foramView = (data, index) => {
  return (
    <Option code={data.code} value={data.id} key={index}>
      {data.name}
    </Option>
  );
};
const foramSele = (data, index) => {
  return (
    <Option value={data.region} key={index}>
      {data.name}
    </Option>
  );
};
