const ExcelJS = require("exceljs");
const Investment = require("../models/Investment");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
exports.exportExcel = async (req, res) => {
  try {
    const agentId = new mongoose.Types.ObjectId(req.agent.id);

    const investments = await Investment.aggregate([
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
          "client.agentId": agentId
        }
      }
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Investments");

    worksheet.columns = [
      { header: "Client Name", key: "clientName", width: 20 },
      { header: "Company", key: "company", width: 15 },
      { header: "Policy Number", key: "policyNumber", width: 20 },
      { header: "Premium", key: "premium", width: 15 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Status", key: "status", width: 15 }
    ];

    investments.forEach(inv => {
      worksheet.addRow({
        clientName: inv.client.name,
        company: inv.company,
        policyNumber: inv.policyNumber,
        premium: inv.premium,
        dueDate: new Date(inv.dueDate).toDateString(),
        status: inv.status
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Investments.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const PDFDocuments = require("pdfkit");

exports.exportPDF = async (req, res) => {
  try {
    const agentId = new mongoose.Types.ObjectId(req.agent.id);

    const investments = await Investment.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      },
      { $unwind: "$client" },
      { $match: { "client.agentId": agentId } }
    ]);

    const doc = new PDFDocuments();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Investments.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Investment Report", { align: "center" });
    doc.moveDown();

    investments.forEach(inv => {
      doc
        .fontSize(12)
        .text(`Client: ${inv.client.name}`)
        .text(`Company: ${inv.company}`)
        .text(`Premium: ₹${inv.premium}`)
        .text(`Due Date: ${new Date(inv.dueDate).toDateString()}`)
        .text(`Status: ${inv.status}`)
        .moveDown();
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};