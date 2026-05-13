/* ================= Shape LOOKUP ================= */
// Shape LOOKUP
function loadShapeLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Shape",
  })
    .then(function (response) {
      console.log("Shape lookup response:", response);
      // Targets various ID/Class naming conventions used across the project
      const selects = document.querySelectorAll("#select_shape, .select_shape, #shape_lookup, #shapelookup, .selectshape");

      selects.forEach(function (select) {
        const selectedValue = select.value;
        select.innerHTML = '<option value="">Select Shape</option>';

        if (!response.data || response.data.length === 0) return;

        response.data.forEach(function (record) {
          const option = document.createElement("option");
          option.value = record.ID;
          option.text = record.Description1;

          if (selectedValue && selectedValue == record.ID) {
            option.selected = true;
          }

          select.appendChild(option.cloneNode(true));
        });
      });
    })
    .catch(function (error) {
      console.error("Shape lookup error:", error);
    });
}
