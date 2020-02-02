//@flow

import { makeRequest, formatReq } from "./config";
import { Ctrl } from "./url";
//根据设备类型查询品牌
export const get_equips = (id: Number) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  return makeRequest(Ctrl.get_equips, params);
};

//控制列表
export const equipment_control = (id: number, detail: Array<object>) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  params.append(
    "account",
    JSON.parse(window.localStorage.getItem("data")).name
  );
  params.append("equipCtrlDetail", JSON.stringify(detail));
  return makeRequest(Ctrl.equipment_control, params);
};

//下课
export const one_key_class_over = (id: String) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  return makeRequest(Ctrl.one_key_class_over, params);
};
//上课
export const one_key_class_begin = (id: String) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  return makeRequest(Ctrl.one_key_class_begin, params);
};
//根据教室ID获取设备状态（设备操作）
export const get_equips_status = (id: String) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  return makeRequest(Ctrl.get_equips_status, params);
};

//重启
export const res_central_ctrl = (id: String) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  return makeRequest(Ctrl.res_central_ctrl, params);
};

//视屏
export const get_camera = (id: String) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  return makeRequest(Ctrl.get_camera, params);
};
// 按课表自动开启设备
export const handleAutom = (id: String, isAutoOpen) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  params.append("isAutoOpen", isAutoOpen);
  return makeRequest(Ctrl.handleAutom, params);
};
