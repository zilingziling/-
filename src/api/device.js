// @flow

import { makeRequest, formatReq } from "./config";
import { Device } from "./url";
//查询设备类型
export const validation = () => {
  return makeRequest(Device.type);
};
export const skip = p => {
  const params = new URLSearchParams();
  params.append("buildingid", p.buildingid);
  params.append("schoolid", p.schoolid);
  params.append("account", p.account);
  return makeRequest(Device.skip, params);
};
//根据设备类型查询品牌
export const Devicebrand = () => {
  const params = new URLSearchParams();
  return makeRequest(Device.brand);
};

//通过查询条件查询设备 list
export const DeviceList = (
  pages: number,
  equipType: string,
  equipBrand: string,
  equipModel: string,
  brandTypeId: string
) => {
  const params = new URLSearchParams();
  params.append("equipType", equipType);
  params.append("equipBrand", brandTypeId); //equipBrand 名字
  params.append("equipModel", equipModel);
  params.append("pageNo", pages);
  params.append("pageSize", 10);
  // params.append('	',brandTypeId); equipBrand
  return makeRequest(Device.list, params);
};

//  保存品牌信息
export const SeveBrand = (brandCnName: String, brandEnName: String) => {
  const params = new URLSearchParams();
  params.append("brandCnName", brandCnName);
  params.append("brandEnName", brandEnName);
  // params.append('brandEnName', brandEnName);
  return makeRequest(Device.SeveBrand, params);
};

//链接方式
export const Links = () => {
  return makeRequest(Device.links);
};

//控制数据
export const dataCtr = (equipTypeId: string, equipId: string) => {
  const params = new URLSearchParams();
  params.append("equipTypeId", equipTypeId);
  if (equipId !== null) {
    params.append("equipId", equipId);
  }
  return makeRequest(Device.dataCtr, params);
};

//add添加和保存
export const AddSeven = (param: Object<Array>, list: Object<Array>) => {
  let data = formatReqs(param);
  data.append("codeList", JSON.stringify(list));
  return makeRequest(Device.addSeven, data);
};

//删除
export const DeviceDlet = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(Device.DeleteDevice, params);
};
//编辑
export const editor = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(Device.editor, params);
};

//获取学校 wod
export const schoolList = id => {
  const params = new URLSearchParams();
  params.append(
    "userid",
    JSON.parse(window.localStorage.getItem("data")).userid
  );
  return makeRequest(Device.schoolurl, params);
};
//admin 获取学校
export const adminSchoolist = () => {
  return makeRequest(Device.adminschoolurl);
};

//所属学校
export const schoolType = () => {
  return makeRequest(Device.Belongs);
};
//获取表格
export const get_classrooms = (schoolid: string, pageNo: string) => {
  const params = new URLSearchParams();
  params.append("schoolid", schoolid);
  params.append("pageNo", pageNo);
  params.append("pageSize", 10);
  return makeRequest(Device.get_classrooms, params);
};

//教室信息
export const get_classroom_tree = () => {
  const params = new URLSearchParams();
  params.append(
    "userid",
    JSON.parse(window.localStorage.getItem("data")).userid
  );
  return makeRequest(Device.get_classroom_tree, params);
};
//admin教室信息
export const amdinget_classroom_tree = () => {
  return makeRequest(Device.adminget_classroom_tree);
};
//房间列表
export const get_equip_rooms = (val: string, page: number) => {
  const params = new URLSearchParams();
  params.append("classroomId", val);
  params.append("pageNo", page);
  params.append("pageSize", 10);
  return makeRequest(Device.get_equip_rooms, params);
};
//添加教室设备
export const save_equip_room = (data: Object) => {
  let param = formatReq(data);
  return makeRequest(Device.save_equip_room, param);
};
//删除
export const del_equip_room = (id: string) => {
  const params = new URLSearchParams();
  params.append("ids", JSON.stringify(id));
  return makeRequest(Device.del_equip_room, params);
};

