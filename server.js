const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const volumeBasedRoutes = require("./routes/volumeBasedRoutes")
const distanceOnlyRoutes = require("./routes/distanceOnlyRoutes");
const authRoutes = require("./routes/authRoutes")
const cors = require("cors");
const verifyToken = require("./middleware/authMiddleware");



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());//cors should go after defining the app, it causes an error if placed before

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


app.use("/api/auth", authRoutes);//handle authentication logic
app.use("/api/volume-based", volumeBasedRoutes);//handle volume based logic
app.use("/api/distances-only", distanceOnlyRoutes)

app.get("/api/protected", verifyToken, (req, res) =>{
  res.json( {message: "you are now authorised", userId: req.user.id})
});

// Optional root route
app.get("/", (req, res) => {
  res.send("Fuel Cost Optimization API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
