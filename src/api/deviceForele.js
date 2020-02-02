import {makeRequest} from "./config";
import {deviceForEle} from "./url";

export const getStatus = (id) => {
    const params = new URLSearchParams();

    params.append("schoolId", id);
    return makeRequest(deviceForEle.getStatus, params);
};
export const control = (ids) => {
    const params = new URLSearchParams();
    params.append("equipclassroomId", ids.equipclassroomId);
    params.append("keyId", ids.keyId);
    return makeRequest(deviceForEle.control, params);
};
