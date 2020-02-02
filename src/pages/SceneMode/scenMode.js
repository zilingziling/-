//@flow
import React, { Component } from "react";
import ScenBody from "./components/scenBody";
import Api from "./../../api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Input, Select, message,InputNumber } from "antd";
import "./scenMode.scss";
import { Model } from "../component/Model/model";
import { RouterPmi } from "../component/function/routerPmi";
import { debounce } from "../component/function/formatDateReturn";
import {getUuid} from "../../utils/handleNumbers";

const Option = Select.Option;
const grid = 8;

//数组排序
const sortId = (a: Object, b: Object) => {
  return a.order_no - b.order_no;
};
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  // margin: `0 0 ${2}px 0`,
  height: "3rem",
  background: isDragging ? "rgba(56,150,222,0.6)" : "rgba(0,160,233,0.75)",
  borderBottom: "2px solid #3896de",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  ...draggableStyle
  // change background colour if dragging
  // background: isDragging ? 'lightgreen' : 'grey',
  // styles we need to apply on draggables
});

type Props = {
  match: Object,
  history: Object,
  location: Object,
  item: Array<Object>
};
type State = {
  scenario: Array<object>,
  deviceList: Array<object>,
  items: Array<object>,
  itemStyle: String,
  Delt: String,
  title: String,
  visible: Boolean,
  infoText: String,
  mark: String
};
/**
 * @description:
 * 情景序列列表，排序都是根据this.state.items.`order_no`来排序的，
 * order_no比较重要，当情景序列列表出现乱窜或者无缘的增加数据说明, 你在上一步操作中没有重新把数据排序，需要调用_formatData函数。
 *  _formatData函数，从新把数据格式化一次，让order_no从0坐标开始
 * @param {type}
 * @return:
 */
