//@flow

import React, { Component } from 'react';
import './operating.scss';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';
import Api from './../../api';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';

type Props = {}
type State = {
}
@inject('Socke')
@observer
class Operating extends Component<Props, State> {

	componentDidMount() {
		this.datalist();
	}
	datalist = async () => {
		let id = JSON.parse(window.localStorage.getItem('data'))?JSON.parse(window.localStorage.getItem('data')).schoolid:null;
		let res = await Api.Device.get_room_num(id);
		console.log(res);
		if (res.code === 200) {
			const option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				legend: {
					show: true,
					orient: 'horizontal',
					// x: 'left',
					bottom: 0,
					data: res.data.title,
					textStyle: {
						color: '#fff'
					}
				},
				series: [
					{
						name:'',
						type: 'pie',
						radius: [
							'50%', '70%'
						],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: res.data.data,
						// animationThreshold: 3000,
						animationDuration: 2000
					}
				]
			};
			let dom = document.getElementById('pies');
			let myChart = echarts.init(dom);
			myChart.setOption(option);
		}
		let data = await Api.Device.get_equip_num(id);
		console.log(data);
		if (res.code === 200) {
			const option = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				legend: {
					show: true,
					orient: 'horizontal',
					// x: 'left',
					bottom: 0,
					data: data.data.title,
					textStyle: {
						color: '#fff'
					}
				},
				series: [
					{
						name: '',
						type: 'pie',
						radius: [
							'50%', '70%'
						],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: data.data.data,
						// animationThreshold: 3000,
						animationDuration: 2000
					}
				]
			};
			let dom1 = document.getElementById('pies2');
			var myChart1 = echarts.init(dom1);
			myChart1.setOption(option);
		}
	}
	render() {
		return (
			<div className="oper">
				<div className="oper-title">
					设备工作和报警情况
				</div>
				<div className="oper-row">
					<div
						id='pies'
						style={{
							width: 700,
							height: 500
						}}></div>
					<div
						id='pies2'
						style={{
							width: 700,
							height: 500
						}}></div>
				</div>
			</div>
		);
	}
}
export default Operating;