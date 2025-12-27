import React, {useEffect, useState} from "react";
import authService from "../services/authService";

const PhoneNumbersSection:React.FC=()=>{
  const[currentPhones,setCurrentPhones]=useState<string[]>([]);
  const[newPhone,setNewPhone]=useState<string>("");
  const[loading,setLoading]=useState<boolean>(true);
  const[saving,setSaving]=useState<boolean>(false);
  const[error,setError]=useState<string>("");

  const fetchPhones=async()=>{
    try{
      const user=authService.getCurrentUser();
      if(!user)return;

      const res=await fetch(`/api/Auth/${user.userId}/phones`,{
        headers:{
          "Authorization":`Bearer ${user.token}`
        }
      });

      if(!res.ok)throw new Error("Failed to load phones");

      const data=await res.json();
      setCurrentPhones(data.phoneNumbers||[]);
    }catch(e:any){
      setError(e.message||"Failed to load phone numbers");
    }finally{
      setLoading(false);
    }
  };

  const savePhones=async()=>{
    try{
      setSaving(true);
      setError("");

      const user=authService.getCurrentUser();
      if(!user)return;

      const body={
        phoneNumbers:newPhone
          ?[newPhone]
          :currentPhones
      };

      const res=await fetch(`/api/Auth/${user.userId}/phones`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${user.token}`
        },
        body:JSON.stringify(body)
      });

      if(!res.ok)throw new Error("Failed to update phone");

      setCurrentPhones(body.phoneNumbers);
      setNewPhone("");
      alert("Phone updated successfully");
    }catch(e:any){
      setError(e.message||"Failed to update phone");
    }finally{
      setSaving(false);
    }
  };

  useEffect(()=>{
    fetchPhones();
  },[]);

  if(loading)return <div>Loading phone numbers...</div>;

  return(
    <div style={{
      border:"1px solid #ddd",
      borderRadius:"10px",
      padding:"16px",
      marginTop:"16px",
      width:"100%"
    }}>
      <h3>Phone Number</h3>

      {error && <p style={{color:"red"}}>{error}</p>}

      {currentPhones.length>0?(
        <p><strong>Current:</strong> {currentPhones[0]}</p>
      ):(
        <p><strong>No phone added yet</strong></p>
      )}

      <input
        type="text"
        placeholder="Enter phone number"
        value={newPhone}
        onChange={e=>setNewPhone(e.target.value)}
        style={{width:"100%",padding:"8px",marginTop:"8px"}}
      />

      <button
        onClick={savePhones}
        disabled={saving}
        style={{
          marginTop:"10px",
          padding:"8px 12px",
          cursor:"pointer"
        }}
      >
        {currentPhones.length>0?"Change Phone":"Add Phone"}
      </button>
    </div>
  );
};

export default PhoneNumbersSection;
