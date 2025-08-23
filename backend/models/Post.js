import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: function() {
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Middleware
postSchema.pre('remove', async function(next) {
  if (this.imagePublicId) {
    try {
      const { v2: cloudinary } = await import('cloudinary');
      await cloudinary.uploader.destroy(this.imagePublicId);
    } catch (err) {
      console.error('Error deleting image from Cloudinary:', err);
    }
  }
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;