/* ================= Clarity LOOKUP ================= */
let clarityLookupData = null;

function loadClarityLookup(targetElement = null) {
  if (clarityLookupData) {
    renderClarityOptions(targetElement);
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Clarity",
  })
    .then(function (response) {
      if (response.data && response.data.length > 0) {
        clarityLookupData = response.data;
        renderClarityOptions(targetElement);}
    })
    .catch(function (error) {
      console.error("Clarity lookup error:", error);
    });
}

function renderClarityOptions(targetElement = null) {
  const selects = targetElement
    ? [targetElement]
    : document.querySelectorAll("#Select_Clarity,.Select_Clarity, .j3-clarity,.Select_Clarity_j3-clarity");

  selects.forEach(function (select) {
    if (!select) return;

    const selectedValue = select.value;
    select.innerHTML = `<option value="">Select Clarity</option>`;

    clarityLookupData.forEach(function (record) {
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
