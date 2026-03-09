require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const jobs = require("./routes/jobs");
const auth = require("./middleware/auth");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret =
  process.env.SESSION_SECRET || (isProduction ? null : "dev-session-secret");

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required in production.");
}

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());
app.use(xssClean());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);
app.use(flash());

app.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  res.locals.flash = {
    info: typeof req.flash === "function" ? req.flash("info") : [],
    error: typeof req.flash === "function" ? req.flash("error") : [],
  };
  next();
});

app.get("/login-demo", (req, res) => {
  req.session.user = {
    _id: "64f1f77bcf1f77bcf1f77bc1",
    name: "Demo User",
  };
  res.redirect("/jobs");
});

app.get("/logout-demo", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.use("/jobs", auth, jobs);
app.use(express.static("public"));
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ctd-jobs";

const start = async () => {
  try {
    await mongoose.connect(mongoUri);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
