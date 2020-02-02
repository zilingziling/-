// @flow

import { makeRequest, formatReq } from "./config";
import { Scen } from "./url";

export const get_equips_qj = (id: String) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  return makeRequest(Scen.get_equips_qj, params);
};
//通过教室ID获取情景列表
export const get_scene_list = (id: number) => {
  const params = new URLSearchParams();
  params.append("classroomid", id);
  return makeRequest(Scen.get_scene_list, params);
};
//根据设备类型ID查询按键设备关系（用户自定义情景序列）
export const get_key_equips = (id: String) => {
  const params = new URLSearchParams();
  params.append("equiptype", id);
  return makeRequest(Scen.get_key_equips, params);
};
//通过情景ID获取情景序列列表
export const get_scene_seq_list = (id: String) => {
  const params = new URLSearchParams();
  params.append("sceneid", id);
  return makeRequest(Scen.get_scene_seq_list, params);
};
//保存情景序列
export const save_scene_seq = (seqList: Array<Object>, id) => {
  // console.log(seqList);
  const params = new URLSearchParams();
  params.append("sceneid", id);
  params.append("seqList", JSON.stringify(seqList));
  return makeRequest(Scen.save_scene_seq, params);
};
//保存情景信息
export const save_scene = (
  sceneNo: String,
  sceneName: String,
  classroomId: String,
  id: string
) => {
  console.log(id);
  const params = new URLSearchParams();
  params.append("id", id);
  params.append("sceneNo", sceneNo);
  params.append("sceneName", sceneName);
  params.append("classroomId", classroomId);
  return makeRequest(Scen.save_scene, params);
};
//删除情景
export const del_scene = (id: String) => {
  const params = new URLSearchParams();
  let arr = [];
  arr.push(id);
  params.append("ids", JSON.stringify(arr));
  return makeRequest(Scen.del_scene, params);
};

export const _codeList = () => {
  return makeRequest(Scen.get_scene_no);
};
//通过主键获取情景详情
export const _get_scene_by_id = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(Scen.get_scene_by_id, params);
};
