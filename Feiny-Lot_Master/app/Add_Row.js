// Add Row Function for Jewellery 1 Table - Jewellery 1 – Metal Details
function addJewellery1Row() {
  // // console.log("Adding Jewellery 1 row...");
  const tbody = document.getElementById("jewel1Body");

  const newRow = document.createElement("tr");
  newRow.className = "jewel1-row";
  newRow.innerHTML = `
    <td><input type="text" class="j1-cast-no" /></td>
    <td>
      <select class="select_contact j1-vendor">
        <option value="">Select Contact</option>
      </select>
    </td>
    <td>
      <select class="select_metal_type j1-metal-type">
        <option value="">Select Metal Type</option>
      </select>
    </td>
    <td>
      <select class="select_color j1-metal-color">
        <option value="">Select Color</option>
      </select>
    </td>
    <td>
      <select class="select_purity j1-metal-purity">
        <option value="">Select Purity</option>
      </select>
    </td>
    <td>
      <select class="select_unit j1-unit">
        <option value="">Select Unit</option>
      </select>
    </td>
    <td><input type="number" class="j1-weight" /></td>
    <td><input type="number" class="j1-qty" /></td>
    <td><input type="number" class="j1-market" /></td>
    <td><input type="text" class="j1-price" /></td>
    <td><input type="text" class="j1-gold-cost" /></td>
    <td><textarea class="j1-remarks"></textarea></td>
  `;
        `;
  tbody.appendChild(newRow);

  if (typeof loadContactLookup === "function") loadContactLookup(newRow.querySelector(".j1-vendor"));
  if (typeof loadMetalTypeLookup === "function") loadMetalTypeLookup(newRow.querySelector(".j1-metal-type"));
  if (typeof loadColorLookup === "function") loadColorLookup(newRow.querySelector(".j1-metal-color"));
  if (typeof loadPurityLookup === "function") loadPurityLookup(newRow.querySelector(".j1-metal-purity"));
  if (typeof loadUnitLookup === "function") loadUnitLookup(newRow.querySelector(".j1-unit"));
  loadContactLookup(newRow.querySelector(".select_contact"));
  loadMetalTypeLookup(newRow.querySelector(".select_metal_type"));
  loadColorLookup(newRow.querySelector(".select_color"));
  loadPurityLookup(newRow.querySelector(".select_purity"));
  loadUnitLookup(newRow.querySelector(".select_unit"));
}

// Add Row Function for Jewellery 2 – Diamond Details

function addJewellery2Row() {
  // console.log("Adding Jewellery 2 row...");
  const tbody = document.getElementById("jewel2Body");

  const newRow = document.createElement("tr");
  newRow.className = "jewel2-row";
  newRow.innerHTML = `
    <td><input type="text" class="j2-lot" /></td>
    <td>
      <select class="select_shape j2-shape">
        <option value="">Select Shape</option>
      </select>
    </td>
    <td><input type="text" class="j2-quality" /></td>
    <td><input type="number" class="j2-stones" /></td>
    <td><input type="number" class="j2-total-ct" /></td>
    <td><input type="text" class="j2-price" /></td>
    <td><input type="text" class="j2-cost" /></td>
    <td><textarea class="j2-remarks"></textarea></td>
  `;
        `;
  tbody.appendChild(newRow);

  // Use cached render if available, otherwise load
  if (typeof renderShapeOptions === "function") {
    renderShapeOptions(newRow.querySelector(".j2-shape"));
  } else if (typeof loadShapeLookup === "function") {
    loadShapeLookup(newRow.querySelector(".j2-shape"));
  }
  loadShapeLookup(newRow.querySelector(".select_shape"));
}

