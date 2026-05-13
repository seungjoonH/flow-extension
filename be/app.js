import express from "express";
import * as c from "#src/constants";

const app = express();

app.use(express.json());

app.listen(c.PORT, () => {
  console.log(`http://localhost:${c.PORT}`);
});