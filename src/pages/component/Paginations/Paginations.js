// @flow

import React, { Component } from 'react';
import { Pagination, } from 'antd';
type Props = {
	match: Object,
	history: Object,
	location: Object,
	page: Number,
	total: String,
	paging: Function,
	current: any
};
export default class Paint extends Component<Props> {
	render() {
		const {showSizeChanger,onShowSizeChange,pageSize}=this.props
		return (
			<div>
				<Pagination
					className="pages"
					style={{marginTop:'1rem', float:'right', marginRight: '2rem'}}
					current={this.props.current} //当前页数
					total={this.props.total}
					pageSize={pageSize?pageSize:10}
					showQuickJumper
					showSizeChanger={showSizeChanger}
					onShowSizeChange={onShowSizeChange}
					onChange={e => {
						this.props.paging(e);
					}}
				/>

			</div>
		);
	}
}
