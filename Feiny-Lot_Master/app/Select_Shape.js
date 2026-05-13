/* ================= Shape LOOKUP ================= */
// Shape LOOKUP
let shapeLookupData = null;

function loadShapeLookup(targetElement) {
  if (shapeLookupData) {
    renderShapeOptions(targetElement);
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Shape",
  })
    .then(function (response) {
      if (response.data && response.data.length > 0) {
        shapeLookupData = response.data;
        renderShapeOptions(targetElement);
      }
    })
    .catch(function (error) {
      console.error("Shape lookup error:", error);
    });
}

function renderShapeOptions(targetElement) {
  const selects = targetElement
    ? [targetElement]
    : document.querySelectorAll(
        "#select_shape, .select_shape, #shape_lookup, #shapelookup, .selectshape",
      );

  selects.forEach(function (select) {
    const selectedValue = select.value;
    select.innerHTML = '<option value="">Select Shape</option>';

    shapeLookupData.forEach(function (record) {
      const option = document.createElement("option");
      option.value = record.ID;
      option.text = record.Description1;

      if (selectedValue && selectedValue == record.ID) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  });
}
