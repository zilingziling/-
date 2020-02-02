//@flow
import React, { Component } from "react";
import { Modal, Form } from "antd";
import BaseModel from "../../component/Model/model";
const FormItem = Form.Item;

export default class DeviceAddModles extends Component {
  render() {
    return (
      <div>
        <BaseModel
          width={this.props.width}
          title={this.props.title}
          visible={this.props.visible}
          handleOk={this.props.handleOk}
          onCancel={this.props.onCancel}
        ></BaseModel>
      </div>
    );
  }
}
