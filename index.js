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
const PORT = process.env.PORT || 4001;

//Creating our server
app.get("/", (req, res) => {
  res.send(`Hey it's working !!`);
});
app.listen(PORT, () => console.log(`server is running on the =====> ${PORT}`));

try {
  const uri =
    "mongodb+srv://sid:sid@cluster0.dbrwq10.mongodb.net/?retryWrites=true&w=majority";
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  };
  mongoose
    .connect(uri, connectionParams)
    .then(() => {
      console.log("Connected to database ");
    })
    .catch((err) => {
      console.error(`Error connecting to the database. \n${err}`);
    });
} catch (error) {
  console.log(error);
}

//MIDDLEWARE -> DISALBING CORS AND USED FOR JSON OUTPUT
app.use(express.json(), cors());

//ROUTE MIDDLEWARE
app.use("/api/users", authRoute);
app.use("/api/dashboard", authDashboard);
