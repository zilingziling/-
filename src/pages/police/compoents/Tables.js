//@flow
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Table, Divider, Modal } from 'antd';
import './../../device/device.scss';
import Api from './../../../api';
const confirm = Modal.confirm;
type Props = {
	match: Object,
	history: Object,
	location: Object,
	data: Array<Object>,
	ids: Function,
	delete: Function,
	mark: Boolean,
	refresh: Function,
	refreshDelete: Function,
};
type State = {
	columns: Array<Object>
};
class Tables extends Component<Props, State> {
	state = {
		columns: [
			{ title: '位置', dataIndex: 'schoolroom', key: 'schoolroom' },
			{title: '发生时间', dataIndex: 'event_time', key: 'event_time' },
			{ title: '事件类型', dataIndex: 'eventtypename', key: 'eventtypename' },
			{
				title: '操作',
				dataIndex: 'key',
				key: 'key',
				render: (text, data) => {
					return (
						<div>
							<a disabled={!this.props._info.includes('delete')} onClick={this.deals.bind(this, data)} className="all-a" href={null}>
								处理
							</a>
						</div>
					);
				}
			}
		],
		Have: [
			{width:"40%", title: '位置', dataIndex: 'schoolroom', key: 'schoolroom' },
			{width:"15%", title: '发生时间', dataIndex: 'event_time', key: 'event_time' },
			{width:"15%", title: '事件类型', dataIndex: 'eventtypename', key: 'eventtypename' },
			{width:"10%", title: '处理人员', dataIndex: 'handler', key: 'handler' },
			{width:"15%", title: '处理时间', dataIndex: 'handletime', key: 'handletime' },
			{
				title: '处理', dataIndex: 'key', key: 'key', render: (text, data) => {
					return (
						<a disabled={!this.props._info.includes('delete')} className="all-a" href={null} onClick={this.Deletes.bind(this, data)}>删除</a>
					);
				}
			},
		],
		selectedRowKeys: null
	};
	render() {
		const { selectedRowKeys } = this.state;
		// const rowSelection = {
		// 	selectedRowKeys,
		// 	onChange: this.onSelectChange,
		// };
		return (
			<div className="police-tables">
				<Table
					pagination={false}
					columns={this.props.mark ? this.state.columns : this.state.Have}
					dataSource={this.props.data}
					className="device-tables-table"
					rowClassName="device-tables-tableRow"
					bordered
					rowSelection={this.props.disabled?null:{
						onChange: this.onSelectChange,
						selectedRowKeys,
					}}
				/>
			</div>
		);
	}
	//处理报警
	deals = async (data: Object) => {
		confirm({
			title: '异常已解决并标记为已处理？',
			centered: true,
			onOk: async () => {
				let res = await Api.Police.handle_alartm([data.key]);
				console.log(res);
				if (res.code === 200) {
					window._guider.Utils.alert({
						message: res.msg,
						type: 'success'
					});
					this.props.refresh();
					// this.list(0, this.state.current);
				} else {
					window._guider.Utils.alert({
						message: res.msg,
						type: 'error'
					});
				}
			},
			onCancel() { },
		});
	}
	onSelectChange = (selectedRowKeys: Array<number>, selectedRows: Array<number>) => {
		// console.log(selectedRows);
		if (this.props.mark) {
			let ant = [];
			selectedRows.forEach((time) => {
				ant.push(time.key);
			});
			this.props.ids(ant);
			this.setState({ selectedRowKeys });
		} else {
			let data = [];
			selectedRows.forEach((time) => {
				data.push(time.key);
			});
			this.props.delete(data);
			this.setState({ selectedRowKeys });

		}
	}
	//删除
	Deletes = (data: object) => {
		// console.log(data);
		confirm({
			title: '删除' + data.schoolroom + '吗？',
			centered: true,
			onOk: async () => {
				let res = await Api.Police.del_handle(data.key);
				console.log(res);
				if (res.code === 200) {
					window._guider.Utils.alert({
						message: res.msg,
						type: 'success'
					});
					this.props.refreshDelete();
				} else {
					window._guider.Utils.alert({
						message: res.msg,
						type: 'error'
					});
				}
			},
			onCancel() { },
		});
	}
}

export default Tables;
