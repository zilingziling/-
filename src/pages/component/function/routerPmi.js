//处理权限按钮和页面操作
//进入页面获取函数然后打印出来权限，注意权限必须在菜单管理里面添加、如果发现下拉出来的没得你想要的按钮权限可以在给字典管理添加，需要给后端说。
export const RouterPmi = () => {
  try {
    let array = [];
    let res = JSON.parse(window.localStorage.getItem("data")); //格式化数据权限
    if (res !== null) {
      if (res.menu_operation_tree !== null) {
        let PermisData = res.menu_operation_tree[0].children;
        if (PermisData.length > 0) {
          PermisData.forEach((e, index) => {
            //遍历每个权限
            if (`/${e.route}` === window.location.pathname) {
              //判断当前的url和权限url相同就执行下一步
              if (e.operationList.length > 0) {
                e.operationList.forEach(element => {
                  array.push(element.code);
                });
              }
            }
          });
        }
      }
    }
    return array;
  } catch (error) {
    console.log(error);
  }
};

//处理隐藏和显示
export const RouteIsSHow = res => {
  let array = [];
  try {
    if (res) {
      if (res.menu_operation_tree.length > 0) {
        let PermisData = res.menu_operation_tree[0].children;
        array = PermisData;
      }
    }
    return array;
  } catch (error) {
    console.log(error);
  }
};
