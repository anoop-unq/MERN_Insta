import userModel from "../models/user.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from "../config/nodemailer.js";
import { generateLoginEmail, generateOtpVerificationEmail, generateResetPasswordOtpEmail, generateWelcomeEmail } from "../config/emailTemplate.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv'

dotenv.config()

const SALT_NUM = process.env.SALT_ROUND



export const register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    let photoUrl = '';

    // Handle file upload if exists
    if (req.file) {
      try {
        // Convert buffer to base64 for Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'user-profiles',
          width: 150,
          height: 150,
          crop: 'fill',
          quality: 'auto:good'
        });

        photoUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload profile picture',
          error: uploadError.message
        });
      }
    }

    // Create new user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      photo: photoUrl,
      bio: bio || ''
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '7d'
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return success response (excluding sensitive data)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const login = async(req,res)=>{
    const {email,password} = req.body;
    console.log(process.env.SECRET_KEY)
    console.log(email,password)
    if(!email || !password){
        return res.json({message:"All Fields are required !"})
    }
    try {
    const user = await userModel.findOne({email})
    if(!user){
        return res.json({message:"Invalid Email Details"})
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        return res.json({message:"Invalid Password Details"})
    }
    
    const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"7d"});
    console.log("Setting token:", token);
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        // sameSite:process.env.NODE_ENV==='production' ?
        // 'None':'Strict',
        sameSite:"None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
      const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to: user.email,
        subject: `New Login Detected - ${user.name}`,
        html: generateLoginEmail(user.name, user.email, req.ip),
    }
    
     try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
      // Optionally: You can continue without failing the registration
    }

    return res.json({success:true,message:"User Logged In Successfully !",user})
}
    catch(error){
        return res.json({success:false,message:error.message})
    }
}

