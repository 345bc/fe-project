import { jwtDecode } from "jwt-decode";

export const getUser=()=>{
  if (typeof window==="undefined")return null;
  const token =localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    console.log("Don't get token");
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/sign-in";
};