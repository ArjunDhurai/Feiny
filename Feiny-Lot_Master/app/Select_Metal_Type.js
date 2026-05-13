/* ================= METAL TYPE LOOKUP ================= */
let metalTypeLookupData = null;

function loadMetalTypeLookup(targetElement) {
  if (metalTypeLookupData) {
    renderMetalTypeOptions(targetElement);
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Metals",
  })
    .then(function (response) {
      if (response.data && response.data.length > 0) {
        metalTypeLookupData = response.data;
        renderMetalTypeOptions(targetElement);
      }
    })
    .catch(function (error) {
      console.error("Metal type lookup error:", error);
    });
}

function renderMetalTypeOptions(targetElement) {
  const selects = targetElement
    ? [targetElement]
    : document.querySelectorAll("#select_metal_type, .select_metal_type");

  selects.forEach(function (select) {
    const selectedValue = select.value;
    select.innerHTML = `<option value="">Select Metal Type</option>`;

    metalTypeLookupData.forEach(function (record) {
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
