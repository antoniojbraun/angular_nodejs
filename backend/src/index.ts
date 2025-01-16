import dotenv from 'dotenv';
dotenv.config({path:'./src/.env'})

import express, { Request, Response } from 'express';
import 'express-async-errors'
import './database/index'
import categoryRoutes from './routes/category-routes';
import tagRoutes from './routes/tag.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';
import authRoutes from './routes/auth.routes';
import logger from './shared/logger.util';
import { Category } from './models/Category';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// app.use('/',async ()=>{
//     // @ts-ignore
//     await Category.findAll();
//     throw new Error('Error');
// })

app.use('/api/categories',categoryRoutes)
app.use('/api/tags',tagRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/comments',commentRoutes)
app.use('/api/auth', authRoutes)

app.use(((err:Error, req:Request, res:Response, next:any)=>{
    logger.error({
        message: err.message, stack: err.stack
    });

    res.status(500).send('Something went wrong!')
}))

app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`)
})




// app.get('/test', authenticateJWT, (req,res)=>{
//     res.json((req as any).user);
// })

