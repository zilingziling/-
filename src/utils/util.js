// @flow

import Noty from "noty"; // https://ned.im/noty/#/options
import "noty/lib/noty.css";
import "noty/lib/themes/nest.css";
import { notification } from "antd";
import NProgress from "nprogress"; // https://github.com/rstacruz/nprogress
import "nprogress/nprogress.css";

// Loding progress bar globally
export const loading: Object = {
  start() {
    NProgress.start();
  },
  set(n) {
    NProgress.set(n);
  },
  inc(n) {
    NProgress.inc(n);
  },
  done() {
    NProgress.done();
  }
};
// window.addEventListenerwindow.addEventListener('popstate', function(e) {
// });
// console.log(window);

// Show alert
// const noty = new Noty({
// 	theme: 'nest',
// 	timeout: 5000,
// 	progressBar: false,
// 	type: 'alert',
// 	text: '警告'
// });

export const alert: Function = (data: {
  message: string,
  type: string,
  i: number,
  datas: number
}) => {
  notification[data.type]({
    message: "提示",
    description: data.message,
    duration: data.type === "warning" || data.type === "error" ? 3.5 : 2,
    key: data.key ? data.key : null
  });

  // if(data.datas){
  // 	if(data.number >= 1){
  // 		Noty.closeAll();
  // 		Noty.setMaxVisible(1);
  // 		new Noty({
  // 			text: data.message,
  // 			type: data.type,
  // 			theme: 'nest',
  // 			timeout: 2000,
  // 			progressBar: false,
  // 		}).show();
  // 	}
  // }else{
  // 	Noty.closeAll();
  // 	Noty.setMaxVisible(1);
  // 	new Noty({
  // 		text: data.message,
  // 		type: data.type,
  // 		theme: 'nest',
  // 		timeout: 2000,
  // 		progressBar: false,
  // 	}).show();
  // }
  // console.log(data);
  // Noty.clearQueue(mes);
  // noty.setText(data.message, true).setType(data.type, true).show();
};
