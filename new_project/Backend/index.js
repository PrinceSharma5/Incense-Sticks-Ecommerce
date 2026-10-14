require("dotenv").config();
const dbToConnect = require("./db/db");

const adminRouter = require("./routes/adminRoute");
const categoryRouter = require("./routes/categoryRoute");
const productRouter = require("./routes/productRoute");
const orderRouter = require("./routes/orderRoute");
const userRouter = require("./routes/userRoute");
const chatRouter = require("./routes/chatRoute");
const cartRouter = require("./routes/cartRoute");
const unusedCouponCodeRouter = require("./routes/unusedCouponCodeRoute");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/assets", express.static("statics"));

app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupon-code", unusedCouponCodeRouter);

const port = Number(process.env.PORT) || 8502;

dbToConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(() => {
    process.exitCode = 1;
  });
