/* ================= VENDOR LOOKUP ================= */
function loadvendorLookup() {
  console.log("Loading vendor lookup...");

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Customers1",
  })
    .then(function (response) {
      console.log("Vendor Response:", response);

      const vendorSelect = document.getElementById("vendor_lookup");
      if (!vendorSelect) return;

      // Clear existing options
      vendorSelect.innerHTML =
        `<option value="">Select Vendor</option>`;

      // Check if data exists
      if (!response.data || response.data.length === 0) return;

      // Append options
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID; // Store ID
        option.textContent = record.Legal_Name || "No Name"; // Display name
        vendorSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Vendor lookup error:", error);
    });
}

loadvendorLookup();