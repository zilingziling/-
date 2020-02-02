// @flow
import React, { Component } from 'react';
import Header from './components/header';
import Tables from './components/Tables';
import Pagination from '../component/Paginations/Paginations';
import Api from './../../api';
import { message, Spin, } from 'antd';
import { observable, toJS } from 'mobx';
import { observer, inject, } from 'mobx-react';
import './device.scss';

type Props = {
	match: Object,
	history: Object,
	location: Object,
	Devices: Object
};

type State = {
	dataSrouce: Array<Object>,
	current: number,
	total: string
};


@inject('Devices', 'Socke', 'DeviceState')
@observer
class Device extends Component<Props, State> {
	componentDidMount() {
		if (this.props.Devices.dataSrouce.length === 0) {
			this.props.DeviceState._allDictionary(); // 波特率 数据位 停止位 校验 接口
			// this.props.Devices.validation(); //设备类型
			this.props.Devices.list(1, '', '', '', '');
		}

	}

	render() {
		const { total, dataSrouce, current, _info } = this.props.Devices;
		return (
			<div className="device">
				<Header
					searchInfo={this.infoSearch}
					renderList={(type, brandType, deviceValue, brandTypeId) => { this.props.Devices.list(this.props.Devices.current, type, brandType, deviceValue, brandTypeId); }}
				/>
				<Tables
					DeleteDevice={this.Det}
					data={dataSrouce}
				/>
				<Pagination
					current={current}
					total={total}
					paging={e => {
						this.props.Devices.list(
							e,
							this.props.Devices.search.type,
							this.props.Devices.search.brandType,
							this.props.Devices.search.deviceValue,
							this.props.Devices.search.brandTypeId
						);
						this.props.Devices.current = e;
					}}
				/>
			</div>
		);
	}
	//搜索返回回来的参数，来请求list列表
	infoSearch = (type: string, brandType: string, deviceValue: string, brandTypeId: string) => {
		this.props.Devices.search = {
			type: type,
			brandType: brandType,
			deviceValue: deviceValue,
			brandTypeId: brandTypeId,
		};
		this.props.Devices.list(this.props.Devices.current, type, brandType, deviceValue, brandTypeId);
	}

	//删除设备
	Det = async (id: number) => {
		let res = await Api.Device.DeviceDlet(id);
		window._guider.Utils.alert({
			message: res.msg,
			type: 'success'
		});
		if (res.code === 200) {
			this.props.Devices.list(
				this.props.Devices.current,
				this.props.Devices.search.type,
				this.props.Devices.search.brandType,
				this.props.Devices.search.deviceValue,
				this.props.Devices.search.brandTypeId
			);
		}
	};


}

export default Device;
