//@flow
import { makeRequest } from "./config";
import { Police } from "./url";

export const get_alarm_view = (state, pageNo) => {
  // console.log(seqList);
  const params = new URLSearchParams();
  params.append("handlestatus", state);
  params.append("pageNo", pageNo.page);
  params.append("pageSize", 10);
  params.append("schoolid", pageNo.schoolid);
  return makeRequest(Police.get_alarm_view, params);
};

export const handle_alartm = (ids: string) => {
  let userid = JSON.parse(window.localStorage.getItem("data")).userid;

  const params = new URLSearchParams();
  params.append("ids", JSON.stringify(ids));
  params.append("userid", userid);
  return makeRequest(Police.handle_alartm, params);
};
export const del_handle = (id: string) => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(Police.del_handle, params);
};
