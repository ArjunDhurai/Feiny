function loadContactLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Customers1",
  })
    .then(function (response) {
      if (!response.data || response.data.length === 0) return;

      // Fill ALL select_contact elements (classes + IDs)
      const allContactSelects = document.querySelectorAll(
        "#select_contact, .select_contact, #select_contact_Jewellery_Partnership",
      );

      allContactSelects.forEach(function (select) {
        select.innerHTML = `<option value="">Select Contact</option>`;

        response.data.forEach(function (record) {
          const option = document.createElement("option");
          option.value = record.ID;
          option.text = record.Legal_Name;
          select.appendChild(option.cloneNode(true));
        });
      });
    })
    .catch(function (error) {
      console.error("Contacts lookup error:", error);
    });
}
