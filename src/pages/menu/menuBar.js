//@flow
import React, { Component } from 'react';
import '../component/Bar/bar.scss';
import { Tree, Divider, TreeSelect, Row, Col, Input, Modal, Upload, Icon } from 'antd';
import { Model } from '../component/Model/model';
import { renderTree } from './TreeNode';
import Api from './../../api';
import('./menubar.scss');
const { TreeNode } = Tree;
const DirectoryTree = Tree.DirectoryTree;
const confirm = Modal.confirm;

type Props = {
	treeData: Array<object>,
	mark: object,
	title: String,
	visible: Boolean,
	value: object,
	inputVal: string,
	parent: ayn,
	treeId: string,
}
class MenuBar extends Component<Props, State> {
	state = {
		mark: null,
		title: '',
		visible: false,
		value: '',  //当前节点
		inputVal: null,
		parent: false,//父节点
		ModifyInput: '', //修改
		ModifyID: '', //修改ID节点
		fileList: {},  //img
		loading: false, 	//img
		imageUrl: false, //控制显示图片
		routerUrl: '',
		ModifyRouterUrl: '',
	}
	componentDidMount() {

	}
	render() {
		const uploadButton = (
			<div>
				<Icon type={this.state.loading ? 'loading' : 'plus'} />
				<div className="ant-upload-text">上传图片</div>
			</div>
		);
		const { treeData } = this.props;
		const { mark, title, visible, value, inputVal, ModifyInput, ModifyID, fileList, imageUrl, routerUrl, ModifyRouterUrl } = this.state;
		return (
			<div className="barMen">
				<div className="barMen-P">
					<a onClick={this.click.bind(this, 1)} className={mark === 1 ? 'atyle' : null} href={null}>新增</a>
					<Divider className="barMen-P-d" type="vertical" />
					<a onClick={this.click.bind(this, 2)} className={mark === 2 ? 'atyle' : null} href={null}>编辑</a>
					<Divider className="barMen-P-d" type="vertical" />
					<a onClick={this.click.bind(this, 3)} className={mark === 3 ? 'atyle' : null} href={null}>删除</a>
				</div>
				<div className="devicesele-selects">
					<DirectoryTree
						// multiple
						motion={null}
						showLine
						showIcon={false}
						onSelect={this.seleKey}
						onExpand={this.onExpand}
					>
						{renderTreeNodes(treeData)}
					</DirectoryTree>

				</div>
				<Model
					title={title}
					visible={visible}
					handleOk={this.handleOk}
					onCancel={this.onCancel}
					width={800}
				>
					<Row>
						<Col offset={6} span={12}>
							<span className="row-span">当前菜单:</span>
							&nbsp;&nbsp;&nbsp;
							<TreeSelect
								style={{ width: 300 }}
								value={[value]}
								dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
								placeholder="请选择"
								allowClear
								treeDefaultExpandAll
								onChange={this.onChange}
								showCheckedStrategy={TreeSelect.SHOW_ALL}
							>
								{treeData.map(item => renderTree(item))}
							</TreeSelect>

						</Col>
					</Row>
					<br />
					{mark === 1 ?
						<div>
							<Row>
								<Col offset={6} span={12}>
									<span className="row-span">菜单名称:</span>
									&nbsp;&nbsp;&nbsp;
									<Input className="row-Input" maxLength={20} value={inputVal} onChange={(e) => { this.setState({ inputVal: e.target.value }); }} className="row-inputs" placeholder="请输入菜单名称" />
								</Col>
							</Row>

							<Row style={{ paddingTop: '1rem' }}>
								<Col offset={6} span={12}>
									<span className="row-span">路由地址:</span>
									&nbsp;&nbsp;&nbsp;
									<Input className="row-Input" maxLength={20} value={routerUrl} onChange={(e) => { this.setState({ routerUrl: e.target.value }); }} className="row-inputs" placeholder="请输入路由地址" />
								</Col>
							</Row>
						</div>
						: null}

					{mark === 2 ?
						<div>
							<Row>
								<Col offset={6} span={12}>
									<span className="row-span">编辑菜单:</span>
									&nbsp;&nbsp;&nbsp;
									<Input className="row-Input" value={ModifyInput} onChange={(e) => { this.setState({ ModifyInput: e.target.value }); }} className="row-inputs" placeholder="请输入菜单名称" />
								</Col>
							</Row>
							<Row style={{ paddingTop: '1rem' }}>
								<Col offset={6} span={12}>
									<span className="row-span">修改路由:</span>
									&nbsp;&nbsp;&nbsp;
									<Input className="row-Input" maxLength={20} value={ModifyRouterUrl} onChange={(e) => { this.setState({ ModifyRouterUrl: e.target.value }); }} className="row-inputs" placeholder="请输入路由地址" />
								</Col>
							</Row>
						</div>
						: null}
					<Col className="imgUpdate" offset={6} span={12}>
						<span className="row-span imgUpdate-img">上传图片:</span>
						<Upload
							name="avatar"
							listType="picture-card"
							className="avatar-uploader"
							showUploadList={false}
							beforeUpload={this.beforeUpload}
						>
							{
								// mark === 1 ? uploadButton :
								imageUrl ?
									<img src={imageUrl} alt="avatar" className="imgUpdate-imgsize" /> : uploadButton}
						</Upload>

					</Col>
				</Model>
			</div>
		);
	}

