//@flow
import React, { Component } from 'react';
import './menu.scss';
import MenuBar from './menuBar';
import Api from './../../api';
import { Button, Form, Input, Radio, Table, Divider, Modal, Select } from 'antd';
import { Models } from '../component/Model/model';
import Paginations from '../component/Paginations/Paginations';
import { observable, toJS, } from 'mobx';
import { observer, inject } from 'mobx-react';
const confirm = Modal.confirm;
const { Option } = Select;
let count = 0;

const FormItem = Form.Item;
const menuFormItemLayout = {
	labelCol: {
		xs: { span: 28 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 28 },
		sm: { span: 8 }
	}
};
type Props = {
	match: Object,
	history: Object,
	location: Object,
	MenTree: Object,
};
type State = {
	treeId: string,
	data: Array<Object>,
	total: string,
	current: Number,
	visible: boolean,
	title: string,
	id: string,
	columns: Array<Object>,
	row: object,

}

@inject('MenTree')
@observer
class Menu extends Component<Props, State> {
	state = {
		treeId: null, //树形结构ID
		data: null, // 列表数据
		total: null, //总数
		current: 1, //当前页数
		visible: false,  //Model
		title: '',
		id: '',  //表格id
		columns: [
			{ title: '操作名称', dataIndex: 'name', key: 'name' },
			{ title: '操作代码', dataIndex: 'dictid', key: 'dictid' },
			{ title: '操作RUL', dataIndex: 'url', key: 'url' },
			{ title: '启用状态', dataIndex: 'is_show_name', key: 'is_show_name' },
			{
				title: '操作', dataIndex: 'id', key: 'id', render: (id: string, row: object) => {
					return (
						<div>
							<a className="all-a" onClick={this.itemClick.bind(this, row, 1)} href={null}>编辑</a>
							<Divider style={{ background: 'rgb(0, 160, 233)' }} type="vertical" />
							<a className="all-a" onClick={this.itemClick.bind(this, row, 2)} href={null}>删除</a>
						</div>
					);
				}
			},
		],
		row: {},
	}
	componentDidMount() {
		if (this.props.MenTree.TreeDataSorce.length === 0) {
			this.props.MenTree._tree();
		}
		if (this.props.MenTree.Pmisd.length === 0) {
			this.props.MenTree._PmisData();
		}
	}
	render() {
		const { visible, title, row, current, total } = this.state;
		const { TreeDataSorce, _tree } = this.props.MenTree;
		return (
			<div className="menus">
				<MenuBar
					refresh={() => { _tree(); }}
					treeData={toJS(TreeDataSorce)}
					treeId={this.treeId}
				/>
				<div className="menus-all">
					<div className="menus-all-btn">
						<Button onClick={this.onClick} type='primary' size='large'>新增</Button>
					</div>
					<Table
						onRow={record => {
							return {
								onClick: this.RowTable.bind(this, record),
							};
						}}
						pagination={false}
						dataSource={this.state.data}
						bordered
						className="device-tables-table"
						rowClassName="device-tables-tableRow"
						columns={this.state.columns}
					/>
					<Paginations paging={this.paging} current={current} total={total} />
				</div>
				<Models
					width={800}
					visible={visible}
					title={title}
					handleOk={this.handleOk}
					onCancel={this.onCancel}
				>
					<Info
						ref={node => (this.infos = node)}
						info={row}
					/>
				</Models>
			</div>
		);
	}
	RowTable = (e) => {
		count += 1;
		setTimeout(() => {
			if (count === 2) {
				this.itemClick(e, 1);
			}
			count = 0;
		}, 300);
	}
	//分页监听
	paging = (current: string) => {
		this.setState({
			current,
		});
		this.list(current, this.state.treeId);
	}
	//删除点击列表数据
	itemClick = async (row: object, mark: number) => {
		if (mark === 1) {
			// console.log(row);
			let state;
			if (row.is_show_name === '启用') {
				state = '1';
			} else {
				state = '0';
			}
			row['mark'] = state;
			this.setState({
				row,
				visible: true,
				id: row.id,
			});
		} else if (mark === 2) {
			confirm({
				centered: true,
				title: '确定删除操作 ' + row.name + '吗',
				onOk: async () => {
					let res = await Api.setUp.del_operation(row.id);
					if (res.code === 200) {
						window._guider.Utils.alert({
							message: res.msg,
							type: 'success'
						});
						this.list(this.state.current, this.state.treeId);
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
	//点击btn
	onClick = () => {
		let id = this.state.treeId;
		if (id !== null) {
			this.setState({
				title: '新增',
				visible: true,
			});
		} else {
			window._guider.Utils.alert({
				message: '请选择菜单',
				type: 'warning'
			});
		}
	}
	//保存
	handleOk = () => {
		let data = this.infos;
		let menu = this.state.treeId;
		if (menu !== null) {
			data.validateFields(async (err, val) => {
				if (!err) {
					// let param = {
					// 	'dict.id': val.code,
					// };
					val['dict.id'] = val.code;
					delete val.code;
					console.log(val);

					try {
						let res = await Api.setUp.save_operation(val, menu, this.state.id);
						console.log(res);
						if (res.code === 200) {
							window._guider.Utils.alert({
								message: res.msg,
								type: 'success'
							});
							this.list(this.state.current, this.state.treeId);
							this.onCancel();
						} else {
							window._guider.Utils.alert({
								message: res.msg,
								type: 'error'
							});
						}
					} catch (error) {
						console.log(error);
					}
				}
			});
		} else {
			window._guider.Utils.alert({
				message: '请选择菜单',
				type: 'warning'
			});
		}

	}
	//树形菜单返回过来的ID
	treeId = (treeId: string) => {
		// console.log(treeId);
		this.setState({ treeId });
		this.list(this.state.current, treeId);
	}
	//表格列表
	list = async (page: number, menuid: string, ) => {
		try {
			let res = await Api.setUp.get_operations_by_Menu(page, menuid);
			if (res.code === 200) {
				if (res.data.rows.length > 0) {
					this.setState({
						data: formatData(res.data.rows),
						total: res.data.total
					});
				} else if (res.data.pageNo > '1' && res.data.rows.length === 0) {
					this.list(parseInt(res.data.pageNo) - 1, menuid);
					this.setState({ current: parseInt(res.data.pageNo) - 1 });
				} else {
					this.setState({
						data: [],
						total: null
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	};
	//关闭
	onCancel = () => {
		this.setState({
			visible: false,
			// treeId: null,
			id: '',
			row: {}
		});
	}
}
export default Menu;
const formatData = (data) => {
	let array = [];
	data.forEach((res, index) => {
		array.push({
			key: index,
			// code: res.code,
			code: res.code,
			dictid: res.dictid,
			id: res.id,
			is_show_name: res.is_show_name,
			name: res.name,
			url: res.url,
			operaname: res.operaname,
		});
	});
	return array;
};


const Info = Form.create()(
@inject('MenTree')
@observer
	class extends Component {
	render() {
		const { getFieldDecorator } = this.props.form;
		const { info } = this.props;
		// console.log(info);
		return (
			<Form
				style={this.props.style}
				className="row"
				onSubmit={this.handleSubmit}
			>
				<FormItem {...menuFormItemLayout} label="操作名称">
					{getFieldDecorator('name', {
						rules: [{ required: true, message: '请填写操作名称' }],
						initialValue: info.name
					})(<Input maxLength={20} className="inputss" />)}
				</FormItem>

				<FormItem {...menuFormItemLayout} label="操作代码">
					{getFieldDecorator('code', {
						rules: [{ required: true, message: '请选择操作代码' }],
						initialValue: info.dictid
					})(
						// <Input  maxLength={20}  />
						<Select style={{ width: '16.5rem' }} placeholder="请选择操作代码">
							{this.props.MenTree.Pmisd.map(foramView)}
						</Select>
					)}
				</FormItem>

				<FormItem {...menuFormItemLayout} label="操作URL">
					{getFieldDecorator('url', {
						rules: [{ required: true, message: '请填写操作URL' }],
						initialValue: info.url
					})(<Input maxLength={20} className="inputss" />)}
				</FormItem>

				<FormItem {...menuFormItemLayout} label="启用状态">
					{getFieldDecorator('isshow', {
						rules: [{ required: true, message: '请选择启用状态' }],
						initialValue: info.mark,
					})(
						<Radio.Group>
							<Radio value="1"><span className="spans">启用</span></Radio>
							<Radio value="0"><span className="spans">禁用</span></Radio>
						</Radio.Group>
					)}
				</FormItem>
			</Form>
		);
	}
}
);
const foramView = (data, index) => {
	return (
		<Option value={data.id} key={index}>{data.name}</Option>
	);
};
