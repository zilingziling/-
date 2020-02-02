// @flow
import axios from "axios";
axios.defaults.withCredentials = true;
import UserStore from "./../stores/userinfo";
export const instance = axios.create({
  baseURL: "/deviceapi",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});
// Catch error and print error log
export function failRequest(
  error: Object,
  defaultValue: any
): { message: string, error: Object | string } {
  let errMessage: {
    msg: string,
    error: Object | string,
    response?: Object
  };
  if (error && error.data) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.data.status === 404) {
      errMessage = {
        msg: "长时间未操作,请重新登录!",
        error: error.data.msg
      };
      // window._guider.Store.user.updateStatus(false, ''); // 退出登录,自动跳转到登录页
    } else {
      errMessage = {
        msg: "请求失败,系统报错:",
        error: error.data.msg
      };
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    errMessage = {
      msg: "网络错误,无法连接",
      error: error.request
    };
  } else {
    console.log(error);
    // Something happened in setting up the request that triggered an Error
    errMessage = {
      msg: error.message || error.msg || error, //error.msg ? error.msg : '请求参数错误:',
      error: error.msg
    };
  }
  // window._guider.Utils.log(errMessage);
  window._guider.Utils.alert({
  	message: errMessage.msg,
  	type: 'error',
    key:500
  });
  return defaultValue ? defaultValue : errMessage;
}

export function makeRequest(requestData: Object, data?: Object) {
  const config = {
    ...requestData
  };
  if (data) {
    if (config.method === "get") {
      config.params = data;
    } else {
      config.data = data;
    }
  }
  window._guider.Utils.loading.start();
  return instance(config)
    .then(res => {
      window._guider.Utils.loading.done();
      if (res.data.code === 0) {
        return res.data;
      }
      if (res.data.code === 200) {
        return res.data;
      }
      else if (res.data.code === 500) {
        window._guider.Utils.alert({
          message: res.data.msg,
          type: "error",
          key: 500
        });
        return res.data;
      }
      else if (res.data.code === 1008) {
        window._guider.Utils.alert({
          message: res.data.msg,
          type: "error",
          key: 1008
        });
        UserStore.outLogin(); //返回登录页面
        return res.data;
      } else if (res.data.code === 1004) {
        window._guider.Utils.alert({
          message: res.data.msg,
          type: "error"
        });
        return res.data;
      } else {
        throw new Error(res.data.msg ? res.data.msg : "网络获取数据错误!");
      }
    })
    .catch(error => {
      window._guider.Utils.loading.done();
      return failRequest(error);
    });
}

//登录
export function validations(requestData: Object, data?: Object) {
  const config = {
    ...requestData
  };
  if (data) {
    if (config.method === "get") {
      config.params = data;
    } else {
      config.data = data;
    }
  }
  window._guider.Utils.loading.start();

  return instance(config)
    .then(res => {
      window._guider.Utils.loading.done();
      if (res.data) {
        return res.data;
      } else {
        throw new Error(res.data.msg ? res.data.msg : "fetch 获取数据错误!");
      }
    })
    .catch(error => {
      window._guider.Utils.loading.done();
    });
}

export function formatReq(params: Object) {
  const data = new URLSearchParams();

  Object.keys(params).forEach(key => {
    data.append(key, params[key]);
  });

  return data;
}
