// const geoToken = process.env.GEO_TOKEN;

let geowidgetAppended = false;
let pointSelected = false;

let appendGeoWidget = function () {
  let userLang = (navigator.language || navigator.userLanguage).substr(0, 2);
  if (userLang !== "pl") {
    userLang = "en";
  }

  // Securely embed the token using template literal:
  let widgetCode = `<div class="custom-geowidget"><inpost-geowidget id="geowidget" onpoint="handlePointSelection" token="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVzROZW9TeXk0OHpCOHg4emdZX2t5dFNiWHY3blZ0eFVGVFpzWV9TUFA4In0.eyJleHAiOjIwMjM0MzYxNDQsImlhdCI6MTcwODA3NjE0NCwianRpIjoiNWFlOGU2NGQtMzM5YS00ZDZiLThjMTUtMzJiZTMyNzliZmVlIiwiaXNzIjoiaHR0cHM6Ly9zYW5kYm94LWxvZ2luLmlucG9zdC5wbC9hdXRoL3JlYWxtcy9leHRlcm5hbCIsInN1YiI6ImY6N2ZiZjQxYmEtYTEzZC00MGQzLTk1ZjYtOThhMmIxYmFlNjdiOjFBNlZvZGcwdGFvLVYxa1RXV1dFSzBRdlFGQWlMbGhyYS1HdVJwVkVNSEUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzaGlweCIsInNlc3Npb25fc3RhdGUiOiIwNDdiN2ExMC02ZGY3LTQ1OWUtYmY5Ni04N2YzZjFmMThjZjkiLCJzY29wZSI6Im9wZW5pZCBhcGk6YXBpcG9pbnRzIiwic2lkIjoiMDQ3YjdhMTAtNmRmNy00NTllLWJmOTYtODdmM2YxZjE4Y2Y5IiwiYWxsb3dlZF9yZWZlcnJlcnMiOiJzbmlwY2FydC10ZXN0b3d5LndlYmZsb3cuaW8iLCJ1dWlkIjoiZDc2YmRjNWUtMDU0NS00OThhLTg2MjctNjRkOWZlMTA5NjlmIn0.JrAU0bV3kDpuZPIe-UkkJRxDdaVJrNayqtQ4saMeUO9eHY4MnQyqKM-_ori7HYYKE0Z0tw9aMANgBWKCf_RMJQM7eTHSmgSkLGx96qbyxDIY7CPMpmnx0rnJuN6lfi142Bwe45MYshdjvAc3I9eFTLzkSTve_mhjYhsoq787Tjo941-KLpQUM2OFMgihv8u9pJ2QIAx8YPogk5TqhyrcbehsK7N-IHuiKlFUlSY3OQ1ockuteItIlCboHwZde1aODZcJgqfe-aS4KmNz-nHNkn3jPbPtJ0ODVoyb0UZEZpU-8nIJtqXFIGf2OcdwX875TGDIj3VMzKD96JV2_G4P7Q" language\="</span>{userLang}" config="parcelCollect"></inpost-geowidget></div>`;

  let targetElement = $(".snipcart-layout__col.snipcart-layout__col--large");
  let childrenCount = targetElement.children().length;

  if (childrenCount > 0) {
    targetElement
      .children()
      .eq(childrenCount - 1)
      .before(widgetCode);
  } else {
    targetElement.append(widgetCode);
  }

  geowidgetAppended = true;

  let geowidget = document.querySelector("#geowidget");

  geowidget.addEventListener("handlePointSelection", async (event) => {
    globalDetails = event.detail;
    globalBillingDetails = Snipcart.store.getState().cart.billingAddress;
    globalEmail = Snipcart.store.getState().cart.email;

    try {
      await Snipcart.api.cart.update({
        email: globalEmail,
        shipToBillingAddress: false,
        billingAddress: {
          name: globalBillingDetails.name,
          firstName: globalBillingDetails.firstName,
          address1: globalBillingDetails.address1,
          city: globalBillingDetails.city,
          country: globalBillingDetails.country,
          postalCode: globalBillingDetails.postalCode,
          province: globalBillingDetails.province,
          phone: globalBillingDetails.phone,
        },
        shippingAddress: {
          name: globalBillingDetails.name,
          firstName: globalBillingDetails.firstName,
          address1: globalDetails.address.line1,
          address2: `${globalDetails.name}, ${globalDetails.location_description}`,
          city: globalDetails.address_details.city,
          country: globalBillingDetails.country,
          postalCode: globalDetails.address_details.post_code,
          province: globalDetails.address_details.province,
          phone: globalBillingDetails.phone,
        },
      });
      pointSelected = true;
    } catch (error) {
      console.log(error);
    }
    console.log(globalDetails);
  });
};

document.addEventListener("snipcart.ready", function () {
  Snipcart.events.on("shipping.selected", (shippingMethod) => {
    if (shippingMethod.method === "inPost" && !geowidgetAppended) {
      appendGeoWidget();
    } else if (shippingMethod.method !== "inPost" && geowidgetAppended) {
      $(".custom-geowidget").remove();
      geowidgetAppended = false;
    }
  });

  Snipcart.events.on("cart.confirmed", async function () {
    if (!pointSelected) {
      throw new Error("Please select a delivery point");
    }

    const shipmentData = {
      billingDetails: Snipcart.store.getState().cart.billingAddress,
      shippingDetails: {
        name: globalDetails.name,
        addressLine1: globalDetails.address.line1,
        city: globalDetails.address_details.city,
        postalCode: globalDetails.address_details.post_code,
      },
    };

    try {
      const response = await fetch("/api/shipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentData),
      });

      if (!response.ok) {
        throw new Error("Error creating shipment");
      }

      console.log("Shipment created successfully");
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  });
});
