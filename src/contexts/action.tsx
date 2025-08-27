// 🌍 API Base URLs
// export const APIURL = "https://temitayo01-001-site1.ktempurl.com/api";
// export const APIURL = "https://localhost:7096/api";
export const APIURL = "https://realestate-n8s4.onrender.com/api";

// 📍 UI Config
export const TOAST_POSITION = "bottom-center";

// 🔑 Client-side helpers (safe with SSR)
export const getVubidsUser = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("vubids_token");
};

export const getMainUser = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_Type");
};
