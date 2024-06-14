import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import usersRoutes from './routes/usersRoutes.js';
import ticketsRoutes from './routes/ticketsRoutes.js'
import error from './middlewares/error.js';

const app = express();
const DB_URL = (process.env.DB_URL === "test" 
  ? "mongodb://localhost:27017/ticketing-db-test"
  : process.env.DB_URL || "mongodb://localhost:27017/ticketing-db");

mongoose.connect(DB_URL)
  .then(()=> console.log(`Connected to DB: ${DB_URL}`))
  .catch((error)=> console.log("Failed to connect to Mongo DB with: ", error));

app.use(morgan("dev"));
app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use("/api/users", usersRoutes);
app.use("/api/tickets", ticketsRoutes );
app.use(error);

export default app;