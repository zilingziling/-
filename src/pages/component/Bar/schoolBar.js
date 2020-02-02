//@flow
import React, { Component } from "react";
import Api from "../../../api/index";
import { Divider, Tree, Row, Col, Select, Input, Modal } from "antd";
import { Models } from "../Model/model";
import { observable, toJS } from "mobx";
import { observer, inject } from "mobx-react";
import "./schoolBar.scss";
const { TreeNode } = Tree;
const Option = Select.Option;
const confirm = Modal.confirm;
const DirectoryTree = Tree.DirectoryTree;

type Props = {};
type State = {
  mark: number,
  treeData: Array,
  data: object,
  visible: Boolean,
  title: stirng,
  title: stirng,
  treeID: any,
  selectlist: Array,
  schoolText: stirng,
  selectID: stirng,
  name: stirng,
  treeName: stirng
};
@inject("Region")
@observer
class SchoolBar extends Component<Props, State> {
  state = {
    expandedKeys: [""],
    selected: []
  };
  componentDidMount() {
    let expandedKeys = window.localStorage.getItem("ExpRegion");
    let selected = window.localStorage.getItem("SelectRegion");
    if (expandedKeys !== null && selected !== null) {
      this.setState({
        selected: [selected],
        expandedKeys: JSON.parse(expandedKeys)
      });
    }
  }

  render() {
    const { expandedKeys, selected } = this.state;
    return (
      <div className="sb">
        <div className="schoolBar-bars">
          <DirectoryTree
            // multiple
            motion={null}
            showLine
            showIcon={false}
            onSelect={this.seleKey}
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            selectedKeys={selected}
          >
            {/*<TreeNode title="所有区域" key="topClass" id="" code="" dataRef={{code:""}}>*/}
              {renderTreeNodes(toJS(this.props.Region.treeData))}
            {/*</TreeNode>*/}
          </DirectoryTree>
        </div>
      </div>
    );
  }
  onExpand = e => {
    this.setState({ expandedKeys: e });
    window.localStorage.setItem("ExpRegion", JSON.stringify(e));
  };
  //tree点击
  seleKey = (e: Array, data: object) => {
    let topAry=[]
    console.log(data.node.props)
    this.props.Region.treeData.map(item=>{
      topAry.push({
        name:item.title,
        key:item.key,
        id:item.value,
        code:item.code
      })
    })
    if (e.length > 0) {
      if(e[0]==="topClass"){
        this.props.Region.data=topAry
      }else {
        this.props.Selevalue(e[0], data.node.props);
        window.localStorage.setItem("SelectRegion", e);
        this.setState({
          selected: e
        });
      }
    } else {
      this.props.Selevalue(null, null);
    }
  };
}
export default SchoolBar;
const formatData = (res: Array<Object>) => {
  let ant = [];
  res.forEach(e => {
    if (e.children) {
      ant.push({
        title: e.name,
        key: e.id,
        value: e.id,
        code: e.code,
        children: formatData(e.children),
        row: e
      });
    } else {
      ant.push({ title: e.name, key: e.id, value: e.id, code: e.code, row: e });
    }
  });
  return ant;
};

const renderTreeNodes = (data: Array<object>, parent: Object) => {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeNode
          parent={parent}
          code={item.code}
          title={item.title}
          value={String(item.value)}
          key={String(item.key)}
          dataRef={item}
        >
          {renderTreeNodes(item.children, item)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} dataRef={item} />;
  });
};
