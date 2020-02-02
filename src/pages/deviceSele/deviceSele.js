/* eslint-disable indent */
//@flow

import React, { Component } from 'react';
import Api from '../../api/index';
import Bar from '../component/Bar/deviceSeleclass';
import Pagination from '../component/Paginations/Paginations';
import { Tree, Table } from 'antd';
import { observable, toJS } from 'mobx';
import { observer, inject, } from 'mobx-react';
import { RouterPmi } from '../component/function/routerPmi';
import {getExpand} from "../../api/deviceState";
const TreeNode = Tree.TreeNode;
type Props = {
  match: Object,
  history: Object,
  location: Object
};
type State = {
  list: Arrar,
  current: Number,
  total: Number,
  listData: Arrar,
  columns: Arrar,
  school: string,
  classid: string
}
const devices = { display: 'flex' };
const deviceTable = {
  marginTop: '30px',
  marginLeft: '15px',
  width: '86rem',
};
@inject('DeviceState')
@observer
class DeviceSele extends Component<Props, State> {
  state = {
    current: 1,  //当前
    total: null, //总数
    listData: [], //数据
    columns: [
      { title: '位置', dataIndex: 'schoolroom', key: 'schoolroom' },
      { title: '中控IP', dataIndex: 'hostip', key: 'hostip' },
      {
        title: '操作', dataIndex: 'key', key: 'key', render: (text, render) => {
          return (
            <a disabled={!this.state._info.includes('device_config')} onClick={() => { this.linkAddDevice(text, render); }} href={null} style={{ color: '#a4d2fd' }}>配置</a>
          );
        }
      },
    ],
    classid: null, //教室
    school: null, //学校
  }

  async componentDidMount() {
    let classid = window.localStorage.getItem('devicesStateClassroomid'); //教室
    let school = window.localStorage.getItem('devicesStateschool'); //学校

    if (school !== null && classid !== null) {
      this.list(classid, '1');
      this.setState({
        classid,
        school
      });
    } else {
      this.list(null, '1');
    }
    this.setState({
      _info: RouterPmi()
    });
  }

  render() {
    return (
      <div style={devices}>
        <Bar renderValue={this.onchang} />
        <div style={deviceTable}>
          <Table
            className="device-tables-table"
            rowClassName="device-tables-tableRow"
            columns={this.state.columns}
            dataSource={this.state.listData}
            bordered
            pagination={false}
          />
          <Pagination
            current={this.state.current}
            total={this.state.total}
            paging={e => {
              this.setState({ current: e });
              this.list(this.state.classid, e);
            }}
          />
        </div>
      </div>
    );
  }
  //设备配置页面跳转到真正的配置页面

  linkAddDevice = async (text: Number, row: Object) => {
    let r=await getExpand(row.key)
    console.log(r.data)
    if(r.code===200){
      window.localStorage.setItem("stateE",JSON.stringify(r.data))
    }
    let array = [];
    let res = await Api.Device.get_parent_id(text);
    console.log(res)
    if (res.code === 200) {
      // console.log(res);
      res.data.forEach(element => {
        array.push(
          element.id + ':' + element.code
        );
      });
    }
    window.localStorage.setItem('school', this.state.classid);
    window.localStorage.setItem('classroomid', text);
    window.localStorage.setItem('CtrClassrommid', `${text}:classroom`); //设备控制页面bar
    window.localStorage.setItem('CtrSchoole', JSON.stringify(array)); //设备控制页面bar

    this.props.history.push({
      pathname: '/deviceAdd',
      query: text,
      shcool: this.state.classid,
    });
  }
  //选择
  onchang = (id: Number) => {
    this.setState({ classid: id });
    if (typeof id !== 'undefined') {
      this.list(id, this.state.current);
    } else {
      this.setState({
        listData: [],
        total: 0,
      });
    }
  }

  // 表格数据
  list = async (id: string, page: string) => {
    let res = await Api.Device.get_classrooms(id, page);
    if (res.code === 200) {
      if (res.data.rows.legnth !== 0) {
        this.setState({
          listData: this.formatTable(res.data.rows),
          total: res.data.total
        });
      } else {
        this.setState({
          listData: [],
          total: res.data.total
        });
      }
    }
  }
  //表格数据
  formatTable = (data: Array<Object>) => {
    let ant = [];
    data.forEach((res, index) => {
      ant.push({
        equipcode: res.equipcode,
        hostip: res.hostip,
        schoolroom: res.schoolroom,
        key: res.classroomid,
      });
    });
    return ant;
  }


}

export default DeviceSele;
