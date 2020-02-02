//@flow
import React, { Component } from 'react';
import { Table, Divider, Button, Form, Input, Radio, Select, message, Checkbox, Col, Popconfirm, Modal, TreeSelect, Icon } from 'antd';
import { Models } from '../../component/Model/model';
import Api from './../../../api';
import SparkMD5 from 'spark-md5';
import { observable, } from 'mobx';
import { observer, inject } from 'mobx-react';
import { RouterPmi } from '../../component/function/routerPmi';
import {mobileValidator} from "../../../utils/handleNumbers";

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
let count = 0;

const formItemLayout = {
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
	data: Array<object>,
	callback: Function,

}
type State = {
	columns: Array<Object>,
	title: string,
	visible: boolean,
	role: Array,
	info: object,
	roleId: string,
	schoolData: Array<object>
}
@inject('userInfo')
@observer
class Tables extends Component<Props, State> {
	state = {
		columns: [
			{ title: '账号', dataIndex: 'account', key: 'account' },
			{ title: '所属学校', dataIndex: 'schoolname', key: 'schoolname' },
			{ title: '联系人', dataIndex: 'name', key: 'name' },
			{ title: '联系电话', dataIndex: 'phone', key: 'phone' },
			{ title: '状态', dataIndex: 'status_name', key: 'status_name' },
			{
				title: '操作', dataIndex: 'id', key: 'id', render: (text: string, row: object) => {
					return (
						<div>
							<a disabled={!this.state._info.includes('edit')} className="all-a" onClick={this.click.bind(this, 1, row)} href={null}>编辑</a>
							<Divider style={{ background: 'rgb(0, 160, 233)' }} type="vertical" />
							<a disabled={!this.state._info.includes('update_password')} className="all-a" onClick={this.click.bind(this, 2, row)} href={null}>修改密码</a>
							<Divider style={{ background: 'rgb(0, 160, 233)' }} type="vertical" />
							<Popconfirm icon={<Icon type="question-circle-o" style={{ color: 'red' }} />} placement="top" title={'确定重置账号' + row.account + '吗？'} okText="确定" cancelText="取消" onConfirm={this.click.bind(this, 3, row)} >
								<a disabled={!this.state._info.includes('reset_password')} className="all-a" href={null}>重置密码</a>
							</Popconfirm>
							<Divider style={{ background: 'rgb(0, 160, 233)' }} type="vertical" />
							<a disabled={!this.state._info.includes('delete')} className="all-a" onClick={this.click.bind(this, 4, row)} href={null}>删除</a>
						</div>
					);
				}
			},
		],
		title: '',
		visible: false,
		role: [],  			//角色list
		id: '',					//表格ID
		info: {},				//所有信息
		roleId: '',			//ID
		mark: null,  		//点击切换
		schoolData: [],
		_info: RouterPmi(),
	}

