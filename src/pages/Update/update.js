//@flow
import React, { Component } from 'react';
import { Upload, Button, Input, List, Spin } from 'antd';
import Api from './../../api';
import { observable, toJS, } from 'mobx';
import { observer, inject } from 'mobx-react';
import './update.scss';
import {RouterPmi} from "../component/function/routerPmi";
/**
 * 这个页面包含了， Ai升级、触摸屏升级、中控升级
 */
type Props = {
	match: Object,
	history: Object,
	location: Object,
	DeviceState: Object,
};
type State = {}
const versionStyle = {
	color:"#ffffff",
	marginLeft:"1rem"
};
@inject('DeviceState')
@observer
class Updates extends Component {
	state = {
		text: '未选中文件',
		file: null,
		vers: null,
		upLoig: false,
		spinning: false,
		calssRoomId: [],
		successRouter: null,
		authority:RouterPmi()
	}
	componentDidMount() {
		this.props.DeviceState._updatelists(this.siwtchRouter());
	}
	render() {
		const { text } = this.state;
		return (
			<div className="update-fu">
				<Spin tip="上传文件中"  spinning={this.state.spinning} >
					<div className="update-fu-div">
						<p className="update-fu-div-p">
							{window.location.pathname === '/update' && '中控固件升级'}
							{window.location.pathname === '/TouchUpdate' && '触摸屏升级'}
							{window.location.pathname === '/aiUpdate' && 'AI升级'}
						</p>
						<p className="update-fu-div-p1">最新的升级固件，请到易简官网下载，或联系小弈的运维工程师获取，得到新的升级固件后，点击网站上的本页的“上传文件”，上传成功后，中控在下一次重启时自动升级</p>
					</div>
					<div className="update-fu-up">
						<span className="update-fu-up-version">当前固件版本为<span style={versionStyle}>{this.props.DeviceState._Version?this.props.DeviceState._Version:"暂无版本信息"}</span></span>
						<Button onClick={this._goBack} type='primary' className="update-fu-up-btns">升级区域</Button>
					</div>
					<div className="update-fu-up update-fu-margin">
						<div>
							<span className="update-fu-up-fonts">文件路径：</span>
							<Upload
								name='file'
								showUploadList={false}
								beforeUpload={this.info}
								action={null}
							>
								<Button className="update-fu-up-btn" disabled={!this.state.authority.includes("browse")}><span>浏览</span></Button>
							</Upload>
							<span className="update-fu-up-fontss">{text.length > 15 ? text.substring(0, 15) + '...' : text}</span>
						</div>
						<Button className="update-fu-info-btn" disabled={this.state.upLoig} onClick={this.upLoad} type="primary">
							上传文件
						</Button>
					</div>
					<div className="update-fu-list">
						<List
							className="update-fu-list-list"
							header={
								<div className="update-fu-list-header">
									<div className="update-fu-list-header-div">版本号</div>
									<div className="update-fu-list-header-div">文件名字</div>
									<div className="update-fu-list-header-div">上传日期</div>
								</div>
							}
							dataSource={toJS(this.props.DeviceState._UpdateList)}//{this.state.listData}
							renderItem={row}
						/>
					</div>
					<div className="update-fu-bott">
						<span>注意：中控重启升级过程中为保证正常升级，请不要断电！</span>
					</div>
				</Spin>
			</div>
		);
	}
	//上传
	upLoad = async () => {
		let flie = this.state.file;
		let vers = this.state.vers;
		let filename = this.state.text;
		let marak = window.location.pathname;
		try {
			if (flie !== null) {
				// if (vers !== null) {
				if (flie.size <= 31457280) {
					this.setState({
						upLoig: true,
						spinning: true,
					});
					let res = await Api.Device.upload_upgrade(flie, vers, filename, this.siwtchRouter());
					if (res.code === 200) {
						this.props.DeviceState._updatelists(this.siwtchRouter());
						window._guider.Utils.alert({
							message: res.msg,
							type: 'success'
						});
						this.setState({
							file: null,
							vers: null,
							upLoig: false,
							text: '未选中文件',
							spinning: false,
						});
					} else { this.setState({ spinning: false, upLoig: false });
						window._guider.Utils.alert({
							message: res.msg,
							type: 'error'
						});
					}
				} else {
					window._guider.Utils.alert({
						message: '请上传下于30MB文件',
						type: 'warning'
					});
				}
			} else {
				window._guider.Utils.alert({
					message: '请选择上传的文件',
					type: 'warning'
				});
			}
		} catch (error) {
			console.log(error);
		}

	}
	//文件监听
	info = (info: Object) => {
		console.log(info);
		this.setState({
			file: info,
			text: info.name
		});

	}
	//跳转
	_goBack = () => {
		// this.props.history.replace({
		// 	pathname: window.location.pathname === '/update' ? 'updateTable' : 'TouchUpdateTable'
		// });
		let marak = window.location.pathname;
		switch (marak) {
			case '/update':
				this.props.history.replace({
					pathname: 'updateTable',
				});
				break;
			case '/TouchUpdate':
				this.props.history.replace({
					pathname: 'TouchUpdateTable'
				});
				break;
			case '/aiUpdate':
				this.props.history.replace({
					pathname: 'updateTableAi'
				});
				break;
		}
	}
	//根据Router来获取传入的参数
	siwtchRouter = () => {
		let marak = window.location.pathname;
		let mark = '';
		switch (marak) {
			case '/update':
				mark = 1;
				break;
			case '/TouchUpdate':
				mark = 2;
				break;
			case '/aiUpdate':
				mark = 3;
				break;
		}
		return mark;
	}
}

export default Updates;
const row = (item) => {
	return (
		<List.Item
			className="update-fu-list-itme">

			<List.Item.Meta
				title={item.version}
				className="update-fu-list-itme-div"
			/>
			<List.Item.Meta
				// title={item.filename.length > 15 ? item.filename.substring(0, 15) + '...' : item.filename}
				title={item.filename}

				className="update-fu-list-itme-div"
			/>
			<List.Item.Meta
				title={item.createtime}
				className="update-fu-list-itme-div"
			/>
		</List.Item>
	);

};

