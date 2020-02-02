//@flow
/* eslint-disable indent */
import React, { Component } from "react";
import { Icon, Tree } from "antd";
// import { Tree } from "element-react";
import "./deviceSelePage.scss";
import { observable, toJS } from "mobx";
import { observer, inject } from "mobx-react";
// import "element-theme-default";
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;
const styles = {
  width: "12rem",
  display: "flex",
  color: " #fff",
  alignItems: "top",
  marginTop: "30px",
  height: "70vh",
  overflow: "auto",
  overflowY: "scroll",
  boxSizing: "border-box",
  paddingLeft: "1rem"
};
@inject("DeviceState", "DeviceDetection")
@observer
class DeviceSeleclass extends Component {
  @observable selected = [''];
  @observable expanded = [];
  @observable CtrTree = [];
  componentDidMount() {
    let expanded = window.localStorage.getItem("deviceExpanded");
    let selected = window.localStorage.getItem("deviceSelected");
    if (expanded !== null) {
      this.selected = [selected];
      this.expanded = [...JSON.parse(expanded)];
    }
  }
  render() {
    return (
      <div style={styles}>
        {/*电子科大设备控制页面树*/}
        <DirectoryTree
          // multiple
          motion={null}
          showLine={true}
          showIcon={false}
          onSelect={this.seleKey}
          onExpand={this.onExpand}
          selectedKeys={toJS(this.selected)}
          expandedKeys={toJS(this.expanded)}
        >
          {renderTreeNodes(toJS(this.props.DeviceState.list))}
        </DirectoryTree>
      </div>
    );
  }
  onExpand = (e: any, r) => {
    let select = r.node.props.dataref.row;
    this.expanded = e;
    let array = this.CtrTree;
    array.push(`${select.id}:${select.code}`);
    window.localStorage.setItem(
      "CtrSchoole",
      JSON.stringify([...new Set(array)])
    );
    window.localStorage.setItem("deviceExpanded", JSON.stringify(e));
    window.localStorage.setItem('stateE',JSON.stringify(e))
  };
  //é€‰æ‹©
  seleKey = (key: Array<Object>, e: Object) => {
    this.selected = key;
    window.localStorage.setItem("deviceSelected", key);
    let array = this.CtrTree;
    if (e.selectedNodes.length > 0) {
      let obj = e.selectedNodes[0].props.dataref.row;
      this.props.renderValue(obj.id, e);
      window.localStorage.setItem("devicesStateschool", obj.parent);
      window.localStorage.setItem("devicesStateClassroomid", obj.id);
    }
  };
}

export default DeviceSeleclass;

const renderTreeNodes = data => {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataref={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} dataref={item} />;
  });
};
