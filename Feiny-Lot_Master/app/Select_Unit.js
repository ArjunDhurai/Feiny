/* ================= UNIT LOOKUP ================= */
let unitLookupData = null;

function loadUnitLookup(targetElement = null) {
  if (unitLookupData) {
    renderUnitOptions(targetElement);
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Unit",
  })
    .then(function (response) {
      if (response.data && response.data.length > 0) {
        unitLookupData = response.data;
        renderUnitOptions(targetElement);
      }
    })
    .catch(function (error) {
      console.error("Unit lookup error:", error);
    });
}

function renderUnitOptions(targetElement = null) {
  const selects = targetElement
    ? [targetElement]
    : document.querySelectorAll(
        "#select_unit, .select_unit, #selectunit, .selectunit, #unitlookup, .selectunit, .j1-unit, .j3-unit",
      );

  selects.forEach(function (select) {
    if (!select) return;

    const selectedValue = select.value;
    select.innerHTML = `<option value="">Select Unit</option>`;

    unitLookupData.forEach(function (record) {
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
