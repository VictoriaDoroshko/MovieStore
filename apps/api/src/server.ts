import "reflect-metadata";
import cors from "cors";
import express from "express";
import movieRoutes from "./routes/movieRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/movies", movieRoutes);
app.use("/categories", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
