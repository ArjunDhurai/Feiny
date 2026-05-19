/* =================================================================================
    JEWELLERY — Lookups, Subform Rows, Data Collectors, Partnership
  ================================================================================= */

/* ================= BRAND LOOKUP ================= */
function loadBrandLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Brand" })
    .then(function (response) {
      const brandSelect = document.getElementById("brand");
      if (!brandSelect) return;
      brandSelect.innerHTML = `<option value="">Select Brand</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        brandSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Brand lookup error:", error);
    });
}

/* ================= JEWELLERY 2 SHAPE LOOKUP ================= */

let jewellery2ShapeCache = [];

function loadJewellery2ShapeLookup(targetSelect = null) {
  if (jewellery2ShapeCache.length > 0) {
    populateJewellery2Shape(targetSelect);
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Shape" })
    .then(function (response) {
      jewellery2ShapeCache = response.data || [];
      populateJewellery2Shape(targetSelect);
    })
    .catch(function (error) {
      console.error("Jewellery 2 Shape lookup error:", error);
    });
}

function populateJewellery2Shape(targetSelect = null) {
  const selects = targetSelect
    ? [targetSelect]
    : document.querySelectorAll(".j2-shape");

  selects.forEach(function (select) {
    if (select.dataset.loaded === "true") return;
    select.innerHTML = `<option value="">Select Shape</option>`;
    jewellery2ShapeCache.forEach(function (record) {
      const option = document.createElement("option");
      option.value = record.ID;
      option.text = record.Description1;
      select.appendChild(option);
    });
    select.dataset.loaded = "true";
  });
}

/* ================= JEWELLERY PARTNER LOOKUP ================= */

let jewelPartnerList = [];

function loadJewelleryPartnerLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "All_Customers1" })
    .then(function (response) {
      if (!response.data || response.data.length === 0) {
        console.warn("No Jewellery Partner records found");
        return;
      }
      jewelPartnerList = response.data;
      populateJewelleryPartnerDropdowns();
    })
    .catch(function (error) {
      console.error("Jewellery Partner lookup error:", error);
      alert("Unable to load Jewellery Partner lookup");
    });
}

function populateJewelleryPartnerDropdowns() {
  document.querySelectorAll(".jp_partner").forEach(function (dropdown) {
    const selectedValue = dropdown.value;
    dropdown.innerHTML = '<option value="">Select Partner</option>';
    jewelPartnerList.forEach(function (record) {
      const option = document.createElement("option");
      option.value = record.ID;
      option.text = record.LegalName || record.Legal_Name || record.zc_display_value || "No Name";
      if (selectedValue == record.ID) option.selected = true;
      dropdown.appendChild(option);
    });
  });
}

/* ================= JEWELLERY PARTNERSHIP ROW ================= */

function addJewelleryPartnershipRow() {
  const tbody = document.getElementById("jewelleryPartnershipBody");
  if (!tbody) {
    console.log("jewelleryPartnershipBody not found");
    return;
  }
  const newRow = document.createElement("tr");
  newRow.className = "jewellery-partnership-row";
  newRow.innerHTML = `
    <td><select class="jp_partner"><option value="">Select Partner</option></select></td>
    <td><input type="text" class="jp_shares"></td>
    <td><input type="text" class="jp_partnership_percentage"></td>
    <td><input type="text" class="jp_commission_percentage"></td>
    <td style="text-align:center"><input type="checkbox" class="jp_commission_itemization"></td>
    <td><textarea class="jp_description"></textarea></td>
    <td><button type="button" class="btn-delete-row" onclick="removeJewelleryPartnershipRow(this)">Remove</button></td>
  `;
  tbody.appendChild(newRow);
  if (typeof populateJewelleryPartnerDropdowns === "function") {
    populateJewelleryPartnerDropdowns();
  }
}

function removeJewelleryPartnershipRow(btn) {
  btn.closest("tr").remove();
}

document.addEventListener("DOMContentLoaded", function () {
  const addJewPartnerBtn = document.getElementById("addJewelleryPartnerBtn");
  if (addJewPartnerBtn) {
    addJewPartnerBtn.addEventListener("click", addJewelleryPartnershipRow);
  }
});

/* ================= JEWELLERY SUBFORM ROW — METAL DETAILS (1) ================= */

function addJewellery1Row() {
  const tbody = document.getElementById("jewel1Body");
  if (!tbody) return;
  const tr = document.createElement("tr");
  tr.classList.add("jewel1-row");
  tr.innerHTML = `
    <td><input type="text" class="j1-cast-no"></td>
    <td><select class="select_contact j1-vendor"><option value="">Select Contact</option></select></td>
    <td><select class="select_metal_type j1-metal-type"><option value="">Select Metal Type</option></select></td>
    <td><select class="select_color j1-metal-color"><option value="">Select Color</option></select></td>
    <td><select class="select_purity j1-metal-purity"><option value="">Select Purity</option></select></td>
    <td><select class="select_unit j1-unit"><option value="">Select Unit</option></select></td>
    <td><input type="number" class="j1-weight"></td>
    <td><input type="number" class="j1-qty"></td>
    <td><input type="number" class="j1-market"></td>
    <td><input type="text" class="j1-price"></td>
    <td><input type="text" class="j1-gold-cost"></td>
    <td><textarea class="j1-remarks"></textarea></td>
    <td><button type="button" onclick="removeRow(this)">❌</button></td>
  `;
  tbody.appendChild(tr);
}

/* ================= JEWELLERY SUBFORM ROW — DIAMOND DETAILS (2) ================= */

function addJewellery2Row() {
  const tbody = document.getElementById("jewel2Body");
  if (!tbody) return;
  const tr = document.createElement("tr");
  tr.classList.add("jewel2-row");
  tr.innerHTML = `
    <td><input type="text" class="j2-lot"></td>
    <td><select class="j2-shape"><option value="">Select Shape</option></select></td>
    <td><input type="text" class="j2-quality"></td>
    <td><input type="number" class="j2-stones"></td>
    <td><input type="number" class="j2-total-ct"></td>
    <td><input type="text" class="j2-price"></td>
    <td><input type="text" class="j2-cost"></td>
    <td><textarea class="j2-remarks"></textarea></td>
    <td><button type="button" onclick="removeRow(this)">❌</button></td>
  `;
  tbody.appendChild(tr);
  loadJewellery2ShapeLookup();
}

/* ================= JEWELLERY SUBFORM ROW — COLOR STONE (3) ================= */

function addJewellery3Row() {
  const tbody = document.getElementById("jewel3Body");
  if (!tbody) return;
  const tr = document.createElement("tr");
  tr.classList.add("jewel3-row");
  tr.innerHTML = `
    <td><input type="text" class="j3-lot"></td>
    <td><select class="j3-stone-type"><option value="">Select</option></select></td>
    <td><input type="text" class="j3-shape"></td>
    <td><input type="text" class="j3-quality"></td>
    <td><input type="text" class="j3-range"></td>
    <td><input type="number" class="j3-no-stones"></td>
    <td><input type="number" class="j3-wt-stone"></td>
    <td><input type="number" class="j3-ctwt"></td>
    <td><select class="select_unit j3-unit"><option value="">Select Unit</option></select></td>
    <td><input type="text" class="j3-cut"></td>
    <td><input type="text" class="j3-color"></td>
    <td><input type="text" class="j3-clarity"></td>
    <td><input type="text" class="j3-supplier"></td>
    <td><input type="text" class="j3-setter"></td>
    <td><input type="text" class="j3-price"></td>
    <td><input type="text" class="j3-cost"></td>
    <td><input type="checkbox" class="j3-cs"></td>
    <td><input type="checkbox" class="j3-duty"></td>
    <td><textarea class="j3-remarks"></textarea></td>
    <td><button type="button" onclick="removeRow(this)">❌</button></td>
  `;
  tbody.appendChild(tr);
}

/* ================= JEWELLERY SUBFORM ROW — LABOUR DETAILS (4) ================= */

function addJewellery4Row() {
  const tbody = document.getElementById("jewel4Body");
  if (!tbody) return;
  const tr = document.createElement("tr");
  tr.classList.add("jewel4-row");
  tr.innerHTML = `
    <td><input type="text" class="j4-labor-no"></td>
    <td><textarea class="j4-description"></textarea></td>
    <td><input type="text" class="j4-price"></td>
    <td><input type="number" class="j4-qty"></td>
    <td><input type="checkbox" class="j4-duty"></td>
    <td><input type="text" class="j4-amount"></td>
    <td><button type="button" onclick="removeRow(this)">❌</button></td>
  `;
  tbody.appendChild(tr);
}

/* ================= DATA COLLECTORS — JEWELLERY SUBFORMS ================= */

function getMetalDetailsRowsData() {
  const metalRows = [];
  document.querySelectorAll("#jewel1Body .jewel1-row").forEach(function (row) {
    metalRows.push({
      Cast_No: row.querySelector(".j1-cast-no")?.value || "",
      Vendor: row.querySelector(".j1-vendor")?.value || "",
      Metal_Type: row.querySelector(".j1-metal-type")?.value || "",
      Metal_Colour: row.querySelector(".j1-metal-color")?.value || "",
      Metal_Purity: row.querySelector(".j1-metal-purity")?.value || "",
      Unit: row.querySelector(".j1-unit")?.value || "",
      Weight: row.querySelector(".j1-weight")?.value || "",
      Quantity: row.querySelector(".j1-qty")?.value || "",
      Metal_Market: row.querySelector(".j1-market")?.value || "",
      Price: row.querySelector(".j1-price")?.value || "",
      Gold_Cost: row.querySelector(".j1-gold-cost")?.value || "",
      Remarks: row.querySelector(".j1-remarks")?.value || "",
    });
  });
  return metalRows;
}

function getJewelleryDiamondRowsData() {
  const jewelDiamondRows = [];
  document.querySelectorAll("#jewel2Body .jewel2-row").forEach(function (row) {
    jewelDiamondRows.push({
      Diamond_Lot: row.querySelector(".j2-lot")?.value || "",
      Shape: row.querySelector(".j2-shape")?.value || "",
      Quality: row.querySelector(".j2-quality")?.value || "",
      No_of_Stones: row.querySelector(".j2-stones")?.value || "",
      Total_Ct_Wt: row.querySelector(".j2-total-ct")?.value || "",
      Price: row.querySelector(".j2-price")?.value || "",
      Diamond_Cost: row.querySelector(".j2-cost")?.value || "",
      Remarks: row.querySelector(".j2-remarks")?.value || "",
    });
  });
  return jewelDiamondRows;
}

function getJewelleryColorStoneRowsData() {
  const jewelColorStoneRows = [];
  document.querySelectorAll("#jewel3Body .jewel3-row").forEach(function (row) {
    jewelColorStoneRows.push({
      Lot: row.querySelector(".j3-lot")?.value || "",
      Stone_Type: row.querySelector(".j3-stone-type")?.value || "",
      Shape: row.querySelector(".j3-shape")?.value || "",
      Quality: row.querySelector(".j3-quality")?.value || "",
      Range: row.querySelector(".j3-range")?.value || "",
      No_Stones: row.querySelector(".j3-no-stones")?.value || "",
      Wt_Per_Stone: row.querySelector(".j3-wt-stone")?.value || "",
      CT_WT: row.querySelector(".j3-ctwt")?.value || "",
      Unit: row.querySelector(".j3-unit")?.value || "",
      Cut: row.querySelector(".j3-cut")?.value || "",
      Stone_Color: row.querySelector(".j3-color")?.value || "",
      Stone_Clarity: row.querySelector(".j3-clarity")?.value || "",
      Supplier: row.querySelector(".j3-supplier")?.value || "",
      Setter: row.querySelector(".j3-setter")?.value || "",
      Price: row.querySelector(".j3-price")?.value || "",
      Stone_Cost: row.querySelector(".j3-cost")?.value || "",
      C_S: row.querySelector(".j3-cs")?.checked || false,
      Duty: row.querySelector(".j3-duty")?.checked || false,
      Remarks: row.querySelector(".j3-remarks")?.value || "",
    });
  });
  return jewelColorStoneRows;
}

function getLabourDetailsRowsData() {
  const labourRows = [];
  document.querySelectorAll("#jewel4Body .jewel4-row").forEach(function (row) {
    labourRows.push({
      Labor: row.querySelector(".j4-labor-no")?.value || "",
      Description: row.querySelector(".j4-description")?.value || "",
      Price: row.querySelector(".j4-price")?.value || "",
      Qty: row.querySelector(".j4-qty")?.value || "",
      Duty: row.querySelector(".j4-duty")?.checked || false,
      Amount: row.querySelector(".j4-amount")?.value || "",
    });
  });
  return labourRows;
}

function getJewelleryPartnershipRowsData() {
  const jewelPartnerRows = [];
  document.querySelectorAll("#jewelleryPartnershipBody .jewellery-partnership-row").forEach(function (row) {
    jewelPartnerRows.push({
      Partner_Name:
        row.querySelector(".jp_partner")?.value ||
        row.querySelector(".jp_partner")?.ID || "",
      Partnership_shares: row.querySelector(".jp_shares")?.value || "",
      Partnership: row.querySelector(".jp_partnership_percentage")?.value || "",
      Commission: row.querySelector(".jp_commission_percentage")?.value || "",
      Description: row.querySelector(".jp_description")?.value || "",
      Commission_Itemized_on_Invoice:
        row.querySelector(".jp_commission_itemization")?.checked || false,
    });
  });
  return jewelPartnerRows;
}
