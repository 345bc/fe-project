"use client";
import { useState, useEffect } from "react";
import { getUser } from "@/utils/auth";
import { JwtPayload } from "jwt-decode";
import authService from "@/services/auth-service";



export const useAuth = () => {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

 const handleLogout = () => {
     authService.logout();
     setUser(null);   
   };

  return { user,handleLogout };
};