// @flow

import { makeRequest, formatReq } from "./config";
import { DeviceState } from "./url";

export const get_status_monitor = (id: number, pageNo: number) => {
  // console.log(seqList);
  const params = new URLSearchParams();
  params.append("schoolid", id);
  params.append("pageNo", pageNo);
  params.append("pageSize", 10);

  return makeRequest(DeviceState.get_status_monitor, params);
};
export const getExpand = id => {
  const params = new URLSearchParams();
  params.append("classroomId", id);
  return makeRequest(DeviceState.getExpand, params);
};
