/* eslint-disable no-undef */
/* eslint-disable indent */
// @flow
import './../index.scss';
import React, { Component } from 'react';
import { BaseModel } from '../../component/Model/model';
import { Tabs, Form, Radio, Select, Button, Input, message, Tree, TreeSelect, Modal } from 'antd';
import { observable, toJS, autorun, action, } from 'mobx';
import { observer, inject, } from 'mobx-react';
import { idMarker, uint8Buff2Str } from '../../component/function/formatDateReturn';
import jia from './../../../assets/img/jia.png';
import jian from './../../../assets/img/jian.png';
import Api from './../../../api';
import('./../../component/index.scss');
const { confirm } = Modal;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const hexlist = '0123456789abcdef'; //解析16进制
const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 5 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 }
	}
};
const formItemLayouts = {
	labelCol: {
		xs: { span: 12 },
		sm: { span: 5 }
	},
	wrapperCol: {
		xs: { span: 12 },
		sm: { span: 22 }
	}
};
type Props = {
	width: number,
	title: string,
	visible: Boolean,
	handleOk: Function,
	onCancel: Function,
	data: Array<object>
};
type State = {
	view: string,
	mark: boolean,
	view: string,
	Type: string,
	listData: any,
	device: object<string>,
	links: object<string>,
};
@inject('DeviceState', 'Devices')
@observer
export default class DeviceModle extends Component<Props, State> {

	state = {
		view: '1',
		Type: '',
		listData: [],
		device: {},
		links: {},
	};
	render() {
		return (
			<BaseModel
				width={this.props.width}
				title={this.props.title}
				visible={this.props.visible}
				handleOk={() => {
					this.props.handleOk;
				}}
				onCancel={() => {
					this.props.onCancel();
					this.props.Devices._validationNet = false;
					this.setState({
						view: '1'
					});
				}}
			>
				<Tabs
					className="tabss"
					tabPosition="left"
					type="card"
					activeKey={String(this.state.view)}
				>
					<TabPane tab="设备信息" key="1">
						<DeviceInfo
							data={toJS(this.props.Devices._validation)}
							Itme={this.props.itme} ref="deviceInfo" />
					</TabPane>
					<TabPane tab="连接方式" key="2">
						<LinkRelease
							Itme={this.props.itme}
							ref="links"
							mapData={toJS(this.props.DeviceState.dictionaryList)}
						/>
					</TabPane>
					<TabPane tab="控制数据" key="3">
						<TablsInfo
							Itme={this.props.itme}
							type={this.state.type}
							listData={this.state.listData}
							mapData={toJS(this.props.DeviceState.dictionaryList)}
							ref='Tables'
						/>
					</TabPane>
				</Tabs>

				<div className="Modla-button">
					{this.state.view > 1 ? (
						<Button
							onClick={this.simple}
							type="primary"
							className="Modla-button-left"
						>
							上一步
						</Button>
					) : null}
					{this.state.view === '3' ? (
						<Button onClick={this.SeveCtr} className="Modla-button-doe" type="primary">
							完成
						</Button>
					) : (
							<Button
								className="Modla-button-right"
								onClick={this.shoView}
								type="primary"
								disabled={this.props.Devices._validationNet&&String(this.state.view)==="2"}
							>
								下一步
						</Button>
						)}

				</div>
			</BaseModel >
		);
	}

