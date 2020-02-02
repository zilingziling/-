//@flow
import React, { Component } from 'react';
import './user.scss';
import Paginations from '../component/Paginations/Paginations';
import Api from './../../api';
import Table from './components/table';
import { Input , Button, Icon} from 'antd';
type Props = {
	match: Object,
	history: Object,
	location: Object
};
type State ={
	data: Array<Object>,
	total: number,
	current: number,
	search: string
}
class User extends Component<Props, State> {
	state={
		data: null, // 列表数据
		total: null, //总数
		current: 1, //当前页数
		search: '', //搜索名字
	}
	async componentDidMount(){
		this.list(1, '');
	}
	render() {
		const { data, total, current, search}= this.state;
		return (
			<div className="user">
				<div className="user-header">
					<div className="user-header-left">
						<span className="user-header-left-span">账号名称</span>
						<Input
							maxLength={20}
							value={search}
							onChange={(e)=>{this.setState({search: e.target.value});}}
							onPressEnter={this.search}
						/>
					</div>
					<Button onClick={this.search} type="primary" className="user-header-left-btns">搜索</Button>
				</div>
				<Table
					data={data}
					callback={this.callback}
				/>
				<Paginations 
					paging={this.paging} current={current} total={total}
				/>
			</div>
		);
	}
	//刷新 
	callback =() =>{
		const { search,current}=this.state;
		this.list(current, search);
	}
	//分页
	paging =(current: number) =>{
		this.setState({
			current,
		});
		this.list(current, this.state.search);
	}
	//按钮点击
	search = () =>{
		const { search,current}=this.state;
		this.list(current, search);
	}
	//列表数据
	list = async(current: number, name: string) =>{
		try{
			let res = await Api.setUp.get_users(current,name);
			// console.log(res);
			formatData(res.data.rows);
			if (res.code === 200) {
				if (res.data.rows.length > 0) {
					this.setState({
						data: formatData(res.data.rows),
						total: res.data.total
					});
				} else if (res.data.pageNo > '1' && res.data.rows.length === 0) {
					this.list(parseInt(res.data.pageNo) - 1, name);
					this.setState({ current: parseInt(res.data.pageNo) - 1 });
				} else {
					this.setState({
						data: [],
						total: null
					});
				}
			}
		}catch(error){
			console.log(error);
		}
	}
}
export default User;
const  formatData = (data) =>{
	let array = [];
	data.forEach((e,index) => {
		array.push({
			account: e.account,
			id: e.id,
			name: e.name,
			phone: e.phone,
			schoolname: e.schoolname,
			status_name: e.status_name,
			key: index,
		});
	});
	return array;
};