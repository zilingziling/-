// @flow
import React from "react";
import Loadable from "react-loadable";
import Stores from "./../stores";
import Loading from "./../components/loading";

//注册Router过后是一级页面，需要在Header文件中添加进去
const router = {
  //这里定义的名字Login必须和你添加菜单的名字相同
  Login: () =>
    Loadable({
      loader: () => import("./../pages/login/login"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),

  devicesate: () =>
    //设备添加控制码
    Loadable({
      loader: () => import("./../pages/deviceState/deviceState"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  device: () =>
    //设备新增
    Loadable({
      loader: () => import("./../pages/device/device"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  devicesele: () =>
    //设备教室选择 1
    Loadable({
      loader: () => import("./../pages/deviceSele/deviceSele"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  deviceAdd: () =>
    //设备教室选择
    Loadable({
      loader: () => import("../pages/devicesAdd/deviceAdd"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  // 电子科大设备控制
    deviceForEletron: () =>
    //设备教室选择
    Loadable({
      loader: () => import("../pages/deviceForElectron/deviceForElectron"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  update: () =>
    //中控升级
    Loadable({
      loader: () => import("./../pages/Update/update"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  TouchUpdate: () =>
    //中控升级
    Loadable({
      loader: () => import("./../pages/Update/update"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  updateTable: () =>
    //中控升级
    Loadable({
      loader: () => import("./../pages/Update/UpdateTab"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  TouchUpdateTable: () =>
    //触控升级 1
    Loadable({
      loader: () => import("./../pages/Update/UpdateTabTouch"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
    // 故障登记
    faultRegister: () =>
        //触控升级
        Loadable({
            loader: () => import("./../pages/faultRegister/faultRegister"),
            render(loaded, props) {
                const Component = loaded.default;
                return <Component {...props} userStore={Stores} />;
            },
            loading() {
                return <Loading />;
            },
            delay: 300
        }),
  operating: () =>
    //					设备工作和报警情况
    Loadable({
      loader: () => import("./../pages/operating/operating"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  // police: () =>
  //   //报警
  //   Loadable({
  //     loader: () => import("./../pages/police/police"),
  //     render(loaded, props) {
  //       const Component = loaded.default;
  //       return <Component {...props} userStore={Stores} />;
  //     },
  //     loading() {
  //       return <Loading />;
  //     },
  //     delay: 300
  //   }),

  deviceScene: () =>
    //情景
    Loadable({
      loader: () => import("./../pages/SceneMode/scenMode"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  role: () =>
    //角色
    Loadable({
      loader: () => import("./../pages/role/role"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  jurisd: () =>
    //权限
    Loadable({
      loader: () => import("./../pages/Jurisdiction/Jurisdiction"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),

  user: () =>
    //用户
    Loadable({
      loader: () => import("./../pages/User/user"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  menu: () =>
    //菜单
    Loadable({
      loader: () => import("./../pages/menu/menu"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),

  opeLog: () =>
    //操作日志 1
    Loadable({
      loader: () => import("./../pages/opeLog/opeLog"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  miniProManage: () =>
    //操作日志
    Loadable({
      loader: () => import("./../pages/miniPro/miniPro"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),

  region: () =>
    //区域管理
    Loadable({
      loader: () => import("./../pages/region/region"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  aiUpdate: () =>
    //ai升级
    Loadable({
      loader: () => import("./../pages/Update/update"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  updateTableAi: () =>
    //ai升级
    Loadable({
      loader: () => import("./../pages/Update/updateTabAi"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  NoMatch: () =>
    Loadable({
      loader: () => import("./../components/Order"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    }),
  help: () =>
    Loadable({
      loader: () => import("./../pages/helpBook/helpBook"),
      render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} userStore={Stores} />;
      },
      loading() {
        return <Loading />;
      },
      delay: 300
    })
};
export default router;
