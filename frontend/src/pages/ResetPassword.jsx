import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { AppContext } from "../context/AuthContext";

import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [newPassword, setPassword] = useState("");
  const [otpValue, setOtpValue] = useState("");

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  axios.defaults.withCredentials = true;

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      e.target.value = value;
      if (index < 5) inputRefs.current[index + 1]?.focus();
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      paste.split("").forEach((digit, idx) => {
        if (inputRefs.current[idx]) inputRefs.current[idx].value = digit;
      });
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user-reset-otp`, { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map((el) => el?.value).join("");
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/user-verify-otp`, { email, otp });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) {
        setOtpValue(otp);
        setIsOtpSubmitted(true);

        // Clear inputs
        inputRefs.current.forEach((el) => {
          if (el) el.value = "";
        });
      }
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();


    try {
      const { data } = await axios.post(`${backendUrl}/api/user-reset-password`, {
        email,otp:otpValue,newPassword
      });
      console.log(email,otpValue,newPassword)
      console.log(data)
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) navigate("/login");
    } catch (error) {
      toast.error(error.message || "Password reset failed");
    }
  };

  return (
  //   <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
  //     <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
  //        <Link to={"/"} className="btn edit inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200">
  //   <FaArrowLeft className="mr-2" />
  // </Link>
  //       <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Password</h2>
      
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
  <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
    <div className="flex items-center justify-center mb-6">
      <Link to={"/"} className="btn edit inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200">
        <FaArrowLeft className="mr-2" />
      </Link>
      <h2 className="text-2xl font-semibold text-center text-gray-800 ml-4">Reset Password</h2>
    </div>
        {/* Step 1: Email */}
        {!isEmailSent && (
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {isEmailSent && !isOtpSubmitted && (
          <form onSubmit={handleSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-2xl text-sm">
            <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
            <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email:</p>

            <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
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
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {isOtpSubmitted && isEmailSent && (
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
