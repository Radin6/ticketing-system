import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

const app = express();
const DB_URL = (process.env.DB_URL === "test" 
  ? "mongodb://localhost:27017/express-mongo/ticketing-db-test"
  : process.env.DB_URL || "mongodb://localhost:27017/express-mongo/ticketing-db");

mongoose.connect(DB_URL)
  .then(()=> console.log(`Connected to DB: ${DB_URL}`))
  .catch((error)=> console.log("Failed to connect to Mongo DB with: ", error));

app.use(morgan("dev"));
app.use(express.json());

app.get("/hello", (req, res) => {
  res.status(200).send("Hello Node!");
});

export default app;