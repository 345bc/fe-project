import { cookies } from "next/headers";



const baseURL ="http://localhost:8080";


const userService = {
    
    async  getUser(){
        const cookieStore =cookies();
        const token = (await cookieStore).get('access_token')?.value;
        const res = await fetch(`${baseURL}/users`,{
            method:"GET",
            headers:{
                 Authorization: `Bearer ${token}`,
            },
            cache:"no-store",
        });
        
        
console.log("STATUS:", res.status);

if (!res.ok) {
  const text = await res.text();
  console.error("RESPONSE:", text);
  throw new Error("Failed to fetch users");
}


        return res.json();

    }
}
export default userService;