export const logout = (req,res)=>{
    try {
        res.clearCookie('token',{
              httpOnly:true,
              secure:process.env.NODE_ENV === 'production',
              sameSite:process.env.NODE_ENV==='production' ?
              'none':'strict',
        })
        return res.status(200).json({success:true,message:"Logged Out"})
    }  catch(error){
        return res.status(501).json({success:false,message:error.message})
    }
}
// Send Verification OTP !
export const sendOtp = async(req,res)=>{
    const userId = req.userId
    try {
        
        // console.log(req.body)
        console.log(userId,"113")
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success:false,message:"Account Already verified"})
        }
        const otp = String(Math.floor(100000+Math.random()*900000))
        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save();
        console.log("ll",user)

    //     const mailOptions = {
    //     from:process.env.SENDER_EMAIL,
    //     to:user.email,
    //     subject:`Hii ! ${user.name} ! OTP Verification !`,
    //     text:`Welcome to Task Management Your account has been created with email id : ${user.email} & OTP : ${otp}`
    // }
     const mailOptions = {
        from: process.env.SENDER_EMAIL,
  to: user.email,
  subject: `Verify Your Task Management Account`,
  html: generateOtpVerificationEmail(user.name, otp),
    }
    
     try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError.message);
      // Optionally: You can continue without failing the registration
    }
        // await transporter.sendMail(mailOptions)
    res.json({success:true,message:"OTP sent successfull !"})
    } catch (error) {
        res.json({success:false,message:"Error"})
    }
}
// Verify Email !
export const verifyEmail = async (req, res) => {
    const userId = req.userId
    const  {otp}  = req.body;
    console.log(req.body,"ll")

      console.log("📥 req.userId:", userId);
  console.log("📥 req.body.otp:", otp);
  try {
      if (!otp) {
          return res.json({ success: false, message: "OTP is required" });
        }
        
        const user = await userModel.findById(userId);
        console.log(user.verifyOtp,"55")
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        if (user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpiresAt < Date.now()) {
            return res.json({ success: false, message: "OTP has expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiresAt = 0;
        await user.save();

        res.json({ success: true, message: "Email verified successfully!" });

    } catch (error) {
        console.error("Verify Email Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// Is login or not like User AUthentication

export const userAuthenticate = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token,"555")

    if (!token) {
      return res.json({ success: false, message: "User not logged in (no token)" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    res.json({
      success: true,
      message: "User is logged in",
      userId: decoded.id,
    });
  } catch (error) {
    res.json({ success: false, message: "Invalid or expired token" });
  }
};

// send reset OTP !
export const resetOtp = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:false,message:"Email is required"})
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User no found !"})
        }

        const otp = String(Math.floor(100000+Math.random()*900000))
        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() +  15 * 60 * 1000
        
        await user.save();
        console.log("ll",user)
        const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: `🔐 Reset Password OTP - Task Management`,
    
        html:generateResetPasswordOtpEmail(user.name, user.email, otp),
        };
        await transporter.sendMail(mailOptions)
        res.json({success:true,message:"OTP sent successfull !"})
    } catch (error) {
           console.error("Reset OTP Error:", error); // ✅ Add log for debugging
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({ success: false, message: "All fields are required!" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// verify Otp to reset password !
export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body
    console.log(email,newPassword,otp)
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"All fileds are required !"})
    }
    try {
        const user = await userModel.findOne({email})
        // console.log(user,"55")
        console.log(user,"55")
        // console.log(email,otp,newPassword)
        if(!user){
            return res.json({success:false,message:"User not found !"})
        }
        if(!user.resetOtp  || user.resetOtp !== otp){
            return res.json({success:false,message:"Invalid Otp"})
        }
        if(user.resetOtpExpiresAt< Date.now()){
            return res.json({success:false,message:"Otp expires"})
        }
        const hashedpassword = await bcrypt.hash(newPassword,10)
        user.password = hashedpassword;
        user.resetOtp =""
        user.resetOtpExpiresAt=0;
        await user.save();
        return res.json({ success: true, message: "Password reset successful!" }); 
    } catch (error) {
         res.status(500).json({ success: false, message: "Internal Server" });
    }
}
// Get user data !
export const getUserData = async(req,res)=>{
    const userId = req.userId
    const user = await userModel.findById(userId);
    if(!user){
        return res.status(400).json({success:false,message:"User not found !"})
    }
    res.json({
        success:true,
        userData:{
            name:user.name,
            isAccountVerified:user.isAccountVerified,
            user
        }

    })
}

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user by ID and exclude sensitive fields
    const user = await userModel.findById(userId)
      .select('-password -verifyOtp -resetOtp -verifyOtpExpiresAt -resetOtpExpiresAt');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }
    
    res.json({
      success: true,
      userData: user
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

export const changeUserData = async (req, res) => {
  try {
    const { bio } = req.body;
    const { userId: paramUserId } = req.params; // Rename to avoid confusion
    const requestingUserId = req.userId; // From auth middleware

    console.log('Request details:', {
      paramUserId,
      requestingUserId,
      bio
    });

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(paramUserId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Verify authorization
    if (requestingUserId !== paramUserId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to update this profile' 
      });
    }

    // Update the user
    const updatedUser = await userModel.findByIdAndUpdate(
      paramUserId,
      { bio },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Bio updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error in changeUserData:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error'
    });
  }
};



// export const updateProfile = async (req, res) => {
//   try {
//     const { name, bio } = req.body;
//     const { userId: paramUserId } = req.params; // Rename to avoid confusion
//     const requestingUserId = req.userId; // From auth middleware
    
//     console.log('Update profile request details:', {
//       paramUserId,
//       requestingUserId,
//       name,
//       bio
//     });

//     // Validate input
//     if (!mongoose.Types.ObjectId.isValid(paramUserId)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Invalid user ID format' 
//       });
//     }

//     // Verify authorization
//     if (requestingUserId !== paramUserId) {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Unauthorized to update this profile' 
//       });
//     }

//     // Validate at least one field is provided
//     if (!name && !bio) {
//       return res.status(400).json({
//         success: false,
//         message: 'At least one field (name or bio) must be provided'
//       });
//     }

//     // Validate name length if provided
//     if (name && name.length > 50) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name must be 50 characters or less'
//       });
//     }

