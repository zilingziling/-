/* eslint-disable indent */
// @flow
import React, { Component } from 'react';
import { Button, Upload, message, Select, Input } from 'antd';
// import Api from './../../../api';
import Searchs from './search';
import Modles from './Modles';
import { observable, toJS } from 'mobx';
import { observer, inject, } from 'mobx-react';
import { RouterPmi } from '../../component/function/routerPmi';

const Option = Select.Option;

type Props = {
	searchInfo: Function
};
type State = {
	deviceType: Array<object>,
	deviceValue: string,
	brandType: string,
	inpuValue: string,
	title: string,
	visible: Boolean
};
@inject('Devices')
@observer
class Header extends Component<Props, State> {
	state = {
		deviceType: [],
		deviceValue: '', //设备
		brandType: '',
		inpuValue: '', //input
		brandTypeId: '',
		title: '',
		visible: false,
		_info: RouterPmi(),//[]
	};
	async componentDidMount() {
		// this.setState({
		// 	_info: RouterPmi(),
		// });
	}

	render() {
		const { deviceType, deviceValue, brandType, inpuValue, brandTypeId } = this.state;
		return (
			<div className="device-header">
				<div className="device-header-addUpdate">
					<Button
						disabled={!this.state._info.includes('add_ control_devices')}
						onClick={() => {
							this.setState({ visible: true, title: '添加控制码' });
						}}
						className="device-header-addUpdate-btn"
						type="primary"
					>
						新增设备控制码
					</Button>
				</div>
				<Searchs
					searchInfo={(deviceValue, brandType, inpuValue, brandTypeId) => {
						this.setState({
							deviceValue: deviceValue,
							brandType: brandType,
							inpuValue: inpuValue,
							brandTypeId: brandTypeId,
						});
						this.props.searchInfo(deviceValue, brandType, inpuValue, brandTypeId);
					}}
				/>

				<Modles
					width={700}
					title={this.state.title}
					visible={this.state.visible}
					data={deviceType}
					handleOk={() => {
						console.log(1);
					}}
					itme={{}}
					onCancel={() => {
						this.props.renderList(deviceValue, brandType, inpuValue, brandTypeId);
						this.setState({ visible: false });
					}}
				/>
			</div>
		);
	}
}

export default Header;
