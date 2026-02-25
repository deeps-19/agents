const Investment = require("../models/Investment");
const Client = require("../models/Client");
const mongoose = require("mongoose");

exports.getDashboardStats = async (req, res) => {
  try {
    const agentId = new mongoose.Types.ObjectId(req.agent.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    const stats = await Investment.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      },
      { $unwind: "$client" },
      {
        $match: {
          "client.agentId": agentId,
          status: "Due"
        }
      },
      {
        $facet: {
          dueToday: [
            { $match: { dueDate: today } },
            { $count: "count" }
          ],
          dueThisWeek: [
            {
              $match: {
                dueDate: { $gte: today, $lte: weekEnd }
              }
            },
            { $count: "count" }
          ],
          overdue: [
            { $match: { dueDate: { $lt: today } } },
            { $count: "count" }
          ]
        }
      }
    ]);

    res.json({
      dueToday: stats[0].dueToday[0]?.count || 0,
      dueThisWeek: stats[0].dueThisWeek[0]?.count || 0,
      overdue: stats[0].overdue[0]?.count || 0
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};