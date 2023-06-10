const express = require("express");
// const { connectDB } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { noteRouter } = require("./routes/note.routes");
const mongoose = require("mongoose");

const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/notes", noteRouter);

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.mongoURL);
    console.log("connected to mongoDB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(process.env.port, async () => {
    console.log(`server is running at port ${process.env.port}`);
  });
});
