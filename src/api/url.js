const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};
const Header = {
  "Content-Type": "application/json;charset=UTF-8"
};
const upDate = {
  "Content-Type": "multipart/form-data"
};

export const LOGIN = {
  Login: {
    url: "/sys_user/user_login", //登录
    method: "post",
    headers: headerFrom
  },
  validation: {
    url: "sys_user/create_verify_code", //验证码
    method: "get"
  },
  tokenUlr: {
    url: "authenticate",
    method: "post",
    headers: headerFrom
  },
  exitLogin: {
    url: "sys_user/cancel_user",
    method: "post",
    headers: headerFrom
  }
};

export const Help = {
  select: {
    url: "/release_ver/get_versions",
    method: "get"
  },
  detail: {
    url: "/release_ver/get_detail_ver_info",
    method: "post",
    headers: headerFrom
  }
};
//电子科大控制页面请求
export const deviceForEle={
  getStatus:{
    url: "/equip_status/equipsData",
    method: "get"
  },
  control:{
    url: "/equip_status/equipControl",
    method: "get"
  }
}
// 故障登记url
export const faultRegister={
  getList:{
    url: "/equip_classroom/get_alarm_view",
    method: "get"
  },
  getBuilding:{
    url: "/equip_classroom/findAcademicBuilding",
    method: "get"
  },
  getClassroom:{
    url: "/equip_classroom/findClassroomBySchoolId",
    method: "get"
  },
  getEquip:{
    url: "/equip_classroom/findEquipmentByClassroomId",
    method: "get"
  },
  getBrand:{
    url: "/equip_classroom/findBrandAndModelByEquipmentId",
    method: "get"
  },
  getPersons:{
    url: "/equip_classroom/userData",
    method: "get"
  },
  ope:{
    url: "/equip_classroom/saveStatusData",
    method: "get"
  },
  complete:{
    url: "/equip_classroom/finishHandle",
    method: "get"
  },
}
//设备
export const Device = {
  skip: {
    url: "/equip_status/is_jumpto_classroom", //是否弹出教室跳转框
    method: "post",
    headers: headerFrom
  },
  type: {
    url: "/equip_type/get_equip_types", //查询设备类型
    method: "get"
  },
  brand: {
    url: "/equipbrand/get_brands", //根据设备类型查询品牌
    method: "post",
    headers: headerFrom
  },
  list: {
    url: "/equip_info/get_equip_info", //通过查询条件查询设备
    method: "post",
    headers: headerFrom
  },
  SeveBrand: {
    url: "/equipbrand/save_brand", //通过查询条件查询设备
    method: "post",
    headers: headerFrom
  },
  links: {
    url: "/conntype/getconntype", //查询设备类型
    method: "get"
  },
  dataCtr: {
    url: "/ctrlcode/get_ctrlcode_by_equip", //保存设备信息
    method: "post",
    headers: headerFrom
  },
  addSeven: {
    url: "/equip_info/save_equip", //通过查询条件查询设备
    method: "post",
    headers: headerFrom
  },
  DeleteDevice: {
    url: "/equip_info/del_equip", //通过查询条件查询设备
    method: "post",
    headers: headerFrom
  },
  editor: {
    url: "/equip_info/get_equip_by_id", //通过查询条件查询设备
    method: "post",
    headers: headerFrom
  },
  schoolurl: {
    url: "/equip_classroom/get_schools_by_user", //获取学校数据
    method: "post",
    headers: headerFrom
  },
  adminschoolurl: {
    url: "/equip_classroom/get_schools ", //admin 获取学校数据
    method: "get"
  },
  Belongs: {
    url: "/equip_classroom/get_schools", //所属学校
    method: "get"
  },
  get_classrooms: {
    url: "/equip_classroom/get_classrooms", //通过查询条件查询设备
    method: "post",
    headers: headerFrom
  },
  get_classroom_tree: {
    url: "equip_classroom/get_school_room_by_user", //get_classroom_tree
    method: "post",
    headers: headerFrom
  },
  adminget_classroom_tree: {
    url: "equip_classroom/get_classroom_tree", //admin get_classroom_tree
    method: "get"
  },
  get_equip_rooms: {
    url: "/equip_classroom/get_equip_rooms", //查询房间设备信息
    method: "post",
    headers: headerFrom
  },
  save_equip_room: {
    url: "/equip_classroom/save_equip_room", //保存房间设备信息
    method: "post",
    headers: headerFrom
  },
  del_equip_room: {
    url: "/equip_classroom/del_equip_room", //删除房间设备信息
    method: "post",
    headers: headerFrom
  },
  get_equiproom_by_id: {
    url: "/equip_classroom/get_equiproom_by_id", //根据主键查询房间设备详情信息
    method: "post",
    headers: headerFrom
  },
  get_rctrlcode_by_equip: {
    url: "/rctrlcode/get_rctrlcode_by_equip", //根据教室、设备查询控制码
    method: "post",
    headers: headerFrom
  },
  upload_upgrade: {
    url: "/mc_upgrade/upload_upgrade", //上传文件
    method: "post",
    headers: upDate
  },
  get_upgrades: {
    url: "/mc_upgrade/get_upgrades", //上传文件
    method: "post",
    headers: headerFrom
  },
  get_room_num: {
    url: "/equip_classroom/get_room_num",
    method: "post",
    headers: headerFrom
  },
  get_equip_num: {
    url: "/equip_classroom/get_equip_num",
    method: "post",
    headers: headerFrom
  },
  get_datadic_by_type: {
    url: "/equip_info/get_datadic_by_type",
    method: "get"
  },
  get_ports_by_type: {
    url: "/connport/get_ports_by_type",
    method: "post",
    headers: headerFrom
  },
  get_dic_by_type: {
    url: "/equip_classroom/get_dics_by_type",
    method: "post",
    headers: headerFrom
  },
  get_upgrade_room: {
    url: "/upgrade_room/get_upgrade_room",
    method: "post",
    headers: headerFrom
  },
  upgrade_room: {
    url: "/upgrade_room/save_room",
    method: "post",
    headers: headerFrom
  },
  copy_equiproom: {
    url: "/equip_classroom/copy_equiproom",
    method: "post",
    headers: headerFrom
  },
  get_imei_by_room: {
    url: "/equip_classroom/get_imei_by_room",
    method: "post",
    headers: headerFrom
  },
  get_parent_id: {
    url: "/base_school/get_parent_id",
    method: "post",
    headers: headerFrom
  }
};

