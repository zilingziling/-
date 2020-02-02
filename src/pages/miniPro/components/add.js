import React from "react";
import { Form, Input } from "antd";
import { Models } from "../../component/Model/model";
import "../miniPro.scss";
import { ope } from "../../../api/miniPro";
const FormItem = Form.Item;
const formItem = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 28 },
    sm: { span: 14 }
  }
};

const Add = ({
  v,
  title,
  setV,
  setT,
  id,
  initData,
  info,
  form: { getFieldDecorator, validateFields, resetFields }
}) => {
  const handleOk = () => {
    validateFields((e, v) => {
      if (!e) {
        ope(
          title.includes("编辑")
            ? { ...v, id: info.id, mark: 2, edit: true }
            : { ...v, mark: 2 }
        ).then(res => {
          if (res.code === 200) {
            window._guider.Utils.alert({
              message: res.msg,
              type: "success"
            });
            resetFields();
            setV(false);
            initData();
          }
        });
      }
    });
  };
  const handleCancel = () => {
    setV(false);
    resetFields();
  };
  return (
    <Models
      visible={v}
      title={title}
      onCancel={handleCancel}
      handleOk={handleOk}
    >
      <Form>
        <FormItem label="字段名称" {...formItem}>
          {getFieldDecorator("fieldName", {
            rules: [
              {
                required: true,
                message: "请输入字段名称"
              }
            ]
          })(<Input className="input" />)}
        </FormItem>
        <FormItem label="审核名称" {...formItem}>
          {getFieldDecorator("examineName", {
            rules: [
              {
                required: true,
                message: "请输入审核名称"
              }
            ]
          })(<Input className="input" />)}
        </FormItem>
        <FormItem label="发布名称" {...formItem}>
          {getFieldDecorator("releaseName", {
            rules: [
              {
                required: true,
                message: "请输入发布名称"
              }
            ]
          })(<Input className="input" />)}
        </FormItem>
      </Form>
    </Models>
  );
};
export default Form.create({
  mapPropsToFields({ info }) {
    return {
      fieldName: Form.createFormField({
        value: info.fieldName
      }),
      examineName: Form.createFormField({
        value: info.examineName
      }),
      releaseName: Form.createFormField({
        value: info.releaseName
      })
    };
  }
})(Add);
