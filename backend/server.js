import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import route from './routes/userRoute.js'
import { authRouter } from './routes/authUserRoute.js'
import validRouter from './routes/postRoutes.js'
import connectCloudinary from './config/cloudinary.js'
dotenv.config()

const app = express()

await connectCloudinary()
const PORT = process.env.PORT || 3800
console.log(PORT,"PORT")
const allowedOrigins = [
    
    'http://localhost:5173'


]


const corsOptions = {
    origin:allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true,
     allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


app.use("/api",route)
app.use("/api/posts",validRouter)
app.use("/api/user",authRouter)

connectDB().then(()=>{
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})
})
