/* eslint-disable indent */
// @flow
import React, { Component } from 'react';
import { Table, Divider, Modal, Form, Input, Select, Button, Radio } from 'antd';
import Api from '../../../api';
import { BaseModel } from '../../component/Model/model';
import { observable, toJS } from 'mobx';
import { observer, inject, } from 'mobx-react';
import { validator } from '../../component/function/validation';
import { RouterPmi } from '../../component/function/routerPmi';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

let count = 0;

const formItemLayouts = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 28 },
		sm: { span: 10 }
	}
};
type Props = {}
type state = {}
const tableStyle = {
	width: '79rem'
};
@inject('DeviceState')
@observer
export default class DevicesTable extends Component<Props, State> {
	componentDidMount() {
		// this.setState({
		// 	_info: RouterPmi()
		// });
	}
	state = {
		columns: [
			// {
			// 	title: '图标', dataIndex: 'equiptypeimg', key: 'equiptypeimg', width: '4%', render: (text, data) => {
			// 		try {
			// 			return (
			// 				<img style={{ width: '30px', height: '26px' }} src={require(`../../../assets/deviceAdd/${text}.png`)} />
			// 			);
			// 		} catch (error) {
			// 			console.log('没有图片在本地需要导入进去————设备配置');
			// 		}
			// 	}
			// },
			{ title: '设备名称', dataIndex: 'equipname', key: 'equipname', width: '13%' },
			{ title: '设备类型', dataIndex: 'equiptypename', key: 'equiptypename', width: '13%' },
			{ title: '品牌', dataIndex: 'brandcnname', key: 'brandcnname', width: '10%' },
			{ title: '型号', dataIndex: 'equipmodel', key: 'equipmodel', width: '10%' },
			{ title: '控制方式', dataIndex: 'connname', key: 'connname' },
			{ title: 'ip地址', dataIndex: 'hostip', key: 'hostip' },
			// { title: '配置日期', dataIndex: 'createtime', key: 'createtime' },
			{
				title: '操作',
				dataIndex: 'key',
				key: 'key',
				width: '8%',
				render: (text, data) => {
					return (
						<div>
							<a
								disabled={!this.state._info.includes('edit')}
								onClick={this.editor.bind(this, data)}
								className="all-a"
								href={null}>
								修改
							</a>
							<Divider
								type="vertical"
								style={{ background: 'rgb(0, 160, 233)' }}
							/>
							<a
								disabled={!this.state._info.includes('delete')}
								onClick={() => {
									this.delt(text, data);
								}}
								className="all-a"
								href={null}
							>
								删除
							</a>
						</div>
					);
				}
			}
		],
		data: null,
		visible: false,
		ctr: [],
		mark: 1,
		allData: null, //编辑当前的数据
		CommProt: [], 	//comm
		_info: RouterPmi(),
		connname: '', //控制方式 红外 端口
	};
	//编辑
	editor = async (data: Object) => {
		let res = await Api.Device.get_equiproom_by_id(data.key);
		let calssID = this.props.classroomId;
		let ant = await Api.Device.get_rctrlcode_by_equip(data.equipid, data.equipTypeId, data.key);
		if (res.code === 200) {
			let CommProt = await Api.Device.CommProt(res.data.connecttype);
			if (ant.code === 200) {
				this.setState({
					data: res.data,
					visible: true,
					ctr: ant.data,
					allData: data,
					CommProt: CommProt.data,
				});
			}
		}
	};
	delt = (text: string, data: object) => {
		confirm({
			title: '确定删除' + data.equipname + '设备吗',
			centered: true,
			onOk: () => {
				this.props.Delete(text);
			},
			onCancel() { }
		});
	};
	render() {
		return (
			<div>
				<Table
					style={tableStyle}
					className="device-tables-table"
					rowClassName="device-tables-tableRow"
					columns={this.state.columns}
					dataSource={this.props.data}

					onRow={record => {
						return {
							onClick: this.RowTable.bind(this, record),
						};
					}}
					pagination={false}
				/>
				<BaseModel
					width={700}
					title="编辑设备"
					visible={this.state.visible}
					// handleOk={this.handleOk}
					onCancel={this.onCancel}>
					<Button
						className="btns"
						type="primary"
						style={
							this.state.mark === 1
								? { marginRight: 10, background: 'rgba(86,164,86,1)' }
								: { marginRight: 10 }
						}
					>
						端口参数
					</Button>
					<Button
						className="btns"
						type="primary"
						style={
							this.state.mark === 2 ? { background: 'rgba(86,164,86,1)' } : null
						}
					>
						控制码
					</Button>
					<Info
						style={this.state.mark === 2 ? { display: 'none' } : null}
						data={this.state.data}
						mapData={toJS(this.props.DeviceState.dictionaryList)}
						CommProt={this.state.CommProt}
						ref="infos"
					/>
					<CtrMa
						style={this.state.mark === 1 ? { display: 'none' } : null}
						ctr={this.state.ctr}
						data={this.state.data}
						ref="ctr"
					/>

					<div style={{ textAlign: 'center' }}>
						{this.state.mark !== 2 ? (
							<div>
								<Button
									style={{ marginRight: 10, background: 'rgba(86,164,86,1)' }}
									type="primary"
									className="btns"
									onClick={() => {
										this.switch_btn(2);
									}}
								>
									下一步
								</Button>
							</div>
						) : (
								<div>
									<Button
										style={{ marginRight: 10, background: 'rgba(86,164,86,1)' }}
										type="primary"
										className="btns"
										onClick={() => {
											this.switch_btn(1);
										}}
									>
										上一步
								</Button>
									<Button
										type="primary"
										className="btns"
										onClick={this.seve_info}
									>
										保存
								</Button>
									}
							</div>
							)}
					</div>
				</BaseModel>
			</div>
		);
	}
	RowTable = (e) => {
		if (!this.state._info.includes('edit')) return;
		count += 1;
		setTimeout(() => {
			if (count === 2) {
				this.editor(e);
			}
			count = 0;
		}, 300);
	}
	//切换
	switch_btn = (nmber: number) => {
		let res = this.refs.infos;
		let ctr = this.refs.ctr;
		if (this.state.mark !== nmber) {
			res.validateFields((err, val) => {
				if (!err) {
					this.setState({
						mark: nmber
					});
				}
			});
		}
	};
	//保存
	seve_info = () => {
		let res = this.refs.infos;
		let ctr = this.refs.ctr;
		let ctrid = this.state.ctr;
		res.validateFields((err, val) => {
			if (!err) {
				let ctr = this.refs.ctr;
				ctr.validateFields(async (err, obj) => {
					if (!err) {
						delete obj.codingScheme;
						let ids = this.state.allData.key;
						let classid = this.state.allData.classroomid;
						let ant = Object.keys(obj).map((key, i) => ({
							ctrlNo: key,
							keyId: key,
							controlCommand: obj[key],
							equipId: this.state.allData.equipid,
							equipRoomId: this.props.classroomId,
							id: this.state.ctr[i].id !== null ? this.state.ctr[i].id : ''
						}));
						let equtype = this.state.allData.equipTypeId;
						let equipid = this.state.allData.equipid;
						delete val.equiptypeid;
						let param = Object.assign(val, {
							id: ids,
							equiptypeid: equtype,
							equipid: equipid,
							equipName: val.equiptypename,
							schoolid: this.props.shcool,
							classroomId: classid,
							connectType: this.state.data.connecttype,
							brandid: this.state.data.equipbrandid,
						});
						let souu = await Api.Device.save_equip_rooms(param, ant);
						console.log(souu)
						if (souu.code === 200) {
							window._guider.Utils.alert({
								message: souu.msg,
								type: 'success'
							});
							this.onCancel();
							this.props.listRender();
						} else {
							window._guider.Utils.alert({
								message: souu.msg,
								type: 'error'
							});
						}
					}
				});
			}
		});
	};
	//退出
	onCancel = () => {
		this.setState({
			visible: false,
			mark: 1
		});
	};
}
//控制码
const CtrMa = Form.create()(
	class extends Component {
		render() {
			const { getFieldDecorator } = this.props.form;
			const { ctr, data } = this.props;
			return (
				<Form
					style={this.props.style}
					className="row"
					onSubmit={this.handleSubmit}
				>
					<FormItem {...formItemLayouts} label="编码方式" className="links" style={{ display: 'flex' }}>
						{getFieldDecorator('codingScheme', {
							initialValue: data.codingscheme
						})(
							<RadioGroup disabled className="Groups">
								<Radio value="HEX"><span style={{ color: '#66e2f5' }}>HEX</span></Radio>
								<Radio value="ASCII"><span style={{ color: '#66e2f5' }}>ASCII</span></Radio>
							</RadioGroup>
						)}
					</FormItem>
					{ctr.map((res, index) => {
						return (
							<FormItem
								key={index}
								label={res.keyname}
								{...formItemLayouts}
								className="tiemsAdd"
							>
								{getFieldDecorator(res.kId, {
									// rules: [{ required: true, message: '请填写控制命令' }],
									initialValue: res.ctrlCommand !== null ? res.ctrlCommand : ''
								})(
									<Input
										className=""
										placeholder="请填写控制命令"
										maxLength={250}
									/>
								)}
							</FormItem>
						);
					})}
				</Form>
			);
		}
	}
);
// 端口参数

