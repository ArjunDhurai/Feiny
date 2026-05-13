/* ================= Shape LOOKUP ================= */
function loadShapeLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Shape",
  })
    .then(function (response) {
      const allShapeSelects = document.querySelectorAll(
        "#select_shape, .select_shape",
      );

      allShapeSelects.forEach(function (select) {
        select.innerHTML = `<option value="">Select Shape</option>`;

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
      console.error("Shape lookup error:", error);
    });
}