//控制
export const Ctrl = {
  get_equips: {
    url: "/equip_status/get_equips", //根据教室ID获取设备（设备操作）
    method: "post",
    headers: headerFrom
  },
  equipment_control: {
    url: "/equip_status/equipment_control", //根据教室ID获取设备（设备操作）
    method: "post",
    headers: headerFrom
  },
  one_key_class_over: {
    //下课
    url: "/equip_status/one_key_class_over",
    method: "post",
    headers: headerFrom
  },
  one_key_class_begin: {
    //上课
    url: "/equip_status/one_key_class_begin",
    method: "post",
    headers: headerFrom
  },
  get_equips_status: {
    url: "equip_status/get_equips_status",
    method: "post",
    headers: headerFrom
  },
  res_central_ctrl: {
    url: "equip_status/res_central_ctrl",
    method: "post",
    headers: headerFrom
  },
  get_camera: {
    url: "equip_status/get_camera",
    method: "post",
    headers: headerFrom
  },
  handleAutom: {
    url: "equip_status/update_is_AutoOpen",
    method: "post",
    headers: headerFrom
  }
};

//情景
export const Scen = {
  get_equips_qj: {
    url: "/equip_classroom/get_equips_qj", //根据教室ID获取设备（设备操作）
    method: "post",
    headers: headerFrom
  },
  get_scene_list: {
    url: "/scene/get_scene_list", //通过教室ID获取情景列表
    method: "post",
    headers: headerFrom
  },
  get_key_equips: {
    url: "/key_equip/get_key_equips",
    method: "post",
    headers: headerFrom
  },
  get_scene_seq_list: {
    url: "/scene_sequence/get_scene_seq_list",
    method: "post",
    headers: headerFrom
  },
  save_scene_seq: {
    url: "/scene_sequence/save_scene_seq",
    method: "post",
    headers: headerFrom
  },
  save_scene: {
    url: "/scene/save_scene", //通过教室ID获取情景列表
    method: "post",
    headers: headerFrom
  },
  del_scene: {
    url: "/scene/del_scene", //通过教室ID获取情景列表
    method: "post",
    headers: headerFrom
  },
  get_scene_no: {
    url: "/scene/get_scene_no"
  },
  get_scene_by_id: {
    url: "/scene/get_scene_by_id", //通过主键获取情景详情
    method: "post",
    headers: headerFrom
  }
};

//设备状态检测
export const DeviceState = {
  get_status_monitor: {
    url: "/equip_classroom/get_status_monitor",
    method: "post",
    headers: headerFrom
  },
  getExpand: {
    url: "/equip_classroom/get_jumpdata_By_classroomid",
    method: "post",
    headers: headerFrom
  }
};

