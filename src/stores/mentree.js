/* eslint-disable no-mixed-spaces-and-tabs */
import { observable, action, autorun } from 'mobx';
import Api from './../api';

class MentRree {
  @observable  TreeDataSorce = []; 

	@observable  Pmisd = []; 
  /**
   * 菜单树形data
   */
  @action _tree = async() =>{ 
  	try{
  		let res = await Api.setUp.get_menu_tree();
  		if(res.code === 200){
  			this.TreeDataSorce = foramData(res.data);

  		}
  	}catch(error){
  		console.log(error);
  	}
  }
	
	@action _PmisData = async() =>{
		try{
			let res = await Api.setUp._get_by_parentcode();
			// console.log(res);
			if(res.code === 200){
				this.Pmisd = res.data;
			}
		}catch(error){	
			console.log(error);
		}
	}
}
export default new MentRree();
const foramData = (res) => {
	let ant = [];
	res.forEach(e => {
		if (e.children) {
			ant.push({ title: e.name, key: e.id, value: e.id, children: foramData(e.children) });
		} else {
			ant.push({ title: e.name, key: e.id, value: e.id,});
		}
	});
	return ant;
};