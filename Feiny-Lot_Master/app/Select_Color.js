/* ================= COLOR LOOKUP ================= */
let colorLookupData = null;

function loadColorLookup(targetElement) {
  if (colorLookupData) {
    renderColorOptions(targetElement);
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Gold_Metal_Color",
  })
    .then(function (response) {
      if (response.data && response.data.length > 0) {
        colorLookupData = response.data;
        renderColorOptions(targetElement);
      }
    })
    .catch(function (error) {
      console.error("Color lookup error:", error);
    });
}

function renderColorOptions(targetElement) {
  const selects = targetElement ? [targetElement] : document.querySelectorAll("#select_color, .select_color");

  selects.forEach(function (select) {
    const selectedValue = select.value;
    select.innerHTML = `<option value="">Select Color</option>`;

    colorLookupData.forEach(function (record) {
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