	//保存
	SeveCtr = () => {
		let ctr = this.refs.Tables;	//控制数据参数
		let Device = this.state.device;	//设备信息 参数
		let link = this.state.links;	//链接方式 参数
		let off = this.props.itme;
		ctr.validateFields(async (err, val) => {
			if (!err) {
				// console.log(objs);
				// console.log(val);
				let codingScheme = val.codingScheme;	//编码方式 编码方式
				let userid = JSON.parse(window.localStorage.getItem('data')).userid;
				delete val.codingScheme;

				//val
				let ant = Object.keys(val).map((key, i) => ({
					keyId: key,
					controlCommand: val[key],
					equipId: Device.equipType,
					id: this.state.listData[i].id === null ? '' : this.state.listData[i].id
				}));
				// let param = Object.assign(Device, link, { codingScheme: codingScheme }, JSON.stringify(off) !== '{}' ? { 'id': off.id } : null);
				let param = Object.assign(Device, link, { codingScheme: codingScheme }, { 'id': typeof (off.id) !== 'undefined' ? off.id : '' }, { userid: userid });

				let res = await Api.Device.AddSeven(param, ant);
				if (res.code === 200) {
					message.success(res.msg);
					this.props.onCancel();
					this.props.Devices.list(
						this.props.Devices.current,
						this.props.Devices.search.type,
						this.props.Devices.search.brandType,
						this.props.Devices.search.deviceValue,
						this.props.Devices.search.brandTypeId
					);

					this.setState({ view: '1' });
				}
			}
		});
	}
	//上一步
	simple = () => {
		let numbet = this.state.view;
		if (numbet >= '2') {
			this.setState({ view: String(--numbet) });
		}
	};
	//下一步
	shoView = () => {
		let numbet = this.state.view;
		if (numbet !== 3) {
			let device = this.refs.deviceInfo;
			device.validateFields(async (err, value) => {
				// console.log(value);
				if (value.brandCnName && value.brandEnName) {
					Modal.warning({
						centered: true,
						title: '请点击"添加品牌"',
					});
					return;
				}
				let res = await Api.Device.dataCtr(value.type, JSON.stringify(this.props.itme) !== '{}' ? this.props.itme.id : null);
				this.setState({
					listData: res.data,
					device: value
				});
				if (!err) {
					this.setState({ view: '2' });
					// console.log(numbet);
					if (numbet === '2') {
						let links = this.refs.links;
						links.validateFields((err, val) => {
							if (!err) {
								// console.log(val);
								this.setState({ view: '3', type: val.connectType, links: val });
							}
						});
					}

				}
			});
		}
	};
}

