/* ================= JEWELLERY PARTNER LOOKUP ================= */

  let jewelpartnerList = [];

  function loadPartnerLookup() {
    ZOHO.CREATOR.DATA.getRecords({
      app_name: "feiny-app",
      report_name: "All_Customers1",
    })
      .then(function (response) {
        if (!response.data || response.data.length === 0) {
          console.warn("No Partner records found");
          return;
        }
        jewelpartnerList = response.data;
        populatePartnerDropdowns();
      })
      .catch(function (error) {
        console.error("Partner lookup error:", error);
        alert("Unable to load Partner lookup");
      });
  }

  function populatePartnerDropdowns() {
    document
      .querySelectorAll(".jp_partner select_contact, .jp_partner select_contact")
      .forEach(function (dropdown) {
        const selectedValue = dropdown.value;
        dropdown.innerHTML = '<option value="">Select Partner</option>';

        jewelpartnerList.forEach(function (record) {
          const option = document.createElement("option");
          option.value = record.ID;
          option.text =
            record.LegalName ||
            record.Legal_Name ||
            record.zc_display_value ||
            "No Name";

          if (selectedValue == record.ID) {
            option.selected = true;
          }

          dropdown.appendChild(option);
        });
      });
  }

  function addPartnerRow() {
    const tbody = document.getElementById("partnerBody");

    if (!tbody) {
      console.log("partnerBody not found");
      return;
    }

    const newRow = document.createElement("tr");
    newRow.className = "partner-row";

    newRow.innerHTML = `
          <td>
              <select class="jp_partner select_contact">
                  <option value="">Select Partner</option>
              </select>
          </td>

          <td>
              <input type="text" class="jp_shares">
          </td>

          <td>
              <input type="text" class="jp_partnership_percentage">
          </td>

          <td>
              <input type="text" class="jp_commission_percentage">
          </td>

          <td style="text-align:center">
              <input type="checkbox" class="jp_commission_itemization">
          </td>

          <td>
              <textarea class="jp_description"></textarea>
          </td>
      `;

    tbody.appendChild(newRow);

    if (typeof populatePartnerDropdowns === "function") {
      populatePartnerDropdowns();
    }
  }

  // Button Click
  document.addEventListener("DOMContentLoaded", function () {
    const addBtn = document.getElementById("addRowBtn");

    if (addBtn) {
      addBtn.addEventListener("click", addPartnerRow);
    }
  });
