import express from 'express';
import { getUserData } from '../controllers/userController.js';
import { userAuthMiddleware } from '../middileware/userAuth.js';
export const authRouter = express.Router();
authRouter.get("/data",userAuthMiddleware,getUserData)