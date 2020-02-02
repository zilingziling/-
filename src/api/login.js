// @flow

import { makeRequest, validations } from "./config";
import { LOGIN } from "./url";

export const UpLogin = (user: string, pass: string, code: string) => {
  // console.log(code);
  const params = new URLSearchParams();
  params.append("account", user);
  params.append("password", pass);
  params.append("verifycode", code);
  return validations(LOGIN.Login, params);
};
export const refreshToke = (tokne: string) => {
  const params = new URLSearchParams();
  params.append("token", tokne);
  return makeRequest(LOGIN.tokenUlr, params);
};

export const exitLogin = (userId: String) => {
  const params = new URLSearchParams();
  params.append("userid", userId);
  return makeRequest(LOGIN.exitLogin, params);
};

export const _imgUlr = data => {
  let param = {
    url: `sys_user/create_verify_code?${data}`, //验证码
    method: "get"
  };
  return makeRequest(LOGIN.validation);
};
