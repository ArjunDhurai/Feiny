/* ================= UNIT LOOKUP ================= */
function loadUnitLookup() {
  //   console.log("Loading unit lookup...");

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Unit",
  })
    .then(function (response) {
      //   console.log("Unit lookup response:", JSON.stringify(response));
      const unitSelect = document.getElementById("select_unit");
      unitSelect.innerHTML = `<option value="">Select Unit</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        unitSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Unit lookup error:", error);
    });
}