const Info = Form.create()(

@inject('DeviceState')
@observer
class extends Component {
	render() {
		const { getFieldDecorator } = this.props.form;
		const { data, mapData } = this.props;
		return (
			<Form
				style={this.props.style}
				className="row"
				onSubmit={this.handleSubmit}
			>
				<FormItem className="tiemsAdd" {...formItemLayouts} label="设备类型">
					{getFieldDecorator('equiptypeid', {
						initialValue: data.equiptypename
					})(<Input disabled className="" />)}
				</FormItem>
				<FormItem className="tiemsAdd" {...formItemLayouts} label="品牌">
					{getFieldDecorator('brandcnname', {
						initialValue: data.brandcnname
					})(<Input disabled className="" />)}
				</FormItem>
				<FormItem className="tiemsAdd" {...formItemLayouts} label="型号">
					{getFieldDecorator('equipmodel', {
						initialValue: data.equipmodel
					})(<Input disabled className="" />)}
				</FormItem>
				<FormItem className="tiemsAdd" {...formItemLayouts} label="设备名称">
					{getFieldDecorator('equiptypename', {
						initialValue: data.equipname
					})(<Input className="" />)}
				</FormItem>
				{/* 可选输入框 */}
				{data.connname === "私有协议" && data.equip_type_id === "1" ?
					<div>
						<FormItem className="tiemsAdd" {...formItemLayouts} label="设备ID">
							{getFieldDecorator('imeiNo', {
								rules: [{ required: true, message: '请填写设备ID' }],
								initialValue: data.imei_no
							})(<Input className="" />)}
						</FormItem>
						<FormItem className="tiemsAdd" {...formItemLayouts} label="服务器IP">
							{getFieldDecorator('serviceIp', {
								initialValue: data.serviceip
							})(<Input className="" />)}
						</FormItem>
					</div>
					: null}
				{
					data.connname === 'TCP'&&<FormItem className="row" {...formItemLayouts} label="URL">
						{getFieldDecorator("centralContrlUrl", {
							// rules: [{ required: true, message: "请填写url" }],
							initialValue: data.centralContrlUrl
						})(<Input   />)}
					</FormItem>
				}
				{/*data.connname === 'TCP' ||  电子科大的不要这个地址格式*/}
				{ data.connname === 'UDP' ? (
					<div>
						<FormItem className="tiemsAdd" {...formItemLayouts} label="地址格式">
							{getFieldDecorator('addrFormat', {
								initialValue: data.addr_format
							})(
								<Select disabled className="tiemsAdd-select">
									<Option value="通用">通用</Option>
									{/* <Option value="ONVIF">ONVIF</Option> */}
									<Option value="RTSP">RTSP</Option>
								</Select>
							)}
						</FormItem>
						{data.addr_format === 'RTSP' ? (
							<FormItem
								className="tiemsAdd"
								{...formItemLayouts}
								label="RTSP地址"
							>
								{getFieldDecorator('rtspAddr', {
									initialValue: data.rtsp_addr?data.rtsp_addr:''
								})(<TextArea rows={4} className="" />)}
							</FormItem>
						) : null}
					</div>
				) : null}
				{/* 连接口 */}
				{data.connname !=="私有协议" &&
				(data.connname === "RS232" ||
					data.connname === "RS485" ||
					data.connname === "DO") ?
					<FormItem {...formItemLayouts} label="连接口" className="tiemsAdd">
						{getFieldDecorator('mcPortNo', {
							rules: [{ required: true, message: '请选择连接口' }],
							initialValue: data.mcportno
						})(
							<Select className="tiemsAdd-select">
								{this.props.CommProt.map(MapDataFormatCommProt)}
							</Select>
						)}
					</FormItem>
					: null}
				{/* hdmi连接口 */}
				{data.connname === "DO" && data.equip_type_id === "4" &&
					< FormItem {...formItemLayouts} label="hdmi连接口" className="row">
						{getFieldDecorator('hdmiConn', {
							rules: [{ required: true, message: '请选择hdmi连接口' }],
							initialValue: String(data.hdmiconn)
						})(
							<Select className="tiemsAdd-select">
								{toJS(this.props.DeviceState.hdmiconn).map(MapDataFormat)}
							</Select>
						)}
					</FormItem>
				}
				{/* 波特率、 数据位、停止位、校验*/}
				{  data.connname === "RS232" ||
				data.connname === "RS485"? (
					<div>
						<FormItem {...formItemLayouts} label="波特率" className="tiemsAdd">
							{getFieldDecorator('baudRate', {
								rules: [{ required: true, message: '请选择波特率' }],
								initialValue: data.baudrate
							})(
								<Select className="tiemsAdd-select" disabled={data.noupdate === 1 ? true : false}>
									{mapData.baud_rate.map(MapDataFormat)}
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayouts} label="数据位" className="tiemsAdd">
							{getFieldDecorator('dataBit', {
								rules: [{ required: true, message: '请选择数据位' }],
								initialValue: data.databit
							})(
								<Select className="tiemsAdd-select" disabled={data.noupdate === 1 ? true : false}>
									{mapData.data_bits.map(MapDataFormat)}
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayouts} label="停止位" className="tiemsAdd">
							{getFieldDecorator('stopBit', {
								rules: [{ required: true, message: '请选择停止位' }],
								initialValue: data.stopbit
							})(
								<Select className="tiemsAdd-select" disabled={data.noupdate === 1 ? true : false}>
									{mapData.stop_bits.map(MapDataFormat)}
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayouts} label="校验" className="tiemsAdd">
							{getFieldDecorator('checks', {
								rules: [{ required: true, message: '请选择校验' }],
								initialValue: data.checks
							})(
								<Select className="tiemsAdd-select" disabled={data.noupdate === 1 ? true : false}>
									{mapData.checks.map(MapDataFormat)}
								</Select>
							)}
						</FormItem>
					</div>) : null}

				{/* ip地址  端口*/}
				{(data.connname === "私有协议" && data.equip_type_id === "1") ||
				(data.connname === "私有协议" && data.equip_type_id === "16") ||
				(data.connname === "DO" && data.equip_type_id === "4") ||
				data.connname === "TCP" ||
				data.connname === "UDP" ? (
						<div>
							<FormItem className="tiemsAdd" {...formItemLayouts} label="IP">
								{getFieldDecorator('hostIp', {
									rules: [{ required: true, message: '请填写IP' },
									{
										validator: this.ipValidator
									}],
									initialValue: data.hostip
								})(<Input maxLength={15} className="" />)}
							</FormItem>
							<FormItem
								className="tiemsAdd"
								{...formItemLayouts}
								label="端口号"
							>
								{getFieldDecorator('portNo', {
									rules: [{ required: true, message: '请填写端口号', pattern: new RegExp(/^[1-9]\d*$/, 'g') },
									{ validator: this.Proot, }
									],
									getValueFromEvent: (event) => {
										return event.target.value.replace(/\D/g, '');
									},
									initialValue: data.portno
								})(<Input maxLength={5} />)}
							</FormItem>

						</div>
					) : null}
				{/*用户名密码  */}
				{(data.connname === "私有协议" && data.equip_type_id === "16") ||
				(data.connname === "DO" && data.equip_type_id === "4") ||
				data.connname === "TCP" ? (
					<div>
						<FormItem
							className="tiemsAdd"
							{...formItemLayouts}
							label="用户名"
						>
							{getFieldDecorator('username', {
								initialValue: data.username?data.username:""
							})(<Input />)}
						</FormItem>
						<FormItem
							className="tiemsAdd"
							{...formItemLayouts}
							label="密码"
						>
							{getFieldDecorator('password', {
								initialValue: data.password
							})(<Input type="password" autoComplete="new-password" />)}
						</FormItem>
					</div>
				) : null}
				{data.equip_type_id === "15" ?
					<FormItem {...formItemLayouts} label="摄像头位置" className="tiemsAdd">
						{getFieldDecorator('cameraType', {
							rules: [{ required: true, message: '请选择摄像头位置' }],
							initialValue: data.cameratype
						})(
							<Select className="tiemsAdd-select" >
								{toJS(this.props.DeviceState.location).map(MapDataFormat)}
							</Select>
						)}
					</FormItem> : null}
				{/* 连接方式暂时屏蔽 */}
				{/* <FormItem className="tiemsAdd heid" {...formItemLayouts} label="连接方式">
					{getFieldDecorator('connecttype_', {
						initialValue: data.connname
					})(<Input disabled className="" />)}
				</FormItem> */}
			</Form>
		);
	}
	//端口
	Proot = (rule, value, callback) => {
		if (value != '') {
			if (isNaN(value) || value > 65535 || value < 0) {
				callback('请输入端口在(1-65535)范围之内');
			}
			callback();
		}
		callback();
	}
	//IP 验证
	ipValidator = (rule, value, callback) => {
		if (value !== '') {
			if (validator(value)) {
				callback();
			} else {
				callback('请输入ip地址列如：（192.13.313.13）');
			}
			callback();
		}
		callback();
	}
}
);


const MapDataFormat = (data, index) => {
	return (
		<Option value={data.dic_value} key={index}>{data.dic_name}</Option>
	);
};
const MapDataFormatcoding = (data, index) => {
	return (
		<Radio value={data.dic_value} key={index}><span className="Group-span">{data.dic_name}</span></Radio>
	);
};

const MapDataFormatCommProt = (data, index) => {
	return (
		<Option value={data.id} key={index}>{data.mcport}</Option>
	);
};
