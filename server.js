const express = require("express");
const userRoute = require("./Routes/userRoute.js");
const categoryRoute = require("./Routes/categoryRoute.js");
const subCategoryRoute = require("./Routes/subCategoryRoute.js");
const productRoute = require("./Routes/productRoute.js");
const cartRoute = require("./Routes/cartRoute.js");
const cors = require("cors");
const path = require("path");
const {connectToDb} = require("./Confige/dbConnection.js");

// Load environment variables
require("dotenv").config();

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());

// Set up routes
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/subcategory", subCategoryRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);

// Serve static files
app.use('/image', express.static('Upload'));

app.get("/", (req, res) => {
  res.send("this is the root path!");
});

// Set view engine
app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send({ status: "fail", message: "Page not available" });
});

// Connect to the database and start the server
const port = process.env.PORT || 4000;
//const url = process.env.MONGODB_URI;
const url = "mongodb+srv://bookmart:bookmart2024@bookmart.fntnbku.mongodb.net/bookmartDb"

connectToDb(url);

app.listen(5000, () => {
  console.log(`Server is running at http://localhost:${5000}`);
});
