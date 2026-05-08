/* ================= CONTACTS LOOKUP ================= */
function loadContactLookup() {
  // console.log("Loading contacts lookup...");

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Customers1",
  })
    .then(function (response) {
      const contactsSelect = document.getElementById("select_contact");
      const contactsSelect_Jewellery_Partnership = document.getElementById(
        "select_contact_Jewellery_Partnership",
      );

      contactsSelect.innerHTML = `<option value="">Select Contact</option>`;
      contactsSelect_Jewellery_Partnership.innerHTML = `<option value="">Select Contact</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Legal_Name;

        contactsSelect.appendChild(option);
        contactsSelect_Jewellery_Partnership.appendChild(
          option.cloneNode(true),
        );
      });
    })
    .catch(function (error) {
      console.error("Contacts lookup error:", error);
    });
}
