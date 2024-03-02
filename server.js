const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv"); // For environment variables

dotenv.config(); // Load environment variables from a `.env` file

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON data in the request body
app.use(bodyParser.json());

// Endpoint to create shipment
app.post("/api/shipment", async (req, res) => {
  const { billingDetails, shippingDetails } = req.body;

  if (!billingDetails || !shippingDetails) {
    return res.status(400).json({ message: "Missing required data" });
  }

  // Replace with your actual InPost API logic and error handling
  try {
    const inpostApiUrl = "https://sandbox-api-shipx-pl.easypack24.net/v1/organizations/3879/shipments";
    const inpostApiKey = process.env.API_TOKEN;

    const shipmentData = {
      receiver: {
        first_name: billingDetails.firstName,
        last_name: billingDetails.name,
        email: billingDetails.email,
        phone: billingDetails.phone,
      },
      parcels: {
        template: "small",
      },
      insurance: {
        amount: 25,
        currency: "PLN",
      },
      cod: {
        amount: 12.5,
        currency: "PLN",
      },
      custom_attributes: {
        sending_method: "parcel_locker",
        target_point: shippingDetails.name,
      },
      service: "inpost_locker_standard",
      reference: "snipcart",
    };

    const response = await fetch(inpostApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${inpostApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipmentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating shipment:", errorData);
      return res.status(response.status).json({ message: "Error creating shipment" });
    }

    console.log("Shipment created successfully");
    res.json({ message: "Shipment created successfully" });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ message: "Error creating shipment" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