//报警查看
export const Police = {
  get_alarm_view: {
    url: "/equip_classroom/get_alarm_view",
    method: "post",
    headers: headerFrom
  },
  handle_alartm: {
    url: "/equip_classroom/handle_alartm",
    method: "post",
    headers: headerFrom
  },
  del_handle: {
    url: "/equip_classroom/del_handle",
    method: "post",
    headers: headerFrom
  }
};

//设置
export const setUp = {
  get_roles: {
    url: "sys_role/get_roles",
    method: "post",
    headers: headerFrom
  },
  get_operation_tree: {
    url: "sys_menu/get_operation_tree",
    method: "get"
  },
  save_role_operation: {
    url: "sys_role/save_role_operation",
    method: "post",
    headers: headerFrom
  },
  get_role_by_id: {
    url: "sys_role/get_role_by_id",
    method: "post",
    headers: headerFrom
  },
  del_role: {
    url: "sys_role/del_role",
    method: "post",
    headers: headerFrom
  },
  get_menu_tree: {
    url: "sys_menu/get_menu_tree",
    method: "get"
  },
  save_menu: {
    url: "sys_menu/save_menu",
    method: "post",
    headers: headerFrom
  },
  info_menu: {
    url: "sys_menu/get_menu_by_id",
    method: "post",
    headers: headerFrom
  },
  del_menu: {
    url: "sys_menu/del_menu",
    method: "post",
    headers: headerFrom
  },
  get_operations_by_Menu: {
    url: "sys_operation/get_operations_by_Menu",
    method: "post",
    headers: headerFrom
  },
  save_operation: {
    url: "sys_operation/save_operation",
    method: "post",
    headers: headerFrom
  },
  del_operation: {
    url: "sys_operation/del_operation",
    method: "post",
    headers: headerFrom
  },
  get_users: {
    url: "sys_user/get_users",
    method: "post",
    headers: headerFrom
  },
  get_all_roles: {
    url: "sys_role/get_all_roles",
    method: "get"
  },
  save_user: {
    url: "sys_user/save_user",
    method: "post",
    headers: headerFrom
  },
  get_user_by_id: {
    url: "sys_user/get_user_by_id",
    method: "post",
    headers: headerFrom
  },
  reset_pwd: {
    url: "sys_user/reset_pwd",
    method: "post",
    headers: headerFrom
  },
  update_pwd: {
    url: "sys_user/update_pwd",
    method: "post",
    headers: headerFrom
  },
  del_user: {
    url: "sys_user/del_user",
    method: "post",
    headers: headerFrom
  },
  get_by_parentcode: {
    url: "sys_dic/get_by_parentcode",
    method: "post",
    headers: headerFrom
  },
  // adminget_by_parentcode: {
  // 	url: 'sys_dic/get_schools',
  // 	method: 'get',
  // },
  save_school: {
    url: "base_school/save_school",
    method: "post",
    headers: headerFrom
  },
  del_school: {
    url: "base_school/del_school",
    method: "post",
    headers: headerFrom
  },
  get_schools: {
    url: "base_school/get_schools", //get_schools
    method: "post",
    headers: headerFrom
  },
  get_level1: {
    url: "base_school/get_level1",
    method: "get"
  },
  get_level_by_parent: {
    url: "base_school/get_level_by_parent",
    method: "post",
    headers: headerFrom
  },
  get_school_by_id: {
    url: "base_school/get_school_by_id",
    method: "post",
    headers: headerFrom
  },
  get_classroom_by_school: {
    url: "base_classroom/get_classroom_by_school",
    method: "post",
    headers: headerFrom
  },
  save_classroom: {
    url: "base_classroom/save_classroom",
    method: "post",
    headers: headerFrom
  },
  del_classroom: {
    url: "base_classroom/del_classroom",
    method: "post",
    headers: headerFrom
  },
  get_classroom_by_id: {
    url: "base_classroom/get_classroom_by_id",
    method: "post",
    headers: headerFrom
  }
};
//操作日志
export const Log = {
  opeLog: {
    url: "aop_log/get_logs",
    method: "post",
    headers: headerFrom
  }
};
// 小程序管理
export const MiniPro = {
  getList: {
    url: "base_teacher/return_appletPC",
    method: "get",
    headers: headerFrom
  },
  ope: {
    url: "base_teacher/save_applet",
    method: "post",
    headers: headerFrom
  },
  del: {
    url: "base_teacher/delete_applet",
    method: "post",
    headers: headerFrom
  }
};
