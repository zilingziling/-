// @flow

import React, { Component } from 'react';
import { Modal } from 'antd';
import '../index.scss';

type Props = {
	width: number,
	title: string,
	visible: boolean,
	handleOk: Function,
	onCancel: Function,
	style: string
};

export class BaseModel extends Component<Props> {
	render() {
		return (
			<Modal
				maskStyle={this.props.maskStyle&&this.props.maskStyle}
				className={this.props.className}
				style={this.props.style}
				width={this.props.width}
				okText="确定"
				cancelText="取消"
				title={this.props.title}
				visible={this.props.visible}
				onOk={this.props.handleOk}
				onCancel={this.props.onCancel}
				destroyOnClose={true}
				className="model"
				footer={null}
				maskClosable={false}
			>
				{this.props.children}
			</Modal>
		);
	}
}
export class Model extends Component<Props> {
	render() {
		return (
			<Modal
				className={this.props.className}
				style={this.props.style}
				width={this.props.width}
				okText="确定"
				cancelText="取消"
				title={this.props.title}
				visible={this.props.visible}
				onOk={this.props.handleOk}
				onCancel={this.props.onCancel}
				destroyOnClose={true}
				className="model"
				maskClosable={false}
			// footer={null}
			>
				{this.props.children}
			</Modal>
		);
	}
}

export class Models extends Component<Props> {
	render() {
		return (
			<Modal
				style={this.props.style}
				width={this.props.width}
				okText="确定"
				cancelText="取消"
				title={this.props.title}
				visible={this.props.visible}
				onOk={this.props.handleOk}
				onCancel={this.props.onCancel}
				destroyOnClose={true}
				className="model"
				maskClosable={false}
			// footer={null}
			>
				{this.props.children}
			</Modal>
		);
	}
}
