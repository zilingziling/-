//@flow
import React, { Component } from 'react';
import { Table, Divider, Button, Form, Input, Checkbox, Row, Col, Modal } from 'antd';
import { Model } from '../../component/Model/model';
import { observable, toJS, set } from 'mobx';
import { observer, inject } from 'mobx-react';
import { RouterPmi } from '../../component/function/routerPmi';
import Api from './../../../api';
const confirm = Modal.confirm;
const FormItem = Form.Item;
let count = 0;

const formItemLayout = {
	labelCol: {
		xs: { span: 28 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 28 },
		sm: { span: 12 }
	}
};
type Props = {
	data: Array<object>,
	callback: Function,
	Role: Function,
}
type State = {
	columns: Array<Object>,
	title: String,
	id: string,  //row ID
	Checkboxall: Array,
	info: object,
};
@inject('Role')
@observer
class Tables extends Component<Props, State,> {
	componentDidMount() {
		if (this.props.Role.permissions.length === 0) {
			this.props.Role._permissions();
		}
		// this.setState({
		// 	_info: RouterPmi(),
		// });
	}
	state = {
		_info: RouterPmi(),
		columns: [
			{ title: '角色名称', dataIndex: 'role_name', key: 'role_name' },
			{ title: '角色编码', dataIndex: 'role_code', key: 'role_code' },
			{
				title: '操作', dataIndex: 'key', key: 'key', render: (text, row) => {
					return (
						<div>
							<a disabled={!this.state._info.includes('edit')}
								onClick={this.click.bind(this, 1, text)} className="all-a" href={null}>编辑</a>
							<Divider style={{ background: 'rgb(0, 160, 233)' }} type="vertical" />
							<a disabled={!this.state._info.includes('delete')}
								onClick={this.delete.bind(this, text, row)} className="all-a" href={null}>删除</a>
						</div>
					);
				}
			},
		],
		visible: false,
		title: '',
		id: '',
		Checkboxall: [], //选中的数组
		info: {}, //信息
		setValue: [],
	}
	render() {
		const { info, Checkboxall, _info } = this.state;
		return (
			<div className="role-table">
				<Button disabled={!this.state._info.includes('add')}
					onClick={this.click.bind(this, 2)} className="role-btn btns" type="primary">
					新增
				</Button>

				<Table
					onRow={record => {
						return {
							onClick: this.RowTable.bind(this, record),
						};
					}}
					pagination={false}
					dataSource={this.props.data}
					bordered
					className="device-tables-table"
					rowClassName="device-tables-tableRow"
					columns={this.state.columns}
				/>
				<Model
					className="modelAdd"
					width={1200}
					title={this.state.title}
					visible={this.state.visible}
					onCancel={this.Cancel}
					handleOk={this.ok}
				>
					<Info
						ref={node => (this.infos = node)}
						data={toJS(this.props.Role.permissions)}
						info={info}
						Checkboxall={Checkboxall}
						setValue={this.setValue}
					/>
				</Model>
			</div>
		);
	}
	setValue = (e: Array<Number>) => {
		// console.log(e);
		if (e !== true) {
			let array = this.state.setValue;
			array.push(e);
			console.log([... new Set(array)]);
			this.setState({
				setValue: array
			});
		}

	}
	RowTable = (e) => {
		if (!this.state._info.includes('edit')) return;
		count += 1;
		setTimeout(() => {
			if (count === 2) {
				this.click(1, e.key);
			}
			count = 0;
		}, 300);
	}
	//保存修改
	ok = () => {
		let res = this.infos;
		res.validateFields(async (err, val) => {

			if (!err) {
				try {
					let array = [];
					Object.keys(val).forEach(function (key) {
						if (key.indexOf('operation') != -1) {
							if (val[key] !== null) {
								val[key].forEach((r, index) => {
									array.push(r);
								});
							}
						}
					});
					let paramArray = arrayWeightRemoval([... new Set(array)], this.state.setValue);
					let param = {
						code: val.code,
						name: val.name,
						operation: paramArray
					};
					let data = await Api.setUp.save_role_operation(this.state.id, param);
					if (data.code === 200) {
						window._guider.Utils.alert({
							message: data.msg,
							type: 'success'
						});
						this.props.callback();
						this.Cancel();
					} else {
						window._guider.Utils.alert({
							message: data.msg,
							type: 'error'
						});
					}
				} catch (error) {
					console.log(error);
				}
			}
		});
	}
	//点击切换弹出框详情
	click = async (state: Number, row: string) => {
		// console.log(row);
		if (state === 1) {
			try {
				let res = await Api.setUp.get_role_by_id(row);
				// console.log(res);
				if (res.code === 200) {
					let array = [];
					if (res.data.operation.length > 0) {
						res.data.operation.forEach(e => {
							array.push(e.id);
						});
						this.setState({
							title: '修改角色',
							visible: true,
							info: res.data.role,
							Checkboxall: array,
							id: row
						});
					} else {
						this.setState({
							title: '修改角色',
							visible: true,
							info: res.data.role,
							Checkboxall: [],
							id: row
						});
					}
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			this.setState({
				title: '新增角色',
				visible: true,
				id: ''
			});
		}
	}
	//退出
	Cancel = () => {
		this.setState({ visible: false, title: '', info: {}, Checkboxall: [] });
	}
	//删除
	delete = (id: Number, row: Object) => {
		confirm({
			centered: true,
			title: '确定删除' + row.role_name + '角色吗？',
			onOk: async () => {
				try {
					let res = await Api.setUp.del_role(id);
					console.log(res);
					if (res.code === 200) {
						window._guider.Utils.alert({
							message: res.msg,
							type: 'success'
						});
						this.props.callback();
						this.Cancel();
					} else {
						window._guider.Utils.alert({
							message: res.msg,
							type: 'error'
						});
					}
				} catch (error) {
					console.log(error);
				}
			},
			onCancel() { },
		});
	}
}
const Info = Form.create()(
	class extends Component {
		state = { allValue: [] }
		render() {
			const { getFieldDecorator } = this.props.form;
			const { data, info, Checkboxall } = this.props;
			return (
				<Form
					style={this.props.style}
					className="row"
					onSubmit={this.handleSubmit}
				>
					<FormItem className="tiems" {...formItemLayout} label="角色名称">
						{getFieldDecorator('name', {
							rules: [{ required: true, message: '请填写角色名称' }],
							initialValue: info.role_name
						})(<Input maxLength={20} className="inputs" />)}
					</FormItem>
					<FormItem className="tiems" {...formItemLayout} label="角色编码">
						{getFieldDecorator('code', {
							rules: [{ required: true, message: '请填写角色编码' }],
							initialValue: info.role_code
						})(<Input maxLength={20} className="inputs" />)}
					</FormItem>
					{data.length > 0 ? data[0].children.map((res, index) => {
						return (
							res.name !== '触控升级选择区域' && res.name !== '中控升级选择区域' && res.name !== 'AI升级选择区域' ?  //这里可以隐藏添加权限
								<FormItem className="tiems" key={index} {...formItemLayout} label={res.name}>
									{getFieldDecorator(`operation${index}`, {
										initialValue: Checkboxall
									})(
										<Checkbox.Group className="Group" key={index}>
											{
												typeof (res.operationList) !== 'undefined' ?
													res.operationList.map((r, i) => {
														return (
															<Checkbox onChange={this.detValue} value={r.id} key={i}><span className="checkboxFont">{r.name}</span></Checkbox>
														);
													})
													: null
											}
										</Checkbox.Group>
									)}
								</FormItem>
								: null
						);
					}) : null}
				</Form>
			);
		}
		detValue = (e) => {
			if (!e.target.checked) {
				this.props.setValue(e.target.value);
			} else {
				this.props.setValue(true);
			}
		}
	}
);

// 数据去重
const arrayWeightRemoval = function (array1, array2) {

	//临时数组存放
	var tempArray1 = [];//临时数组1
	var tempArray2 = [];//临时数组2

	for (var i = 0; i < array2.length; i++) {
		tempArray1[array2[i]] = true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
	}
	// eslint-disable-next-line no-redeclare
	for (var i = 0; i < array1.length; i++) {
		if (!tempArray1[array1[i]]) {
			tempArray2.push(array1[i]);//过滤array1 中与array2 相同的元素；
		}
	}
	return tempArray2;
};
export default Tables;
