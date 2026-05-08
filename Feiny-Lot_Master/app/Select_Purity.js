/* ================= PURITY LOOKUP ================= */
function loadPurityLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Metal_Purity",
  })
    .then(function (response) {
      const allPuritySelects = document.querySelectorAll(
        "#select_purity, .select_purity",
      );

      allPuritySelects.forEach(function (select) {
        select.innerHTML = `<option value="">Select Purity</option>`;

        if (!response.data || response.data.length === 0) return;

        response.data.forEach(function (record) {
          const option = document.createElement("option");
          option.value = record.ID;
          option.text = record.Description1;
          select.appendChild(option.cloneNode(true));
        });
      });
    })
    .catch(function (error) {
      console.error("Purity lookup error:", error);
    });
}
