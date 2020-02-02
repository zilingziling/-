// @flow
import { Component } from 'react';
import { withRouter } from 'react-router';
import Userinfo from '../stores/userinfo';
import { autorun } from 'mobx';
// import { observable } from 'mobx';

type Props = {
	userStore: {
		isLogin: boolean,
		token: string,
		updateStatus: Function
	},
	children: Object
};

type State = {
	isLoading: boolean
};

class RedirectLogin extends Component<Props, State> {
	state = {
		isLoading: false
	};
	componentWillMount() {

		let isLogin = window.sessionStorage.getItem('status');
		console.log(isLogin)
		if (!isLogin) {
			window._guider.History.replace('/login');
		}
	}
	render() {
		return this.props.children;
	}
}
export default RedirectLogin// withRouter();
