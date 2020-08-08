const dotenv = require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes/appRoutes");
const port = process.env.PORT;

app.listen(port, () => {
    console.log("App running on : ", port);
});

app.use(cors());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
routes(app);