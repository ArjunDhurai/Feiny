/* ================= UNIT LOOKUP ================= */
function loadUnitLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Unit",
  })
    .then(function (response) {
      const allUnitSelects = document.querySelectorAll(
        "#select_unit, .select_unit",
      );

      allUnitSelects.forEach(function (select) {
        select.innerHTML = `<option value="">Select Unit</option>`;

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
      console.error("Unit lookup error:", error);
    });
}
