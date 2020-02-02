// @flow
import React, { Component } from 'react';
import Api from './../../../api';
import { Slider,Button } from 'antd';
import {getUuid} from "../../../utils/handleNumbers";
type Props = {
	list: Array<Object>,
	pushItem: Function,
};
type State = {
	itemStyle: Number,
	btn: Array<Object>,
	btnStyle: Number,
	deivcesID: String,
	name: String,
	amplifierOfConditioning: Object<string>,
	Conditioning: String,
	ConditioningValue: String,
	volume: String,
	volumeValue: String
};
const style_ = {
	width: 280, marginLeft: 20
};

class ScenBody extends Component<Props, State> {
	state = {
		itemStyle: null,
		btn: [],
		btnStyle: null,
		deivcesID: null,
		name: '',
		amplifierOfConditioning: null,
		Conditioning: null,  //空调
		ConditioningValue: 24,
		volume: null,  //功放
		volumeValue: 0,
	};
	render() {
		return (
			<div className="Scene-body-centen">
				<div className="Scene-body-centen-devices">
					{this.props.list.length > 0 ? this.props.list.map(this.list) : null}
				</div>

				<div className="Scene-body-centen-key">
					<p>按键选项</p>
					{/* {console.log(this.props)} */}
					<div className="Scene-body-centen-key-btn">
						{this.state.btn.length > 0 ? this.state.btn.map(this.btnList) : null}
						{this.state.amplifierOfConditioning !== null ? this.amplifierOfConditioning(this.state.amplifierOfConditioning) : null}
						{this.state.volume !== null ? this.volume(this.state.volume) : null}
					</div>
				</div>
			</div>
		);
	}
	//设备
	list = (data: Object, index: number) => {
		try {
			let url = require(`../../../assets/img/${data.equip_type_img}.png`);
			return (
				<div
					style={this.state.itemStyle === index ? { background: '#394188' } : null}
					onClick={this.item.bind(this, data, index)}
					key={index}
					className="Scene-body-centen-devices-item"
				>
					<img src={url} />
					<span>{data.equipname}</span>
				</div>
			);
		} catch (error) {
			console.log('没有图片在本地需要导入进去—— 情景模式');
		}
	};
	item = async (data: Object, index: Number) => {
		// console.log(data);
		if (data.equiptypeid === '2' || data.equiptypeid === '14') {
			if (data.equiptypeid === '2') {
				this.setState({
					amplifierOfConditioning: data,
					itemStyle: index,
					btnStyle: null,
					btn: [],
					volume: null,
				});
			} else {
				this.setState({
					btn: [],
					itemStyle: index,
					btnStyle: null,
					amplifierOfConditioning: null,
					volume: data
				});
			}

		} else {
			let res = await Api.Scenario.get_key_equips(data.equiptypeid);
			console.log(res);
			if (res.code === 200) {
				this.setState({
					btn: res.data,
					itemStyle: index,
					deivcesID: data.id,
					btnStyle: null,
					name: data.equipname,
					amplifierOfConditioning: null,
					volume: null,
				});
			}
		}
	};
	//按钮all
	btnList = (data: Object, index: number) => {
		return (
			<div
				style={this.state.btnStyle === index ? { background: '#394188' } : null}
				key={index}
				className="Scene-body-centen-key-btn-div"
				onClick={this.btnItem.bind(this, data, index)}
			>
				<span>{data.key_name}</span>
				<img  src={require('./../../../assets/img/jias.png')} />
			</div>
		);
	};
	//添加到父组件
	btnItem = (data: Object, index: Number) => {
		this.setState({
			btnStyle: index
		});
		this.props.pushItem({...data,uuid:getUuid()}, this.state.deivcesID, this.state.name);
	};
	//空调render
	amplifierOfConditioning = (mark: String) => {
		return (
			<div className="row">
				<div className="row-show">
					<div className="Scene-div" style={this.state.Conditioning === 0 ? { background: '#303b89' } : null} onClick={this.Conditionings.bind(this, 0)}>
						<span>关机</span>
					</div>
					<div className="Scene-div" style={this.state.Conditioning === 1 ? { background: '#303b89' } : null} onClick={this.Conditionings.bind(this, 1)}>
						<span>制热</span>
					</div>
					<div className="Scene-div" style={this.state.Conditioning === 2 ? { background: '#303b89' } : null} onClick={this.Conditionings.bind(this, 2)}>
						<span>制冷</span>
					</div>
					<div className="Scene-div" onClick={this.pushCond.bind(this)}>
						<span>添加</span>
						<img src={require('./../../../assets/img/jias.png')} />
					</div>
				</div>
				<div className="row-Ctrl">
					<img src={require('./../../../assets/img/-.png')} />
					<Slider
						value={this.state.ConditioningValue}
						onChange={(ConditioningValue) => { this.setState({ ConditioningValue }); }} style={style_} max={32} min={16} />
					<img src={require('./../../../assets/img/+.png')} />
					<span>{this.state.ConditioningValue}°C</span>
				</div>
			</div>
		);
	}
	Conditionings = (Conditioning: String) => {
		this.setState({ Conditioning });
	}
	//push 空调
	pushCond = () => {
		let mrak = this.state.Conditioning;
		let info = this.state.amplifierOfConditioning;
		let value = this.state.ConditioningValue.toString();
		console.log("172hang",info)
		if (mrak === 0) {
			this.props.pushItem({ key_name: '立即关机', id: 73,uuid:getUuid() }, info.id, info.equipname);
		} else if (mrak === 1) {
			this.props.pushItem({ key_name: '开机制热' + value + '度',uuid:getUuid(), id: hotMapKey[temper(value)], key_value: value }, info.id, info.equipname);
		} else if (mrak === 2) {
			this.props.pushItem({ key_name: '开机制冷' + value + '度',uuid:getUuid(), id: ColdmapKey[temper(value)], key_value: value }, info.id, info.equipname);
		}
	}
	//功放
	volume = (volume: Object<string>) => {
		console.log(typeof this.state.volumeValue);
		return (
			<div className="row">
				<div className="row-show">
					<div className="Scene-div" onClick={this.pushVolume.bind(this, volume, '开机', 37, false)}>
						<span>开机</span>
						<img  src={require('./../../../assets/img/jias.png')} />
					</div>
					<div className="Scene-div" onClick={this.pushVolume.bind(this, volume, '关机', 38, false)}>
						<span>关机</span>
						<img  src={require('./../../../assets/img/jias.png')} />
					</div>
					<Button  disabled={this.state.volumeValue === 0} className="Scene-div" onClick={this.pushVolume.bind(this, volume, '静音', 41, this.state.volumeValue)}>
						<span>静音</span>
						<img  src={require('./../../../assets/img/jias.png')} />
					</Button>
					<div  className="Scene-div" onClick={this.pushVolume.bind(this, volume, '音量加', 39, false)}>
						<span>音量加</span>
						<img  src={require('./../../../assets/img/jias.png')} />
					</div>

					<div className="Scene-div" onClick={this.pushVolume.bind(this, volume, '音量减', 40, false)}>
						<span>音量减</span>
						<img  src={require('./../../../assets/img/jias.png')} />
					</div>
					<Button disabled={this.state.volumeValue === 0} className="Scene-div" onClick={this.pushVolume.bind(this, volume, '取消静音', 42, this.state.volumeValue)}>
						<span>取消静音</span>
						<img  src={require('./../../../assets/img/jias.png')} />
					</Button>
				</div>
				<div className="row-Ctrl">
					<img src={require('./../../../assets/img/voiceno.png')} />
					<Slider
						// onAfterChange={(e) => { this.after(e, volume); }}
						value={this.state.volumeValue}
						onChange={this.volumeValue} style={{ width: 280, marginLeft: 20, }} max={100} min={0} />
					<img src={require('./../../../assets/img/voiceok.png')} />
					<span>{this.state.volumeValue}%</span>
					<img onClick={this.pushVolume.bind(this, volume, '音量设置' + this.state.volumeValue + '%', 43, this.state.volumeValue)} src={require('./../../../assets/img/jias.png')} />

				</div>
			</div>
		);
	}
	//音量
	// after = (e: number) => {
	// 	// console.log(e);
	// 	// this.props.pushItem({key_name: '音量'})
	// }
	//push 功放
	pushVolume = (info: Object, name: String, id: number, value: String) => {
		// console.log(value);
		if (value) {
			this.props.pushItem({ key_name: name, id, key_value: value ,uuid:getUuid()}, info.id, info.equipname);
		} else {
			this.props.pushItem({ key_name: name, id,uuid:getUuid() }, info.id, info.equipname);
		}
	};
	volumeValue = (volumeValue: String) => {
		this.setState({ volumeValue });

	}
}
export default ScenBody;
let ColdmapKey = {
	'16': '27',
	'17': '28',
	'18': '45',
	'19': '46',
	'20': '47',
	'21': '48',
	'22': '49',
	'23': '50',
	'24': '51',
	'25': '52',
	'26': '53',
	'27': '54',
	'28': '55',
	'29': '56',
	'30': '57',
};
const hotMapKey = {
	'16': '58',
	'17': '59',
	'18': '60',
	'19': '61',
	'20': '62',
	'21': '63',
	'22': '64',
	'23': '65',
	'24': '66',
	'25': '67',
	'26': '68',
	'27': '69',
	'28': '70',
	'29': '71',
	'30': '72',
};
const temper = (text: String) => { //text 是温度
	const match = text.match(/\d\d\d?/gi);
	return match.length ? match[0] : '';
};
