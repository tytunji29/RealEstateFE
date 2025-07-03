export const APIURL = "https://temitayo01-001-site1.ktempurl.com/api";
export const position = "bottom-center";
export const vubids_user =
  typeof window !== "undefined"
    ? window.localStorage.getItem("vubids_token")
    : false;
export const main_user =
  typeof window !== "undefined"
    ? window.localStorage.getItem("user_Type")
    : false;
