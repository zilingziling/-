import React from "react";
import ReactDOM from "react-dom";
// import "@babel/polyfill";

// 编译
import "core-js/features/array/from"; // <- at the top of your entry point
import "core-js/features/array/flat"; // <- at the top of your entry point
import "core-js/features/set"; // <- at the top of your entry point
import "core-js/features/promise"; // <- at the top of your entry point
import "core-js/features/symbol"; // <- at the top of your entry point
import "core-js/stable";
import "core-js";
import "regenerator-runtime/runtime";

import * as Utils from "./utils/util";
import * as serviceWorker from "./serviceWorker";

import History from "./utils/history";
import App from "./routes/index";
import zhCN from "antd/lib/locale-provider/zh_CN";
import { LocaleProvider } from "antd";
import { Provider } from "mobx-react";
import { AppContainer } from "react-hot-loader"; // 包裹根节点，想要渲染的内容，热更新需要的
import Store from "./stores/allStore";

import "moment/locale/zh-cn";
import "./utils/component";
import "./scss/index.css";
import "./scss/index.scss";
import "./scss/fontcss/fontawesome-all.min.css";
window._guider = {
  Utils,
  History
};

//热更新页面代码
const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider {...Store}>
        <LocaleProvider locale={zhCN}>
          <App />
        </LocaleProvider>
      </Provider>
    </AppContainer>,
    document.getElementById("root")
  );
};
render(App);
if (module.hot) {
  module.hot.accept("./routes/index", () => {
    // eslint-disable-next-line semi
    const NextApp = require("./routes/index").default;
    render(NextApp); // 重新渲染到 document 里面
  });
}
// //不想要热更新直接打开，把上面的注释掉⬆️
// ReactDOM.render(
// 	<Provider {...Store}>
// 		<LocaleProvider locale={zhCN}>
// 			<App />
// 		</LocaleProvider>
// 	</Provider>
// 	,document.getElementById('root')
// );

serviceWorker.unregister();
