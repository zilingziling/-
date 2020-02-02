// @flow

import { makeRequest, formatReq } from "./config";
import { setUp, Device } from "./url";

export const get_roles = (page: string, rolename: string) => {
  const params = new URLSearchParams();
  params.append("pageSize", 10);
  params.append("pageNo", page);
  params.append("rolename", rolename);
  return makeRequest(setUp.get_roles, params);
};

export const get_operation_tree = () => {
  return makeRequest(setUp.get_operation_tree);
};

export const save_role_operation = (id: number, data: string) => {
  const params = new URLSearchParams();
  if (id !== "") {
    params.append("id", id);
  }
  params.append("name", data.name);
  params.append("code", data.code);
  if (typeof data.operation !== "undefined") {
    data.operation.forEach((e, index) => {
      params.append("operation[" + index + "].id", e);
    });
  }
  return makeRequest(setUp.save_role_operation, params);
};

export const get_role_by_id = (id: Number) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.get_role_by_id, params);
};

export const del_role = (id: number) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.del_role, params);
};
export const get_menu_tree = () => {
  return makeRequest(setUp.get_menu_tree);
};
export const save_menu = (
  id: string,
  parent: string,
  name: string,
  fileList: Object,
  url: String
) => {
  const params = new FormData();
  params.append("id", id);
  if (parent !== false) {
    params.append("parent.id", parent);
  }
  params.append("name", name);
  params.append("file", fileList);
  params.append("url", url);

  return makeRequest(setUp.save_menu, params);
};

export const info_menu = (id: String) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.info_menu, params);
};

export const del_menu = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.del_menu, params);
};

export const get_operations_by_Menu = (pageNo: string, id: string) => {
  const params = new URLSearchParams();
  params.append("menuid", id);
  params.append("pageNo", pageNo);
  params.append("pageSize", 10);
  return makeRequest(setUp.get_operations_by_Menu, params);
};

export const save_operation = (all: object, menu: string, id: string) => {
  let params = formatReqs(all);
  params.append("menu.id", menu);
  params.append("id", id);
  return makeRequest(setUp.save_operation, params);
};

export const del_operation = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.del_operation, params);
};

export const get_users = (pageNo: string, name: string) => {
  const params = new URLSearchParams();
  params.append("pageNo", pageNo);
  params.append("accountname", name);
  params.append("pageSize", 10);
  return makeRequest(setUp.get_users, params);
};

export const get_all_roles = () => {
  return makeRequest(setUp.get_all_roles);
};

export const save_user = (all: object, id: string, roles: array) => {
  let params = formatReqs(all);
  params.append("id", id);
  // roles.forEach((e,index) => {
  // 	console.log(e);
  // 	params.append('role['+index+'].id', e);
  // });
  return makeRequest(setUp.save_user, params);
};

export const get_user_by_id = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.get_user_by_id, params);
};

export const reset_pwd = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.reset_pwd, params);
};

export const update_pwd = (all: object, id: string) => {
  let params = formatReqs(all);
  params.append("id", id);
  return makeRequest(setUp.update_pwd, params);
};

export const del_user = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.del_user, params);
};

export const _get_by_parentcode = () => {
  const params = new URLSearchParams();
  params.append("parent_code", "operation");
  return makeRequest(setUp.get_by_parentcode, params);
};

export const save_school = (
  name: string,
  type: string,
  parent: string,
  id: string,
  mark: number
) => {
  // console.log(parent);
  const params = new URLSearchParams();
  params.append("name", name);
  params.append("type.id", type);
  if (mark === 1) {
    if (id !== "") {
      params.append("parent.id", id);
    }
  } else if (mark === 2) {
    params.append("id", id);
    if (parent !== null) {
      params.append("parent.id", parent);
    }
  }
  return makeRequest(setUp.save_school, params);
};
export const _save = (all: object) => {
  //区域管理保存
  let params = formatReqs(all);
  return makeRequest(setUp.save_school, params);
};

export const del_school = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.del_school, params);
};

// export const get_schools = (pageNo: number, schoolid: string, schooltype: string, schoolname: string) => {
// 	const params = new URLSearchParams();
// 	params.append('pageNo', pageNo);
// 	params.append('schoolid', schoolid === null ? '' : schoolid);
// 	params.append('schooltype', schooltype);
// 	params.append('schoolname', schoolname);
// 	params.append('pageSize', 10);
// 	return makeRequest(setUp.get_schools, params);
// };
export const get_schools = (schoolid: string, pageNo: number) => {
  const params = new URLSearchParams();
  params.append("pageNo", pageNo);
  params.append("schoolid", schoolid);

  params.append("pageSize", 10);
  return makeRequest(setUp.get_schools, params);
};

export const get_level1 = (id: string) => {
  return makeRequest(setUp.get_level1);
};

export const get_level_by_parent = (id: string) => {
  const params = new URLSearchParams();
  params.append("parent_reg", id);
  return makeRequest(setUp.get_level_by_parent, params);
};

export const save_schoolList = (all: object) => {
  let params = formatReqs(all);
  return makeRequest(setUp.save_school, params);
};

export const get_school_by_id = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.get_school_by_id, params);
};

export const get_classroom_by_school = (
  schoolid: string,
  pageNo: string,
  roomname: String
) => {
  const params = new URLSearchParams();
  params.append("schoolid", schoolid);
  params.append("pageNo", pageNo);
  // params.append('roomname', roomname);
  params.append("pageSize", 10);
  return makeRequest(setUp.get_classroom_by_school, params);
};

export const save_classroom = (all: object) => {
  let params = formatReqs(all);
  return makeRequest(setUp.save_classroom, params);
};

export const del_classroom = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.del_classroom, params);
};

export const get_classroom_by_id = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(setUp.get_classroom_by_id, params);
};

export const get_by_parentcode = data => {
  const params = new URLSearchParams();
  params.append("parent_code", data);
  return makeRequest(setUp.get_by_parentcode, params);
};
// export const adminget_by_parentcode = (data) => {
// 	return makeRequest(setUp.adminget_by_parentcode);
// };
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
