import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();
let collection = db.collection("planner");

//GET SCHEDULES
router.get("/", async (req, res) => {
  try {
    let query = {
      status: { $not: { $eq: "deleted" } },
    };
    let results = await collection.find(query).toArray();
    res.send(results).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// ADD SCHEDULE
router.post("/add", async (req, res) => {
  try {
    const schedule = req.body;
    const newSchedule = {
      playlist_id: schedule.title,
      start_date: schedule.start,
      end_date: schedule.end,
      backgroundColor: schedule.backgroundColor,
      status: "active",
    };
    result = await collection.insertOne(newSchedule);
    res.send(result).status(204);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
