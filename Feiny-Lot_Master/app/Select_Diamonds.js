/* ================= DIAMOND LOOKUP ================= */
function loadDiamondLookup() {
  //   console.log("Loading diamond lookup...");

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Diamond",
  })
    .then(function (response) {
      console.log("Diamond lookup response:", JSON.stringify(response));
      const diamondSelect = document.getElementById("select_diamond");
      diamondSelect.innerHTML = `<option value="">Select Diamond</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.In_SKU;
        diamondSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Diamond lookup error:", error);
    });
}
