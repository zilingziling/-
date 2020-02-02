/* eslint-disable require-yield */

//@flow
export const decodeUtf8 = (bytes: Array<string>) => {
  var encoded = "";
  for (var i = 0; i < bytes.length; i++) {
    encoded += "%" + bytes[i].toString(16);
  }
  return decodeURIComponent(encoded);
};

//编码data
export const uint8Buff2Str = (u8array) => {
  let str = "";
  for (let i = 0; i < u8array.length; i++) {
    str += String.fromCharCode(u8array[i])
  }
  return str;
};
//发送
export const str2Uint8Buff = (strData: any) => {
  var x2 = new Uint8Array(strData.length);
  for (var i = 0; i < strData.length; i++) {
    x2[i] = strData.charCodeAt(i);
  }
  return x2;
};

//Uint8Array转字符串
export const Uint8ArrayToString = fileData => {
  var dataString = "";
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }

  return dataString;
};

//转换数据
export const ArrayDataFormat = (arr: Array<object>) => {
  arr = arr.map(item => {
    return {
      ...item,
      highlight: "0"
    };
  });
  return arr;
};

//把数据状态加上
export const arrarDataAddState = (
  previous: Array<object>,
  original: Array<object>
) => {
  previous.forEach((element, index) => {
    if (element.key_id === original.keyId) {
      element.highlight = "1";
    }
  });
  return previous;
};

//处理状态数据
export const stateCtrLight = (
  data: Array<object>,
  returnData: Array<object>
) => {
  let beforeDAta = ArrayDataFormat(data); //初始化状态
  let newData = arrarDataAddState(beforeDAta, returnData);
  return newData;
};
export const handleProjector = (init, fromWS) => {
  let handledData;
  handledData = init.map(item => {
    if (item.equip_code === fromWS.equipCode) {
      item.highlight = "0";
      if (item.key_id === fromWS.keyId) {
        item.highlight = fromWS.hightlight;
      } else {
        if (fromWS.hightlight === "0") {
          item.highlight = "1";
        } else if (fromWS.hightlight === "1") item.highlight = "0";
      }
    }
    return item;
  });
  return handledData;
};
//js 字节数组转十六进制字符串
export const Bytes2Str = (arr: Array<number>) => {
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    let tmp = arr[i].toString(16);
    if (tmp.length == 1) {
      tmp = "0" + tmp;
    }
    str += tmp;
  }
  return str;
};

//生成器函数， 红外学习的时候使用， 管理库码
export function* idMarker(array) {
  if (array.length) {
    for (let i = 0; i < array.length; i++) {
      yield array[i];
    }
  } else {
    yield undefined;
  }
}

//判断对象里面是否有空或者null、用于参数提交时候
export const checkBe = obj => {
  if (!(typeof obj == "object")) {
    return;
  }
  for (var key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      (obj[key] == null || obj[key] == undefined || obj[key] == "")
    ) {
      delete obj[key];
    }
  }
  return obj;
};

//防抖或节流函数封装
export const debounce = (func, wait = 300) => {
  try {
    let timeout; // 定时器变量
    return function(event) {
      clearTimeout(timeout); // 每次触发时先清除上一次的定时器,然后重新计时
      event.persist && event.persist(); //保留对事件的引用
      //const event = e && {...e}   //深拷贝事件对象
      timeout = setTimeout(() => {
        func(event);
      }, wait); // 指定 xx ms 后触发真正想进行的操作 handler
    };
    // eslint-disable-next-line no-unreachable
  } catch (error) {
    console.log(error);
  }
};

export const throttle = (func, delay) => {
  let timer = null;
  return function() {
    let context = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  };
};
