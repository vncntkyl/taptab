import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/records.mjs";
import users from "./routes/users.mjs";
import storage from "./routes/storage.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/record", records);
app.use("/users", users);
app.use("/storage", storage);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
