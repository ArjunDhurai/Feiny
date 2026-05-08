/* ================= COLOR LOOKUP ================= */
function loadColorLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Gold_Metal_Color",
  })
    .then(function (response) {
      const allColorSelects = document.querySelectorAll(
        "#select_color, .select_color",
      );

      allColorSelects.forEach(function (select) {
        select.innerHTML = `<option value="">Select Color</option>`;

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
      console.error("Color lookup error:", error);
    });
}
