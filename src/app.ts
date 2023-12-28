import express from 'express';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import cors from "cors"
import adminRoutes from './routes/adminRoutes';
import studentRoutes from './routes/studentRoutes';
import dotenv from "dotenv";
import swaggerSpecs from "./utils/swagger"
import swaggerUi from 'swagger-ui-express';
dotenv.config()

const app = express();
app.use(cors())
const PORT = process.env.PORT || 4000;

app.use(express.json());
const uri = process.env.MONGODB_URI!;
// MongoDB Atlas connection
mongoose.connect(uri).then((res)=> console.log("Db is conneted")).catch((err)=> console.log(err.message))


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
// app.get("docs.json" ,(req:Request ,res:Response)=>{
//   res.setHeader("Content-Type" ,"application/json");
//   res.send(swaggerSpecs)
// })
// Routes
app.use('/admin', adminRoutes);
app.use('/student' , studentRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
