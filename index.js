/**************************************************
 *             author : siddharth                  *
 **************************************************/

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./routes/auth/auth");
const authDashboard = require("./routes/auth/authDashboard");
var bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//DEFINIG PORT
const PORT = process.env.PORT || 4002;

//Creating our server
app.get("/", (req, res) => {
  res.send(`Hey it's working !!`);
});
app.listen(PORT, () => console.log(`server is running on the =====> ${PORT}`));

//CONNECTION TO DATABASE
// mongoose.connect(
//   process.env.DB_CONNECT,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   () => console.log("connected to db  ")
// );

const uri =
  "mongodb+srv://sid1729:pandey1729@cluster0.rdgas0r.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
    console.log(err);
  // perform actions on the collection object
  client.close();
});

//MIDDLEWARE -> DISALBING CORS AND USED FOR JSON OUTPUT
app.use(express.json(), cors());

//ROUTE MIDDLEWARE
app.use("/api/users", authRoute);
app.use("/api/dashboard", authDashboard);