//     // Validate bio length if provided
//     if (bio && bio.length > 200) {
//       return res.status(400).json({
//         success: false,
//         message: 'Bio must be 200 characters or less'
//       });
//     }

//     // Prepare update object
//     const updateFields = {};
//     if (name) updateFields.name = name;
//     if (bio) updateFields.bio = bio;

//     // Update the user
//     const updatedUser = await userModel.findByIdAndUpdate(
//       paramUserId,
//       updateFields,
//       { 
//         new: true, 
//         runValidators: true 
//       }
//     ).select('-password');

//     if (!updatedUser) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'User not found' 
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully',
//       user: updatedUser
//     });

//   } catch (error) {
//     console.error('Error in updateProfile:', error);
    
//     // Handle specific validation errors
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }

//     return res.status(500).json({ 
//       success: false, 
//       message: error.message || 'Internal server error'
//     });
//   }
// };


// New controller for photo updates

export const updateProfile = async (req, res) => {
  try {
    const { 
      name, 
      bio, 
      mobile, 
      dateOfBirth, 
      gender, 
      portfolioUrl, 
      education, 
      address 
    } = req.body;
    
    const { userId: paramUserId } = req.params;
    const requestingUserId = req.userId;

    console.log('Update profile request details:', {
      paramUserId,
      requestingUserId,
      name,
      bio,
      mobile,
      dateOfBirth,
      gender,
      portfolioUrl,
      education,
      address
    });

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(paramUserId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format' 
      });
    }

    // Verify authorization
    if (requestingUserId !== paramUserId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to update this profile' 
      });
    }

    // Validate at least one field is provided
    const fieldsToCheck = {
      name, bio, mobile, dateOfBirth, gender, 
      portfolioUrl, education, address
    };
    
    const hasAtLeastOneField = Object.values(fieldsToCheck).some(
      field => field !== undefined && field !== null && field !== ""
    );
    
    if (!hasAtLeastOneField) {
      return res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update'
      });
    }

    // Validate name length if provided
    if (name && name.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Name must be 50 characters or less'
      });
    }

    // Validate bio length if provided
    if (bio && bio.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Bio must be 150 characters or less'
      });
    }

    // Validate mobile format if provided - STRICT 10 DIGITS ONLY
    if (mobile !== undefined && mobile !== "") {
      // Remove any non-digit characters first
      const cleanedMobile = mobile.replace(/\D/g, '');
      
      // Check if it's exactly 10 digits
      if (!/^\d{10}$/.test(cleanedMobile)) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number must be exactly 10 digits with no special characters'
        });
      }
      
      // Check if mobile number already exists for another user
      const existingUser = await userModel.findOne({ 
        mobile: cleanedMobile, 
        _id: { $ne: paramUserId } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number already exists'
        });
      }
      
      // Update the mobile value to the cleaned version
      req.body.mobile = cleanedMobile;
    } else if (mobile === "") {
      // Allow clearing the mobile field
      req.body.mobile = "";
    }

    // Validate date of birth if provided
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      
      // Check if date is valid
      if (isNaN(dob.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date of birth format'
        });
      }
      
      // Check if date is in the future
      if (dob > today) {
        return res.status(400).json({
          success: false,
          message: 'Date of birth cannot be in the future'
        });
      }
      
      // Check if user is at least 13 years old
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 13);
      if (dob > minAgeDate) {
        return res.status(400).json({
          success: false,
          message: 'You must be at least 13 years old'
        });
      }
    }

    // Validate gender if provided
    if (gender && !["Male", "Female", "Other", "Prefer not to say"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gender selection'
      });
    }

    // Validate portfolio URL if provided
    if (portfolioUrl && portfolioUrl !== "") {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(portfolioUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid portfolio URL'
        });
      }
    }

    // Validate education data if provided
    if (education && Array.isArray(education)) {
      for (let i = 0; i < education.length; i++) {
        const edu = education[i];
        
        // Validate institution name length
        if (edu.institution && edu.institution.length > 100) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i+1}: Institution name must be 100 characters or less`
          });
        }
        
        // Validate degree name length
        if (edu.degree && edu.degree.length > 100) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i+1}: Degree name must be 100 characters or less`
          });
        }
        
        // Validate field of study length
        if (edu.fieldOfStudy && edu.fieldOfStudy.length > 100) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i+1}: Field of study must be 100 characters or less`
          });
        }
        
        // Validate start year
        if (edu.startYear) {
          const currentYear = new Date().getFullYear();
          if (edu.startYear < 1950 || edu.startYear > currentYear) {
            return res.status(400).json({
              success: false,
              message: `Education entry ${i+1}: Start year must be between 1950 and ${currentYear}`
            });
          }
        }
        
        // Validate end year
        if (edu.endYear) {
          const currentYear = new Date().getFullYear();
          if (edu.endYear < 1950 || edu.endYear > currentYear + 10) {
            return res.status(400).json({
              success: false,
              message: `Education entry ${i+1}: End year must be between 1950 and ${currentYear + 10}`
            });
          }
          
          // Validate that end year is not before start year
          if (edu.startYear && edu.endYear < edu.startYear) {
            return res.status(400).json({
              success: false,
              message: `Education entry ${i+1}: End year cannot be before start year`
            });
          }
        }
        
        // Validate description length
        if (edu.description && edu.description.length > 300) {
          return res.status(400).json({
            success: false,
            message: `Education entry ${i+1}: Description must be 300 characters or less`
          });
        }
      }
    }

    // Validate address data if provided
    if (address) {
      // Validate city length
      if (address.city && address.city.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'City must be 50 characters or less'
        });
      }
      
      // Validate state length
      if (address.state && address.state.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'State must be 50 characters or less'
        });
      }
      
      // Validate country length
      if (address.country && address.country.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Country must be 50 characters or less'
        });
      }
      
      // Validate street length
      if (address.street && address.street.length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Street address must be 200 characters or less'
        });
      }
      
      // Validate zip code length
      if (address.zipCode && address.zipCode.length > 20) {
        return res.status(400).json({
          success: false,
          message: 'Zip code must be 20 characters or less'
        });
      }
    }

    // Prepare update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (mobile !== undefined) updateFields.mobile = mobile;
    if (dateOfBirth) updateFields.dateOfBirth = new Date(dateOfBirth);
    if (gender) updateFields.gender = gender;
    if (portfolioUrl !== undefined) updateFields.portfolioUrl = portfolioUrl;
    if (education !== undefined) updateFields.education = education;
    if (address !== undefined) updateFields.address = address;

    // Update the user
    const updatedUser = await userModel.findByIdAndUpdate(
      paramUserId,
      updateFields,
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password -verifyOtp -resetOtp');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error in updateProfile:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error'
    });
  }
};

export const updateProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photo provided'
      });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'user-profiles',
      width: 150,
      height: 150,
      crop: 'fill',
      quality: 'auto:good'
    });

    // Update user with new photo
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { photo: result.secure_url },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      photoUrl: result.secure_url
    });

  } catch (error) {
    console.error('Profile photo update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile photo'
    });
  }
};



// controllers/postController.js
// export const deletePostImage = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
    
//     if (!post) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Post not found' 
//       });
//     }

//     // Authorization check
//     if (post.author.toString() !== req.userId.toString()) {
//       return res.status(403).json({ 
//         success: false,
//         error: 'Unauthorized to edit this post' 
//       });
//     }

//     // Check if post has an image to delete
//     if (!post.imageUrl && !post.imagePublicId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Post does not have an image to delete'
//       });
//     }

//     // Delete image from Cloudinary if exists
//     if (post.imagePublicId) {
//       await cloudinary.uploader.destroy(post.imagePublicId);
//     }

//     // Update post to remove image references
//     const updatedPost = await Post.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           imageUrl: null,
//           imagePublicId: null
//         }
//       },
//       { new: true, runValidators: true }
//     ).populate('author', 'name username avatar');

//     res.json({ 
//       success: true,
//       message: 'Image deleted successfully',
//       post: updatedPost 
//     });
    
//   } catch (error) {
//     console.error("Delete image error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to delete image from post',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };