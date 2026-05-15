/* ================= Contact LOOKUP ================= */
let contactLookupData = null;

function loadContactLookup(targetElement) {
  if (contactLookupData) {
    renderContactOptions(targetElement);
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Customers1",
  })
    .then(function (response) {
      if (response.data && response.data.length > 0) {
        contactLookupData = response.data;
        renderContactOptions(targetElement);
      }
    })
    .catch(function (error) {
      console.error("Contacts lookup error:", error);
    });
}

function renderContactOptions(targetElement) {
  const selects = targetElement
    ? [targetElement]
    : document.querySelectorAll(
        "#select_contact, .select_contact, #selectcontact, .selectcontact, .select_contact_j1_vendor , .jp_partner_select_contact",
      );

  selects.forEach(function (select) {
    if (!select) return;

    const selectedValue = select.value;
    select.innerHTML = '<option value="">Select Contact</option>';

    contactLookupData.forEach(function (record) {
      const option = document.createElement("option");
      option.value = record.ID;
      option.text =
        record.LegalName ||
        record.Legal_Name ||
        record.zc_display_value ||
        "No Name";

      if (selectedValue && selectedValue == record.ID) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  });
}
