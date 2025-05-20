const Invoice = require("../models/Invoice.model");

// 📌 Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const Invoice = req.db.Invoice; // ✅ Dynamic DB model
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📌 Get all invoices
exports.getInvoices = async (req, res) => {
  try {
    const Invoice = req.db.Invoice; // ✅ Dynamic DB model
    const invoices = await Invoice.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get a single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const Invoice = req.db.Invoice; // ✅ Dynamic DB model
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update an invoice
exports.updateInvoice = async (req, res) => {
  try {
    const Invoice = req.db.Invoice; // ✅ Dynamic DB model
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await invoice.update(req.body);
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📌 Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const Invoice = req.db.Invoice; // ✅ Dynamic DB model
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await invoice.destroy();
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
