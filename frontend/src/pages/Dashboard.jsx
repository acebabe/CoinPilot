import React, { useEffect, useState } from "react";

function WalletConnect({ onConnected }){
  async function connect(){
    if(window.ethereum){
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        onConnected(accounts[0]);
      } catch(e){
        console.error(e);
      }
    } else {
      alert("No web3 provider found (MetaMask). This is a placeholder.");
    }
  }
  return <button className="btn" onClick={connect}>Connect Wallet (placeholder)</button>
}

export default function Dashboard({ token, onLogout }){
  const [me,setMe] = useState(null);
  const [txs,setTxs] = useState([]);
  const [notes,setNotes] = useState([]);

  useEffect(()=>{
    async function load(){
      const headers = {"Authorization": "Bearer "+token};
      const r1 = await fetch("/auth/me", {headers});
      if(r1.ok){
        setMe(await r1.json());
      } else {
        onLogout();
      }
      const r2 = await fetch("/auth/transactions", {headers});
      if(r2.ok) setTxs(await r2.json());
      const r3 = await fetch("/auth/notifications", {headers});
      if(r3.ok) setNotes(await r3.json());
    }
    load();
  }, [token]);

  async function handleWalletConnected(addr){
    // call wallet-signin to create/attach account
    const res = await fetch("/auth/wallet-signin", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({wallet_address: addr})});
    if(res.ok){
      const data = await res.json();
      localStorage.setItem("ll_token", data.token);
      window.location.reload();
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h2>LedgerLocket Dashboard</h2>
        <div>
          <button className="btn" onClick={()=>{localStorage.removeItem("ll_token"); onLogout();}}>Logout</button>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem"}}>
        <div className="card">
          <h3>Account</h3>
          {me ? <>
            <p><strong>Email:</strong> {me.email}</p>
            <p><strong>Wallet:</strong> {me.wallet_address || "not connected"}</p>
            <p><strong>Balance:</strong> {me.balance}</p>
            <WalletConnect onConnected={handleWalletConnected} />
          </> : <p>Loading…</p>}
        </div>

        <div className="card">
          <h3>Notifications</h3>
          <ul>
            {notes.map(n=> <li key={n.id}>{n.message} <small>({new Date(n.created_at).toLocaleString()})</small></li>)}
          </ul>
        </div>
      </div>

      <div className="card" style={{marginTop:"1rem"}}>
        <h3>Transactions</h3>
        <table style={{width:"100%"}}>
          <thead><tr><th>At</th><th>Amount</th><th>Direction</th><th>Note</th></tr></thead>
          <tbody>
            {txs.map(t=> <tr key={t.id}><td>{new Date(t.created_at).toLocaleString()}</td><td>{t.amount}</td><td>{t.direction}</td><td>{t.note}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}