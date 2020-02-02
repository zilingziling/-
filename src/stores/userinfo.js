// @flow
import { observable, action, autorun } from "mobx";
import { refreshToke, exitLogin } from "./../api/login";
import Socke from "./socket";
import { notification } from "antd";
class UserStore {
  @observable data = [];
  constructor() {
    // this.intercept();
  }
  @action updateStatus = (
    status: boolean,
    routerName: string,
    data: Object,
    Name: string,
    password: string,
    name: String
  ) => {
    this.data = data;
    window.localStorage.setItem("status", status);
    window.localStorage.setItem("data", JSON.stringify(data));
    window.localStorage.setItem("userName", Name);
    window.localStorage.setItem("password", password);
    window.localStorage.setItem("name", name);
    window.sessionStorage.setItem("status", true);
    window._guider.History.history.push({
      pathname: routerName
    });
    Socke.Socke();
    // this.intercept(data);
  };

  @action outLogin = async state => {
    let obj = window.localStorage.getItem("data");
    window.ws.close();
    try {
      if (state) {
        let res = await exitLogin(JSON.parse(obj).userid); //用户被挤下线不用调这个接口， 点击退出登录调用这个接口
        window.localStorage.clear();
        window.sessionStorage.clear();
        // 请求验证码
        window._guider.History.replace({
          pathname: "/login"
        });
        return;
      }
      window._guider.History.replace({
        pathname: "/login"
      });
    } catch (error) {
      console.log(error);
    }
  };
  //登录被挤下线
  @action LoginOfline = () => {
    notification["warning"]({
      message: "提示！",
      // placement: 'topLeft',
      duration: 10,
      description: "该账号已下线，请重新登录"
    });
  };
}
export default new UserStore();
