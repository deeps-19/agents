const ExcelJS = require("exceljs");
const Investment = require("../models/Investment");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
exports.exportExcel = async (req, res) => {
  try {
    const agentId = new mongoose.Types.ObjectId(req.agent.id);
    const { company, clientId, clientsOnly } = req.query;

    let matchStage = {
      agentId: agentId
    };

    if (company) {
      matchStage.company = company;
    }

    if (clientId) {
      matchStage.clientId = new mongoose.Types.ObjectId(clientId);
    }

    // If only client export
    if (clientsOnly === "true") {
      const Client = require("../models/Client");
      const clients = await Client.find({ agentId });

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Clients");

      sheet.columns = [
        { header: "Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 25 },
        { header: "Phone", key: "phone", width: 20 }
      ];

      clients.forEach(c => sheet.addRow(c));

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=Clients.xlsx");

      await workbook.xlsx.write(res);
      return res.end();
    }

    // Investment export
    const investments = await Investment.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      },
      { $unwind: "$client" }
    ]);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Investments");

    sheet.columns = [
      { header: "Client Name", key: "client", width: 25 },
      { header: "Company", key: "company", width: 20 },
      { header: "Type", key: "type", width: 20 },
      { header: "Account No", key: "accountNo", width: 20 },
      { header: "Receipt No", key: "receiptNo", width: 20 },
      { header: "Premium", key: "premium", width: 15 },
      { header: "Opening Date", key: "openingDate", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Status", key: "status", width: 15 }
    ];

    investments.forEach(inv => {
      sheet.addRow({
        client: inv.client.name,
        company: inv.company,
        type: inv.type,
        accountNo: inv.accountNo,
        receiptNo: inv.receiptNo,
        premium: inv.premium,
        openingDate: inv.openingDate
          ? new Date(inv.openingDate).toDateString()
          : "",
        dueDate: new Date(inv.dueDate).toDateString(),
        status: inv.status
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=Investments.xlsx");

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
      { $match: { agentId } },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      },
      { $unwind: "$client" }
    ]);

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Investments.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Investment Report", { align: "center" });
    doc.moveDown();

    investments.forEach(inv => {
      doc
        .fontSize(10)
        .text(`Client: ${inv.client.name}`)
        .text(`Company: ${inv.company}`)
        .text(`Type: ${inv.type}`)
        .text(`Account No: ${inv.accountNo}`)
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