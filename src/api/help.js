import { makeRequest, validations } from "./config";
import { Help, Log, LOGIN } from "./url";
export const getVer = () => {
  return makeRequest(Help.select);
};
export const getDetail = name => {
  const params = new URLSearchParams();
  params.append("vername", name);
  return validations(Help.detail, params);
};
export const opeLog = p => {
  const { pageNo, pageSize, selsign, username, begintime, endtime } = p;
  const params = new URLSearchParams();
  params.append("pageNo", pageNo);
  params.append("pageSize", pageSize);
  params.append("username", username);
  params.append("begintime", begintime);
  params.append("selsign", selsign);
  params.append("endtime", endtime);
  return makeRequest(Log.opeLog, params);
};
