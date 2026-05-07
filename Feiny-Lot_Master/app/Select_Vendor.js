/* ================= VENDOR LOOKUP ================= */
function loadVendorLookup() {
  // console.log("Loading vendor lookup...");

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Customers1",
  })
    .then(function (response) {
      const vendorSelect = document.getElementById("select_vendor");
      // if (!vendorSelect) return;
      vendorSelect.innerHTML = `<option value="">Select Vendor</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Legal_Name;
        vendorSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Vendor lookup error:", error);
    });
}
