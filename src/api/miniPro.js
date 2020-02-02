import { makeRequest } from "./config";
import { MiniPro } from "./url";
export const getList = () => {
  return makeRequest(MiniPro.getList);
};
export const ope = ({
  fieldName,
  examineName,
  releaseName,
  id,
  version,
  type,
  mark,
  edit
}) => {
  const params = new URLSearchParams();
  if (mark === 2) {
    params.append("fieldName", fieldName);
    params.append("examineName", examineName);
    params.append("releaseName", releaseName);
    if (edit) {
      params.append("id", id);
    }
  } else {
    params.append("id", id ? id : "");
    params.append("version", version ? version : "");
    params.append("type", type);
  }
  return makeRequest(MiniPro.ope, params);
};
export const del = id => {
  const params = new URLSearchParams();
  params.append("id", id);
  return makeRequest(MiniPro.del, params);
};
