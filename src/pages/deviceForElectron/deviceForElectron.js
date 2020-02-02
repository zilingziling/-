import React, { useEffect, useState, useRef } from "react";
import Bar from "../component/Bar/deviceSeleclass";
import { Button, message, Spin } from "antd";
import "./index.less";
import SingleRoom from "./components/singleRoom";
import { control, getStatus } from "../../api/deviceForele";
import {
  handleProjector,
  stateCtrLight,
  uint8Buff2Str
} from "../component/function/formatDateReturn";
import socket from "../../stores/socket";
const DeviceForElectron = () => {
  const getInitSelect = () => {
    if (window.localStorage.getItem("CtrClassrommid")) {
      return window.localStorage.getItem("CtrClassrommid").split(":")[0];
    } else return "";
  };
  const [schoolId, setSchool] = useState(
    window.localStorage.getItem("deviceSelected")
  );
  const [roomControls, setControl] = useState([]);
  const [selectRoomName, setName] = useState("");
  const [classStatus, setClassStatus] = useState("");
  const [data, setData] = useState([]);
  const [selectedRoom, setSR] = useState(false);
  const [batch, setBatch] = useState(false);
  const [allBtn, setAllBtn] = useState([]);
  const [treePosition, setTreePosition] = useState("");
  const [selectGroup, setGroupId] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const [socket, setSocket] = useState({});
  // room单选
  const [selectId, setSelectId] = useState(getInitSelect());
  const [loadingStatus, setLoading] = useState(false);

  // init
  useEffect(() => {
    if (!schoolId) return;
    if (schoolId.includes("school_academic_building")) {
      let id = schoolId.split(":")[0];
      getStatus(id).then(r => {
        if (r.data) {
          toOringin(r.data)
          // setData(r.data);
        }
      });
    } else {
      setData([]);
      setSchool(null);
    }
  }, []);
  useEffect(() => {
    let array = [];
    data &&
      data.map(i => {
        i.classroomData.map(room =>
          room.baseEquipment.map(btn => {
            if (array.length === 0) {
              array.push(btn);
            } else if (
              array.findIndex(m => btn.equitCode === m.equitCode) === -1
            ) {
              array.push(btn);
            }
          })
        );
      });
    setAllBtn(array);
    let newArr = [];
      data.map(inner => {
        inner.classroomData.map(room => newArr.push(room));
      });
    let ary1 = newArr.filter(item => item.clickStatus === false);
    let ary2 = newArr.filter(item => item.clickStatus === true);
    if (ary1.length > 0) {
      setSelectAll(false);
    } else if (ary2.length === newArr.length && newArr.length !== 0) {
      setSelectAll(true);
    }
    if (selectId && data) {
      data.map(room => {
        room.classroomData.map(inner => {
          if (inner.classroomId === selectId) {
            setClassStatus(inner.classroomType);
          }
        });
      });
    }
  }, [data]);

  const docClick = () => {
    let newData =
      data &&
      data.map(room => {
        room.classroomData.map(inner => {
          if (inner.classroomId === selectId) {
            inner.clickStatus = false;
          }
        });
        return room;
      });
    setData(newData);
    setSelectId("");
    setControl([]);
    // setAllBtn([])
    setClassStatus("");
    setName("");
  };
  useEffect(() => {
    if (selectId) {
      document.addEventListener("click", docClick);
      return () => {
        document.removeEventListener("click", docClick);
      };
    }
  }, [selectId]);
  const onSelectSchool = (id, e) => {
    setTreePosition(e.node.props.title);
    if (e.node.props.dataref.key.includes("school_academic_building")) {
      setSchool(id);
      setControl([]);
      getStatus(id).then(r => {
        if (r) {
          toOringin(r.data)
          // setData(r.data);
        }
      });
    } else {
      setSchool("");
      setData([]);
    }
  };
  // socket
  useEffect(() => {
    _infomsg();
  }, [socket,data]);
  const roomProps = {
    roomControls,
    setControl,
    setName,
    setClassStatus,
    setSR,
    selectId,
    setSelectId,
    batch,
    selectGroup,
    setGroupId,
    data,
    setData
  };
  const onClickBatch = () => {
    if (schoolId) {
      setBatch(!batch);
    } else {
      message.info("请先选择教室！");
    }
  };
  const toOringin = (oriData) => {
    let ary=[];
    if(oriData){
      ary=oriData
    }else ary=data
    let newData = ary.map(inner => {
      inner.classroomData.map(room => {
        room.clickStatus = false;
        // room.loading=false
        return room;
      });
      return inner;
    });
    setData(newData);
  };
  useEffect(() => {
    if (!batch) {
      toOringin();
      setControl([]);
      setName("");
      setClassStatus("");
      setSelectId("");
    }
  }, [batch]);

  useEffect(() => {
    if (selectId && data) {
      let newData = data.map(inner => {
        inner.classroomData.map(room => {
          room.clickStatus = room.classroomId === selectId;
          return room;
        });
        return inner;
      });
      setData(newData);
    }
  }, [selectId]);
  const toConfig = () => {
    window._guider.History.history.push({
      pathname: "/deviceAdd"
    });
  };
  const onSelectAll = () => {
    setSelectAll(!selectAll);
    if (data) {
      let newData = data.map(inner => {
        inner.classroomData.map(room => {
          room.clickStatus = !selectAll;
          return room;
        });
        return inner;
      });
      setData(newData);
    }
  };
  //接受websock消息
  const _infomsg = () => {
    window.ws.onmessage = evt => {
        let baseMsg = proto.cn.yjtianxia.im.protocol2.BaseMsg.deserializeBinary(
            evt.data
        );
        let objdata;
        try {
          objdata = uint8Buff2Str(baseMsg.getData());
          console.log("socket数据", JSON.parse(objdata));
          objdata = JSON.parse(objdata);
          setSocket(objdata);
          console.log(data)
            if (data.length > 0) {
              console.log(1)
              let ary = data;
              console.log(objdata.classroomData.classroomId);
              ary = ary.map(room => {
                room.classroomData.map(classroom => {
                  if (classroom.classroomId === objdata.classroomData.classroomId) {
                    if (objdata.classroomData.masterEquipment.length) {
                      classroom.masterEquipment.map(i => {
                        objdata.classroomData.masterEquipment.map(e => {
                          if (i.equipCode === e.equipCode) {
                            i.equipType = e.equipType;
                          }
                        });
                      });
                    }
                    classroom.classroomType = objdata.classroomData.classroomType;
                    classroom.loading=objdata.classroomData.loading
                  }
                  return classroom;
                });
                return room;
              });
              setData(ary);
            }
        } catch (error) {
          console.log(error);
        }
    };
  };

  const buttonProps={
    selectId,selectRoomName,classStatus,batch,setLoading,setBatch,schoolId,data,setData,socket
  }
  return (
    <div className="eleControlOut">
      {/*树菜单*/}
      <Bar renderValue={onSelectSchool} />
      {
        schoolId?data.length>0? <div className="controlDisc">
          <div className="batchOpe">
              <div>
                <Button type="primary" onClick={onClickBatch}>
                  {batch ? "取消批量操作" : "批量操作设备"}
                </Button>
                <Button type="primary" disabled={batch} onClick={toConfig}>
                  打开配置页面
                </Button>
              </div>
              <span>
            {data
                ? data.length && schoolId
                    ? data[0].schoolData
                    : treePosition
                : ""}
          </span>
            </div>
          <div className="rooms">
            {batch && (
                <div className="selectA" onClick={onSelectAll}>
                  <img
                      src={
                        selectAll
                            ? require("../../assets/deviceControl/checked.png")
                            : require("../../assets/deviceControl/check.png")
                      }
                      alt="check"
                  />
                  <span>选择全部</span>
                </div>
            )}
            {data &&
            data.map((item, index) => (
                <Rooms {...roomProps} innerData={item} key={`${index}group`} />
            ))}
          </div>
          <div className="batchControl">
            {selectId||batch ? (
                <Buttons
                    {...buttonProps}
                    btns={batch ? allBtn : roomControls}
                />
            ) : (
                <div className="deviceNotice">
                  <img
                      src={require("../../assets/deviceControl/notice.png")}
                      alt="notice"
                  />
                  <span>请在上面选择需要控制的教室</span>
                </div>
            )}
          </div>
        </div>:<div className="selectNotice">
          <img
              src={require("../../assets/deviceControl/notice.png")}
              alt="notice"
          />
          <h2>暂无教室信息！</h2>
        </div>:<div className="selectNotice">
          <img
              src={require("../../assets/deviceControl/notice.png")}
              alt="notice"
          />
          <h2>请选择教学楼！</h2>
        </div>
      }

    </div>
  );
};

