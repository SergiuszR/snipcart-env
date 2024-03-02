const geoToken = process.env.GEO_TOKEN;
const apiToken = process.env.API_TOKEN;

let geowidgetAppended = false;
let pointSelected = false;

let appendGeoWidget = function () {
  let userLang = (navigator.language || navigator.userLanguage).substr(0, 2);
  if (userLang !== "pl") {
    userLang = "en";
  }

  // Securely embed the token using template literal:
  let widgetCode = `<div class="custom-geowidget"><inpost-geowidget id="geowidget" onpoint="handlePointSelection" token="<span class="math-inline">\{geoToken\}" language\="</span>{userLang}" config="parcelCollect"></inpost-geowidget></div>`;

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

let createShipment = function () {
  if (!globalBillingDetails) throw new Error("Billing details not available");
  $.ajax({
    url: "https://sandbox-api-shipx-pl.easypack24.net/v1/organizations/3879/shipments",
    type: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      receiver: {
        first_name: globalBillingDetails.firstName,
        last_name: globalBillingDetails.name,
        email: globalEmail,
        phone: globalBillingDetails.phone,
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
        target_point: globalDetails.name,
      },
      service: "inpost_locker_standard",
      reference: "snipcart",
    }),
    success: function (response) {
      console.log("Server response:", response);
    },
    error: function (error) {
      console.error("Error creating shipment:", error);
    },
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

  Snipcart.events.on("cart.confirmed", createShipment);
});
