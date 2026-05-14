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
  tbody.appendChild(newRow);

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
  tbody.appendChild(newRow);
  loadShapeLookup(newRow.querySelector(".select_shape"));
}

// Add Row Function for Jewellery 2 – Diamond Details
function addJewellery3Row() {
  // console.log("Adding Jewellery 3 row...");
  const tbody = document.getElementById("jewel3Body");

  const newRow = document.createElement("tr");
  newRow.className = "partner-row";
  newRow.innerHTML = `
              
                  <td><input /></td>
                  <td><select></select></td>
                                                    <td>
                  <select class="select_shape">
                    <option value="">Select Shape</option>
                  </select>
                </td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><select id="select_unit">
                        <option value="">Select Unit</option>
                      </select></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input type="checkbox" /></td>
                  <td><input type="checkbox" /></td>
                  <td><textarea></textarea></td>
                
        `;
  tbody.appendChild(newRow);
  loadUnitLookup(newRow.querySelector(".select_unit"));
  loadShapeLookup(newRow.querySelector(".select_shape"));
}

// Add Row Function for Jewellery 2 – Diamond Details
function addJewellery4Row() {
  // console.log("Adding Jewellery 4 row...");
  const tbody = document.getElementById("jewel4Body");

  const newRow = document.createElement("tr");
  newRow.className = "partner-row";
  newRow.innerHTML = `
              
                  <td><input /></td>
                  <td><textarea></textarea></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input type="checkbox" /></td>
                  <td><input /></td>
                
        `;
  tbody.appendChild(newRow);
}

// Add Row Function for Jewellery Partnership Details
function addJewellerypartnershipRow() {
  // console.log("Adding Jewellery 5 row...");
  const tbody = document.getElementById("subform-body");

  const newRow = document.createElement("tr");
  newRow.className = "partner-row";
  newRow.innerHTML = `
              <td>
                                        <select id="select_contact">
                        <option value="">Select Contact</option>
                      </select>
                  </td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input /></td>
                  <td><input type="checkbox" /></td>
                  <td><textarea></textarea></td>
                
        `;
  tbody.appendChild(newRow);
  loadContactLookup(newRow.querySelector(".select_contact"));
}