// 第三个组件建
const TablsInfo = Form.create()(
@inject('Socke', 'Devices')
@observer
class extends Component {
	state = { mark: null, }
	@observable itemKiD = null;  //ID
	componentDidMount() {
		if (this.props.Itme.codingscheme) {
			this.setState({ mark: this.props.Itme.codingscheme });
		}
		this._socketMsg();
	}
	//通过红外发送过来的数据来赋值到Input上
	_socketMsg(sliceArray) {
		/**
		 * 	dataSource变量 数据源
		 * 	this._start()函数 向硬件send数据
		 * 	ControlCodeData 变量  获取硬件发送过来的数据，并且解析16进制数据
		 *  location 变量 ID来获取当前的坐标，然后截取剩下数组
		 *  sliceArray 变量  截取到的数组从新放入到 generator中自动，next()添加编码到input中
		 */
		try {
			let dataSource = typeof (sliceArray) !== 'undefined' ? sliceArray : this.props.listData;
			let qs = idMarker(dataSource);
			let datamouseFocu = idMarker(dataSource);
			let automatic = datamouseFocu.next();  //让它优先获取下一个ID

			window.ws.onmessage = (evt) => {
				try {
					let msg = new window.proto.com.yj.itgm.protocol.BaseMsg.deserializeBinary(evt.data);
					let res = new window.proto.com.yj.itgm.protocol.BaseDataMsg.deserializeBinary(msg.getData());
					if (res.getCommand() === 8) {
						let ControlCodeData = this.uint8ToHexStr(res.getData());
						const { form: { setFieldsValue } } = this.props;
						// console.log(this.uint8ToHexStr(res.getData()));
						if (this.itemKiD === null) {
							let id = qs.next().value.kId;		//自动获取下一个input把值填写进入
							setFieldsValue({ [id]: ControlCodeData });
							this[`userzh${datamouseFocu.next().value.kId}`].focus();
							setTimeout(() => {
								this._start();
							}, 1000);
						} else if (this.itemKiD !== null) {
							let location = dataSource.findIndex((v) => v.kId == this.itemKiD);
							let sliceArray = dataSource.slice(location);
							let Ck = idMarker(sliceArray);
							let mouseFocu = idMarker(sliceArray);
							let id = Ck.next().value.kId;
							let Fouc = mouseFocu.next();  //让它优先获取下一个ID
							setFieldsValue({ [id]: ControlCodeData });
							// this[`userzh${id}`].focus();
							this[`userzh${mouseFocu.next().value.kId}`].focus();
							this.itemKiD = Ck.next().value.kId;
							setTimeout(() => {
								this._start();
							}, 1000);
						}
					}
				} catch (error) {
					console.log(error);
				}
			};
		} catch (error) {
			console.log(error);
		}
	}
	//16转换string
	uint8ToHexStr(bytes) {
		let array = [];
		for (let i = 0; i < bytes.length; i++) {
			let tmp1 = parseInt(bytes[i] / 16);
			let tmp2 = bytes[i] % 16;
			array.push(hexlist[tmp1] + hexlist[tmp2]);
		}
		return array.join('');
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { type, listData, Itme } = this.props;
		return (
			<Form className="row limitHeight" onSubmit={this.handleSubmit}>
				<FormItem {...formItemLayout} label="编码方式" className="links">
					{getFieldDecorator('codingScheme', {
						rules: [{ required: true, message: '请选择编码方式' }],
						initialValue: 'HEX'//Itme.codingscheme
					})(
						<RadioGroup className="Groups" onChange={this.checkouts}>
							{this.props.mapData.coding_scheme.map(MapDataFormatcoding)}
						</RadioGroup>
					)}
					{type === '7' ? <Button onClick={this._start} type="primary">开始学习</Button> : null}
				</FormItem>
				{listData.map((res, index) => {
					return (
						<FormItem key={index} label={res.keyname} {...formItemLayout} className="tiems" >
							{getFieldDecorator(res.kId, {
								// rules: [{ required: false, message: '请填写控制命令' },
								// 	// { validator: this.ipValidator, trigger: 'blur' }
								// ],
								initialValue: res.ctrlCommand !== null ? res.ctrlCommand : ''
							})(
								<Input
									onClick={this.setValue.bind(this, res.kId)}
									ref={c => this[`userzh${res.kId}`] = c}
									className="inputs" placeholder="请填写控制命令" />
							)}
						</FormItem>
					);
				})}
			</Form>
		);
	}
	//开始学习
	_start = () => {
		this.props.Socke._sendHardware(this.props.Devices._StringNo); //向socket send 数据
	}

	//下一步
	_next = (get, str) => {
		try {
			let marak = get.next().value;
			this[`userzh${marak.kId}`].focus();
			// this[`userzh${marak.kId}`].input.value = str;
			this.itemKiD = marak.kId;

			if (typeof (marak.kId) !== 'undefined') {
				// objs[marak.kId] = str;
				setTimeout(() => {
					this._start();
				}, 1000);
			}
		} catch (error) {
			console.log(error);
		}
	}
	//设置value
	setValue = (e) => {
		this.itemKiD = e;
	}

	//监听数据
	// socketMsg = () => {
	// 	const { listData } = this.props;
	// 	let get = idMarker(listData);  //generator
	// 	if (listData.length > 0) {
	// 		autorun(() => {
	// 			const { startMsg } = this.props.Socke;
	// 			if (toJS(startMsg).length > 0) {
	// 				this._next(get, toJS(startMsg).join(''));
	// 			} else if (toJS(startMsg) === '') {
	// 				// alert('红外学习失败, 请从新学习');
	// 			}
	// 		});
	// 	}
	// }
	checkouts = (e) => {
		this.setState({ mark: e.target.value });
	}
	ipValidator = (rule, value, callback) => {
		let setFieldsValue = this.props.form.setFieldsValue;
		if (value) {
			if (/[\u4E00-\u9FA5]/g.test(value)) {
				callback(new Error('只能输入字母数字、不能输入汉字!'));
			} else {
				if (this.state.mark === 'HEX') {
					if (value.length > 196) {
						callback('最大输入196个字节');
					} else {
						callback();

					}
				} else if (this.state.mark === 'ASCII') {
					if (value.length > 98) {
						callback('最大输入98个字节');
					} else {
						callback();
					}
				}

			}
		}
		callback();
	}
}
);

//第二个组件

