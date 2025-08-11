import { useContext, useState, useEffect,useRef } from "react";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
// import { AppContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const { backendUrl, setIsLogged, getUserData } = useContext(AppContext);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [formType, setFormType] = useState("login");
  const [isLoading, setIsLoading] = useState(false);


  // Detect route change and set form type
  useEffect(() => {
    if (location.pathname === "/signup") {
      setFormType("signup");
    } else {
      setFormType("login");
    }
  }, [location.pathname]);

  const toastIdAll = "fields-required";
  const nameToastId = "missing-name";
  const emailToastId = "missing-email";
  const passwordToastId = "missing-password";

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

    const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    console.log(file,"File !")
    if (file) {
      // Validate file type and size
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const isLoginEmpty = formType === "login" && !data.email && !data.password;
    const isSignupEmpty =
      formType === "signup" && !data.name && !data.email && !data.password;

    if (isLoginEmpty || isSignupEmpty) {
      if (!toast.isActive(toastIdAll)) {
        toast.error("All fields are required!", { toastId: toastIdAll });
      }
         setIsLoading(false);
      return;
    }

    if (formType === "signup" && !data.name && !toast.isActive(nameToastId)) {
      toast.error("Name is required!", { toastId: nameToastId });
      return;
    }

    if (!data.email && !toast.isActive(emailToastId)) {
      toast.error("Email is required!", { toastId: emailToastId });
      return;
    }

    if (!data.password && !toast.isActive(passwordToastId)) {
      toast.error("Password is required!", { toastId: passwordToastId });
      return;
    }

    try {
      // axios.defaults.withCredentials = true;

      if (formType === "login") {
        const res = await axios.post(`${backendUrl}/api/login`, data, {
          withCredentials: true,
        });

        if (res.data.success) {
          setIsLogged(true);
          await getUserData();
          toast.success("Login Successful!");
          localStorage.setItem('justSignedUp', 'true');
          navigate("/");
        } else {
          toast.error("User not found");
        }
      } else {

          const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        console.log(photo,"PHOTO")
        if (photo) {
          formData.append("photo", photo);
        }

        const res = await axios.post(`${backendUrl}/api/register`, formData,{
          withCredentials:true,
            headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data.success) {
          setIsLogged(true);
          await getUserData();
          toast.success("User Registered Successfully!");
          localStorage.setItem('justLoggedIn', 'true');
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }

    console.log(`${formType.toUpperCase()} DATA`, data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 md:p-10">
  
      <div className="mb-6">
  <button
    onClick={() => navigate("/")}
    className="flex items-center text-gray-700 hover:text-blue-600 transition text-xl font-bold"
  >
    <FaArrowLeft className="mr-2 text-2xl" />
    
  </button>
</div>


        {formType === "login" ? (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back 👋</h2>
            <p className="text-center text-gray-500 mb-8">Login to your account to continue</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Account 👤</h2>
            <p className="text-center text-gray-500 mb-8">Sign up to get started with your journey</p>
          </>
        )}

        <form className="space-y-6">
          {formType === "signup" && (
              
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Your full name"
              />

                  <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Profile Photo</label>
        <div className="flex items-center space-x-4">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No photo</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
          >
            Choose Photo
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

              
            </div>

            
          )}



          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="••••••••"
            />
          </div>

          {formType === "login" && (
            <div className="text-right">
              <p onClick={() => navigate("/reset-password")} className="text-sm text-blue-600 hover:underline cursor-pointer">
                Forgot password?
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-md shadow-md hover:scale-105 transition duration-300"
          >
            {formType === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {formType === "login" ? (
          <p onClick={() => navigate("/signup")} className="text-center text-sm text-gray-500 mt-6 cursor-pointer">
            Don't have an account? <span className="text-blue-600 hover:underline">Sign up</span>
          </p>
        ) : (
          <p onClick={() => navigate("/login")} className="text-center text-sm text-gray-500 mt-6 cursor-pointer">
            Already have an account? <span className="text-blue-600 hover:underline">Login</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

