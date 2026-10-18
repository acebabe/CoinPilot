import React, { useState } from "react";

export default function Login({ onLoggedIn }){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState(null);

  async function submit(e){
    e.preventDefault();
    const res = await fetch("/auth/login", {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({email,password})
    });
    const data = await res.json();
    if(res.ok){
      onLoggedIn(data.token);
    } else {
      setMsg(data.error || "Login failed");
    }
  }

  return (
    <div className="card">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div><input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div><button className="btn" type="submit">Login</button></div>
        {msg && <div style={{color:"red"}}>{msg}</div>}
      </form>
    </div>
  );
}