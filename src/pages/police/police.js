//@flow
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Tables from './compoents/Tables';
import { Button, Modal } from 'antd';
import Paginations from '../component/Paginations/Paginations';
import Api from './../../api';
import { observable, toJS, autorun } from 'mobx';
import { observer, inject, } from 'mobx-react';
import { uint8Buff2Str, Uint8ArrayToString } from '../component/function/formatDateReturn';
import { RouterPmi } from '../component/function/routerPmi';

import './police.scss';
const confirm = Modal.confirm;

type Props = {
	match: Object,
	history: Object,
	location: Object,
	policeTaol: Object
};
type State = {
	deal: Array,
	delete: Array,
};
@inject('Police', 'Socke', 'DeviceDetection')
@observer
export default class Police extends Component<Props, State> {
	state = {
		deal: [],
		delete: [],
		_info: RouterPmi(),
		disabled:false
	};
	@observable
	componentDidMount() {

		// if (this.props.Police.untreatedData.length === 0) {
		// 	this.props.Police.list(0, 1); //报警查看数据
		// }
		// this.setState({
		// 	_info: RouterPmi(),
		// });
	}

	render() {
		const { untreatedData, current, total, mark } = this.props.Police;
		return (
			<div className="police" style={{ marginLeft: '12rem', marginTop: '1rem' }}>
				<Button disabled={this.state.disabled} type='primary' className="police-btn" onClick={this.AllProcessing}>批量处理</Button>
				<div className="police-header">
					<div className="police-header-btn">
						<Button onClick={this.switch.bind(this, true)} style={mark ? null : { background: '#0983cd', color: '#fff' }} type={mark ? 'primary' : ''}>未处理</Button>
						<Button onClick={this.switch.bind(this, false)} style={!mark !== true ? { background: '#0983cd', color: '#fff' } : {}} type={!mark ? 'primary' : ''}>已处理</Button>
					</div>
				</div>
				<Tables
					data={toJS(untreatedData)}
					mark={mark}
					ids={this.deal}
					delete={this.delete}
					refresh={this.refresh}
					refreshDelete={this.refreshDelete}
					_info={this.state._info}
					disabled={this.state.disabled}
				/>
				<Paginations
					current={current}
					total={total}
					paging={this.change}
				/>
			</div>
		);
	}
	//切换选向
	switch = (state: Boolean) => {

		this.props.Police.markfu(state);
		this.props.Police.pageNumber(1);
		if (state) {
			this.props.Police.list(0, 1);
			this.setState({
				disabled:false
			})
		} else {
			this.setState({
				disabled:true
			})
			this.props.Police.list(1, 1);
		}
	}
	//分页切换
	change = (e: number) => {
		if (this.props.Police.mark) {
			this.props.Police.list(0, e);
			this.props.Police.pageNumber(e);
		} else {
			this.props.Police.list(1, e);
			this.props.Police.pageNumber(e);
		}

	}
	//批量处理
	deal = (deal: Array) => {
		this.setState({ deal });
	}
	//批量删除
	delete = (e: Array) => {
		this.setState({ delete: e });
	}
	//处理
	AllProcessing = async () => {
		let deal = this.state.deal;
		let deletes = this.state.delete;
		if (this.props.Police.mark) {
			if (this.state.deal.length > 0) {
				confirm({
					title: '确定批量处理所选数据？',
					centered: true,
					onOk: async () => {
						if (this.state.deal !== null) {
							let res = await Api.Police.handle_alartm(deal);
							console.log(res);
							if (res.code === 200) {
								window._guider.Utils.alert({
									message: res.msg,
									type: 'success'
								});
								this.props.Police.list(0, this.props.Police.current);
							} else {
								window._guider.Utils.alert({
									message: res.msg,
									type: 'error'
								});
							}
						}
					},
					onCancel() { },
				});
			} else {
				window._guider.Utils.alert({
					message: '未选中设备',
					type: 'warning'
				});
			}
		} else {
			if (this.state.delete.length > 0) {
				confirm({
					title: '确定删除所选中的数据吗',
					centered: true,
					onOk: async () => {
						if (this.state.deal !== null) {
							let res = await Api.Police.del_handle(deletes);
							if (res.code === 200) {
								window._guider.Utils.alert({
									message: res.msg,
									type: 'success'
								});
								this.props.Police.list(0, this.props.Police.current);
							} else {
								window._guider.Utils.alert({
									message: res.msg,
									type: 'error'
								});
							}
						}
					},
					onCancel() { },
				});
			}
		}

	}
	//处理刷新
	refresh = () => {
		this.props.Police.list(0, this.props.Police.current);
	}
	//删除刷新
	refreshDelete = () => {
		this.props.Police.list(1, this.props.Police.current);
	}
}

// //接受消息
// _infomsg = () =>{
// 	window.ws.onmessage = (evt) => {
// 		try{
// 			let msg = new window.proto.com.yj.itgm.protocol.BaseMsg.deserializeBinary(evt.data);
// 			let obj = new window.proto.com.yj.itgm.protocol.EquipStatusReport.deserializeBinary(msg.getData());
// 			console.log(obj.getStatusType());
// 			if(obj.getStatusType() === 'classes_report'){
// 				this.props.Devicestateall.list(	this.props.Devicestateall.classid, 	this.props.Devicestateall.pageNo);
// 			}else if(obj.getStatusType() === 'fault_report'){
// 				this.props.Police.list(0,1);
// 			}
// 		}catch(error){
// 			console.log(error);
// 		}
// 	};
// }
