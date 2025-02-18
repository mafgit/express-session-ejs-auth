const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60, // 1 day
      autoRemove: "native",
    }),
    // cookie: {
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    // },
  })
);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public")); // for css in ejs

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(require("./routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
