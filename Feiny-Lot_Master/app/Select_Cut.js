/* ================= Cut LOOKUP ================= */
let cutLookupData = null;

function loadCutLookup(targetElement = null) {
  if (cutLookupData) {
    renderCutOptions(targetElement);
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Cut",
  })
    .then(function (response) {
      if (response.data && response.data.length > 0) {
        cutLookupData = response.data;
        renderCutOptions(targetElement);
      }
    })
    .catch(function (error) {
      console.error("Cut lookup error:", error);
    });
}

function renderCutOptions(targetElement = null) {
  const selects = targetElement
    ? [targetElement]
    : document.querySelectorAll("#Select_Cut, .Select_Cut, #selectcut, .selectcut, #cutlookup, .selectcut, .j1-cut, .j3-cut",);

  selects.forEach(function (select) {
    if (!select) return;

    const selectedValue = select.value;
    select.innerHTML = `<option value="">Select Cut</option>`;

    cutLookupData.forEach(function (record) {
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
