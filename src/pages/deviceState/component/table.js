//@flow
import React, { Component } from 'react';
import { Table, Badge } from 'antd';
import { Link } from 'react-router-dom';
import './../../device/device.scss';
import {getExpand} from "../../../api/deviceState";

type Props = {
	data: Array<string>,
	shcoolId: Number
};
type State = {
	columns: Array<Object>
};
class Tables extends Component<Props, State> {
	state = {
		_info: [],
		columns: [
			{ title: '位置', dataIndex: 'school_room', key: 'school_room' },
			{ title: '中控', dataIndex: 'hostip', key: 'hostip' },
			{
				title: '在线状态', dataIndex: 'equipstatusname', key: 'equipstatusname',
				render: (text, record) => {
					return (
						<Badge style={{color:"#a4d2fd"}} status={text==="网络连接"?"success":text==="网络断开"?"error":null} text={text} />
					);
				}
			},
			{
				title: '使用状态',
				dataIndex: 'usestatusname',
				key: 'usestatusname',

			},
			{
				title: '操作',
				dataIndex: 'key',
				key: 'key',
				render: (text: number, data: Object) => {
					return (
						<a onClick={this._clicke.bind(this, data)}>
							<span className="all-a" >查看操作</span>
						</a>
					);
				}
			}
		]
	};
	render() {
		return (
			<Table
				pagination={false}
				columns={this.state.columns}
				dataSource={this.props.data}
				className="device-tables-table"
				rowClassName="device-tables-tableRow"
				bordered
			/>
		);
	}
	_clicke =async (row: object) => {
		let r=await getExpand(row.classroomid)
		console.log(r.data)
		if(r.code===200){
			window.localStorage.setItem("stateE",JSON.stringify(r.data))
		}
		// console.log(row)
		window.localStorage.setItem('expand',`${row.buildingid}:school_academic_building`);
		window.localStorage.setItem('stateClassID', row.classroomid);
		window.localStorage.setItem('school', row.buildingid);
		window.localStorage.setItem('classroomid', row.classroomid);
		window.localStorage.setItem('CtrClassrommid', row.classroomid + ':classroom');
		window._guider.History.history.push({
			pathname: '/deviceForEletron',
			// routerName: '/devicesate',
			classroomid: row.classroomid,
		});
	}
}

export default Tables;
