/* ================= METAL TYPE LOOKUP ================= */
function loadMetalTypeLookup() {
  //   console.log("Loading metal type lookup...");

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Metals",
  })
    .then(function (response) {
      //   console.log("Metal type lookup response:", JSON.stringify(response));
      const metalTypeSelect = document.getElementById("select_metal_type");
      metalTypeSelect.innerHTML = `<option value="">Select Metal Type</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        metalTypeSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Metal type lookup error:", error);
    });
}
