/* ================= Purity LOOKUP ================= */
function loadPurityLookup() {
  //   console.log("Loading purity lookup...");

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Metal_Purity",
  })
    .then(function (response) {
      //   console.log("Purity lookup response:", JSON.stringify(response));
      const puritySelect = document.getElementById("select_purity");
      puritySelect.innerHTML = `<option value="">Select Purity</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        puritySelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Purity   lookup error:", error);
    });
}
