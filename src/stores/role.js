/* eslint-disable no-mixed-spaces-and-tabs */
import { observable, action, autorun } from 'mobx';
import Api from './../api';

class Role {
  @observable data = []; //数据
  @observable total = null; 
  @observable current = 1;
  @observable userName = ''
	@observable permissions = [];  //权限

  @action list = async(page, userName) =>{
  	try {
  		let res = await Api.setUp.get_roles(page, userName);
  		if (res.code === 200) {
  			if (res.data.rows.length > 0) {
  				this.data = formatData(res.data.rows);
  				this.total = res.data.total;
  			} else if (res.data.pageNo > '1' && res.data.rows.length === 0) {

  				this.list(parseInt(res.data.pageNo) - 1, userName);
  				console.log(res.data.pageNo);
  				this.current =  parseInt(res.data.pageNo) - 1;
  			} else {
  				this.data = [];
  				this.total = null;
  			}
  		}
  	} catch (error) {
  		console.log(error);
  	}
  }

  //当前页数
  @action currentPage = (current) =>{
  	this.current = current;
  	this.list(current, this.userName);
  }

  //搜索
  @action _search = () =>{
  	this.list(this.current, this.userName);
  }
	
	@action _permissions = async() =>{
		try{
			let res = await Api.setUp.get_operation_tree();
			console.log(res);
			if(res.code === 200){
				this.permissions = res.data; 
			}
		}catch(error){
			console.log(error);
		}
	}
}
export default new Role();
const formatData = data => {
	let ant = [];
	data.forEach(e => {
		ant.push({
			key: e.id,
			role_code: e.role_code,
			role_name: e.role_name
		});
	});
	return ant;
};