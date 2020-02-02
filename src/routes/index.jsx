import React, { Component } from "react";
import { Redirect } from "react-router";
import {
  HashRouter,
  Switch,
  Route,
  Router,
  BrowserRouter
} from "react-router-dom";
import Headr from "./../pages/Header/Headr";
import router from "./config";
import Historys from "./../utils/history";
import Redirctlogin from "./../containers/RedirectLogin";
import { RouteIsSHow } from "../pages/component/function/routerPmi";
import Userinfo from "../stores/userinfo.js";
import { toJS, autorun, Reaction, observable } from "mobx";
import { observer } from "mobx-react";
import UserStore from "../stores/userinfo.js";
import info from "../assets/img/info.png";
import google from "../assets/img/google.png";
import close from "../assets/img/close.png";

const Notice = props => {
  return (
    <div className="infoWrapper">
      <div className="text">
        <img src={info} />
        <p>{props.text}</p>
      </div>
      <div className="download">
        <a href="https://www.google.cn/chrome/index.html" target="_blank">
          <img src={google} alt="google" />
          <span>下载Chrome</span>
        </a>
        <img src={close} alt="close" onClick={props.setDisplay} />
      </div>
    </div>
  );
};
@observer
class Routes extends Component {
  state = {
    engine: null,
    text: "",
    display: true
  };
  @observable Index = [];
  componentDidMount() {
    //处理登录过后返回过来的Router
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
      this.setState({
        engine: "chrome" //
      });
    } else {
      this.setState({
        text: "当前浏览器或内核模式可能存在兼容性问题，建议更换后访问。"
      });
    }
    function getChromeVersion() {
      let arr = navigator.userAgent.split(" ");
      let chromeVersion = "";
      for (let i = 0; i < arr.length; i++) {
        if (/chrome/i.test(arr[i])) chromeVersion = arr[i];
      }
      if (chromeVersion) {
        return Number(chromeVersion.split("/")[1].split(".")[0]);
      } else {
        return false;
      }
    }
    if (getChromeVersion()) {
      let version = getChromeVersion();
      console.log(version);
      if (version < 66) {
        this.setState({
          text: "当前浏览器或浏览器内核版本过低，请下载新版chrome。",
          engine: "chromeLow"
        });
      }
    }
    autorun(() => {
      if (Userinfo.data.length === 0) {
        let res = JSON.parse(window.localStorage.getItem("data"));
        this.Index = RouteIsSHow(res);
      } else {
        this.Index = RouteIsSHow(toJS(Userinfo.data));
      }
    });
  }
  setDisplay = () => {
    this.setState({
      display: false
    });
  };

  render() {
    const { text } = this.state;
    const isLog = window.sessionStorage.getItem("logStatus");
    console.log(!isLog)
    return (
      <>
        {this.state.engine !== "chrome" && this.state.display ? (
          <Notice setDisplay={this.setDisplay} text={text} />
        ) : null}
        <Router history={Historys.history}>
          <Switch>
            <Route exact path="/" component={router.Login()} />
            <Route exact path="/login" component={router.Login()} />
            <Redirctlogin>
              <Headr IndexRouter={toJS(this.Index)} />
              <Route exact path="/" component={router.deviceForEletron()} />
              {this.Index.map(_RouterIndex)}
            </Redirctlogin>
            <Redirect from="*" to="/" />
            <Route path="/404" component={router.NoMatch} />
          </Switch>
        </Router>
      </>
    );
  }
}
export default Routes;

const _RouterIndex = (res, index) => {
  //如果新增加了页面需要在Config.js 注册Router

  try {
    let routerName = res.route;
    let func = router[routerName];
    let CP = func();
    return <Route key={index} exact path={`/${res.route}`} component={CP} />;
  } catch (error) {
    console.log(error);
    // UserStore.outLogin();    //如果发现新增页面获取直接闪退说明 你配置的router不对，
    // 可以把这个函数去掉看看哪里报错。 这个函数目的就是清楚缓存在本地的router，很久没退登录无法拉取最新的数据
  }
};
