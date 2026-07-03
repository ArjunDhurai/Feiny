// Add Row utilities for Jewellery subforms
function safeAppendRow(tbodyId, html) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return null;
  const tr = document.createElement('tr');
  tr.innerHTML = html;
  tbody.appendChild(tr);
  return tr;
}

function addJewellery1Row() {
  const html = `
    <td><input type="text" class="j1-cast-no" /></td>
    <td><select class="select_contact j1-vendor"><option value="">Select Contact</option></select></td>
    <td><select class="select_metal_type j1-metal-type"><option value="">Select Metal Type</option></select></td>
    <td><select class="select_color j1-metal-color"><option value="">Select Color</option></select></td>
    <td><select class="select_purity j1-metal-purity"><option value="">Select Purity</option></select></td>
    <td><select class="select_unit j1-unit"><option value="">Select Unit</option></select></td>
    <td><input type="number" class="j1-weight" /></td>
    <td><input type="number" class="j1-qty" /></td>
    <td><input type="number" class="j1-market" /></td>
    <td><input type="text" class="j1-price" /></td>
    <td><input type="text" class="j1-gold-cost" /></td>
    <td><textarea class="j1-remarks"></textarea></td>
    <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
  `;
  const tr = safeAppendRow('jewel1Body', html);
  if (!tr) return;
  if (typeof loadContactLookup === 'function') loadContactLookup(tr.querySelector('.j1-vendor'));
  if (typeof loadMetalTypeLookup === 'function') loadMetalTypeLookup(tr.querySelector('.j1-metal-type'));
  if (typeof loadColorLookup === 'function') loadColorLookup(tr.querySelector('.j1-metal-color'));
  if (typeof loadPurityLookup === 'function') loadPurityLookup(tr.querySelector('.j1-metal-purity'));
  if (typeof loadUnitLookup === 'function') loadUnitLookup(tr.querySelector('.j1-unit'));
}

function addJewellery2Row() {
  const html = `
    <td><input type="text" class="j2-lot" /></td>
    <td><select class="select_shape j2-shape"><option value="">Select Shape</option></select></td>
    <td><input type="text" class="j2-quality" /></td>
    <td><input type="number" class="j2-stones" /></td>
    <td><input type="number" class="j2-total-ct" /></td>
    <td><input type="text" class="j2-price" /></td>
    <td><input type="text" class="j2-cost" /></td>
    <td><textarea class="j2-remarks"></textarea></td>
    <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
  `;
  const tr = safeAppendRow('jewel2Body', html);
  if (!tr) return;
  if (typeof renderShapeOptions === 'function') renderShapeOptions(tr.querySelector('.j2-shape'));
  else if (typeof loadShapeLookup === 'function') loadShapeLookup(tr.querySelector('.j2-shape'));
}

function addJewellery3Row() {
  const html = `
    <td><input type="text" class="j3-lot" /></td>
    <td><select class="j3-stone-type"><option value="">Select</option></select></td>
    <td><select class="select_shape"><option value="">Select Shape</option></select></td>
    <td><input type="text" class="j3-quality" /></td>
    <td><input type="text" class="j3-range" /></td>
    <td><input type="number" class="j3-no-stones" /></td>
    <td><input type="number" class="j3-wt-stone" /></td>
    <td><input type="number" class="j3-ctwt" /></td>
    <td><select class="select_unit j3-unit"><option value="">Select Unit</option></select></td>
    <td><select class="Select_Cut j3-cut"><option value="">Select Cut</option></select></td>
    <td><select class="Select_Stone_Color j3-color"><option value="">Select Stone Color</option></select></td>
    <td><select class="Select_Clarity_j3-clarity"><option value="">Select Clarity</option></select></td>
    <td><select class="j3-supplier"><option value="">Select Supplier</option></select></td>
    <td><select class="j3-setter"><option value="">Select Setter</option></select></td>
    <td><input type="text" class="j3-price" /></td>
    <td><input type="text" class="j3-cost" /></td>
    <td><input type="checkbox" class="j3-cs" /></td>
    <td><input type="checkbox" class="j3-duty" /></td>
    <td><textarea class="j3-remarks"></textarea></td>
    <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
  `;
  const tr = safeAppendRow('jewel3Body', html);
  if (!tr) return;
  if (typeof loadUnitLookup === 'function') loadUnitLookup(tr.querySelector('.j3-unit'));
  if (typeof loadCutLookup === 'function') loadCutLookup(tr.querySelector('.j3-cut'));
  if (typeof loadColorLookup === 'function') loadColorLookup(tr.querySelector('.j3-color'));
  if (typeof loadClarityLookup === 'function') loadClarityLookup(tr.querySelector('.Select_Clarity_j3-clarity'));
  if (typeof loadContactLookup === 'function') {
    loadContactLookup(tr.querySelector('.j3-supplier'));
    loadContactLookup(tr.querySelector('.j3-setter'));
  }
  if (typeof renderShapeOptions === 'function') renderShapeOptions(tr.querySelector('.select_shape'));
  else if (typeof loadShapeLookup === 'function') loadShapeLookup(tr.querySelector('.select_shape'));
}

function addJewellery4Row() {
  const html = `
    <td><input type="text" class="j4-labor-no" /></td>
    <td><textarea class="j4-description"></textarea></td>
    <td><input type="text" class="j4-price" /></td>
    <td><input type="number" class="j4-qty" /></td>
    <td><input type="checkbox" class="j4-duty" /></td>
    <td><input type="text" class="j4-amount" /></td>
    <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
  `;
  safeAppendRow('jewel4Body', html);
}

function addJewelleryPartnershipRow() {
  const html = `
    <td><select class="jp_partner_select_contact"><option value="">Select Contact</option></select></td>
    <td><input type="number" class="jp_shares" step="0.01" /></td>
    <td><input type="number" class="jp_partnership_percentage" step="0.01" /></td>
    <td><input type="number" class="jp_commission_percentage" step="0.01" /></td>
    <td class="checkbox-cell"><input type="checkbox" class="jp_commission_itemization" /></td>
    <td><textarea class="jp_description"></textarea></td>
    <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
  `;
  const tr = safeAppendRow('jewelleryPartnershipBody', html);
  if (!tr) return;
  if (typeof populatePartnerDropdowns === 'function') populatePartnerDropdowns(tr.querySelector('.jp_partner_select_contact'));
}
