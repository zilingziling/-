/* eslint-disable indent */
// @flow
import React, { Component } from "react";
import {
  Button,
  Form,
  Table,
  Input,
  Select,
  TreeSelect,
  Modal,
  Radio,
  message
} from "antd";
import { BaseModel } from "../../component/Model/model";
import Search from "../../device/components/search";
import Api from "../../../api";
import Pagination from "../../component/Paginations/Paginations";
import Bars from "../../component/Bar/bar";
import { observable, toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { RegExpNmuber, validator } from "../../component/function/validation";
import { RouterPmi } from "../../component/function/routerPmi";

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

const { confirm } = Modal;
const deviceBtn = {
  marginLeft: "1.5rem",
  marginRight: "1rem"
};
const sceneBtn = {
  marginLeft: "1.5rem"
};
const { TextArea } = Input;
const formItemstyles = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 28 },
    sm: { span: 10 }
  }
};
const formitems = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 28 },
    sm: { span: 14 }
  }
};
const inputWidth = {
  width: "16rem",
  borderRadius: "4px"
};
type Props = {
  match: Object,
  history: Object,
  location: Object,
  shcool: String,
  classroomId: number,
  linkInfo: any
};
type State = {};

@inject("DeviceState")
@observer
export default class DeviceHeade extends Component<Props, State> {
  state = {
    title: "",
    visible: false,
    classinfo: null,
    Submit: null,
    ctrschoolId: null,
    mark: null, //model控制显示那个
    cpData: null, //复制数据
    _info: [],
    chooseVisible: false,
    disabled: false
  };

