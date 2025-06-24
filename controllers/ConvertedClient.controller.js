const createConvertedClient = async (req, res) => {
  try {
    const { ConvertedClient, FreshLead, Lead, ClientLead } = req.db;
    const { fresh_lead_id } = req.body;

    if (!fresh_lead_id) {
      return res.status(400).json({ message: "fresh_lead_id is required." });
    }

    const freshLead = await FreshLead.findOne({
      where: { id: fresh_lead_id },
      include: {
        model: Lead,
        as: "lead",
        include: {
          model: ClientLead,
          as: "clientLead",
        },
      },
    });

    const existingConvertedClient = await ConvertedClient.findOne({
      where: { fresh_lead_id },
    });

    if (existingConvertedClient) {
      return res.status(409).json({
        message: "A ConvertedClient already exists for this fresh_lead_id.",
        data: existingConvertedClient,
      });
    }

    if (!freshLead) {
      return res.status(404).json({ message: "FreshLead not found." });
    }

    if (!freshLead.lead || !freshLead.lead.clientLead) {
      return res.status(404).json({
        message: "Lead or ClientLead not found for this FreshLead.",
      });
    }

    const { name, phone, email } = freshLead;
    const country = freshLead.lead.clientLead.country || null;

    const convertedClient = await ConvertedClient.create({
      fresh_lead_id,
      name,
      phone,
      email,
      country,
      last_contacted: new Date(),
    });

    await ClientLead.update(
      { status: "Converted" },
      {
        where: { id: freshLead.lead.clientLeadId },
      }
    );

    res.status(201).json({
      message: "Converted client created successfully.",
      data: convertedClient,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
};

const getAllConvertedClients = async (req, res) => {
  try {
    const { ConvertedClient } = req.db;
    const clients = await ConvertedClient.findAll();

    res.status(200).json({
      message: "All converted clients fetched successfully.",
      data: clients,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
};

const getConvertedClientById = async (req, res) => {
  try {
    const { ConvertedClient } = req.db;
    const { id } = req.params;

    const client = await ConvertedClient.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Converted client not found." });
    }

    res.status(200).json({
      message: "Converted client fetched successfully.",
      data: client,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
};

// 🔐 For Executive (self data)
const getConvertedClientByExecutive = async (req, res) => {
  try {
    const { ConvertedClient, FreshLead, Lead, ClientLead } = req.db;
    const executiveName = req.user.username;

    if (!executiveName) {
      return res.status(400).json({ message: "Executive name not found in token." });
    }

    const clients = await ConvertedClient.findAll({
      include: [
        {
          model: FreshLead,
          as: "freshLead",
          required: true,
          include: [
            {
              model: Lead,
              as: "lead",
              required: true,
              include: [
                {
                  model: ClientLead,
                  as: "clientLead",
                  required: true,
                  where: { assignedToExecutive: executiveName },
                  attributes: ["status"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!clients || clients.length === 0) {
      return res.status(404).json({
        message: "No converted clients found for this executive.",
      });
    }

    const formattedClients = clients.map((client) => ({
      id: client.id,
      fresh_lead_id: client.fresh_lead_id,
      name: client.name,
      phone: client.phone,
      email: client.email,
      country: client.country,
      last_contacted: client.last_contacted,
      status: client.freshLead?.lead?.clientLead?.status || "Unknown",
    }));

    res.status(200).json({
      message: "Converted clients fetched successfully.",
      data: formattedClients,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong.",
      error: err.message,
    });
  }
};

// ✅ NEW: For Admin (pass executive name via URL param)
const getConvertedClientsByExecutiveNameForAdmin = async (req, res) => {
  try {
    const { ConvertedClient, FreshLead, Lead, ClientLead } = req.db;
    const executiveName = req.params.executiveName;

    if (!executiveName) {
      return res.status(400).json({ message: "Executive name is required." });
    }

    const clients = await ConvertedClient.findAll({
      include: [
        {
          model: FreshLead,
          as: "freshLead",
          required: true,
          include: [
            {
              model: Lead,
              as: "lead",
              required: true,
              include: [
                {
                  model: ClientLead,
                  as: "clientLead",
                  required: true,
                  where: { assignedToExecutive: executiveName },
                  attributes: ["status"],
                },
              ],
            },
          ],
        },
      ],
    });

    const formattedClients = clients.map((client) => ({
      id: client.id,
      fresh_lead_id: client.fresh_lead_id,
      name: client.name,
      phone: client.phone,
      email: client.email,
      country: client.country,
      last_contacted: client.last_contacted,
      status: client.freshLead?.lead?.clientLead?.status || "Unknown",
    }));

    res.status(200).json({
      message: `Converted clients fetched for ${executiveName}`,
      data: formattedClients,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong.",
      error: err.message,
    });
  }
};

module.exports = {
  createConvertedClient,
  getAllConvertedClients,
  getConvertedClientById,
  getConvertedClientByExecutive,
  getConvertedClientsByExecutiveNameForAdmin,
};