const Buttons = ({
  batch,
  btns,
  selectRoomName,
  classStatus,
  data,
  setBatch,
  setLoading,setData,selectId,socket
}) => {
  // 设备控制
  const handleControl = (event, ids, equitCode) => {
    event.nativeEvent.stopImmediatePropagation();
    setLoading(true);
    let idAry = [];
    let clickedArr = [];
    let propAry = [];
    if (batch) {
      data &&
        data.map(room => {
          let a = room.classroomData.filter(
            inner => inner.clickStatus === true
          );
          clickedArr = clickedArr.concat(a);
        });
      clickedArr.map(room => {
        let a = room.baseEquipment.filter(
          equip => equip.equitCode === equitCode
        );
        propAry = propAry.concat(a);
      });
      propAry.map(equip => idAry.push(equip.equipclassroomId));
    } else {
      idAry.push(ids.equipclassroomId);
    }
    if(idAry.length>0){
      control({ ...ids, equipclassroomId: idAry }).then(r => {
        if (r.code === 200) {
          window._guider.Utils.alert({
            message: r.msg,
            type: "success"
          });
          if (batch) {
            let newData =
                data &&
                data.map(room => {
                  room.classroomData.map(inner => {
                    if (inner.clickStatus === true) {
                      inner.loading = true;
                    }
                  });
                  return room;
                });
            setData(newData);
            setBatch(false);
          }else {
            let newData =
                data &&
                data.map(room => {
                  room.classroomData.map(inner => {
                    if (inner.classroomId === selectId) {
                      inner.loading = true;
                    }
                  });
                  return room;
                });
            setData(newData);
          }
          setTimeout(()=>{
            if(!Object.keys(socket).length){
              // 超时未响应
              let newData =
                  data &&
                  data.map(room => {
                    room.classroomData.map(inner => {
                      if (inner.loading === true) {
                        inner.loading = false;
                      }
                    });
                    return room;
                  });
              setData(newData);
            }
          },110000)
          setTimeout(()=>{
              let newData =
                  data &&
                  data.map(room => {
                    room.classroomData.map(inner => {
                      if (inner.loading === true) {
                        inner.loading = false;
                      }
                    });
                    return room;
                  });
              setData(newData);
          },140000)
        }
      });
    }else message.error("你还未选择要控制的教室！")
  };
  return (
    <>
      <h6>
        {batch ? "" : selectRoomName}
        <span className="classStatus">
          {batch
            ? ""
            : classStatus === "on"
            ? "上课中"
            : classStatus === "off"
            ? "下课中"
            : ""}
        </span>
      </h6>
      <ul className="controlBtns">
        {btns.map(btnGroup => (
          <li key={btnGroup.equipclassroomId}>
            <span>{btnGroup.equipName}</span>
            {btnGroup.keyData.map(singleBtn => (
              <Button
                onClick={event =>
                  handleControl(
                    event,
                    {
                      equipclassroomId: btnGroup.equipclassroomId,
                      keyId: singleBtn.keyId
                    },
                    btnGroup.equitCode
                  )
                }
                key={singleBtn.keyId}
                type="primary"
                className="pad"
              >
                {singleBtn.keyName}
              </Button>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
};
// 每条数据
const Rooms = ({
  innerData,
  roomControls,
  setControl,
  setName,
  setClassStatus,
  setSR,
  selectId,
  setSelectId,
  batch,
  selectGroup,
  setGroupId,
  data,
  setData
}) => {
  const [groupCheck, setGroup] = useState(false);

  const onClickCircle = () => {
    setGroupId(innerData.groupId);
    setGroup(!groupCheck);
    let newData =
      data &&
      data.map(room => {
        if (room.groupId === innerData.groupId) {
          room.classroomData.map(inner => {
            inner.clickStatus = !groupCheck;
          });
          return room;
        } else return room;
      });
    setData(newData);
  };
  const singleProps = {
    roomControls,
    setControl,
    setName,
    setClassStatus,
    setSR,
    setSelectId,
    selectId,
    setGroup,
    batch,
    data,
    setData
  };
  useEffect(() => {
    let ary = innerData.classroomData.filter(i => i.clickStatus === true);
    if (ary.length === innerData.classroomData.length) {
      setGroup(true);
    } else setGroup(false);
  }, [data]);
  return (
    <div className="roomsRow">
      {batch && (
        <img
          onClick={onClickCircle}
          src={
            groupCheck
              ? require("../../assets/deviceControl/checked.png")
              : require("../../assets/deviceControl/check.png")
          }
          alt="check"
        />
      )}
      {/*<h2>{innerData.group}</h2>*/}
      <div className="roomsGroup">
        {innerData.classroomData.map((room, index) => (
          <SingleRoom {...singleProps} roomInfo={room} key={room.classroomId} />
        ))}
      </div>
    </div>
  );
};

export default DeviceForElectron;
