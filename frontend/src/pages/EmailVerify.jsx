import { useContext, useEffect, useRef } from "react";
import { assets } from '../assets/assets';
// import { AppContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
   const inputRefs = useRef([]);
   const navigate = useNavigate()
   const {userdata,backendUrl, setIsLogged,getUserData,islogged} = useContext(AppContext)
   axios.defaults.withCredentials=true

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      e.target.value = value;
      if (index < 5) inputRefs.current[index + 1].focus();
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      paste.split("").forEach((digit, idx) => {
        inputRefs.current[idx].value = digit;
      });
      inputRefs.current[5].focus();
    }
  };

  const handleOtpSubmit =async(e)=>{

   try {
     e.preventDefault();
    const otpArray = inputRefs.current.map(e=>e.value)
    const otp = otpArray.join('')
    console.log(otp)
    const {data} = await axios.post(backendUrl+"/api/verify-email",{otp})
    console.log(data,"55")
    if(data.success){
      toast.success(data.message)
      getUserData()
      navigate("/home")
    }
    else{
      toast.error(data.message)
    }
   } catch (error) {
      toast.error(error.message)
   }
  }
  useEffect(()=>{
    islogged && userdata && userdata.isAccountVerified && navigate("/")
  },[islogged,userdata])
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-500 px-4">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form onSubmit={handleOtpSubmit} className="bg-slate-900 p-8 rounded-lg shadow-2xl w-full max-w-md text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email ID:</p>

        <div
          className="flex justify-between gap-2 mb-6"
          onPaste={handlePaste}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[idx] = el)}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-10 h-12 text-center text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-black font-bold"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-medium rounded-lg"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
