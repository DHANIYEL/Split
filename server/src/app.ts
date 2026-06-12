import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Split API Running",
  });
});

export default app;
