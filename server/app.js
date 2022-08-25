const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRouter = require("./routers/products.js");
const userRouter = require("./routers/user.js");
const orderRouter = require("./routers/order.js");
const cors = require("cors");

dotenv.config();
const app = express();
// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database Connected!!!"))
    .catch((err) => console.log(err.message));
// Disconnected Message
mongoose.connection.on("disconnected", () => console.log("Database Disconnected"));
// Middleware
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serve to http://localhost:${PORT}`);
})

