/* eslint-disable indent */
//@flow
import React, { Component } from 'react';
import { Button, Select, Input } from 'antd';
import Api from './../../../api';
import { observable, toJS } from 'mobx';
import { observer, inject, } from 'mobx-react';
const Option = Select.Option;
const btn={
    boxShadow:"0px 0px 10px #1485c7"
}
type Props = {
  style: Object<string>
}
@inject('Devices')
@observer
class Search extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      deviceValue: '', //设备
      brandType: '',
      brandTypeId: '',
      inpuValue: '', //input
      title: '',
      visible: false,

    };
  }

  render() {
    const { deviceValue, brandType, inpuValue, brandTypeId } = this.state;
    const { _validation, _brands } = this.props.Devices;
    return (
      <div className="device-header-search" style={this.props.style}>
        <div className="device-header-search-type">
          <span className="device-header-search-type-span">设备类型:</span>
          <Select
            onChange={e => {
              this.setState({ deviceValue: e });
              this.props.searchInfo(e, brandType, inpuValue, brandTypeId);
            }}
            value={deviceValue}
            className="device-header-search-type-select"
          >
            <Option value="">全部</Option>
            {typeof (_validation) !== 'undefined' ? _validation.map((data, index) => {
              return (
                <Option value={data.id} key={index}>
                  {data.equiptypename}
                </Option>
              );
            }) : null}
          </Select>
        </div>
        <div className="device-header-search-type">
          <span className="device-header-search-type-span">品牌:</span>
          <Select
            value={brandType}
            onChange={(e, option) => {
              this.props.searchInfo(deviceValue, brandType, inpuValue, option.props.id);
              this.setState({ brandType: e, brandTypeId: option.props.id });

            }}
            className="device-header-search-type-select"
          >
            <Option value="" id="">全部</Option>
            {typeof (_brands) !== 'undefined' ? _brands.map((res, index) => {
              let obj = { value: res.brandenname, id: res.id, key: res.id };
              return <Option {...obj}>{res.brandcnname}</Option>;
            }) : null}
          </Select>
        </div>

        <div className="device-header-search-type">
          <Input
            className="device-header-search-type-input"
            placeholder="请输入设备型号"
            onChange={e => {
              this.setState({ inpuValue: e.target.value });
            }}
            onPressEnter={this.callbackInfo}
            maxLength={32}
          />
          <Button
            onClick={this.callbackInfo}
            className="device-header-search-type-btn"
            style={btn}
            ghost
          > 搜索 </Button>
        </div>
      </div>
    );
  }
  //搜索
  callbackInfo = () => {
    const { inpuValue, deviceValue, brandType, brandTypeId } = this.state;
    this.props.searchInfo(deviceValue, brandType, inpuValue, brandTypeId);
  };

}

export default Search;