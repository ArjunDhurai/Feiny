/* ================= STYLE TYPE LOOKUP ================= */
function loadStyleTypeLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "StyleType",
  })
    .then(function (response) {
      const styleTypeSelect = document.getElementById("style_type");
      if (!styleTypeSelect) return;
      styleTypeSelect.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        styleTypeSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Style type lookup error:", error);
    });
}