  componentDidMount() {
    this.setState({
      _info: RouterPmi()
    });
  }
  handleSave = () => {
    confirm({
      className: "modles",
      title: "保存配置需要重启中控才能生效，确定保存配置并重启中控？",
      centered: true,
      onOk: async () => {
        let select = window.localStorage.getItem("classroomid");
        if (!select) {
          return;
        }
        try {
          let res = await Api.Ctrl.res_central_ctrl(select);
          if (res.code === 200) {
            window._guider.Utils.alert({
              message: res.msg,
              type: "success"
            });
          } else {
            window._guider.Utils.alert({
              message: res.msg,
              type: "error"
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      onCancel: () => {}
    });
  };
  onSelectCopyClass = (e, label, extra) => {
    if (e.includes("classroom")) {
      this.setState({ cpData: extra.triggerNode.props.row.id, disabled: true });
    } else {
      this.setState({
        disabled:false
      })
      message.error("请选择到教室层级！");
    }
  };
  render() {
    const { title, visible, mark } = this.state;
    return (
      <div className="deviceadd-body-headers">
        <div className="deviceadd-body-headers-seve">
          {/*<Button*/}
          {/*  // disabled={!this.state._info.includes("restart_device")}*/}
          {/*  className="deviceadd-body-headers-add-btns"*/}
          {/*  onClick={this.handleSave}*/}
          {/*>*/}
          {/*  保存配置*/}
          {/*</Button>*/}
          <Button
            type="primary"
            onClick={this._Links}
            className="deviceadd-body-headers-seve-btn"
            style={deviceBtn}
          >
            设备控制
          </Button>
        </div>
        <div className="deviceadd-body-headers-add">
          <Button
            disabled={!this.state._info.includes("add_device")}
            onClick={this.ofs}
            type="primary"
            className="deviceadd-body-headers-add-btn"
          >
            添加设备
          </Button>
          {/* <span className='deviceadd-body-headers-add-span'>批量导入</span> */}
          {/*<Button*/}
          {/*  type="primary"*/}
          {/*  onClick={this.scenario}*/}
          {/*  className="deviceadd-body-headers-seve-btn"*/}
          {/*  style={sceneBtn}*/}
          {/*>*/}
          {/*  情景编辑*/}
          {/*</Button>*/}
          <Button
            disabled={!this.state._info.includes("Copy_data")}
            onClick={this._cydata}
            type="primary"
            className="deviceadd-body-headers-add-btns"
          >
            拷贝数据
          </Button>
          {/*<span className='deviceadd-body-headers-add-span'>{title}</span>*/}
        </div>
        {mark === 1 ? (
          <BaseModel
            width={1000}
            title="新增设备"
            visible={visible}
            onCancel={this.onCancel}
          >
            <div>
              <AddInfo
                visible={this.state.chooseVisible}
                mapData={toJS(this.props.DeviceState.dictionaryList)}
                ref="inofs"
                itmeid={(v, data) => {
                  this.setState({ classinfo: v, Submit: data });
                }}
                setVisible={visible =>
                  this.setState({ chooseVisible: visible })
                }
                setOuterVisible={() => this.setState({ visible: false })}
              />
              <div style={{ textAlign: "center" }}>
                <Button type="primary" className="btns" onClick={this.handleOk}>
                  保存设备
                </Button>
              </div>
            </div>
          </BaseModel>
        ) : (
          <BaseModel
            width={1000}
            title="拷贝数据"
            visible={visible}
            onCancel={this.onCancel}
          >
            <div className="select_cy">
              <div className="select_cy-row">
                <span className="select_cy-row-span">选择教室：</span>
                <TreeSelect
                  onChange={this.onSelectCopyClass}
                  className="select_cy-row-select"
                  treeData={toJS(this.props.DeviceState.classRoomListSelect)}
                  placeholder="请选择你要复制配置数据的教室"
                />
              </div>
              <div className="select_cy-toRow">
                <Button
                  type="primary"
                  className="btns"
                  disabled={!this.state.disabled}
                  onClick={this.cpDataSeve}
                >
                  保存
                </Button>
              </div>
            </div>
          </BaseModel>
        )}
      </div>
    );
  }
  cpDataSeve = async () => {
    if (this.state.cpData !== null || this.props.classroomId !== null) {
      //
      try {
        let res = await Api.Device.CyData(
          this.props.classroomId,
          this.state.cpData
        );
        if (res.code === 200) {
          window._guider.Utils.alert({
            message: res.msg,
            type: "success"
          });
          this.setState({ visible: false, cpData: null });
          this.props.refreshList();
        } else {
          window._guider.Utils.alert({
            message: res.msg,
            type: "error"
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      window._guider.Utils.alert({
        message: "请选择教室",
        type: "warning"
      });
    }
  };
  //复制数据
  _cydata = () => {
    confirm({
      title: "复制其它教室数据会清空当前教室的数据",
      centered: true,
      onOk: () => {
        this.setState({
          mark: 2,
          visible: true
        });
      },
      onCancel() {}
    });
  };

  ofs = () => {
    if (typeof this.props.classroomId !== "undefined") {
      this.setState({ chooseVisible: true, mark: 1, visible: true });
    } else {
      window._guider.Utils.alert({
        message: "请选择教室在添加设备",
        type: "error"
      });
    }
  };
  // 设备控制
  _Links = () => {
    if (typeof this.props.classroomId !== "undefined") {
      window._guider.History.history.push({
        pathname: "/deviceForEletron",
        routerName: "/deviceAdd"
      });
    }
  };
  //情景编辑
  scenario = () => {
    if (typeof this.props.classroomId !== "undefined") {
      this.props.props.history.push({
        pathname: "/deviceScene",
        query: this.props.classroomId
      });
    } else {
      window._guider.Utils.alert({
        message: "请选择教室进行情景编辑",
        type: "error"
      });
    }
  };
  //保存
  handleOk = () => {
    let Submit = this.state.Submit;
    let array = [];
    if (this.state.classinfo !== null) {
      let devices = this.refs.inofs; //设备参数
      let classrommid = this.props.classroomId; //教室id
      let id = this.state.classinfo.key; // 设备ID
      let type = this.state.classinfo.equiptype; //设备类型
      let brandid = this.state.classinfo.equipbrand; //品牌ID

      devices.validateFields(async (err, val) => {
        if (!err) {
          delete val.equiptypeid;
          val["connectType"] = this.state.classinfo.connecttype;
          val["classroomId"] = classrommid;
          val["equipId"] = id;
          val["equiptypeid"] = type;
          val["equipName"] = val.equiptypename;
          val["brandid"] = brandid;
          val["schoolid"] = this.props.shcool;

          if (Submit.length > 0) {
            Submit.forEach((e, index) => {
              array.push({
                keyname: e.keyname,
                keyId: e.kId,
                id: "",
                equipId: e.eqpId !== null ? e.eqpId : "",
                controlCommand: e.ctrlCommand !== null ? e.ctrlCommand : "",
                equipRoomId: e.equipRoomId,
                ctrlNo: index
              });
            });
            val["codeList"] = JSON.stringify(array);
            console.log(val);
          }
          // var param = JSON.parse(JSON.stringify(val).replace(/connecttype/g, this.state.classinfo.connecttype));
          let res = await Api.Device.save_equip_room(val);
          if (res.code === 200) {
            window._guider.Utils.alert({
              message: res.msg,
              type: "success"
            });
            this.setState({
              visible: false,
              classinfo: null
            });
            this.props.refreshList(); //刷新列表
          } else {
            window._guider.Utils.alert({
              message: res.msg,
              type: "error"
            });
          }
        }
      });
    }
  };
  //退出
  onCancel = () => {
    this.setState({
      visible: false,
      cpData: null
    });
  };
}
const maskStyle = {
  backgroundColor: "#000000"
};
const AddInfo = Form.create()(
  @inject("DeviceState")
  @observer
  class extends Component<State> {
    state = {
      visible: false, //控制弹出框 显示
      current: 1, //当前页数
      data: [], //数据
      total: null, //总数
      columns: [
        { title: "设备类型", dataIndex: "equiptypename", key: "equiptypename" },
        { title: "品牌", dataIndex: "brandcnname", key: "brandcnname" },
        { title: "型号", dataIndex: "equipmodel", key: "equipmodel" },
        { title: "控制方式", dataIndex: "connname", key: "connname" },
        { title: "创建时间", dataIndex: "createtime", key: "createtime" }
        // { title: '添加人员', dataIndex: 'creator', key: 'creator' },
      ],
      type: "",
      brandType: "",
      deviceValue: "",
      itmeColor: null,
      itmeDAta: {},
      item: null,
      Address: "", //判断控获取通用设备的文本框显示
      brandTypeId: "",
      CommProt: [],
      connname: "" //控制方式 红外 端口 do
      // location:[],
    };
    componentDidMount() {
      this.list(1, "", "", "", "");
      // console.log(toJS(this.props.DeviceState.location));
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      const { itmeDAta, connname } = this.state;
      return (
        <Form className="row" onSubmit={this.handleSubmit}>
          <div>
            <BaseModel
              maskStyle={maskStyle}
              style={{ top: 20 }}
              width={1000}
              title="选择设备"
              visible={this.props.visible}
              handleOk={this.handleOk}
              onCancel={() => {
                this.props.setVisible(false);
                this.props.setOuterVisible();
              }}
            >
              {this.Device()}
            </BaseModel>
          </div>
          <FormItem
            className="row"
            style={{ display: "flex" }}
            {...formitems}
            label="设备类型"
          >
            {getFieldDecorator("equiptypeid", {
              initialValue: itmeDAta.equiptypename
            })(<Input disabled className="add-inputs" style={inputWidth} />)}
            <Button
              type="primary"
              className="row-btn"
              onClick={() => {
                this.setState({ visible: true });
                this.props.setVisible(true);
              }}
            >
              选择设备
            </Button>
          </FormItem>
          <FormItem className="row" {...formItemstyles} label="品牌">
            {getFieldDecorator("brandcnname", {
              initialValue: itmeDAta.brandcnname
            })(<Input disabled className="add-inputs" style={inputWidth} />)}
          </FormItem>
          <FormItem className="row" {...formItemstyles} label="型号">
            {getFieldDecorator("equipmodel", {
              initialValue: itmeDAta.equipmodel
            })(<Input disabled className="add-inputs" style={inputWidth} />)}
          </FormItem>
          <FormItem className="row" {...formItemstyles} label="设备名称">
            {getFieldDecorator("equiptypename", {
              initialValue:
                typeof itmeDAta.brandcnname !== "undefined"
                  ? typeof itmeDAta.equiptypename !== "undefined"
                    ? itmeDAta.brandcnname + itmeDAta.equiptypename
                    : null
                  : null
            })(<Input className="add-inputs" style={inputWidth} />)}
          </FormItem>

          {/* 可选输入框 */}
          {/* 电子科大 中控 不需要这个参数*/}
          {/*{itmeDAta.equiptype === "1" ? (*/}
          {/*  <div>*/}
          {/*    <FormItem className="row" {...formItemstyles} label="ID">*/}
          {/*      {getFieldDecorator("imeiNo", {*/}
          {/*        rules: [{ required: true, message: "请填写设备ID" }],*/}
          {/*        initialValue: itmeDAta.imei_no*/}
          {/*      })(<Input className="add-inputs" style={inputWidth} />)}*/}
          {/*    </FormItem>*/}
          {/*    <FormItem*/}
          {/*      className="tiemsAdd"*/}
          {/*      {...formItemstyles}*/}
          {/*      label="服务器IP"*/}
          {/*    >*/}
          {/*      {getFieldDecorator("serviceIp", {*/}
          {/*        initialValue: itmeDAta.serviceip*/}
          {/*      })(<Input className="add-inputs" style={inputWidth} />)}*/}
          {/*    </FormItem>*/}
          {/*  </div>*/}
          {/*) : null}*/}
          {itmeDAta.connname === "TCP" && (
            <FormItem className="row" {...formItemstyles} label="URL">
              {getFieldDecorator("centralContrlUrl", {
                // rules: [{ required: true, message: "请填写url" }],
                initialValue: itmeDAta.centralContrlUrl
              })(<Input className="add-inputs" style={inputWidth} />)}
            </FormItem>
          )}
          {/*itmeDAta.connname === "TCP" ||*/}
          { itmeDAta.connname === "UDP" ? (
            <div>
              <FormItem className="row" {...formItemstyles} label="地址格式">
                {getFieldDecorator("addrFormat", {
                  initialValue:
                    this.state.Address === null ? "通用" : this.state.Address
                })(
                  <Select
                    style={inputWidth}
                    className="row-select"
                    onChange={e => {
                      this.setState({ Address: e });
                    }}
                  >
                    <Option value="通用">通用</Option>
                    {/* <Option value="ONVIF">ONVIF</Option> */}
                    <Option value="RTSP">RTSP</Option>
                  </Select>
                )}
              </FormItem>
              {this.state.Address === "RTSP" ? (
                <FormItem className="row" {...formItemstyles} label="RTSP地址">
                  {getFieldDecorator("rtspAddr", {
                    // initialValue:
                  })(
                    <TextArea
                      style={inputWidth}
                      maxLength={250}
                      rows={4}
                      className="add-inputs"
                    />
                  )}
                </FormItem>
              ) : null}
            </div>
          ) : null}

          {/* 连接端口 */}

          {itmeDAta.connname !== "私有协议" &&
          (itmeDAta.connname === "RS232" ||
            itmeDAta.connname === "RS485" ||
            itmeDAta.connname === "DO") ? (
            <FormItem {...formItemstyles} label="连接口" className="row">
              {getFieldDecorator("mcPortNo", {
                rules: [{ required: true, message: "请选择连接口" }],
                initialValue: itmeDAta.mcPortNo
              })(
                <Select style={inputWidth} className="row-select">
                  {this.state.CommProt.map(MapDataFormatCommProt)}
                </Select>
              )}
            </FormItem>
          ) : null}
          {/* hdmi连接口 */}
          {itmeDAta.connname === "DO" && itmeDAta.equiptype === "4" ? (
            <FormItem {...formItemstyles} label="hdmi连接口" className="row">
              {getFieldDecorator("hdmiConn", {
                rules: [{ required: true, message: "请选择hdmi连接口" }],
                initialValue: itmeDAta.hdmiconn
              })(
                <Select style={inputWidth} className="row-select">
                  {toJS(this.props.DeviceState.hdmiconn).map(MapDataFormat)}
                </Select>
              )}
            </FormItem>
          ) : null}
          {/* 波特率、 数据位、停止位、校验*/}
          {itmeDAta.connname === "RS232" || itmeDAta.connname === "RS485" ? (
            <div>
              <FormItem {...formItemstyles} label="波特率" className="row">
                {getFieldDecorator("baudRate", {
                  rules: [{ required: true, message: "请选择波特率" }],
                  initialValue: itmeDAta.baudrate
                })(
                  <Select style={inputWidth} className="row-select">
                    {this.props.mapData.baud_rate.map(MapDataFormat)}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemstyles} label="数据位" className="row">
                {getFieldDecorator("dataBit", {
                  rules: [{ required: true, message: "请选择数据位" }],
                  initialValue: itmeDAta.databit
                })(
                  <Select style={inputWidth} className="row-select">
                    {this.props.mapData.data_bits.map(MapDataFormat)}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemstyles} label="停止位" className="row">
                {getFieldDecorator("stopBit", {
                  rules: [{ required: true, message: "请选择停止位" }],
                  initialValue: itmeDAta.stopbit
                })(
                  <Select style={inputWidth} className="row-select">
                    {this.props.mapData.stop_bits.map(MapDataFormat)}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemstyles} label="校验" className="row">
                {getFieldDecorator("checks", {
                  rules: [{ required: true, message: "请选择校验" }],
                  initialValue: itmeDAta.checkout
                })(
                  <Select style={inputWidth} className="row-select">
                    {this.props.mapData.checks.map(MapDataFormat)}
                  </Select>
                )}
              </FormItem>
            </div>
          ) : null}

          {/* IP地址  端口*/}
          {(itmeDAta.connname === "私有协议" && itmeDAta.equiptype === "1") ||
          (itmeDAta.connname === "私有协议" && itmeDAta.equiptype === "16") ||
          (itmeDAta.connname === "DO" && itmeDAta.equiptype === "4") ||
          itmeDAta.connname === "TCP" ||
          itmeDAta.connname === "UDP" ? (
            <div>
              <FormItem className="row" {...formItemstyles} label="IP">
                {getFieldDecorator("hostIp", {
                  rules: [
                    { required: true, message: "请填写IP" },
                    {
                      validator: this.ipValidator
                    }
                  ],
                  initialValue: null
                })(
                  <Input
                    style={inputWidth}
                    maxLength={15}
                    className="add-inputs"
                  />
                )}
              </FormItem>
              <FormItem className="row" {...formItemstyles} label="端口号">
                {getFieldDecorator("portNo", {
                  rules: [
                    {
                      required: true,
                      message: "请填写端口号",
                      pattern: new RegExp(/^[1-9]\d*$/, "g")
                    },
                    { validator: this.Proot }
                  ],
                  getValueFromEvent: event => {
                    return event.target.value.replace(/\D/g, "");
                  },
                  initialValue: itmeDAta.portno
                })(
                  <Input
                    style={inputWidth}
                    maxLength={5}
                    className="add-inputs"
                  />
                )}
              </FormItem>
            </div>
          ) : null}
          {/*用户名密码  */}
          {(itmeDAta.connname === "私有协议" && itmeDAta.equiptype === "16") ||
          (itmeDAta.connname === "DO" && itmeDAta.equiptype === "4") ||
          itmeDAta.connname === "TCP" ? (
            <div>
              <FormItem className="row" {...formItemstyles} label="用户名">
                {getFieldDecorator("username", {
                  initialValue: itmeDAta.user_name
                })(
                  <Input
                    maxLength={20}
                    className="add-inputs"
                    style={inputWidth}
                  />
                )}
              </FormItem>
              <FormItem className="row" {...formItemstyles} label="密码">
                {getFieldDecorator("password", {
                  initialValue: itmeDAta.pass_word
                })(
                  <Input
                    style={inputWidth}
                    maxLength={20}
                    type="password"
                    className="add-inputs"
                  />
                )}
              </FormItem>
            </div>
          ) : null}
          {itmeDAta.equiptype === "15" ? (
            <FormItem className="row" {...formItemstyles} label="摄像头位置">
              {getFieldDecorator("cameraType", {
                rules: [{ required: true, message: "请填摄像头位置" }]
              })(
                <Select style={inputWidth} className="row-select">
                  {toJS(this.props.DeviceState.location).map(MapDataFormat)}
                </Select>
              )}
            </FormItem>
          ) : null}
          {/* 连接方式暂时屏蔽 */}
          {/* <FormItem className="row heid"{...formItemstyles} label="连接方式">
					{getFieldDecorator('connectType', {
						initialValue: itmeDAta.connname

					})(
						<Input disabled className="add-inputs" />
					)}
				</FormItem> */}
        </Form>
      );
    }
    //端口
    Proot = (rule, value, callback) => {
      if (value != "") {
        if (isNaN(value) || value > 65535 || value < 0) {
          callback("请输入端口在(1-65535)范围之内");
        }
        callback();
      }
      callback();
    };
    //IP 验证
    ipValidator = (rule, value, callback) => {
      if (value !== "") {
        if (validator(value)) {
          callback();
        } else {
          callback("请输入ip地址列如：（192.13.313.13）");
        }
        callback();
      }
      callback();
    };
    //view Table
    Device = () => {
      return (
        <div>
          <Search
            style={{ marginLeft: 10, marginBottom: 20 }}
            searchInfo={this.searchData}
          />
          <Table
            // className={["device-tables-table","specialTable"].join(" ")}
            className="device-tables-table"
            rowClassName={record => {
              return this.state.itmeColor === record.key
                ? "device-tables-tableRows"
                : null; //device-tables-tableRow';
            }}
            columns={this.state.columns}
            dataSource={this.state.data}
            pagination={false}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  this.setState({ itmeColor: record.key, item: record });
                } // 点击行
              };
            }}
          />
          <Pagination
            current={this.state.current}
            total={this.state.total}
            paging={e => {
              this.list(
                e,
                this.state.type,
                this.state.brandType,
                this.state.deviceValue,
                this.state.brandTypeId
              );
              this.setState({ current: e });
            }}
          />
          <div className="clears"></div>
          <div className="textAlign">
            <Button onClick={this.foramData} type="primary" className="btns">
              选择完成
            </Button>
          </div>
        </div>
      );
    };
    //获取数据
    foramData = async () => {
      let indexName = ["视频", "OPS模块", "电脑", "中控模块", "摄像头"]; //这里输入名称判断，来控制通用设备
      if (this.state.itmeColor !== null) {
        let ComProt = await Api.Device.CommProt(this.state.item.connecttype);
        let res = await Api.Device.editor(this.state.itmeColor);
        let data = await Api.Device.dataCtr(
          this.state.item.equiptype,
          this.state.item.key
        );
        let mark =
          indexName.indexOf(res.data.equiptypename) == -1 ? "RTSP" : "通用";
        if (
          this.state.item.connecttype === "1" ||
          this.state.item.connecttype === "2"
        ) {
          try {
            // let res = await Api.Device.editor(this.state.itmeColor);
            // let data = await Api.Device.dataCtr(this.state.item.equiptype, this.state.item.key);
            // let mark = indexName.indexOf(res.data.equiptypename) == -1 ? 'RTSP' : '通用';
            if (res.code === 200) {
              this.setState({
                itmeDAta: res.data,
                // visible: false,
                Address: mark,
                CommProt: ComProt.data,
                connname: this.state.item.connname
              });
              this.props.itmeid(this.state.item, data.data);
              this.props.setVisible(false);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          // let res = await Api.Device.editor(this.state.itmeColor);
          // let data = await Api.Device.dataCtr(this.state.item.equiptype, this.state.item.key);
          // let mark = indexName.indexOf(res.data.equiptypename) == -1 ? 'RTSP' : '通用';
          if (res.code === 200) {
            this.setState({
              itmeDAta: res.data,
              // visible: false,
              Address: mark,
              connname: this.state.item.connname,
              CommProt: ComProt.data
            });
            this.props.itmeid(this.state.item, data.data);
            this.props.setVisible(false);
          }
        }
      }else {
        message.error("你还未选择设备！")
      }
    };
    list = async (
      pages: number,
      deviceValue: string,
      brandType: string,
      inpuValue: string,
      brandTypeId: string
    ) => {
      let res = await Api.Device.DeviceList(
        pages,
        deviceValue,
        brandType,
        inpuValue,
        brandTypeId
      );
      if (res.code === 200) {
        // console.log(res);
        if (res.data.rows.length !== 0) {
          this.setState({
            data: this.dataRow(res.data.rows),
            total: res.data.total
          });
        } else {
          this.setState({
            data: [],
            total: res.data.total
          });
        }
      }
    };
    dataRow = (obj: Array<object>) => {
      return obj.map(item => {
        return { key: item.id, ...item };
      });
    };
    searchData = (deviceValue, brandType, inpuValue, brandTypeId) => {
      this.list(1, deviceValue, brandType, inpuValue, brandTypeId);
      this.setState({
        current: 1
      });
    };
  }
);

const MapDataFormat = (data, index) => {
  return (
    <Option value={data.dic_value} key={index}>
      {data.dic_name}
    </Option>
  );
};
const MapDataFormatcoding = (data, index) => {
  return (
    <Radio value={data.dic_value} key={index}>
      <span className="Group-span">{data.dic_name}</span>
    </Radio>
  );
};

const MapDataFormatCommProt = (data, index) => {
  return (
    <Option value={data.id} key={index}>
      {data.mcport}
    </Option>
  );
};
