/* ================= JEWELLERY PARTNER LOOKUP ================= */

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
              <select class="partnerdatalookup">
                  <option value="">Select Contact</option>
              </select>
          </td>

          <td>
              <input type="text" class="partner-share">
          </td>

          <td>
              <input type="text" class="partner-percent">
          </td>

          <td>
              <input type="text" class="commission-percent">
          </td>

          <td style="text-align:center">
              <input type="checkbox" class="commission-itemized">
          </td>

          <td>
              <textarea class="jp_description"></textarea>
          </td>
          <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
      `;

    tbody.appendChild(newRow);

    // Assuming populatePartnerDropdowns is globally available from mainJSFile.js
    if (typeof populatePartnerDropdowns === 'function') {
      populatePartnerDropdowns(newRow.querySelector('.partnerdatalookup'));
    }
  }

  // Button Click
  document.addEventListener("DOMContentLoaded", function () {
    const addBtn = document.getElementById("addRowBtn");

    if (addBtn) {
      // addBtn.addEventListener("click", addPartnerRow); // This event listener is likely for Jewellery Partnership, not general partnerBody. addPartnerRow is called directly from HTML.
    }
  });
