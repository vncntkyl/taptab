import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import md5 from "md5";

const router = express.Router();

//GET USERS
router.get("/", async (req, res) => {
  try {
    let collection = db.collection("users");
    let results = await collection
      .find({})
      .project({
        password: 0
      })
      .toArray();
    res.send(results).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const loginData = req.body;
    const newUser = {
      username: loginData.username.toLowerCase(),
      password: md5(loginData.password),
    };
    let collection = db.collection("users");
    let result = await collection.findOne({ username: newUser.username });
    if (!result) {
      result = await collection.insertOne(newUser);
      res.send(result).status(204);
    } else {
      res.send("Already registered").status(404);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const loginData = req.body;
    let collection = db.collection("users");
    let query = {
      username: loginData.username.toLowerCase(),
      password: md5(loginData.password),
    };
    let result = await collection.findOne(query);
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