// Add Row Function for Jewellery 3 – Color Stone
// Add Row Function for Jewellery 2 – Diamond Details
function addJewellery3Row() {
  // console.log("Adding Jewellery 3 row...");
  const tbody = document.getElementById("jewel3Body");

  const newRow = document.createElement("tr");
  newRow.className = "jewel3-row";
  newRow.innerHTML = `
    <td><input type="text" class="j3-lot" /></td>
    <td>
      <select class="j3-stone-type">
        <option value="">Select</option>
      </select>
    </td>
    <td>
      <select class="select_shape">
        <option value="">Select Shape</option>
      </select>
    </td>
    <td><input type="text" class="j3-quality" /></td>
    <td><input type="text" class="j3-range" /></td>
    <td><input type="number" class="j3-no-stones" /></td>
    <td><input type="number" class="j3-wt-stone" /></td>
    <td><input type="number" class="j3-ctwt" /></td>
    <td>
      <select class="select_unit j3-unit">
        <option value="">Select Unit</option>
      </select>
    </td>
    <td>
      <select class="Select_Cut j3-cut">
        <option value="">Select Cut</option>
      </select>
    </td>
    <td>
      <select class="Select_Stone_Color j3-color">
        <option value="">Select Stone Color</option>
      </select>
    </td>
    <td>
      <select class="Select_Clarity_j3-clarity">
        <option value="">Select Clarity</option>
      </select>
    </td>
    <td>
      <select class="j3-supplier">
        <option value="">Select Supplier</option>
      </select>
    </td>
    <td>
      <select class="j3-setter">
        <option value="">Select Setter</option>
      </select>
    </td>
    <td><input type="text" class="j3-price" /></td>
    <td><input type="text" class="j3-cost" /></td>
    <td><input type="checkbox" class="j3-cs" /></td>
    <td><input type="checkbox" class="j3-duty" /></td>
    <td><textarea class="j3-remarks"></textarea></td>
  `;
                  <td><input class="j3-lot" /></td>
                  <td><select class="j3-stone-type"></select></td>
                  <td>
                  <select class="select_shape">
                    <option value="">Select Shape</option>
                  </select>
                </td>
                  <td><input class="j3-quality" /></td>
                  <td><input class="j3-range" /></td>
                  <td><input class="j3-no-stones" /></td>
                  <td><input class="j3-wt-stone" /></td>
                  <td><input class="j3-ctwt" /></td>
                  <td><select class="select_unit j3-unit">
                        <option value="">Select Unit</option>
                      </select></td>
                  <td><select class="Select_Cut j3-cut"></select></td>
                  <td><select class="Select_Stone_Color j3-color"></select></td>
                  <td><select class="Select_Clarity_j3-clarity j3-clarity"></select></td>
                  <td><select class="j3-supplier"></select></td>
                  <td><select class="j3-setter"></select></td>
                  <td><input class="j3-price" /></td>
                  <td><input class="j3-cost" /></td>
                  <td><input type="checkbox" class="j3-cs" /></td>
                  <td><input type="checkbox" class="j3-duty" /></td>
                  <td><textarea class="j3-remarks"></textarea></td>
                  <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
                
        `;
  tbody.appendChild(newRow);

  if (typeof loadUnitLookup === "function") loadUnitLookup(newRow.querySelector(".j3-unit"));
  if (typeof loadCutLookup === "function") loadCutLookup(newRow.querySelector(".j3-cut"));
  if (typeof loadColorLookup === "function") loadColorLookup(newRow.querySelector(".j3-color"));
  if (typeof loadClarityLookup === "function") loadClarityLookup(newRow.querySelector(".Select_Clarity_j3-clarity"));
  if (typeof loadContactLookup === "function") {
    loadContactLookup(newRow.querySelector(".j3-supplier"));
    loadContactLookup(newRow.querySelector(".j3-setter"));
  }
  if (typeof renderShapeOptions === "function") {
    renderShapeOptions(newRow.querySelector(".select_shape"));
  } else if (typeof loadShapeLookup === "function") {
    loadShapeLookup(newRow.querySelector(".select_shape"));
  }
  loadUnitLookup(newRow.querySelector(".select_unit"));
  loadShapeLookup(newRow.querySelector(".select_shape"));
}

// Add Row Function for Jewellery 4 – Labour
// Add Row Function for Jewellery 2 – Diamond Details
function addJewellery4Row() {
  // console.log("Adding Jewellery 4 row...");
  const tbody = document.getElementById("jewel4Body");

  const newRow = document.createElement("tr");
  newRow.className = "jewel4-row";
  newRow.innerHTML = `
    <td><input type="text" class="j4-labor-no" /></td>
    <td><textarea class="j4-description"></textarea></td>
    <td><input type="text" class="j4-price" /></td>
    <td><input type="number" class="j4-qty" /></td>
    <td><input type="checkbox" class="j4-duty" /></td>
    <td><input type="text" class="j4-amount" /></td>
  `;
                  <td><input class="j4-labor-no" /></td>
                  <td><textarea class="j4-description"></textarea></td>
                  <td><input class="j4-price" /></td>
                  <td><input class="j4-qty" /></td>
                  <td><input type="checkbox" class="j4-duty" /></td>
                  <td><input class="j4-amount" /></td>
                  <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
                
        `;
  tbody.appendChild(newRow);
}

// Add Row Function for Jewellery Partnership Details
function addJewelleryPartnershipRow() {
  // console.log("Adding Jewellery 5 row...");
  const tbody = document.getElementById("jewelleryPartnershipBody");

  const newRow = document.createElement("tr");
  newRow.className = "jewellery-partnership-row";
  newRow.innerHTML = `
    <td>
      <select class="jp_partner_select_contact">
        <option value="">Select Contact</option>
      </select>
        <select class="jp_partner_select_contact">
          <option value="">Select Contact</option>
        </select>
    </td>
    <td><input type="text" class="jp_shares" /></td>
    <td><input type="text" class="jp_partnership_percentage" /></td>
    <td><input type="text" class="jp_commission_percentage" /></td>
    <td class="checkbox-cell"><input type="checkbox" class="jp_commission_itemization" /></td>
    <td><textarea class="jp_description"></textarea></td>
    <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
  `;
        `;
  tbody.appendChild(newRow);

  if (typeof populatePartnerDropdowns === "function") {
  if (typeof populatePartnerDropdowns === 'function') {
    populatePartnerDropdowns(newRow.querySelector(".jp_partner_select_contact"));
  }
}
