// import mongoose from 'mongoose';

// // postModel.js
// const postSchema = new mongoose.Schema({
//   content: {
//     type: String,
//     required: true
//   },
//   image:{
//     type:String,
//     default:null
//   },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   likes:[{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User' 
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   // Add visibility settings if needed
//   isPublic: {
//     type: Boolean,
//     default: true
//   }
// });

// const Post = mongoose.model('Post', postSchema); // Registered as 'post' (lowercase)
// export default Post;



import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: function() {
      // Content is required only if there's no image
      return !this.imageUrl;
    },
    minlength: [1, 'Content must be at least 1 character long'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  imageUrl: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        // Only validate if imageUrl exists
        if (!v) return true;
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v);
      },
      message: props => `${props.value} is not a valid image URL!`
    }
  },
  imagePublicId: {
    type: String,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Add virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Middleware to delete image from Cloudinary when post is deleted
postSchema.pre('remove', async function(next) {
  if (this.imagePublicId) {
    try {
      const { v2: cloudinary } = await import('cloudinary');
      await cloudinary.uploader.destroy(this.imagePublicId);
    } catch (err) {
      console.error('Error deleting image from Cloudinary:', err);
      // Continue even if deletion fails
    }
  }
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;