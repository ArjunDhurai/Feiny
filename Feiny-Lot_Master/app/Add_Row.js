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
}
