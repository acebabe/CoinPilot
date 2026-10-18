import React, { useState, useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App(){
  const [token, setToken] = useState(localStorage.getItem("ll_token") || null);

  useEffect(()=> {
    if(token) localStorage.setItem("ll_token", token);
    else localStorage.removeItem("ll_token");
  }, [token]);

  if(!token) {
    return (
      <div className="container">
        <div style={{display:"flex", gap: "1rem"}}>
          <div style={{flex:1}}><Register onRegistered={t=>setToken(t)} /></div>
          <div style={{flex:1}}><Login onLoggedIn={t=>setToken(t)} /></div>
        </div>
      </div>
    );
  }

  return <Dashboard token={token} onLogout={()=>setToken(null)} />;
}