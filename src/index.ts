import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => res.status(200).send("ok"));

app.use(routes);

app.use((req, res, next) => {
  res.status(404);
  return res.json({
    success: false,
    payload: null,
    message: `Não encontrei essa URL: ${req.path}`,
  });
});

app.listen(process.env.PORT || 4001, () =>
  console.log("🚀 REST API server ready at: http://localhost:4001")
);
