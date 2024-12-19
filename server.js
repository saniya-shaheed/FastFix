const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicleRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const partordersRoutes = require("./routes/partordersRoutes");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*", // Replace with your frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", expenseRoutes);
app.use("/api", employeeRoutes);
app.use("/api", partordersRoutes);



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

   
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
