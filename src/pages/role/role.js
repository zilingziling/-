//@flow
import React, { Component } from 'react';
import Paginations from '../component/Paginations/Paginations';
import Api from './../../api';
import { Input, Button, Icon } from 'antd';
import Table from './component/table';
import { observable, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import './../device/device.scss';
import './role.scss';
type Props = {
	match: Object,
	history: Object,
	location: Object,
};

@inject('Role')
@observer
class Role extends Component<Props> {

	componentDidMount() {
		if (this.props.Role.data.length === 0) {
			this.props.Role.list(1, '');
		}
	}
	render() {
		const { userName, data, total, current } = this.props.Role;
		return (
			<div className="role">
				<div className="role-header">
					<div className="role-header-left">
						<span className="role-header-left-span">角色名称：</span>
						<Input
							className="role-header-left-input"
							value={userName}
							onChange={this.onChange}
							onPressEnter={this.refresh}
							maxLength={20}
						/>
					</div>
					<Button onClick={this.refresh} className="role-btn antBtn" type="primary">
						搜索
					</Button>
				</div>
				<Table
					callback={this.refresh}
					data={toJS(data)} />
				<Paginations paging={this.paging}  current={current} total={total} />
			</div>
		);
	}
	//监听页面刷新
	paging = (current: number) => {
		this.props.Role.currentPage(current);
	}
	//添加保存刷新搜索
	refresh = () => {
		this.props.Role._search();
	}
	//监听
	onChange = (e: object) => {
		this.props.Role.userName = e.target.value;
	};
}
export default Role;