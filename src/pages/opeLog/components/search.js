import React from "react";
import { Form, Select, DatePicker, Button, Radio, Input } from "antd";
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = "YYYY/MM/DD";
import moment from "moment";
const onValuesChange = (props, changedValues, allValues) => {
  const { setName, setB, setSign, setE, setCurrent } = props;
  const { selsign, username, time } = allValues;
  setCurrent(1);
  setName(username ? username : "");
  setSign(selsign ? selsign : "");
  if (time && time.length > 0) {
    setB(moment(time[0]).format("YYYY-MM-DD HH:mm:ss"));
    setE(moment(time[1]).format("YYYY-MM-DD HH:mm:ss"));
  } else {
    setB("");
    setE("");
  }
};
const Search = ({ form, setClick, clickS, setCurrent }) => {
  const { getFieldDecorator } = form;

  return (
    <Form className="form">
      <FormItem className="formItem">
        {getFieldDecorator("selsign")(
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={1}>今天</Radio.Button>
            <Radio.Button value={2}>昨天</Radio.Button>
            <Radio.Button value={3}>本周</Radio.Button>
          </Radio.Group>
        )}
      </FormItem>
      <FormItem label="用户" className="formItem">
        {getFieldDecorator("username")(
          <Input allowClear placeholder="输入用户名" />
        )}
      </FormItem>
      <FormItem label="选择时间" className="formItem">
        {getFieldDecorator("time")(<RangePicker format={dateFormat} />)}
      </FormItem>
      {/*<Button*/}
      {/*  className="antBtn searchBtn"*/}
      {/*  type="primary"*/}
      {/*  onClick={() => {*/}
      {/*    setClick(!clickS);*/}
      {/*  }}*/}
      {/*>*/}
      {/*  搜索*/}
      {/*</Button>*/}
    </Form>
  );
};
export default Form.create({ onValuesChange: onValuesChange })(Search);
