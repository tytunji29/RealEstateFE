//export const APIURL = "https://temitayo01-001-site1.ktempurl.com/api";
export const APIURL = "https://localhost:7096/api";
//export const APIURL = "https://realestate-n8s4.onrender.com/api";
export const position = "bottom-center";
export const vubids_user =
  globalThis.window === undefined
    ? false
    : globalThis.localStorage.getItem("vubids_token");
export const main_user =
  globalThis.window === undefined
    ? false
    : globalThis.localStorage.getItem("user_Type");
