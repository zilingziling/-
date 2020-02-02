import React, { Component, useEffect, useState } from "react";
import { Divider, Form, Input, Button, Table, Switch } from "antd";
import "./miniPro.scss";
import VersionTable from "./components/VersionTable";
import { getList, ope } from "../../api/miniPro";
import Add from "./components/add";
import moment from "moment";
const FormItem = Form.Item;

const MiniPro = ({ form }) => {
  const { getFieldDecorator, setFieldsValue, getFieldsValue } = form;
  const [list, setL] = useState([]);
  const [id, setId] = useState(null);
  const [version, setVersion] = useState("");
  const [type, setType] = useState(false);
  const [v, setV] = useState(false);
  const [title, setT] = useState("新增");
  const [info, setInfo] = useState({});

  const initData = () => {
    getList().then(r => {
      if (r.code === 200) {
        if (r.data.type) {
          setType(r.data.type === "0" ? false : r.data.type === "1");
        }
        if (r.data.version) {
          setVersion(r.data.version);
        }
        setId(r.data.id);
        setL(r.data.list);
      }
    });
  };
  useEffect(() => {
    initData();
  }, []);
  useEffect(() => {
    setFieldsValue({
      version
    });
  }, [type, version]);
  const handleAdd = () => {
    setV(true);
    setInfo({});
    setT("新增");
  };
  const addProps = {
    setT,
    title,
    v,
    setV,
    info,
    setInfo,
    id,
    setId,
    initData
  };
  const req = values => {
    ope({ ...values, id }).then(r => {
      if (r.code === 200) {
        window._guider.Utils.alert({
          message: r.msg,
          type: "success"
        });
        initData();
      }
    });
  };
  const tableProps = {
    setInfo,
    setT,
    setV,
    list,
    initData
  };
  const handleSwitch = value => {
    let version = getFieldsValue(["version"]).version;
    req({ type: value ? 1 : 0, mark: 1, version });
    setType(value);
  };
  const confirm = () => {
    let version = getFieldsValue(["version"]).version;
    req({ mark: 1, version, type: type ? 1 : 0 });
  };
  return (
    <div className="miniWrapper">
      <Form className="form">
        <FormItem label="审核模式" className="formItem">
          打开
          {getFieldDecorator("type")(
            <Switch onChange={handleSwitch} checked={type} className="switch" />
          )}
          关闭
        </FormItem>
        <Divider />
        <div className="version">
          <FormItem label="审核版本" className="formItem">
            {getFieldDecorator("version")(<Input />)}
          </FormItem>
          <Button type="primary" onClick={confirm}>
            确认
          </Button>
        </div>
      </Form>
      <Button type="primary" className="add" onClick={handleAdd}>
        新增
      </Button>
      <VersionTable {...tableProps} />
      <Add {...addProps} />
    </div>
  );
};

export default Form.create({})(MiniPro);
