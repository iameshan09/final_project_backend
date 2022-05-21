const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const MainRouter = require("./routes/main");

// CREATE EXPRESS SERVER
const app = express();

// ADD MIDDLEWARES
app.use(cors());
app.use(express.json());

// APP ROUTES
app.use("/app/main", MainRouter);

mongoose
  .connect(process.env.DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log("Getting error with: ", err));

// DEFINE PORT
app.listen(4000, () => {
  console.log("sever running on port 4000");
});
