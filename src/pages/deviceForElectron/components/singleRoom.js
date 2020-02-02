import React, { useEffect, useRef, useState } from "react";
import "../index.less";
import { Modal } from "antd";
const SingleRoom = ({
  roomInfo,
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
}) => {
  const [checked, setChecked] = useState(false);
  let count = 0;
  const selectSingle = event => {
    event.nativeEvent.stopImmediatePropagation();
    count += 1;
    setTimeout(() => {
      // 单击
      if (count === 1) {
        setControl(roomInfo.baseEquipment);
        setName(roomInfo.classroom);
        setClassStatus(roomInfo.classroomType);
        setSR(true);
        setChecked(!checked);
        if (batch) {
          setSelectId("");
          window.localStorage.setItem("CtrClassrommid", "");
          window.localStorage.setItem("classroomid", "");
          let newData =
            data &&
            data.map(room => {
              room.classroomData.map(inner => {
                if (inner.classroomId === roomInfo.classroomId) {
                  inner.clickStatus = !inner.clickStatus;
                }
              });
              return room;
            });
          setData(newData);
        } else {
          setSelectId(roomInfo.classroomId);
          window.localStorage.setItem(
            "CtrClassrommid",
            `${roomInfo.classroomId}:classroom`
          );
          window.localStorage.setItem("classroomid", roomInfo.classroomId);
        }
      } else if (count === 2) {
        window.open(roomInfo.url, "查看状态", "", true);
      }
      count = 0;
    }, 300);
  };

  // const  onloadIframe=(e)=>{
  //     e.target.contentWindow.postMessage("admin","http://172.16.3.55:9528")
  // }
  return (
    <>
      {/*<Modal className="iframeModal" width={700} centered  closable={false}  visible={iframeV} onCancel={()=>setV(false)} footer={null}>*/}
      {/*  <iframe*/}
      {/*      // src={roomInfo.url}*/}
      {/*      ref={iRef}*/}
      {/*      // onLoad={onloadIframe}*/}
      {/*      src="https://sneaker.styleking.cn/#/dashboard"*/}
      {/*      width="100%"*/}
      {/*      frameBorder="0"*/}
      {/*      style={{height:"450px"}}*/}
      {/*  />*/}
      {/*</Modal>*/}
      <div
        className={`singleWrap ${roomInfo.clickStatus ? "clicked" : ""} ${
          roomInfo.classroomType === "on"
            ? "active"
            : roomInfo.classroomType === "off"
            ? "normal"
            : "normal"
        }`}
        onClick={selectSingle}
      >
        {roomInfo.clickStatus && (
          <img
            src={require("../../../assets/deviceControl/right.png")}
            alt="right"
          />
        )}
        <div className="singleContent">
          <span
            style={{
              fontSize:
                roomInfo.classroom && roomInfo.classroom.length > 9
                  ? ".8rem"
                  : "1rem"
            }}
          >
            {roomInfo.classroom}
          </span>
          <div className="status">
            {roomInfo.masterEquipment.map((device, index) => (
              <img src={getImgUrl(device)} key={index} />
            ))}
          </div>
          {roomInfo.loading&&<div className="pro-loader">
            <span></span><span></span><span></span><span></span><span></span>
          </div>}
        </div>
      </div>
    </>
  );
};

export default SingleRoom;
const getImgUrl = device => {
  if (device.equipCode === "mc_module") {
    switch (device.equipType) {
      case "on":
        return require("../../../assets/deviceControl/greenC.png");
      case "off":
        return require("../../../assets/deviceControl/whiteC.png");
      case "break":
        return require("../../../assets/deviceControl/redC.png");
      default:
        return require("../../../assets/deviceControl/whiteC.png");
    }
  } else if (device.equipCode === "projection") {
    switch (device.equipType) {
      case "on":
        return require("../../../assets/deviceControl/greenP.png");
      case "off":
        return require("../../../assets/deviceControl/whiteP.png");
      case "break":
        return require("../../../assets/deviceControl/redP.png");
      default:
        return require("../../../assets/deviceControl/whiteP.png");
    }
  } else if (device.equipCode === "mc_module_lock") {
    switch (device.equipType) {
      case "on":
        return require("../../../assets/deviceControl/greenL.png");
      case "off":
        return require("../../../assets/deviceControl/whiteL.png");
      case "break":
        return require("../../../assets/deviceControl/redP.png");
      default:
        return require("../../../assets/deviceControl/whiteP.png");
    }
  }
};
