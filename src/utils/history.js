// @flow


// import createHistory from 'history/createBrowserHistory';
import { createBrowserHistory } from 'history';


const history = createBrowserHistory({ basename: '/' });

// ATTENTION PLEASE ! tabIndex is based on below
// const router = ['/', '/monitor', '/energy', '/device', '/plan', '/platform', '/login', '/404'];

const pushByIndex = (tabIndex: number) => {
	console.log(history);

};
const replace = (path: string) => {
	history.replace(path);
};

export default {
	history,
	replace,
	// pushByIndex
};