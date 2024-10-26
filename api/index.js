import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth/auth.routes.js";
import adminProductsRouter from "./routes/admin/products.routes.js";
import adminOrderRouter from "./routes/admin/order.routes.js";
import shopProductsRouter from "./routes/shop/products.routes.js";
import shopCartRouter from "./routes/shop/cart.routes.js";
import commonFeatureRouter from "./routes/common/feature.routes.js";
import shopAddressRouter from "./routes/shop/address.routes.js";
import shopOrderRouter from "./routes/shop/order.routes.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);

app.use("/api/common/feature", commonFeatureRouter);

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is Connected Successfully..!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(5000, () => {
  console.log("Server is running on port 5000..!");
});