	//获取图片
	beforeUpload = (file) => {
		const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
		if (isJPG) {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				console.log(reader.result);
				this.setState({
					fileList: file,
					imageUrl: reader.result
				});
			};
		} else {
			window._guider.Utils.alert({
				message: '请选择图片',
				type: 'warning'
			});
		}


	}
	//清楚
	onCancel = () => {
		this.setState({
			title: '',
			visible: false,
			// value: '',
			// parent: false,
			// inputVal: null,
			// ModifyInput:'',
			// ModifyID: false,
		});
		if (this.state.mark === 1) {
			this.setState({
				imageUrl: false,
			});
		}
	}
	//保存
	handleOk = async () => {
		const { mark, value, parent, inputVal, ModifyInput, ModifyID, fileList, routerUrl, ModifyRouterUrl } = this.state;
		if (mark === 1) {
			//新增
			if (inputVal !== '') {
				console.log(fileList);
				let res = await Api.setUp.save_menu('', parent, inputVal, fileList, routerUrl);
				if (res.code === 200) {
					console.log(res);
					window._guider.Utils.alert({
						message: res.msg,
						type: 'success'
					});
					this.setState({ inputVal: '', routerUrl: '' });
					this.onCancel();
					this.props.refresh();
				} else {
					window._guider.Utils.alert({
						message: res.msg,
						type: 'error'
					});
				}
			}
		} else if (mark === 2) {
			console.log('保存');
			let res = await Api.setUp.save_menu(value, ModifyID, ModifyInput, fileList, ModifyRouterUrl);
			if (res.code === 200) {
				console.log(res);
				window._guider.Utils.alert({
					message: res.msg,
					type: 'success'
				});
				this.onCancel();
				this.props.refresh();
			} else {
				window._guider.Utils.alert({
					message: res.msg,
					type: 'error'
				});
			}
		}
	}
	//新增、编辑、删除
	click = async (mark: number) => {
		if (mark === 1) {
			this.setState({ mark, title: '新增', visible: true });
		} else if (mark === 2) {
			if (this.state.ModifyInput !== '') {
				this.setState({ mark, title: '编辑', visible: true });
				let res = await Api.setUp.info_menu(this.state.value);
				console.log(res.data);
				this.setState({
					ModifyRouterUrl: res.data.url,
					imageUrl: res.data.icon !== null ? '/deviceapi' + res.data.icon : false,
				});
			} else {
				window._guider.Utils.alert({
					message: '请选择菜单进行编辑',
					type: 'warning'
				});
			}
		} else if (mark === 3) {
			if (this.state.value !== '') {
				confirm({
					title: '确定删除当前菜单吗！',
					centered: true,
					onOk: async () => {
						let res = await Api.setUp.del_menu(this.state.value);
						// console.log(res);
						if (res.code === 200) {
							window._guider.Utils.alert({
								message: res.msg,
								type: 'success'
							});
							this.setState({
								value: '',
								inputVal: '',
								parent: false,
							});
							this.onCancel();
							this.props.refresh();
						} else {
							window._guider.Utils.alert({
								message: res.msg,
								type: 'error'
							});
						}
					},
					onCancel() { },
				});
			} else {
				window._guider.Utils.alert({
					message: '请选择菜单',
					type: 'error'
				});
			}

		}
	}
	onExpand = (expandedKeys: Array) => {
		// console.log('结束');
		// console.log(expandedKeys);
	};
	//监听
	onChange = (value: object, node: object, extra: Object) => {
		console.log(extra.triggerNode);
		if (this.state.mark === 1) {
			if (typeof (extra.triggerNode) !== 'undefined') {
				this.setState({
					value,
					parent: extra.triggerNode.props.value,
				});
			} else {
				this.setState({
					value: '',
					parent: false,
					ModifyInput: ''
				});
			}
		} else {
			if (typeof (extra.triggerNode) !== 'undefined') {
				this.setState({
					ModifyID: extra.triggerNode.props.value,
					parent: extra.triggerNode.props.value,
				});
			} else {
				this.setState({
					ModifyID: '',
					parent: false,
					ModifyInput: ''
				});
			}
		}
	}
	//tree 选择  #把选中的层级复制到编辑中。
	seleKey = (e: Array, info: Array) => {
		if (e.length > 0) {
			// console.log(e[0]);
			this.setState({
				ModifyInput: info.node.props.title,
				value: String(e[0]),
				parent: String(e[0]),
				ModifyID: typeof (info.node.props.parent) !== 'undefined' ? String(info.node.props.parent.value) : false,
			});
			this.props.treeId(e[0]);
		} else {
			this.setState({
				ModifyInput: '',
				parent: false,
			});
			this.props.treeId(null);
		}

	};


}

export default MenuBar;

// const renderTree = (value: Object, parent: Object) => {
// 	try {
// 		if (!value.children) {
// 			return (
// 				<TreeNode value={String(value.value)} title={value.title} key={String(value.value)} />
// 			);
// 		}
// 		return (
// 			<TreeNode
// 				parent={parent}
// 				value={String(value.value)}
// 				title={value.title}
// 				key={String(value.value)}
// 			>
// 				{value.children.map(item => renderTree(item, value))}
// 			</TreeNode>
// 		);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
const renderTreeNodes = (data: Array<object>, parent: Object) => {
	return data.map((item) => {
		if (item.children) {
			return (
				<TreeNode parent={parent} title={item.title} value={String(item.value)} key={String(item.key)} dataRef={item} >
					{renderTreeNodes(item.children, item)}
				</TreeNode>
			);
		}
		return <TreeNode {...item} dataRef={item} />;
	});
};