// @flow
import React, { Component } from 'react';
import Header from './component/devicesHead';
import Table from './component/tables';
import Bar from '../component/Bar/bar';
import Pagination from '../component/Paginations/Paginations';
import Api from '../../api/index';
import './deviceadd.scss';
import { observable, } from 'mobx';
import { observer, inject } from 'mobx-react';
type Props = {
	match: Object,
	history: Object,
	location: Object,

};
type State = {
	current: number,
	classroomId: any,
	total: number,
	shcool: String,
	linkInfo: any,
	dataSource: Array,
}
const Flex = {
	display: 'flex',
};
@inject('DeviceState', 'userInfo')
@observer
class DeviceAdd extends Component<Props, State> {
	constructor(props: any) {
		super(props);
		this.state = {
			current: 1,   //当前页数
			total: null,	//总数
			shcool: '',	  //学校
			dataSource: [],	//数据
		};
	}
	componentDidMount = () => {
		let school = window.localStorage.getItem('school');
		let classroomId = window.localStorage.getItem('classroomid');
		// 设备控制页面存下来的教室id
		if (classroomId !== null && school !== null) {
			this.setState({
				classroomId,
				shcool: school,
			});
			this.list(classroomId, 1);
		}
		else if (typeof (this.props.location.shcool) !== 'undefined') {
			this.setState({
				classroomId: this.props.location.query,
				shcool: this.props.location.shcool,
			});
			this.list(this.props.location.query, 1);
		}else {
			this.setState({
				classroomId:""
			})
		}
		if (this.props.DeviceState.location.length === 0) {
			this.props.DeviceState._location();
			this.props.DeviceState._allDictionary();
		}
	}
	deviceAddSelect=(e, data) => {
		if(e.includes("classroom")){
			this.setState({ classroomId: e.split(':')[0], linkInfo: data });
			this.list(e.split(':')[0], this.state.current);
		}else {
			this.setState({
				classroomId:"",
				dataSource:[]
			})
		}
	}
	render() {
		return (
			<div className="deviceadd" style={Flex}>
				<Bar
					Seleshcool={this.deviceAddSelect} />
				<div className="deviceadd-body">
					<Header
						shcool={this.state.shcool}
						props={this.props}
						linkInfo={this.state.linkInfo}
						refreshList={() => {
							this.list(this.state.classroomId, this.state.current);
						}} classroomId={this.state.classroomId} />
					<Table
						shcool={this.state.shcool}
						listRender={() => {
							this.list(this.state.classroomId, this.state.current);
						}}
						classroomId={this.state.classroomId}
						Delete={(id) => { this.Delete(id); }}
						data={this.state.dataSource}
					/>
					<Pagination
						current={this.state.current}
						total={this.state.total}
						paging={e => {
							this.setState({ current: e });
							this.list(this.state.classroomId, e);
						}}
					/>
				</div>
			</div>
		);
	}
	//删除
	Delete = async (id) => {
		let res = await Api.Device.del_equip_room([id]);
		if (res.code === 200) {
			window._guider.Utils.alert({
				message: res.msg,
				type: 'success'
			});
			this.list(this.state.classroomId, this.state.current);
		}
	}
	//列表
	list = async (val: string, page: number) => {
		if(!val){
			this.setState({
				dataSource:[]
			})
			return
		}
		let res = await Api.Device.get_equip_rooms(val, page);
		if (res.code === 200) {
			if (res.data.rows.length !== 0) {
				this.setState({
					dataSource: this.foramData(res.data.rows),
					total: res.data.total,
				});
			} else if (res.data.pageNo > '1' && res.data.rows.length === 0) {
				this.setState({ current: parseInt(res.data.pageNo) - 1 });
				this.list(val, res.data.pageNo - 1);
			} else {
				this.setState({ dataSource: [], total: res.data.total });

			}

		}
	}
	//解析数据
	foramData = (res: Array) => {
		let ant = [];
		res.forEach((e, index) => {
			ant.push({
				equipid: e.equipid,
				equipmodel: e.equipmodel,
				createtime: e.createtime,
				equipname: e.equipname,
				hostip: e.hostip,
				creater: e.creater,
				equiptypename: e.equiptypename,
				classroomid: e.classroomid,
				connname: e.connname,
				brandcnname: e.brandcnname,
				key: e.id,
				equipTypeId: e.equiptypeid,
				rtsp_addr: e.rtsp_addr,
				addr_format: e.addr_format,
				equiptypeimg: e.equiptypeimg,
			});
		});
		return ant;
	}
}

export default DeviceAdd;