const LinkRelease = Form.create()(
@inject('DeviceState', 'Devices')
@observer
class extends Component {
	state = {
		datalist: [],
		name: '',
		expand:false,
		inputValue:''
	}
	componentDidMount() {
		this.listLink();
		this.setState({ name: typeof (this.props.Itme.connecttype) === 'undefined' ? '2' : this.props.Itme.connecttype });
	}
	handleChooseClass=(value,node,extra)=>{
		const {setFieldsValue}=this.props.form
		if(value[0].includes("classroom")){
			this.setState({
				inputValue:node.selectedNodes[0].props.title,
				expand:false
			})
			setFieldsValue({"classrommids":node.selectedNodes[0].props.title})
			this.props.Devices.get_imei_by_room(node.selectedNodes[0].props.value)

		}else {
			setFieldsValue({"classrommids":""})

		}
	}
	handleClickInput=()=>{
		this.setState({
			expand:!this.state.expand
		})
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { datalist, name } = this.state;
		const { Itme } = this.props;
		return (
			<Form className="row" onSubmit={this.handleSubmit}>
				<FormItem {...formItemLayouts} className="links">
					{getFieldDecorator('connectType', {
						rules: [{ required: true, message: '请选择链接方式' }],
						initialValue: typeof (Itme.connecttype) === 'undefined' ? '1' : Itme.connecttype
					})(
						<RadioGroup onChange={(e) => { this.setState({ name: e.target.value }); }} className="Group">
							{datalist.map((res, index) => {
								return (
									<Radio value={res.id} key={index}><span className="Group-span">{res.connName}</span></Radio >
								);
							})}
						</RadioGroup  >
					)}
				</FormItem>
				{name === '7' ?
					<div className="deviceStart">
						{/* <FormItem {...formItemLayout} className="links">
							{getFieldDecorator('hwValue', {
								rules: [{ required: true, message: '请选择K' }],
								initialValue: typeof (Itme.hwvalue) === 'undefined' ? '38k' : Itme.hwvalue
							})(
								<RadioGroup className="Group time">
									<Radio value="38k"><span className="Group-span">38k</span></Radio>
									<Radio value="56k"><span className="Group-span">56k</span></Radio>
								</RadioGroup>
							)}
						</FormItem> */}
						<FormItem {...formItemLayout} label="选择教室" className="links">
							{getFieldDecorator('classrommids', {
								rules: [{ required: true, message: '选择教室用于红外学习' }],
								initialValue:""
								// initialValuee: '4016' //typeof (Itme.hwvalue) === 'undefined' ? '38k' : Itme.hwvalue
							})(
								// 红外
								<Input  onClick={this.handleClickInput} placeholder="选择教室用于红外学习" readOnly className="chooseInput"/>
							)}
							<Tree.DirectoryTree
								style={{display:this.state.expand?"block":'none'}}
								treeData={toJS(this.props.DeviceState.classRoomListSelect)} //
								className="chooseClass"
								onSelect={this.handleChooseClass}
							/>
						</FormItem>
						<br />
						<span className="errorMsg">{this.props.Devices._msg}</span>
					</div>
					: null}
				{name === '1' || name === '2' ?
					<div>
						< FormItem {...formItemLayout} label="波特率" className="tiems">
							{getFieldDecorator('baudRate', {
								rules: [{ required: true, message: '请选择波特率' }],
								initialValue: typeof (Itme.baudrate) !== 'undefined' ? Itme.baudrate : '9600'
							})(
								<Select placeholder="请选择波特率" className="tiems-select" >
									{this.props.mapData.baud_rate.map(MapDataFormat)}
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="数据位" className="tiems">
							{getFieldDecorator('dataBit', {
								rules: [{ required: true, message: '请选择数据位' }],
								initialValue: typeof (Itme.databit) !== 'undefined' ? Itme.databit : '8'
							})(
								<Select placeholder="请选择数据位" className="tiems-select" >
									{this.props.mapData.data_bits.map(MapDataFormat)}
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="停止位" className="tiems">
							{getFieldDecorator('stopBit', {
								rules: [{ required: true, message: '请选择停止位' }],
								initialValue: typeof (Itme.stopbit) !== 'undefined' ? Itme.stopbit : '1'
							})(
								<Select placeholder="请选择停止位" className="tiems-select" >
									{this.props.mapData.stop_bits.map(MapDataFormat)}
								</Select>
							)}
						</FormItem>
						<FormItem {...formItemLayout} label="校验" className="tiems">
							{getFieldDecorator('checks', {
								rules: [{ required: true, message: '请选择校验' }],
								initialValue: typeof (Itme.checkout) !== 'undefined' ? Itme.checkout : '0'
							})(
								<Select placeholder="请选择校验" className="tiems-select" >
									{this.props.mapData.checks.map(MapDataFormat)}
								</Select>
							)}
						</FormItem>
					</div>
					: null}
				{name === '4' || name === '3' ? <div>
					<FormItem {...formItemLayout} label="端口号" className="links rows">
						{getFieldDecorator('port', {
							rules: [{ required: true, message: '请输入端口号', pattern: new RegExp(/^[1-9]\d*$/, 'g') },
							{ validator: this.Proot, }
							],
							initialValue: Itme.portno,
							getValueFromEvent: (event) => {
								return event.target.value.replace(/\D/g, '');
							},
						})(
							<Input maxLength={5} className="rows-inputs" placeholder="请输入端口号" />
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="用户名字" className="links rows">
						{getFieldDecorator('username', {
							// rules: [{ required: true, message: '请输入用户名字' }],
							initialValue: Itme.user_name?Itme.user_name:''
						})(
							<Input maxLength={20} className="rows-inputs" placeholder="请输用户名字" />
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="密码" className="links rows">
						{getFieldDecorator('password', {
							// rules: [{ required: true, message: '请输入密码' }],
							initialValue: Itme.pass_word
						})(
							<Input maxLength={20} className="rows-inputs" type="password" placeholder="请输入密码" />
						)}
					</FormItem>
				</div> : null}
			</Form >
		);
	}
	listLink = async () => {
		let res = await Api.Device.Links();
		if (res.code === 200) { this.setState({ datalist: res.data }); }
	}
	//判断端口
	Proot = (rule, value, callback) => {
		if (value != '') {
			if (isNaN(value) || value > 65535 || value < 0) {
				callback('请输入端口在(1-65535)范围之内');
			}
			callback();
		}
		callback();
	}
}
);

//第一个组件
const DeviceInfo = Form.create()(
	class extends Component {
		state = {
			mark: false,
			brands: [],
		};
		componentDidMount() {
			this.banr();
		}
		render() {
			const { getFieldDecorator } = this.props.form;
			const { Itme, data } = this.props;
			const { brands } = this.state;
			return (
				<Form className="row" onSubmit={this.handleSubmit}>
					<FormItem {...formItemLayout} label="设备类型" className="tiems">
						{getFieldDecorator('type', {
							rules: [{ required: true, message: '请选择设备类型' }],
							initialValue: Itme.equiptype
						})(
							<Select
								onChange={(e) => { this.banr(e); }}
								placeholder="请选择设备类型" className="tiems-select">
								{data.map((res, index) => {
									return (
										<Option value={res.id} key={index}>
											{res.equiptypename}
										</Option>
									);
								})}
							</Select>
						)}
					</FormItem>
					<FormItem {...formItemLayout} label="品牌" className="tiems">
						{getFieldDecorator('brand', {
							rules: [{ required: true, message: '请选择品牌' }],
							// initialValue: Itme.equipbrand
						})(
							<Select
								placeholder="请选择或输入设备品牌"
								className="tiems-select"
								disabled={this.state.mark}
							>
								{/*<Option value="0">请选择或输入设备品牌</Option>*/}
								{brands.map((res, index) => {
									return (
										<Option value={res.id} key={index}>
											{res.brandcnname}
										</Option>
									);
								})}
							</Select>
						)}
						<img
							onClick={this.showView}
							className="imgs"
							src={this.state.mark ? jian : jia}
						/>
					</FormItem>
					{this.state.mark ? (
						<div>
							<FormItem
								{...formItemLayout}
								label="品牌(中文)"
								className="tiems"
							>
								{getFieldDecorator('brandCnName', {
									rules: [{ required: true, message: '请输入品牌(中文)' }]
									// initialValue: Itme.equipType
								})(
									<Input
										placeholder="添加中文品牌(如：格力)"
										className="inputs"
										maxLength={20}
									/>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label="品牌(英文)"
								className="tiems"
							>
								{getFieldDecorator('brandEnName', {
									rules: [{ required: true, message: '请输入品牌(英文)' }]
									// initialValue: Itme.equipType
								})(
									<Input
										placeholder="添加英文品牌(如：GREE)"
										className="inputs"
										maxLength={30}
									/>
								)}
								<Button onClick={this.AddType} className="tiems-button" type="primary">
									添加品牌
								</Button>
							</FormItem>
						</div>
					) : null}

					<FormItem {...formItemLayout} label="设备型号" className="tiems">
						{getFieldDecorator('model', {
							rules: [{ required: true, message: '请输入设备型号' }, {
								max: 20,
								message: '不能超过20字符',
							}],
							initialValue: Itme.equipmodel
						})(<Input placeholder="请输入设备型号" className="inputs" />)}
					</FormItem>
				</Form>
			);
		}
		//添加品牌
		AddType = async () => {
			const { form: { getFieldValue, validateFields, setFieldsValue } } = this.props;
			validateFields(['brandCnName', 'brandEnName'], async (error, value) => {
				if (!error) {
					let res = await Api.Device.SeveBrand(getFieldValue('brandCnName'), getFieldValue('brandEnName'));
					let data = await Api.Device.Devicebrand();
					this.setState({ brands: data.data, mark: false });
					setFieldsValue({ brand: res.data });
					message.success(res.msg);
				}
			});
		}
		//下拉类型
		banr = async () => {
			const { form: { resetFields } } = this.props;
			resetFields('equipBrand', []);
			let res = await Api.Device.Devicebrand();
			// console.log(res);
			this.setState({ brands: res.data });
		}
		showView = () => {
			if (!this.state.mark) {
				this.setState({ mark: true });
			} else {
				this.setState({ mark: false });
			}
		};
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
