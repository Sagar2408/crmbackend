const getRevenueData = async (req, res) => {
  try {
    // Destructure RevenueChart model from req.db
    const { RevenueChart } = req.db;

    // Fetch revenue and lead data from the database
    const revenueData = await RevenueChart.findAll({
      attributes: ["date", "revenue", "lead"],
      order: [["date", "ASC"]], // Order by date ascending
    });

    if (!revenueData || revenueData.length === 0) {
      return res.status(404).json({ message: "No revenue data found" });
    }

    // Format the data to match the frontend expectation
    const formattedData = revenueData.map((entry) => ({
      date: entry.date,
      revenue: entry.revenue,
      lead: entry.lead,
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("❌ Error fetching revenue data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getRevenueData,
};
