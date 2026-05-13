/* ================= PURITY LOOKUP ================= */
let purityLookupData = null;

function loadPurityLookup(targetElement) {
  if (purityLookupData) {
    renderPurityOptions(targetElement);
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Metal_Purity",
  })
    .then(function (response) {
      if (response.data && response.data.length > 0) {
        purityLookupData = response.data;
        renderPurityOptions(targetElement);
      }
    })
    .catch(function (error) {
      console.error("Purity lookup error:", error);
    });
}

function renderPurityOptions(targetElement) {
  const selects = targetElement
    ? [targetElement]
    : document.querySelectorAll("#select_purity, .select_purity");

  selects.forEach(function (select) {
    const selectedValue = select.value;
    select.innerHTML = `<option value="">Select Purity</option>`;

    purityLookupData.forEach(function (record) {
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
