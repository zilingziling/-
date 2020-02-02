import {makeRequest} from "./config";
import {faultRegister} from "./url";

export const getDatas = (p) => {
    const params = new URLSearchParams();
    params.append("handlestatus", p.handlestatus);
    params.append("pageNo", p.pageNo);
    params.append("pageSize", p.pageSize);
    return makeRequest(faultRegister.getList, params);
};
export const getBuildings = (p) => {
    return makeRequest(faultRegister.getBuilding);
};
export const getClassroom = (p) => {
    const params = new URLSearchParams();
    params.append("schoolId", p);
    return makeRequest(faultRegister.getClassroom,params);
};
export const getEquip = (p) => {
    const params = new URLSearchParams();
    params.append("classroomId", p);
    return makeRequest(faultRegister.getEquip,params);
};
export const getBrand = (p) => {
    const params = new URLSearchParams();
    params.append("equipClassroom", p);
    return makeRequest(faultRegister.getBrand,params);
};
export const getPersons = (p) => {
    return makeRequest(faultRegister.getPersons);
};
export const ope = (p) => {
    const params = new URLSearchParams();
    for(let key in p){
        params.append(key, p[key]);
    }
    return makeRequest(faultRegister.ope,params);
};
export const complete = (p) => {
    const params = new URLSearchParams();
    for(let key in p){
        params.append(key, p[key]);
    }
    return makeRequest(faultRegister.complete,params);
};
