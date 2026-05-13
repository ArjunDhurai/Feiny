// Add Row Function for Jewellery 1 Table - Jewellery 1 – Metal Details
function addJewellery1Row() {
  console.log("Adding Jewellery 1 row...");
  const tbody = document.getElementById("jewel1Body");

  const newRow = document.createElement("tr");
  newRow.className = "partner-row";
  newRow.innerHTML = `
  <td><input /></td>
                    <td>
                      <select id="select_contact">
                        <option value="">Select Contact</option>
                      </select>
                  </td>
                    <td>
                      <select id="select_metal_type">
                        <option value="">Select Metal Type</option>
                      </select>
                    </td>
                    <td>
                      <select id="select_color">
                        <option value="">Select Color</option>
                      </select>
                    </td>
                    
                        <td>
                    <select id="select_purity">
                      <option value="">Select Purity</option>
                    </select>
                  </td>
                    <td>
                      <select id="select_unit">
                        <option value="">Select Unit</option>
                      </select>
                    </td>
                    <td><input type="number" /></td>
                    <td><input type="number" /></td>
                    <td><input type="number" /></td>
                    <td><input /></td>
                    <td><input /></td>
                    <td><textarea></textarea></td>
        `;
  tbody.appendChild(newRow);
  loadContactLookup();
  loadMetalTypeLookup();
  loadColorLookup();
  loadPurityLookup();
  loadUnitLookup();
}

// Add Row Function for Jewellery 2 – Diamond Details

function addJewellery2Row() {
  console.log("Adding Jewellery 2 row...");
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
  console.log("Adding Jewellery 3 row...");
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
  loadUnitLookup();
  loadShapeLookup();
}

// Add Row Function for Jewellery 2 – Diamond Details
function addJewellery4Row() {
  console.log("Adding Jewellery 4 row...");
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
  console.log("Adding Jewellery 5 row...");
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
  loadContactLookup();
}
