import express from "express";
import { Report } from "../models/ReportModel.js";

const reportRouter = express.Router();

reportRouter.post("/blog", async (request, response) => {
  try {
    const { reporterId, blogId, reason, blogUserId } = request.body;

    // Check if a report already exists for this blog by the same reporter
    const existingReport = await Report.findOne({
      reportedBlog: blogId,
    });

    if (existingReport) {
      // If the report already exists, increment the report count
      existingReport.reportCount = (existingReport.reportCount || 0) + 1;
      await existingReport.save();
      return response.status(200).json({ message: "Report count incremented" });
    }

    // If no report exists, create a new one
    const newReport = new Report({
      reporter: reporterId,
      reportedBlog: blogId,
      reason,
      blogUserId,
      reportCount: 1, // Initialize report count at 1
    });
    await newReport.save();
    response.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

reportRouter.get("/blogdisplay", async (request, response) => {
  try {
    const reports = await Report.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "reporter",
          foreignField: "_id",
          as: "reporterDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "blogUserId",
          foreignField: "_id",
          as: "blogUserDetails",
        },
      },

      {
        $lookup: {
          from: "food-blogs",
          localField: "reportedBlog",
          foreignField: "_id",
          as: "blogDetails",
        },
      },
      { $unwind: "$blogUserDetails" },
      { $unwind: "$reporterDetails" },
      { $unwind: "$blogDetails" },
      {
        $project: {
          _id: 1,
          reason: 1,
          reportCount: 1,
          "reporterDetails._id": 1,
          "reporterDetails.username": 1,
          "reporterDetails.profilePicture": 1,
          "blogUserDetails._id": 1,
          "blogUserDetails.username": 1,
          "blogUserDetails.profilePicture": 1,
          "blogDetails._id": 1,
          "blogDetails.content": 1,
          "blogUserDetails.isBanned": 1,
        },
      },
    ]);

    response.status(200).json(reports);
  } catch (error) {
    response.status(500).send(error);
  }
});

reportRouter.post("/action/delete", async (request, response) => {
  try {
    const { ids } = request.body;
    await Report.deleteMany({ _id: { $in: ids } });
    response.status(200).json({ message: "Reports deleted successfully" });
  } catch (error) {
    response.status(500).send(error);
  }
});

export default reportRouter;
