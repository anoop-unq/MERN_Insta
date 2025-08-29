import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
  likePost,
  deletePostImage,
  searchUser,
  addComment,
  
  getComments,
  getPostLikes,
  getPostComments,
  deleteComment,
 

} from '../controllers/postController.js';
import { userAuthMiddleware } from '../middileware/userAuth.js';
import { handleMulterErrors, upload } from '../middlewares/upload.js';
// import { protect } from '../middleware/authMiddleware.js';

const validRouter = express.Router();

// POST /api/posts - Create a new post (protected)
validRouter.post("/",userAuthMiddleware, upload.single('image'),handleMulterErrors, createPost);

// GET /api/posts - Get all posts (public)
validRouter.get("/", getPosts);

// GET /api/posts/:id - Get a single post (public)
validRouter.get("/:id", getPost);

validRouter.delete("/:id",userAuthMiddleware,deletePost)

validRouter.put("/:id",userAuthMiddleware,upload.single('image'),handleMulterErrors, updatePost)

validRouter.post("/:postId/like",userAuthMiddleware,likePost)

validRouter.delete("/:id/delete-image",userAuthMiddleware,deletePostImage)

validRouter.post('/:postId/comments', userAuthMiddleware, addComment);



validRouter.get('/:postId/user-comments', getComments);


validRouter.get('/:postId/likes', userAuthMiddleware, getPostLikes);

// Get comments for a post
validRouter.get('/:postId/comments', userAuthMiddleware, getPostComments);

validRouter.delete('/comments/:commentId',userAuthMiddleware,deleteComment)

export default validRouter;