/* ================= METAL TYPE LOOKUP ================= */
function loadMetalTypeLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Metals",
  })
    .then(function (response) {
      if (!response.data || response.data.length === 0) return;

      const allMetalTypeSelects = document.querySelectorAll(
        "#select_metal_type, .select_metal_type",
      );

      allMetalTypeSelects.forEach(function (select) {
        select.innerHTML = `<option value="">Select Metal Type</option>`;

        response.data.forEach(function (record) {
          const option = document.createElement("option");
          option.value = record.ID;
          option.text = record.Description1;
          console.log(option);
          select.appendChild(option.cloneNode(true));
        });
      });
    })
    .catch(function (error) {
      console.error("Metal type lookup error:", error);
    });
}