class ScenMode extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.itemClick = this.itemClick.bind(this);
  }
  state = {
    scenario: [],
    items: [], //情景序列数据
    deviceList: [],
    itemStyle: null,
    InputValue: null,
    seven: null,
    Delt: null, //情景序列列表点击每一项数据
    title: "", //弹出框title
    visible: false, //弹出框开关
    infoText: null,
    mark: null, //情景序列>>>点击每一项数据它添加颜色背景
    SerialNumber: [],
    SerialNumberCode: null,
    _info: RouterPmi(), //权限
    display:false
  };
  componentDidMount() {
    let classroomId = window.localStorage.getItem("classroomid");
    if (classroomId !== null) {
      this.Device(classroomId);
      this.scen(classroomId);
    }
    // else if (typeof (this.props.location.query) !== 'undefined') {
    // 	this.Device(this.props.location.query);
    // 	this.scen(this.props.location.query);
    // }
    this._code();
  }
  _code = async () => {
    try {
      let res = await Api.Scenario._codeList();
      if (res.code === 200) {
        this.setState({
          SerialNumber: res.data
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  Device = async (id: String) => {
    let res = await Api.Scenario.get_equips_qj(id); //this.props.location.query
    // console.log(res);
    if (res.code === 200) {
      if (res.data.length > 0) {
        this.setState({
          deviceList: res.data
        });
      }
    }
  };

  scen = async (id: String) => {
    let res = await Api.Scenario.get_scene_list(id);
    // console.log(res);
    if (res.code === 200) {
      this.setState({
        scenario: res.data,
        itemStyle: null
      });
    }
  };

  render() {
    const { SerialNumberCode } = this.state;
    const dragProps={
      onDragStart:this.onDragStart,
      onDragEnd:this.onDragEnd,
      onDragUpdate:this.onDragUpdate,
      items:this.state.items,
      itemData:this.itemData,
      mark:this.state.mark,
      DeleteArray:this.DeleteArray
    }
    return (
      <div className="Scene">
        <div className="clear" />
        <Button
          className="Scene-reutrnBtn"
          type="primary"
          onClick={this._returnPage}
        >
          返回上一级
        </Button>
        <div className="Scene-body">
          <div className="Scene-body-left">
            <div className="Scene-body-left-scen">
              <div className="Scene-body-left-scen-header">
                <span className="Scene-body-left-scen-header-span">情景</span>
                <div className="Scene-body-left-scen-header-img">
                  <a
                    disabled={!this.state._info.includes("add")}
                    onClick={this.info.bind(this, "add")}
                    href={null}
                  >
                    <img src={require("./../../assets/img/jias.png")} />
                  </a>
                  <a
                    disabled={!this.state._info.includes("edit")}
                    onClick={this.info.bind(this, "Modify")}
                    href={null}
                  >
                    <img src={require("./../../assets/img/bi.png")} />
                  </a>
                  <a
                    disabled={!this.state._info.includes("delete")}
                    onClick={this.info.bind(this, "delete")}
                    href={null}
                  >
                    <img src={require("./../../assets/img/delete.png")} />
                  </a>
                </div>
              </div>

              <div className="Scene-body-left-scen-list">
                {this.state.scenario.map(this.list)}
              </div>
            </div>
            <div className="Scene-body-left-list">
              <div className="Scene-body-left-list-header">
                <span className="Scene-body-list-header-span"> 情景序列</span>
                <div className="Scene-body-left-list-header-left">
                  <img
                    onClick={this.del}
                    src={require("./../../assets/img/delete.png")}
                  />
                  <Button
                    disabled={!this.state.seven}
                    className="Scene-body-left-list-header-left-btn"
                    onClick={this.save}
                    type="primary"
                  >
                    保存
                  </Button>
                </div>
              </div>
              <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                onDragUpdate={this.onDragUpdate}
              >
                <Droppable
                  ignoreContainerClipping={true}
                  droppableId="droppable"
                >
                  {(provided, snapshot) => (
                    <div
                      className="Scene-body-left-list-centent"
                      ref={provided.innerRef}
                    >
                      {/* {console.log(this.state.items)} */}
                      {this.state.items.map((item, index) => {
                        return (
                          <Draggable
                            key={index}
                            draggableId={item.order_no.toString()} //order_no作为ID
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                onClick={this.itemData.bind(this, item, index)}
                                className={
                                  this.state.mark === index
                                    ? "aaaaaaaa"
                                    : "Scene-body-list-centent-item"
                                }
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <span>{item.equip_key_name}</span>
                                <Input
                                  size="small"
                                  addonBefore="延迟"
                                  addonAfter="秒"
                                  value={item.time_consuming}
                                  className="sceneInput"

                                  onChange={e => {
                                    this.DeleteArray(e, index);
                                  }}
                                  // onChange={this.DeleteArray.bind(this,)}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
          {
            this.state.display&&<ScenBody list={this.state.deviceList} pushItem={this.pushItem} />
          }
        </div>
        <Model
          width={700}
          title={this.state.title}
          visible={this.state.visible}
          handleOk={this.onOk}
          onCancel={this.onCancel}
        >
          <div className="models">
            <div>
              <span className="models-span">情景名称：</span>
              <Input
                value={this.state.infoText}
                onChange={e => {
                  this.setState({ infoText: e.target.value });
                }}
                placeholder="请输入情景名称"
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <span className="models-span">情景功能：</span>
              <Select
                placeholder="请选择情景功能"
                value={SerialNumberCode}
                style={{ width: "12rem" }}
                onChange={e => {
                  this.setState({ SerialNumberCode: e }), console.log(e);
                }}
              >
                {this.state.SerialNumber.map(MapDataFormat)}
              </Select>
            </div>
          </div>
        </Model>
      </div>
    );
  }

  //监听输入inputVal 修改
  DeleteArray = (e: Object, index: Nmuber) => {
    // console.log(this.state.items);
    if (e.target.value >=0 && e.target.value <= 120) {
     //  let data = Object.assign({}, this.state.items[index], { time_consuming: e.target.value, order_no: index }); //更改当前数据
     // console.log(data)
     //  let hash = {};
     //  let buf = this.state.items.concat([data]).reduceRight((item, next) => {
     //    hash[next.order_no] ? '' : (hash[next.order_no] = true && item.push(next)); return item;
     //  }, []);
     //  // console.log(buf.sort(sortId));
     //  this.setState({
     //    items: buf.sort(sortId)
     //  });
      let data=this.state.items
      data[index].time_consuming=e.target.value!==""?parseInt(e.target.value):e.target.value
      this.setState({
        items:data
      })
    }
  };
  //删除情景序列 数据
  del = () => {
    let items = [];
    if (this.state.Delt !== null && typeof this.state.Delt !== "undefined") {
      this.state.items.forEach((e, index) => {
        if (e.uuid !== this.state.Delt.uuid) {
          return items.push(e);
        }
      });
      let res =
        items.length === this.state.mark ? items.length - 1 : this.state.mark;
      this.setState({
        items: _formatData(items), //这里从新遍历一次items数据，因为列表是更具items.order_no排序的，不然列表会乱窜！！
       // items,
        Delt: _formatData(items).find(i=>i.uuid===items[res].uuid),
       //  Delt:items[res],
        mark:
          items.length === this.state.mark ? items.length - 1 : this.state.mark
      });
    }else message.info("请先选择要删除的情景序列！")
  };
  onDragStart = (result: object) => {
    // console.log(result);
  };
  //结束
  onDragEnd = (result: object) => {
    // console.log('原开始的位置' + result.source.index);
    // console.log('托转过后位置坐标' + result.destination.index);
    console.log(result)
    if (!result.destination) {
      return;
    }
    //从新遍历 index复制进去order_no
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    this.setState({
      // items: _formatData(items),
      items,
      mark: result.destination.index,
      Delt: items[result.destination.index]
    });
  };
  //
  onDragUpdate = (result: object) => {
    // console.log(result);
  };
  //情景list
  list = (item: Object, index: Number) => {
    // console.log(item);
    return (
      <div

        style={
          this.state.itemStyle === index
            ? { background: "rgba(0, 160, 233, 0.75)" }
            : {}
        }
        onClick={this.itemClick.bind(this, item, index)}
        key={index}
        className="list"
      >
        <span>{item.scene_name}</span>
        <img src={require("./../../assets/img/return.png")} />
      </div>
    );
  };
  //情景list item
  async itemClick(item: Object, index: Number) {
    this.setState({
      display:true
    })
    let res = await Api.Scenario.get_scene_seq_list(item.id);
    let data = await Api.Scenario._get_scene_by_id(item.id);
    if (res.code === 200) {
      let ant = [];
      // 生成uuid
      res.data.forEach((e, index) => {
        ant.push({
          equip_id: e.equip_id,
          equip_key_name: e.equip_key_name,
          id: e.id,
          key_id: e.key_id,
          order_no: e.order_no,
          time_consuming: e.time_consuming,
          uuid:getUuid(),
          key_value:e.key_value&&e.key_value
        });
      });
      this.setState({
        itemStyle: index,
        items: ant.sort(sortId),
        seven: item,
        SerialNumberCode: String(data.data.sceneno),
        mark: null
      });
    }
  }
  //addData 从子组件send过来的 添加情景序列
  pushItem = (data: Object, devicesId: String, name: String) => {
    if (this.state.items.length > 0) {
      this.state.items.forEach((e, index) => {
        if (data.key_name === e.equip_key_name) {
          let ant = [];
          ant.push({
            equip_key_name: name + data.key_name,
            key_id: data.id,
            id: "",
            equip_id: devicesId,
            time_consuming: 1, // ''
            order_no: ++index, //parseInt(e.key+1)
            key_value: data.key_value,
            uuid:data.uuid
          });
          console.log("push",ant);
          return this.setState({
            items: this.state.items.concat(ant)
          });
        } else {
          console.log(index)
          let arr = [];
          arr.push({
            equip_key_name: name + data.key_name,
            key_id: data.id,
            id: "",
            equip_id: devicesId,
            time_consuming: 1, //'1'
            order_no: ++index, //++index === 1 ? 2 : ++index //parseInt(data.id)
            key_value: data.key_value,
            uuid:data.uuid
          });
          console.log("hh",arr);
          return this.setState({
            items: this.state.items.concat(arr)
          });
        }
      });
    } else {
      let arr = [];
      arr.push({
        equip_key_name: name + data.key_name,
        key_id: data.id,
        id: "",
        equip_id: devicesId,
        time_consuming: 1,
        order_no: 0,
        key_value: data.key_value,
        uuid:data.uuid
      });
      console.log(arr);
      return this.setState({
        items: this.state.items.concat(arr)
      });
    }
  };
  //保存
  save = debounce(async () => {
    if (this.state.seven !== null) {
      // console.log(this.state.items);
      if(this.state.items.find(i=>i.time_consuming===0||i.time_consuming==="")){
        message.error("延迟时间必须为1~120之间的整数！")
        return
      }
      let antd = [];
      console.log(this.state.items)

      this.state.items.forEach((element, index) => {
        antd.push({
          id: element.id,
          keyId: element.key_id,
          orderNo: index, //element.order_no,
          timeConsuming: element.time_consuming,
          equipId: element.equip_id,
          equipKeyName: element.equip_key_name,
          sceneId: this.state.seven.id,
          uuid:element.uuid,
          key_value:
            typeof element.key_value !== "undefined" ? element.key_value : ""
        });
      });
      let res = await Api.Scenario.save_scene_seq(antd, this.state.seven.id);
      // console.log(res);
      if (res.code == 200) {
        window._guider.Utils.alert({
          message: res.msg,
          type: "success"
        });
        this.setState({ mark: null });
      }
    }
  });

  //情景序列点击每一项
  itemData = (Delt: Object, mark: number) => {
    console.log(Delt,mark)
    this.setState({
      Delt,
      mark
    });
  };
  //添加、修改、删除
  info = async (mark: String) => {
    console.log(this.state.seven);
    if (mark === "add") {
      this.setState({
        visible: true,
        title: "添加情景",
        seven: null,
        SerialNumberCode: ""
      });
    } else {
      if (!this.state.seven) {
        message.info("您还未选择！");
      } else {
        if (mark === "Modify") {
          // console.log(this.state.seven);
          this.setState({
            visible: true,
            title: "修改情景",
            infoText: this.state.seven.scene_name
            // SerialNumberCode: this.state.seven.id, 			////
          });
        } else if (mark === "delete") {
          let res = await Api.Scenario.del_scene(this.state.seven.id);
          if (res.code === 200) {
            window._guider.Utils.alert({
              message: res.msg,
              type: "success"
            });
            // this.props.location.query
            this.Device(window.localStorage.getItem("classroomid"));
            this.scen(window.localStorage.getItem("classroomid"));
            this.setState({ items: [], seven: null });
          }
        }
      }
    }
  };
  //弹出个关闭
  onCancel = () => {
    this.setState({
      visible: false,
      infoText: null,
      itemStyle: null,
      SerialNumberCode: null,
      seven: null
    });
  };

  //保存情景
  onOk = async () => {
    if (this.state.infoText !== null && this.state.SerialNumberCode !== null) {
      let id = this.state.seven === null ? "" : this.state.seven.id;
      let res = await Api.Scenario.save_scene(
        this.state.SerialNumberCode,
        this.state.infoText,
        window.localStorage.getItem("classroomid"),
        id
      ); //this.props.location.query
      // console.log(res);
      if (res.code === 200) {
        window._guider.Utils.alert({
          message: res.msg,
          type: "success"
        });
        this.onCancel();
        this.Device(window.localStorage.getItem("classroomid")); //this.props.location.query
        this.scen(window.localStorage.getItem("classroomid"));
        this.setState({
          seven: null,
          items: [] // itmes
        });
      }
    }
  };
  //返回上级页面
  _returnPage = () => {
    window._guider.History.history.push({
      pathname: "deviceAdd"
    });
  };
}

export default ScenMode;
const MapDataFormat = (data, index) => {
  return (
    <Option value={data.dic_value} key={index}>
      {data.dic_name}
    </Option>
  );
};

function removeEmptyArrayEle(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == undefined) {
      arr.splice(i, 1);
      i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
      // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
    }
  }
  return arr;
}
//遍历数据，让 order_no从新排序一次
const _formatData = data => {
  let array = [];
  data.forEach((e, index) => {
    array.push({
      equip_id: e.equip_id,
      equip_key_name: e.equip_key_name,
      id: e.id,
      key_id: e.key_id,
      order_no: index,
      time_consuming: e.time_consuming,
      uuid:e.uuid,
      key_value:e.key_value&&e.key_value
    });
  });
  return array;
};