	async componentDidMount() {
		try {
			let res = await Api.setUp.get_all_roles();
			let data = await Api.Device.schoolType();
			this.setState({ schoolData: formatData(data.data) });

			if (res.code === 200) {
				this.setState({
					role: res.data,
					// _info: RouterPmi(),
				});
			}
		} catch (error) {
			console.log(error);
		}

	}
	render() {
		const { title, visible, role, info, roleId, mark, schoolData } = this.state;
		return (
			<div className="user-table">
				<Button disabled={!this.state._info.includes('add')}
					type="primary" onClick={this.onClick} className="user-table-btns" >新增</Button>
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
				<Models
					width={800}
					title={title}
					visible={visible}
					onCancel={this.Cancel}
					handleOk={this.ok}	>
					<Info
						ref={node => (this.infos = node)}
						role={role}
						info={info}
						roleId={roleId}
						mark={mark}
						schoolData={schoolData}
					/>
				</Models>
			</div>
		);
	}
	RowTable = (e) => {
		if (!this.state._info.includes('edit')) return;

		count += 1;
		setTimeout(() => {
			if (count === 2) {
				this.click(1, e);
			}
			count = 0;
		}, 300);

	}
	//信息
	click = async (mark: number, row: Object) => {
		try {
			if (mark === 1) {
				let res = await Api.setUp.get_user_by_id(row.id);
				let ids = res.data.role.length > 0 ? res.data.role[0].id : '';
				if (res.code === 200) {
					this.setState({
						visible: true,
						title: '编辑账号',
						info: res.data.user,
						id: row.id,
						roleId: ids,
						mark,
					});
				}
			} else if (mark === 2) {
				this.setState({
					mark,
					id: row.id,
					visible: true,
					title: '修改密码',
				});
			} else if (mark === 3) {
				let res = await Api.setUp.reset_pwd(row.id);
				if (res.code === 200) {
					console.log(res);
					window._guider.Utils.alert({
						message: res.msg,
						type: 'success'
					});
				} else {
					window._guider.Utils.alert({
						message: res.msg,
						type: 'error'
					});
				}
			} else if (mark === 4) {
				confirm({
					centered: true,
					title: '确定删除联系人' + row.name + '吗！',
					onOk: async () => {
						let delt = await Api.setUp.del_user(row.id);
						if (delt.code === 200) {
							// console.log(delt);
							window._guider.Utils.alert({
								message: delt.msg,
								type: 'success'
							});
							this.Cancel();
							this.props.callback();
						} else {
							window._guider.Utils.alert({
								message: delt.msg,
								type: 'error'
							});
						}
					},
					onCancel() { },
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
	//保存
	ok = () => {
		let res = this.infos;
		res.validateFields(async (err, val) => {
			if (!err) {
				try {
					if (this.state.mark === 1) {
						message.info('修改用户角色后，需该用户重新登录后才会生效！')
						let param = JSON.parse(JSON.stringify(val).replace(/roles/g, 'role[0].id'));
						let ant = JSON.parse(JSON.stringify(param).replace(/school/g, 'school.id'));
						let data = await Api.setUp.save_user(ant, this.state.id);

						if (data.code === 200) {
							window._guider.Utils.alert({
								message: data.msg,
								type: 'success'
							});

							this.Cancel();
							this.props.callback();
						} else {
							window._guider.Utils.alert({
								message: data.msg,
								type: 'error'
							});
						}
					} else if (this.state.mark === 2) {
						console.log(val);
						let obj = {
							'oldPwd': SparkMD5.hash(val.oldPwd),
							'newPwd': SparkMD5.hash(val.newPwd),
							'confirmPwd': SparkMD5.hash(val.confirmPwd),
						};
						let res = await Api.setUp.update_pwd(obj, this.state.id);
						if (res.code === 200) {
							console.log(res);
							this.Cancel();
							window._guider.Utils.alert({
								message: res.msg,
								type: 'success'
							});
							// this.props.userInfo.outLogin();
						} else {
							window._guider.Utils.alert({
								message: res.msg,
								type: 'error'
							});
						}
					}

				} catch (error) {
					console.log(error);
				}
			}
		});
	}
	//add
	onClick = () => {
		this.setState({
			title: '新增账号',
			visible: true,
			mark: 1
		});
	}
	//关闭
	Cancel = () => {
		this.setState({ visible: false, id: '', info: {}, roleId: '' });
	}
}
export default Tables;
const Info = Form.create()(
	class extends Component {
		render() {
			const { getFieldDecorator } = this.props.form;
			const { role, info, roleId, mark, schoolData } = this.props;
			return (
				<Form
					style={this.props.style}
					className="row"
					onSubmit={this.handleSubmit}
				>
					{mark === 1 ?
						<div>
							<FormItem className="tiems" {...formItemLayout} label="账号">
								{getFieldDecorator('account', {
									rules: [{ required: true, message: '请填写账号' }],
									initialValue: info.account
								})(<Input
									disabled={typeof (info.account) !== 'undefined' ? true : false}
									maxLength={20} placeholder="请输入账号" className="user-inputs" />)}
							</FormItem>

							<FormItem className="tiems" {...formItemLayout} label="联系人">
								{getFieldDecorator('name', {
									rules: [{ required: true, message: '请填写联系人' }],
									initialValue: info.name
								})(<Input maxLength={20} placeholder="请输入联系人" className="user-inputs" />)}
							</FormItem>

							<FormItem className="tiems" {...formItemLayout} label="联系电话">
								{getFieldDecorator('phone', {
									rules: [
										{ required: true, message: '请填写联系电话',  },
										],
									getValueFromEvent: (event) => {
										return event.target.value.replace(/\D/g, '');
									},
									initialValue: info.phone
								})(<Input placeholder="请输入联系电话" className="user-inputs" />)}
							</FormItem>
							<FormItem className="tiems" {...formItemLayout} label="所属机构">
								{getFieldDecorator('school', {
									rules: [{ required: true, message: '请选择所属机构' }],
									initialValue: info.schoolid
								})(
									// <Select className="selectall" placeholder="请选择学校">
									// 	{/* <Option  value={1}><span className="spans">桐梓林大学</span></Option> */}
									// 	{schoolData.map(ArraySchool)}
									// </Select>
									<TreeSelect
										treeData={schoolData}
										placeholder="请选择所属机构"
									/>
								)}
							</FormItem>
							<FormItem className="tiems" {...formItemLayout} label="所属角色">
								{getFieldDecorator('roles', {
									rules: [{ required: true, message: '请选择角色' }],
									initialValue: roleId,
								})(
									<Radio.Group>
										{role.map((res, index) => {
											return (
												<Radio key={index} value={res.id}><span className="spans">{res.role_name}</span></Radio>
											);
										})}
									</Radio.Group>
									// <Checkbox.Group style={{ width: '100%' }}>
									// 	{/* <Row> */}
									// 	{role.map((res, index) =>{
									// 		return(
									// 			<Checkbox key={index} value={res.id}><span className="spans">{res.role_name}</span></Checkbox>
									// 		);
									// 	})}
									// 	{/* </Row> */}
									// </Checkbox.Group>
								)}
							</FormItem>
							<FormItem className="tiems" {...formItemLayout} label="状态">
								{getFieldDecorator('status', {
									rules: [{ required: true, message: '请选择状态' }],
									initialValue: typeof (info.status) !== 'undefined' ? String(info.status) : ''
								})(
									<Radio.Group>
										<Radio value="1"><span className="spans">开启</span></Radio>
										<Radio value="0"><span className="spans">禁用</span></Radio>
									</Radio.Group>
								)}
							</FormItem>
						</div>
						: null}
					{mark === 2 ?
						<div>

							<FormItem className="tiems" {...formItemLayout} label="原密码">
								{getFieldDecorator('oldPwd', {
									rules: [{ required: true, message: '请填原密码' }],
								})(
									<Input.Password placeholder="请输入原密码" className="user-inputs" />
								)}
							</FormItem>

							<FormItem className="tiems" {...formItemLayout} label="新密码">
								{getFieldDecorator('newPwd', {
									rules: [{ required: true, message: '请填写新密码' },
										{ validator: this.compareToFirstPassword }],
								})(
									<Input.Password placeholder="请输入新密码" className="user-inputs" />
								)}
							</FormItem>

							<FormItem className="tiems" {...formItemLayout} label="确认密码">
								{getFieldDecorator('confirmPwd', {
									rules: [{ required: true, message: '请填写新密码' },
										{ validator: this.compareToFirstPasswordconfirmPwd }],
								})(
									<Input.Password placeholder="请输入确认密码" className="user-inputs" />
								)}
							</FormItem>
						</div> : null}
				</Form>
			);
		}
		//新密码
		compareToFirstPassword = (rule, value, callback) => {
			const form = this.props.form;
			// console.log(form.validateFields);
			if (form.getFieldValue('oldPwd')) {
				if (form.getFieldValue('oldPwd') === value) {
					callback('新密码不能与原密码相同');
				} else if (form.getFieldValue('confirmPwd') === value) {
					form.validateFields(['confirmPwd'], { force: true });
					callback();
				} else {
					callback();
				}
			} else {
				callback();
			}

		}
		//确认密码
		compareToFirstPasswordconfirmPwd = (rule, value, callback) => {
			const form = this.props.form;
			// console.log(form.getFieldValue('newPwd'));
			// console.log(value);
			if (form.getFieldValue('oldPwd')) {
				if (form.getFieldValue('oldPwd') === value) {
					callback('新密码不能与原密码相同');
				} else if (form.getFieldValue('newPwd') !== value) {
					callback('您输入的新密码不相同');
				} else {
					callback();
				}
			} else {
				callback();
			}
		}
	}
);

const ArraySchool = (data) => {
	return (
		<Option value={data.id} key={data.id}>{data.name}</Option>
	);
};

const formatData = (res: Array<Object>) => {
	let ant = [];
	res.forEach(e => {
		// console.log(e);
		if (e.children) {
			ant.push({ title: e.name, key: e.id, value: e.id, code: e.code, parent: e.parent, children: formatData(e.children) });
		} else {
			ant.push({ title: e.name, key: e.id, value: e.id, code: e.code, parent: e.parent, });
		}
	});
	return ant;
};

