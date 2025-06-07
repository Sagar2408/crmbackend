const axios = require('axios');

const API_KEY = '9ZWPSxasF40c66fb1ed9eca0b7e0ae9269be31bebfPE5OKQoz';

const getLeadName = async (req, res) => {
  let number = req.query.number;
  if (!number) {
    return res.status(400).json({ success: false, error: 'Number is required' });
  }

  // Remove all non-digit characters
  number = number.replace(/\D/g, '');

  // Normalize phone number
  if (number.length === 10) {
    // If just 10 digits, add +91 country code
    number = '+91' + number;
  } else if (number.length > 10 && number.startsWith('91')) {
    // If starts with 91 and longer than 10 digits, add '+' in front
    number = '+' + number;
  } else if (!number.startsWith('+')) {
    // Otherwise, just add '+' prefix if missing
    number = '+' + number;
  }

  const url = `https://lookup.proweblook.com/api/v1/calleridvalidation?phone_number=${encodeURIComponent(number)}&api_key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    console.log('External API response:', data);

    if (data.success) {
      res.json({
        success: true,
        name: data.name || 'Name not found',
        location: data.location || 'Location not found',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'API returned failure',
        apiResponse: data,
      });
    }
  } catch (err) {
    console.error('Axios error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Error fetching data from external API',
    });
  }
};

module.exports = { getLeadName };
