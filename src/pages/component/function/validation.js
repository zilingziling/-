//只能限制输入 number类型
export const RegExpNmuber = () =>{
	return new RegExp(/^[1-9]\d*$/, 'g');
};

//IP
export const validator = (ip) =>{
	var reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;   
	return reg.test(ip);  
};