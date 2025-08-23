// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         maxlength: 50
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     photo: {
//         type: String, // This will store the Cloudinary URL
//         default: ""
//     },
//     bio: {
//         type: String,
//         trim: true,
//         maxlength: 150
//     },
//     mobile: {
//         type: String,
//         trim: true,
//         validate: {
//             validator: function(v) {
//                 // Only validate if mobile is provided
//                 if (!v) return true;
//                 return /^\d{10}$/.test(v);
//             },
//             message: 'Mobile number must be exactly 10 digits'
//         }
//     },
//     dateOfBirth: {
//         type: Date
//     },
//     verifyOtp: {
//         type: String,
//         default: ""
//     },
//     verifyOtpExpiresAt: {
//         type: Number,
//         default: 0
//     },
//     isAccountVerified: {
//         type: Boolean,
//         default: false
//     },
//     isAccountActive: {
//         type: Boolean,
//         default: true
//     },
//     gender: {
//         type: String,
//         enum: ["Male", "Female", "Other", "Prefer not to say"],
//         default: "Prefer not to say"
//     },
//     deactivatedAt: {
//         type: Date,
//         default: null
//     },
//     posts: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Post" 
//     }],
//     resetOtp: {
//         type: String,
//         default: ""
//     },
//     resetOtpExpiresAt: {
//         type: Number,
//         default: 0
//     }
// }, { timestamps: true });

// const userModel = mongoose.model('User', userSchema);
// export default userModel;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String, // This will store the Cloudinary URL
        default: ""
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 150
    },
    mobile: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                // Only validate if mobile is provided
                if (!v) return true;
                return /^\d{10}$/.test(v);
            },
            message: 'Mobile number must be exactly 10 digits'
        }
    },
    dateOfBirth: {
        type: Date
    },
    verifyOtp: {
        type: String,
        default: ""
    },
    verifyOtpExpiresAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    isAccountActive: {
        type: Boolean,
        default: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Prefer not to say"],
        default: "Prefer not to say"
    },
    deactivatedAt: {
        type: Date,
        default: null
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post" 
    }],
    resetOtp: {
        type: String,
        default: ""
    },
    resetOtpExpiresAt: {
        type: Number,
        default: 0
    },
    // New fields added below
    portfolioUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
            },
            message: 'Please enter a valid URL'
        }
    },
    education: [{
        institution: {
            type: String,
            trim: true,
            maxlength: 100
        },
        degree: {
            type: String,
            trim: true,
            maxlength: 100
        },
        fieldOfStudy: {
            type: String,
            trim: true,
            maxlength: 100
        },
        startYear: {
            type: Number,
            min: 1950,
            max: new Date().getFullYear()
        },
        endYear: {
            type: Number,
            min: 1950,
            max: new Date().getFullYear() + 10
        },
        description: {
            type: String,
            trim: true,
            maxlength: 300
        }
    }],
    address: {
        street: {
            type: String,
            trim: true,
            maxlength: 200
        },
        city: {
            type: String,
            trim: true,
            maxlength: 50
        },
        state: {
            type: String,
            trim: true,
            maxlength: 50
        },
        country: {
            type: String,
            trim: true,
            maxlength: 50
        },
        zipCode: {
            type: String,
            trim: true,
            maxlength: 20
        }
    }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);
export default userModel;