//查询
export const get_equiproom_by_id = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(Device.get_equiproom_by_id, params);
};
//控制码
export const get_rctrlcode_by_equip = (
  equipId: string,
  equipTypeId: string,
  eroomid: string
) => {
  const params = new URLSearchParams();
  params.append("equipId", equipId);
  params.append("equipTypeId", equipTypeId);
  params.append("eroomid", eroomid);

  return makeRequest(Device.get_rctrlcode_by_equip, params);
};
//保存
export const save_equip_rooms = (data: Object, list: Array) => {
  let atn = formatReqs(data);
  atn.append("codeList", JSON.stringify(list));
  return makeRequest(Device.save_equip_room, atn);
};

//上传
export const upload_upgrade = (
  flie: object,
  vers: string,
  filename: string,
  sign: number
) => {
  const formData = new FormData();
  formData.append("file", flie);
  formData.append("vers", vers);
  formData.append("filename", filename);
  formData.append("sign", sign);
  return makeRequest(Device.upload_upgrade, formData);
};
//上传列表获取
export const get_upgrades = (page: string, number: number, sign: String) => {
  const params = new URLSearchParams();
  params.append("pageNoB", page);
  params.append("pageSize", number);
  params.append("sign", sign);
  return makeRequest(Device.get_upgrades, params);
};

//通过教室使用状态查询教室使用数量
export const get_room_num = id => {
  let username = JSON.parse(window.localStorage.getItem("data")).account;
  const params = new URLSearchParams();
  params.append("schoolid", id);
  params.append("account", username);
  return makeRequest(Device.get_room_num, params);
};

//设备报价
export const get_equip_num = id => {
  let username = JSON.parse(window.localStorage.getItem("data")).account;

  const params = new URLSearchParams();
  params.append("schoolid", id);
  params.append("account", username);
  return makeRequest(Device.get_equip_num, params);
};
//字典数据
export const alldictionary = () => {
  return makeRequest(Device.get_datadic_by_type);
};

//位置等等
export const locations = camera_type => {
  const formData = new URLSearchParams();
  formData.append("dictype", camera_type);
  return makeRequest(Device.get_dic_by_type, formData);
};

//comm
export const CommProt = (id: any) => {
  const formData = new URLSearchParams();
  formData.append("connType", id);
  return makeRequest(Device.get_ports_by_type, formData);
};

//查询教室升级列表
export const get_upgrade_room = (
  id: String,
  sign: String,
  page: number,
  pageSize
) => {
  const formData = new URLSearchParams();
  formData.append("schoolid", id);
  formData.append("sign", sign);
  formData.append("pageNo", page);
  formData.append("pageSize", pageSize ? pageSize : 10);

  return makeRequest(Device.get_upgrade_room, formData);
};

//保存教室
export const upgrade_room = (id: Array, status: Array, sign: number) => {
  const formData = new URLSearchParams();
  formData.append("classroomids", id);
  formData.append("sign", sign);
  formData.append("isupgradequeue", status);
  return makeRequest(Device.upgrade_room, formData);
};
//拷贝数据
export const CyData = (id: number, NewId: number) => {
  const formData = new URLSearchParams();
  formData.append("sourceroomid", NewId);
  formData.append("targetroomid", id);
  return makeRequest(Device.copy_equiproom, formData);
};
//通过教室id获取串号
export const get_imei_by_room = (classroomid: String) => {
  const formData = new URLSearchParams();
  formData.append("classroomid", classroomid);
  return makeRequest(Device.get_imei_by_room, formData);
};
//gen根据教室ID查询所有父级（学校、教学楼等）
export const get_parent_id = (classroomid: String) => {
  const formData = new URLSearchParams();
  formData.append("classroomid", classroomid);
  return makeRequest(Device.get_parent_id, formData);
};
//遍历所有form表单append添加
export function formatReqs(params: Object) {
  const data = new URLSearchParams();

  Object.keys(params).forEach(key => {
    if (Array.isArray(params[key])) {
      params[key].forEach(item => {
        if (typeof params[key] === "object") {
          data.append(key, JSON.stringify(params[key]));
        } else {
          data.append(key, item);
        }
      });
    } else if (typeof params[key] === "object") {
      data.append(key, JSON.stringify(params[key]));
    } else {
      data.append(key, params[key]);
    }
  });
  return data;
}
