/* =================================================================================
    GLOBALS (shared across all modules)
  ================================================================================= */

let certificateLookupCache = {
  labs: [],
  descriptors: [],
  supplements: [],
};
let certificateFiles = new Map();
let certificateFilesToUpload = [];
let diaImageFile = null;
let stoneImageFile = null;
let speciesMap = {};
let isApplying = false;
let lot_edit = false;
let recId = null;

/* =================================================================================
    INIT — LOOKUP CALLS ON DOM READY
  ================================================================================= */

document.addEventListener("DOMContentLoaded", function () {
  loadJewelleryTypeLookup();
  loadOriginCountryDropdown();
  loadContactLookup();
  loadMetalTypeLookup();
  loadColorLookup();
  loadDiamondLookup();
  loadUnitLookup();
  loadBrandLookup();
  loadCodeLookup();
  loadPurityLookup();
  loadShapeLookup();
});

document.addEventListener("DOMContentLoaded", function () {

  /* ================= GET RECORD ID FROM URL ================= */
  ZOHO.CREATOR.UTIL.getQueryParams().then(function (params) {
    recId = params.recId;
    if (recId) {
      lot_edit = true;
      loadExistingRecord(recId);
    }
  });

  /* ================= SECTION VISIBILITY ================= */

  function getElements() {
    return {
      itemTypeEl: document.getElementById("itemType"),
      colorStoneSection: document.getElementById("colorStoneSection"),
      diamondSection: document.getElementById("diamondSection"),
      jewelleryWrapper: document.getElementById("jewelleryWrapper"),
      pricingSection: document.getElementById("pricingSection"),
      Dimensionssection: document.getElementById("Dimensionssection"),
      neededcertificatesec: document.getElementById("neededcertificatesec"),
      certificateuploadsec: document.getElementById("certificateuploadsec"),
      partnershipsec: document.getElementById("partnershipsec"),
      Jewellery_1_Metal_Details: document.getElementById("Jewellery_1_Metal_Details"),
      Jewellery_2_Diamond_Details: document.getElementById("Jewellery_2_Diamond_Details"),
      Jewellery_3_Color_Stone: document.getElementById("Jewellery_3_Color_Stone"),
      Jewellery_4_Labour: document.getElementById("Jewellery_4_Labour"),
      Jewellery_Cost_Summary: document.getElementById("Jewellery_Cost_Summary"),
      Jewellery_Partnership: document.getElementById("Jewellery_Partnership"),
    };
  }

  function hide(el) {
    if (el) el.style.setProperty("display", "none", "important");
  }

  function show(el) {
    if (el) el.style.setProperty("display", "block", "important");
  }

  function applyVisibility() {
    isApplying = true;

    const {
      itemTypeEl,
      colorStoneSection,
      diamondSection,
      jewelleryWrapper,
      pricingSection,
      Dimensionssection,
      neededcertificatesec,
      certificateuploadsec,
      partnershipsec,
      Jewellery_1_Metal_Details,
      Jewellery_2_Diamond_Details,
      Jewellery_3_Color_Stone,
      Jewellery_4_Labour,
      Jewellery_Cost_Summary,
      Jewellery_Partnership,
    } = getElements();

    hide(colorStoneSection);
    hide(diamondSection);
    hide(jewelleryWrapper);
    hide(pricingSection);
    hide(Dimensionssection);
    hide(neededcertificatesec);
    hide(partnershipsec);
    hide(Jewellery_1_Metal_Details);
    hide(Jewellery_2_Diamond_Details);
    hide(Jewellery_3_Color_Stone);
    hide(Jewellery_4_Labour);
    hide(Jewellery_Cost_Summary);
    hide(Jewellery_Partnership);

    if (!itemTypeEl) {
      isApplying = false;
      return;
    }

    const selectedValue = itemTypeEl.value.trim();

    if (selectedValue === "Color Stone") {
      show(colorStoneSection);
      show(pricingSection);
      show(Dimensionssection);
      show(neededcertificatesec);
      show(certificateuploadsec);
      show(partnershipsec);
    } else if (selectedValue === "Diamond") {
      show(diamondSection);
      show(certificateuploadsec);
      show(neededcertificatesec);
      show(partnershipsec);
    } else if (selectedValue === "Jewellery") {
      show(jewelleryWrapper);
      show(Jewellery_1_Metal_Details);
      show(Jewellery_2_Diamond_Details);
      show(Jewellery_3_Color_Stone);
      show(certificateuploadsec);
      show(Jewellery_4_Labour);
      show(Jewellery_Cost_Summary);
      show(Jewellery_Partnership);
    }

    setTimeout(() => {
      isApplying = false;
    }, 50);
  }

  setTimeout(applyVisibility, 300);

  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "itemType") {
      setTimeout(applyVisibility, 100);
    }
  });

  const observer = new MutationObserver(function () {
    if (document.getElementById("itemType")) {
      setTimeout(applyVisibility, 100);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  /* ================= LOOKUP CALLS ================= */

  typeof loadUnitLookup === "function" && loadUnitLookup();
  typeof loadTreatmentLookup === "function" && loadTreatmentLookup();
  typeof loadShapeLookup === "function" && loadShapeLookup();
  typeof loadSpeciesLookup === "function" && loadSpeciesLookup();
  typeof loadSurfaceLookup === "function" && loadSurfaceLookup();
  typeof loadCountryDropdown === "function" && loadCountryDropdown();
  typeof loadCountrycutDropdown === "function" && loadCountrycutDropdown();
  typeof loadDiaColorLookup === "function" && loadDiaColorLookup();
  typeof loadDiaClarityLookup === "function" && loadDiaClarityLookup();
  typeof loadDiaCutLookup === "function" && loadDiaCutLookup();
  typeof loadDiaPolishLookup === "function" && loadDiaPolishLookup();
  typeof loadDiaSymmetryLookup === "function" && loadDiaSymmetryLookup();
  typeof loadDiaCuletLookup === "function" && loadDiaCuletLookup();
  typeof loadDiaFluorescenceLookup === "function" && loadDiaFluorescenceLookup();
  typeof loadDiaFluorescenceColorLookup === "function" && loadDiaFluorescenceColorLookup();
  typeof loaddiaShapeLookup === "function" && loaddiaShapeLookup();
  typeof loadJewellery2ShapeLookup === "function" && loadJewellery2ShapeLookup();
  typeof loadPartnerLookup === "function" && loadPartnerLookup();
  typeof loadJewelleryPartnerLookup === "function" && loadJewelleryPartnerLookup();
  typeof loadPartnerdataLookup === "function" && loadPartnerdataLookup();
  typeof initTotalCalculation === "function" && initTotalCalculation();
  typeof initRapportPriceTriggers === "function" && initRapportPriceTriggers();
  typeof loadCertificateSubformLookups === "function" && loadCertificateSubformLookups();
});

/* =================================================================================
    HELPER FUNCTIONS
  ================================================================================= */

function getNumber(id) {
  let val = document.getElementById(id)?.value;
  if (!val) return null;
  val = val.trim().replace(",", ".");
  const num = Number(val);
  return isNaN(num) ? null : num;
}

function formatToYYYYMMDD(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("T")) return dateStr.split("T")[0];
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [day, monthStr, year] = parts;
      const months = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04",
        May: "05", Jun: "06", Jul: "07", Aug: "08",
        Sep: "09", Oct: "10", Nov: "11", Dec: "12",
      };
      const month = months[monthStr];
      if (month) return `${year}-${month}-${day.padStart(2, "0")}`;
    }
  }
  return "";
}

function removeRow(btn) {
  btn.closest("tr").remove();
}

/* =================================================================================
    UNIT LOOKUP (shared — used by color stone pricing and jewellery)
  ================================================================================= */

function loadUnitLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Unit" })
    .then(function (response) {
      const unitSelect = document.getElementById("unit_lookup");
      if (!unitSelect) return;
      unitSelect.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        unitSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Unit lookup error:", error);
    });
}

/* =================================================================================
    PARTNER LOOKUP (shared — used by color stone and diamond)
  ================================================================================= */

let partnerList = [];

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
      partnerList = response.data;
      populatePartnerDropdowns();
    })
    .catch(function (error) {
      console.error("Partner lookup error:", error);
      alert("Unable to load Partner lookup");
    });
}

function populatePartnerDropdowns() {
  document.querySelectorAll(".partnerlookup, .partnerdatalookup").forEach(function (dropdown) {
    const selectedValue = dropdown.value;
    dropdown.innerHTML = '<option value="">Select Partner</option>';
    partnerList.forEach(function (record) {
      const option = document.createElement("option");
      option.value = record.ID;
      option.text = record.LegalName || record.Legal_Name || record.zc_display_value || "No Name";
      if (selectedValue == record.ID) option.selected = true;
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
    <td><select class="partnerdatalookup"><option value="">Select Partner</option></select></td>
    <td><input type="text" class="partner-share"></td>
    <td><input type="text" class="partner-percent"></td>
    <td><input type="text" class="commission-percent"></td>
    <td style="text-align:center"><input type="checkbox" class="commission-itemized"></td>
    <td><textarea class="partner-desc"></textarea></td>
  `;
  tbody.appendChild(newRow);
  if (typeof populatePartnerDropdowns === "function") {
    populatePartnerDropdowns();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("addRowBtn");
  if (addBtn) addBtn.addEventListener("click", addPartnerRow);
});

function getPartnerRowsData() {
  const partnerRows = [];
  document.querySelectorAll("#partnerBody .partner-row").forEach(function (row) {
    partnerRows.push({
      Partner_Name:
        row.querySelector(".partnerdatalookup")?.ID ||
        row.querySelector(".partnerdatalookup")?.value || "",
      Partnership_shares: row.querySelector(".partner-share")?.value || "",
      Partnership: row.querySelector(".partner-percent")?.value || "",
      Commission: row.querySelector(".commission-percent")?.value || "",
      Description: row.querySelector(".partner-desc")?.value || "",
      Commission_Itemized_on_Invoice: row.querySelector(".commission-itemized")?.checked || false,
    });
  });
  return partnerRows;
}

/* =================================================================================
    CERTIFICATE SUBFORM (shared — used by all three categories)
  ================================================================================= */

function loadCertificateSubformLookups() {
  return Promise.all([
    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "All_Labs" }),
    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Lab_Descriptor_Report" }),
    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "All_Laboratory_Supplements" }),
  ])
    .then(function ([labsRes, descriptorsRes, supplementsRes]) {
      certificateLookupCache.labs = labsRes.data || [];
      certificateLookupCache.descriptors = descriptorsRes.data || [];
      certificateLookupCache.supplements = supplementsRes.data || [];
      const tableBody = document.getElementById("certificateBody");
      if (!tableBody) return;
      Array.from(tableBody.rows).forEach(function (row) {
        populateRowSelects(row);
      });
    })
    .catch(function (err) {
      console.error("Certificate subform lookup error:", err);
    });
}

function populateRowSelects(row) {
  const labSelect = row.querySelector(".cert-lab");
  const labDescSelect = row.querySelector(".cert-lab-desc");
  const labSupSelect = row.querySelector(".cert-lab-sup");
  if (labSelect && labSelect.options.length <= 1)
    fillSelect(labSelect, certificateLookupCache.labs, "Lab");
  if (labDescSelect && labDescSelect.options.length <= 1)
    fillSelect(labDescSelect, certificateLookupCache.descriptors, "Lab_Descriptor");
  if (labSupSelect && labSupSelect.options.length <= 1)
    fillSelect(labSupSelect, certificateLookupCache.supplements, "Laboratory_Supplement");
}

function fillSelect(select, data, fieldName) {
  if (select.options.length > 1) return;
  select.innerHTML = `<option value="">Select</option>`;
  data.forEach(function (rec) {
    const opt = document.createElement("option");
    opt.value = rec.ID;
    opt.text = rec[fieldName] || "";
    select.appendChild(opt);
  });
}

function addCertificateRow() {
  const tbody = document.getElementById("certificateBody");
  if (!tbody) return;
  const tr = document.createElement("tr");
  tr.classList.add("cert-row");
  tr.innerHTML = `
    <td><button type="button" onclick="removeRow(this)">❌</button></td>
    <td><input class="cert-id"></td>
    <td><input type="file" class="cert-file"></td>
    <td><input type="date" class="cert-date"></td>
    <td><textarea class="cert-notes"></textarea></td>
    <td><select class="cert-lab"></select></td>
    <td><select class="cert-lab-desc"></select></td>
    <td><select class="cert-lab-sup"></select></td>
    <td><input type="text" class="cert-rowUnique-id"></td>
  `;
  tbody.appendChild(tr);
  populateRowSelects(tr);
}

function loadCertificateSubform(recordID) {
  const certTbody = document.getElementById("certificateBody");
  certTbody.innerHTML = "";
  document.getElementById("certificateuploadsec").style.display = "block";

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Certificate_Details",
    criteria: "Lot_Master_ID == " + recordID,
  })
    .then(function (response) {
      console.log("CertificateLoad -- ", response);
      const certData = response.data || [];

      if (certData.length === 0) {
        console.log("No certificate rows found — adding blank row");
        addCertificateRow();
        return;
      }

      certData.slice().reverse().forEach(function (item) {
        const formattedDate = formatToYYYYMMDD(item.Date_field);
        const tr = document.createElement("tr");
        tr.classList.add("cert-row");
        tr.dataset.certRecordId = item.ID || "";

        tr.innerHTML = `
          <td><button type="button" class="remove-btn" onclick="removeRow(this)">❌</button></td>
          <td><input class="cert-id" value="${item.ID1 || ""}"></td>
          <td class="cert-file-cell"></td>
          <td><input type="date" class="cert-date" value="${formattedDate}"></td>
          <td><textarea class="cert-notes">${item.Notes || ""}</textarea></td>
          <td><select class="cert-lab"></select></td>
          <td><select class="cert-lab-desc"></select></td>
          <td><select class="cert-lab-sup"></select></td>
          <td><input type="text" class="cert-rowUnique-id" value="${item.ID || ""}"></td>
        `;

        certTbody.appendChild(tr);

        const fileCell = tr.querySelector(".cert-file-cell");
        if (item.Certificate_Single) {
          const fullUrl = "https://creator.zoho.com" + item.Certificate_Single;
          function getFileNameFromUrl(url) {
            try {
              const decodedUrl = decodeURIComponent(url);
              const match = decodedUrl.match(/[?&]filepath=([^&]+)/);
              let fileName = match && match[1] ? match[1] : decodedUrl.split("/").pop();
              fileName = fileName || "Download File";
              fileName = fileName.replace(/^\d+_/, "");
              return fileName;
            } catch (e) {
              return "Download File";
            }
          }
          const fileName = getFileNameFromUrl(fullUrl);
          fileCell.innerHTML = `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${fileName}</a>`;
        } else {
          fileCell.innerHTML = "No file";
        }

        populateRowSelects(tr);

        setTimeout(function () {
          tr.querySelector(".cert-lab").value = item.Lab?.ID || "";
          tr.querySelector(".cert-lab-desc").value = item.Lab_Descriptor?.ID || "";
          tr.querySelector(".cert-lab-sup").value = item.Laboratory_Supplement?.ID || "";
        }, 300);
      });
    })
    .catch(function (error) {
      console.error("Error fetching certificate subform:", error);
      addCertificateRow();
    });
}

function createCertificateRecords(skuValue, lotRecordID) {
  const promises = [];
  const rows = document.querySelectorAll("#certificateBody tr");
  const categoryValue = document.getElementById("itemType")?.value || "";
  const subspeciesvalue = document.getElementById("sub_species")?.value || "";
  const speciesId = document.getElementById("species_lookup")?.value || "";
  const speciesValue = speciesMap[speciesId]?.Species || "";

  if (rows.length === 0) return promises;

  rows.forEach(function (row, index) {
    const idInput = row.querySelector(".cert-id");
    const fileInput = row.querySelector(".cert-file");
    const dateInput = row.querySelector(".cert-date");
    const notesInput = row.querySelector(".cert-notes");
    const labSelect = row.querySelector(".cert-lab");
    const labDescSelect = row.querySelector(".cert-lab-desc");
    const labSupSelect = row.querySelector(".cert-lab-sup");
    const rowUniqueID = row.querySelector(".cert-rowUnique-id");

    const idValue = idInput?.value || "";
    const fileExists = fileInput?.files && fileInput.files.length > 0;

    let dateValue = "";
    if (dateInput && dateInput.value) {
      const dateObj = new Date(dateInput.value);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const month = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      dateValue = `${day}-${month}-${year}`;
    }

    const notesValue = notesInput?.value || "";
    const labValue = labSelect?.value || "";
    const labDescValue = labDescSelect?.value || "";
    const labSupValue = labSupSelect?.value || "";

    const hasData = idValue || fileExists || dateValue || notesValue || labValue || labDescValue || labSupValue;
    if (!hasData) return;

    const certData = {
      ID1: idValue,
      Date_field: dateValue,
      Notes: notesValue,
      Lab: labValue,
      Lab_Descriptor: labDescValue,
      Laboratory_Supplement: labSupValue,
      SKU: skuValue,
      Categories: categoryValue,
      Species: speciesValue,
      Sub_species: subspeciesvalue,
      Lot_Master_ID: lotRecordID,
    };

    if (rowUniqueID && rowUniqueID.value != null && rowUniqueID.value != "") {
      const updatePromise = ZOHO.CREATOR.DATA.updateRecordById({
        app_name: "feiny-app",
        report_name: "All_Certificate_Details",
        id: String(rowUniqueID.value),
        payload: { data: certData },
      })
        .then(function (res) {
          console.log("Row Update Response", res);
          if (rowUniqueID && fileExists) {
            return uploadCertificateFile(rowUniqueID.value, fileInput.files[0]);
          }
        })
        .catch(function (error) {
          console.error("❌ UpdateRes Save Error:", error);
          alert("❌ UpdateRes Error: " + error.message);
        });
      promises.push(updatePromise);
    } else {
      const promise = new Promise((resolve) => {
        ZOHO.CREATOR.DATA.addRecords({
          app_name: "feiny-app",
          form_name: "Certificate_Uploads",
          payload: { data: certData },
        })
          .then(function (response) {
            let certRecordId = null;
            if (response.code === 3000 || response.code === "3000") {
              if (response.data && Array.isArray(response.data) && response.data.length > 0)
                certRecordId = response.data[0].ID;
              else if (response.data && response.data.ID) certRecordId = response.data.ID;
              else if (response.details && response.details.id) certRecordId = response.details.id;
              else if (response.id) certRecordId = response.id;
            }
            if (certRecordId && fileExists) {
              return uploadCertificateFile(certRecordId, fileInput.files[0])
                .then(() => resolve({ type: "certificate", success: true, index, sku: skuValue, recordId: certRecordId }))
                .catch((err) => resolve({ type: "certificate", success: true, fileUploadFailed: true, index, error: err.message }));
            } else {
              resolve({ type: "certificate", success: true, index, sku: skuValue, recordId: certRecordId, noFile: true });
            }
          })
          .catch(function (error) {
            resolve({ type: "certificate", success: false, error: error.message, index, sku: skuValue });
          });
      });
      promises.push(promise);
    }
  });

  return promises;
}

function uploadCertificateFile(recordId, file) {
  return new Promise(function (resolve, reject) {
    ZOHO.CREATOR.FILE.uploadFile({
      app_name: "feiny-app",
      report_name: "All_Certificate_Details",
      id: recordId,
      field_name: "Certificate_Single",
      file: file,
    })
      .then(function (response) {
        if (response.code === 3000 || response.code === "3000") {
          resolve(response);
          ZOHO.CREATOR.DATA.invokeCustomApi({
            api_name: "asfd",
            workspace_name: "ankit_feiny",
            http_method: "POST",
            content_type: "application/json",
            payload: { IDd: recordId, fileFormat: response.data.filename },
            public_key: "yUeF2jG7QJWCHXUaEuCQ91XvA",
          })
            .then((r) => console.log("Cert custom API SUCCESS:", r))
            .catch((e) => console.error("Cert custom API ERROR:", e));
        } else {
          reject(new Error(response.message || "Certificate file upload failed"));
        }
      })
      .catch(reject);
  });
}

/* =================================================================================
    SAVE RECORD (handles all 3 categories — create & update)
  ================================================================================= */

function saveRecord() {
  const itemType = document.getElementById("itemType").value;
  const In_SKU = document.getElementById("In_SKU").value;

  if (!itemType || !In_SKU) {
    alert("Please select Item Type and enter SKU");
    return;
  }

  const saveBtn = document.getElementById("addRecord");
  const originalText = saveBtn ? saveBtn.textContent : "Save";
  if (saveBtn) {
    saveBtn.textContent = "Saving...";
    saveBtn.disabled = true;
  }

  const recordData = {
    Select: itemType,
    In_SKU: In_SKU,
    Stock_On_Hand: getNumber("Stock_On_Hand"),
    Status: document.getElementById("Status")?.value || "",
    /* --- Color Stone fields --- */
    Treatment: document.getElementById("treatment_lookup")?.value || "",
    Species: document.getElementById("species_lookup")?.value || "",
    Sub_species: document.getElementById("sub_species")?.value || "",
    Surface: document.getElementById("surface_lookup")?.value || "",
    Shape: document.getElementById("shape_lookup")?.value || "",
    Origin: document.getElementById("origin_country")?.value || "",
    Country_of_Cut: document.getElementById("country_cut")?.value || "",
    HTS: document.getElementById("hts_field")?.value || "",
    Code: document.getElementById("code_field")?.value || "",
    Rough_Lot: document.getElementById("rough_lot")?.value || "",
    Name1: document.getElementById("cs_short_description")?.value || "",
    Long_Description: document.getElementById("cs_long_description")?.value || "",
    length_field: getNumber("min_length"),
    Width: getNumber("min_width"),
    Height: getNumber("min_height"),
    Length_field1: getNumber("max_length"),
    Width1: getNumber("max_width"),
    Height1: getNumber("max_height"),
    weight: getNumber("weight"),
    AGL: document.getElementById("cert_agl")?.checked || false,
    GIA: document.getElementById("cert_gia")?.checked || false,
    Gub: document.getElementById("cert_gubelin")?.checked || false,
    SSEF: document.getElementById("cert_ssef")?.checked || false,
    Other: document.getElementById("cert_other")?.checked || false,
    Description2: document.getElementById("certificate_details")?.value || "",
    Price4: getNumber("Price4"),
    Minimum_Price: getNumber("MinimumPrice"),
    Unit: document.getElementById("unit_lookup")?.value || "",
    Partnership_Details: getPartnerRowsData(),
    Diamond_Details: getDiamondRowsData(),
    Color_Stone1: getColorStoneRowsData(),
    /* --- Diamond fields --- */
    Shape3: document.getElementById("dia_shape")?.value || "",
    Color: document.getElementById("dia_color")?.value || "",
    Clarity: document.getElementById("dia_clarity")?.value || "",
    Cut: document.getElementById("dia_cut")?.value || "",
    Polish: document.getElementById("dia_polish")?.value || "",
    Culet: document.getElementById("dia_culet")?.value || "",
    Symmetry: document.getElementById("dia_symmetry")?.value || "",
    Fluorescence1: document.getElementById("dia_fluorescence")?.value || "",
    Fluorescence_Color: document.getElementById("dia_colour_fluorescence")?.value || "",
    Length_mm: getNumber("dia_length"),
    Width_mm: getNumber("dia_width"),
    Depth1: getNumber("dia_depth"),
    Table: getNumber("dia_table"),
    Depth2: getNumber("dia_depth_percent"),
    Weight_Ct: getNumber("dia_weight"),
    Price_Per_carat: getNumber("price_per_carat"),
    Total_Price: getNumber("total_price"),
    Rapport_Price1: getNumber("rapport_price"),
    Quantity: getNumber("quantity"),
    Short_Description1: document.getElementById("diashort_description")?.value || "",
    Long_Description2: document.getElementById("dialong_description")?.value || "",
    /* --- Jewellery fields --- */
    Style: document.getElementById("style")?.value || "",
    Jewellery_Type: document.getElementById("jewellery_type")?.value || "",
    Platinum: document.getElementById("platinum")?.value || "",
    Category: document.getElementById("category")?.value || "",
    Description3: document.getElementById("description")?.value || "",
    Gold: document.getElementById("gold")?.value || "",
    Production: document.getElementById("production")?.value || "",
    Instructions: document.getElementById("instruction")?.value || "",
    Country_Of_Origin1: document.getElementById("countries_origin")?.value || "",
    Size: document.getElementById("size")?.value || "",
    Weight_grams: getNumber("weight_grams"),
    Circa: document.getElementById("circa")?.value || "",
    Brand: document.getElementById("brand")?.value || "",
    HTS1: document.getElementById("hts")?.value || "",
    Notes: document.getElementById("note")?.value || "",
    Diamond_price: getNumber("diamond_price"),
    Semi_Mount_Price: getNumber("semi_mount_price"),
    Other_Cost: getNumber("other_cost"),
    Total_Cost: getNumber("total_cost"),
    Duty2: getNumber("duty_percentage"),
    Amount: getNumber("duty_amount"),
    Final_Cost: getNumber("final_cost"),
    Selling_price_per_piece: getNumber("selling_price_piece"),
    Jewel_Short_Description: document.getElementById("description")?.value || "",
    Jewel_Long_Description: document.getElementById("instruction")?.value || "",
    Metal_Details: getMetalDetailsRowsData(),
    Jewellery_Diamond_Details: getJewelleryDiamondRowsData(),
    Jewellery_Color_Stone: getJewelleryColorStoneRowsData(),
    Labour_Details: getLabourDetailsRowsData(),
    Jewellery_Partnership_Details: getJewelleryPartnershipRowsData(),
  };

  console.log("Saving config:", recordData);

  if (!recId) {
    /* ── CREATE ── */
    ZOHO.CREATOR.DATA.addRecords({
      app_name: "feiny-app",
      form_name: "Lot_Master",
      payload: { data: recordData },
    })
      .then(function (response) {
        console.log("✅ Created:", response);
        if (response.code === 3000 || response.code === "3000") {
          alert("✅ Record Saved Successfully");

          let recordId = null;
          if (response.data && Array.isArray(response.data) && response.data.length > 0)
            recordId = response.data[0].ID;
          else if (response.data && response.data.ID) recordId = response.data.ID;
          else if (response.details && response.details.id) recordId = response.details.id;
          else if (response.id) recordId = response.id;

          if (!recordId) throw new Error("Record created but ID not found: " + JSON.stringify(response));

          let uploadPromises = [];
          const certPromises = createCertificateRecords(In_SKU, recordId);
          if (certPromises && certPromises.length > 0) uploadPromises = uploadPromises.concat(certPromises);
          if (recordId && diaImageFile) uploadPromises.push(uploadDiaImage(recordId, diaImageFile));
          if (recordId && stoneImageFile) uploadPromises.push(uploadStoneImage(recordId, stoneImageFile));

          return Promise.all(uploadPromises);
        } else {
          throw new Error("Failed to create record: " + (response.message || JSON.stringify(response)));
        }
      })
      .then(function (uploadResults) {
        const successCount = uploadResults?.filter((u) => u.type === "certificate" && u.success).length || 0;
        let message = "Record created successfully!";
        if (successCount > 0) message += ` ${successCount} certificate(s) created.`;
        alert(message);
        certificateFiles.clear();
        certificateFilesToUpload = [];
        clearPageAfterSave();
        ZOHO.CREATOR.UTIL.navigateTo({ url: "#Report:All_Lot_Master", target: "same" });
      })
      .catch(function (error) {
        console.error("❌ Save Error:", error);
        alert("❌ Error: " + error.message);
      })
      .finally(function () {
        if (saveBtn) { saveBtn.textContent = originalText; saveBtn.disabled = false; }
      });
  } else {
    /* ── UPDATE ── */
    ZOHO.CREATOR.DATA.updateRecordById({
      app_name: "feiny-app",
      report_name: "All_Lot_Master",
      id: String(recId),
      payload: { data: recordData },
    })
      .then(function (res) {
        console.log("✅ Updated:", res);
        if (res.code === 3000 || res.code === "3000") {
          alert("✅ Updated Successfully");

          let uploadPromises = [];
          const certPromises = createCertificateRecords(In_SKU, recId);
          if (certPromises && certPromises.length > 0) uploadPromises = uploadPromises.concat(certPromises);
          if (recId && diaImageFile) uploadPromises.push(uploadDiaImage(recId, diaImageFile));
          if (recId && stoneImageFile) uploadPromises.push(uploadStoneImage(recId, stoneImageFile));

          return Promise.all(uploadPromises);
        } else {
          throw new Error("Failed to update record: " + (res.message || JSON.stringify(res)));
        }
      })
      .then(function (uploadResults) {
        const successCount = uploadResults?.filter((u) => u.type === "certificate" && u.success).length || 0;
        let message = "Record updated successfully!";
        if (successCount > 0) message += ` ${successCount} certificate(s) created.`;
        alert(message);
        certificateFiles.clear();
        certificateFilesToUpload = [];
        clearPageAfterSave();
        ZOHO.CREATOR.UTIL.navigateTo({ url: "#Report:All_Lot_Master", target: "same" });
      })
      .catch(function (error) {
        console.error("❌ Save Error:", error);
        alert("❌ Error: " + error.message);
      })
      .finally(function () {
        if (saveBtn) { saveBtn.textContent = originalText; saveBtn.disabled = false; }
      });
  }
}

/* =================================================================================
    LOAD EXISTING RECORD (EDIT MODE)
  ================================================================================= */

function loadExistingRecord(recordID) {
  ZOHO.CREATOR.DATA.getRecordById({
    app_name: "feiny-app",
    report_name: "All_Lot_Master",
    id: recordID,
  })
    .then(function (res) {
      const data = res.data;
      console.log("Existing record data:", data);

      /* ── Images ── */
      let fullUrl = "https://creator.zoho.com" + data.item_Image;
      let frame = document.getElementById("stoneImagePreview");
      frame.src = fullUrl;
      frame.style.display = "block";
      document.getElementById("imageText").style.display = "none";
      document.getElementById("clearStoneImage").style.display = "block";

      let diaFullUrl = "https://creator.zoho.com" + data.item_Image;
      let diaFrame = document.getElementById("imagePreview");
      diaFrame.src = diaFullUrl;
      diaFrame.style.display = "block";
      document.getElementById("diamand_imageText").style.display = "none";
      document.getElementById("clearImage").style.display = "block";

      /* ── Common ── */
      document.getElementById("In_SKU").value = data.In_SKU || "";
      document.getElementById("itemType").value = data.Select || "";

      /* ── Color Stone fields ── */
      document.getElementById("surface_lookup").value = data.Surface?.ID || "";
      document.getElementById("species_lookup").value = data.Species?.ID || "";
      document.getElementById("treatment_lookup").value = data.Treatment?.ID || "";
      document.getElementById("shape_lookup").value = data.Shape?.ID || "";
      document.getElementById("origin_country").value = data.Origin || "";
      document.getElementById("country_cut").value = data.Country_of_Cut || "";
      document.getElementById("hts_field").value = data.HTS || "";
      document.getElementById("code_field").value = data.Code || "";
      document.getElementById("cs_short_description").value = data.Name1 || "";
      document.getElementById("cs_long_description").value = data.Long_Description || "";
      document.getElementById("min_length").value = data.length_field || "";
      document.getElementById("min_width").value = data.Width || "";
      document.getElementById("min_height").value = data.Height || "";
      document.getElementById("max_length").value = data.Length_field1 || "";
      document.getElementById("max_width").value = data.Width1 || "";
      document.getElementById("max_height").value = data.Height1 || "";
      document.getElementById("weight").value = data.weight || "";
      document.getElementById("cert_other").checked = data.Other || false;
      document.getElementById("cert_gubelin").checked = data.Gub || false;
      document.getElementById("cert_agl").checked = data.AGL || false;
      document.getElementById("cert_gia").checked = data.GIA || false;
      document.getElementById("cert_ssef").checked = data.SSEF || false;
      document.getElementById("certificate_details").value = data.Description2 || "";
      document.getElementById("Price4").value = data.Price4 || "";
      document.getElementById("MinimumPrice").value = data.Minimum_Price || "";
      document.getElementById("unit_lookup").value = data.Unit?.ID || "";
      document.getElementById("brand").value = data.Brand?.ID || "";

      /* ── Diamond fields ── */
      document.getElementById("dia_shape").value = data.Shape3?.ID || "";
      document.getElementById("dia_color").value = data.Color?.ID || "";
      document.getElementById("dia_clarity").value = data.Clarity?.ID || "";
      document.getElementById("dia_cut").value = data.Cut?.ID || "";
      document.getElementById("dia_polish").value = data.Polish?.ID || "";
      document.getElementById("dia_symmetry").value = data.Symmetry?.ID || "";
      document.getElementById("dia_culet").value = data.Culet?.ID || "";
      document.getElementById("dia_fluorescence").value = data.Fluorescence1?.ID || "";
      document.getElementById("dia_colour_fluorescence").value = data.Fluorescence_Color?.ID || "";
      document.getElementById("dia_length").value = data.Length_mm || "";
      document.getElementById("dia_width").value = data.Width_mm || "";
      document.getElementById("dia_depth").value = data.Depth1 || "";
      document.getElementById("dia_table").value = data.Table || "";
      document.getElementById("dia_depth_percent").value = data.Depth2 || "";
      document.getElementById("quantity").value = data.Quantity || "";
      document.getElementById("dia_weight").value = data.Weight_Ct || "";
      document.getElementById("price_per_carat").value = data.Price_Per_carat || "";
      document.getElementById("total_price").value = data.Total_Price || "";
      document.getElementById("rapport_price").value = data.Rapport_Price1 || "";
      document.getElementById("diashort_description").value = data.Short_Description1 || "";
      document.getElementById("dialong_description").value = data.Long_Description2 || "";

      /* ── Jewellery fields ── */
      document.getElementById("style").value = data.Style || "";
      document.getElementById("jewellery_type").value = data.Jewellery__Type || "";
      document.getElementById("platinum").value = data.Platinum || "";
      document.getElementById("category").value = data.Category || "";
      document.getElementById("description").value = data.Description3 || "";
      document.getElementById("gold").value = data.Gold || "";
      document.getElementById("production").value = data.Production || "";
      document.getElementById("instruction").value = data.Instructions || "";
      document.getElementById("countries_origin").value = data.Country_Of_Origin1 || "";
      document.getElementById("size").value = data.Size || "";
      document.getElementById("weight_grams").value = data.Weight_grams || "";
      document.getElementById("circa").value = data.Circa || "";
      document.getElementById("brand").value = data.Brand?.ID || "";
      document.getElementById("hts").value = data.HTS1 || "";
      document.getElementById("note").value = data.Notes || "";

      /* ── Certificate subform ── */
      loadCertificateSubform(recordID);

      /* ── Partnership subform ── */
      var partnerData = data.Partnership_Details;
      var partnerTbody = document.getElementById("partnerBody");
      partnerTbody.innerHTML = "";

      if (partnerData && partnerData.length > 0) {
        partnerData.forEach(function (item) {
          var tr = document.createElement("tr");
          tr.classList.add("partner-row");
          tr.innerHTML = `
            <td><select class="partnerdatalookup"><option value="">Select Partner</option></select></td>
            <td><input type="text" class="partner-share" value="${item.Partnership_shares || ""}"></td>
            <td><input type="text" class="partner-percent" value="${item.Partnership || ""}"></td>
            <td><input type="text" class="commission-percent" value="${item.Commission || ""}"></td>
            <td style="text-align:center"><input type="checkbox" class="commission-itemized" ${item.Commission_Itemized_on_Invoice === "true" ? "checked" : ""}></td>
            <td><textarea class="partner-desc">${item.Description || ""}</textarea></td>
          `;
          partnerTbody.appendChild(tr);
          populatePartnerDropdowns();
          setTimeout(function () {
            const selectEl = tr.querySelector(".partnerdatalookup");
            selectEl.value = item.Partner_Name?.ID || "";
          }, 300);
        });
      } else {
        console.log("⚠️ No partnership data found");
        addPartnerRow();
      }

      /* ── Diamond Details subform (for colour stone/diamond) ── */
      var diamondData = data.Diamond_Details;
      var diamondTbody = document.getElementById("jewel2Body");
      diamondTbody.innerHTML = "";

      if (diamondData && diamondData.length > 0) {
        diamondData.forEach(function (item) {
          var tr = document.createElement("tr");
          tr.classList.add("jewel2-row");
          tr.innerHTML = `
            <td><input type="text" class="j2-lot" value="${item.Diamond_Lot || ""}"></td>
            <td><input type="text" class="j2-shape" value="${item.Shape || ""}"></td>
            <td><input type="text" class="j2-quality" value="${item.Diamond_Quality || ""}"></td>
            <td><input type="number" class="j2-stones" value="${item.No_of_Stones || ""}"></td>
            <td><input type="number" class="j2-total-ct" value="${item.Total_Ct_Wt || ""}"></td>
            <td><input type="text" class="j2-price" value="${item.Price || ""}"></td>
            <td><input type="text" class="j2-cost" value="${item.Diamond_cost || ""}"></td>
            <td><textarea class="j2-remarks">${item.Remarks || ""}</textarea></td>
            <td><button type="button" onclick="removeRow(this)">❌</button></td>
          `;
          diamondTbody.appendChild(tr);
        });
      } else {
        console.log("⚠️ No diamond data found");
        addJewellery2Row();
      }

      /* ── Color Stone subform ── */
      var ColorstoneData = data.Color_Stone1;
      var colorsTbody = document.getElementById("jewel3Body");
      colorsTbody.innerHTML = "";

      if (ColorstoneData && ColorstoneData.length > 0) {
        ColorstoneData.forEach(function (item) {
          var tr = document.createElement("tr");
          tr.classList.add("jewel3-row");
          tr.innerHTML = `
            <td><input type="text" class="j3-lot" value="${item.Colorstone_Lot || ""}"></td>
            <td><input type="text" class="j3-stone-type" value="${item.Stone_Type || ""}"></td>
            <td><input type="text" class="j3-shape" value="${item.Shape || ""}"></td>
            <td><input type="text" class="j3-quality" value="${item.Stone_Quality || ""}"></td>
            <td><input type="text" class="j3-range" value="${item.Range_Sieve_Mm || ""}"></td>
            <td><input type="number" class="j3-no-stones" value="${item.No_of_Stones || ""}"></td>
            <td><input type="number" class="j3-wt-stone" value="${item.Wt_Per_Stone || ""}"></td>
            <td><input type="number" class="j3-ctwt" value="${item.CT_WT || ""}"></td>
            <td><input type="text" class="j3-unit" value="${item.Unit || ""}"></td>
            <td><input type="text" class="j3-cut" value="${item.Cut || ""}"></td>
            <td><input type="text" class="j3-color" value="${item.Stone_Color || ""}"></td>
            <td><input type="text" class="j3-clarity" value="${item.Stone_Clarity || ""}"></td>
            <td><input type="text" class="j3-supplier" value="${item.Supplier || ""}"></td>
            <td><input type="text" class="j3-setter" value="${item.Setter1 || ""}"></td>
            <td><input type="text" class="j3-price" value="${item.Price || ""}"></td>
            <td><input type="text" class="j3-cost" value="${item.Stone_Cost || ""}"></td>
            <td><input type="checkbox" class="j3-cs" ${item.C_S ? "checked" : ""}></td>
            <td><input type="checkbox" class="j3-duty" ${item.Duty ? "checked" : ""}></td>
            <td><textarea class="j3-remarks">${item.Remarks || ""}</textarea></td>
            <td><button type="button" onclick="removeRow(this)">❌</button></td>
          `;
          colorsTbody.appendChild(tr);
        });
      } else {
        console.log("⚠️ No color stone data found");
        addJewellery3Row();
      }

      /* ── Metal Details subform (Jewellery 1) ── */
      var metalData = data.Metal_Details;
      var metalTbody = document.getElementById("jewel1Body");
      metalTbody.innerHTML = "";

      if (metalData && metalData.length > 0) {
        metalData.forEach(function (item) {
          var tr = document.createElement("tr");
          tr.classList.add("jewel1-row");
          tr.innerHTML = `
            <td><input type="text" class="j1-cast-no" value="${item.Cast_No || ""}"></td>
            <td><select class="select_contact j1-vendor"><option value="">Select Contact</option></select></td>
            <td><select class="select_metal_type j1-metal-type"><option value="">Select Metal Type</option></select></td>
            <td><select class="select_color j1-metal-color"><option value="">Select Color</option></select></td>
            <td><select class="select_purity j1-metal-purity"><option value="">Select Purity</option></select></td>
            <td><select class="select_unit j1-unit"><option value="">Select Unit</option></select></td>
            <td><input type="number" class="j1-weight" value="${item.Weight || ""}"></td>
            <td><input type="number" class="j1-qty" value="${item.Quantity || ""}"></td>
            <td><input type="number" class="j1-market" value="${item.Metal_Market || ""}"></td>
            <td><input type="text" class="j1-price" value="${item.Price || ""}"></td>
            <td><input type="text" class="j1-gold-cost" value="${item.Gold_Cost || ""}"></td>
            <td><textarea class="j1-remarks">${item.Remarks || ""}</textarea></td>
            <td><button type="button" onclick="removeRow(this)">❌</button></td>
          `;
          metalTbody.appendChild(tr);
        });
      } else {
        console.log("⚠️ No metal data found");
        addJewellery1Row();
      }

      /* ── Labour Details subform (Jewellery 4) ── */
      var labourData = data.Labour_Details;
      var labourTbody = document.getElementById("jewel4Body");
      labourTbody.innerHTML = "";

      if (labourData && labourData.length > 0) {
        labourData.forEach(function (item) {
          var tr = document.createElement("tr");
          tr.classList.add("jewel4-row");
          tr.innerHTML = `
            <td><input type="text" class="j4-labor-no" value="${item.Labor || ""}"></td>
            <td><textarea class="j4-description">${item.Description || ""}</textarea></td>
            <td><input type="text" class="j4-price" value="${item.Price || ""}"></td>
            <td><input type="number" class="j4-qty" value="${item.Qty || ""}"></td>
            <td><input type="checkbox" class="j4-duty" ${item.Duty ? "checked" : ""}></td>
            <td><input type="text" class="j4-amount" value="${item.Amount || ""}"></td>
            <td><button type="button" onclick="removeRow(this)">❌</button></td>
          `;
          labourTbody.appendChild(tr);
        });
      } else {
        console.log("⚠️ No labour data found");
        addJewellery4Row();
      }

      /* ── Jewellery Partnership subform ── */
      var JewelleryPartnerData = data.Jewellery_Partnership_Details;
      var JewelleryPartnerbody = document.getElementById("jewelleryPartnershipBody");
      JewelleryPartnerbody.innerHTML = "";

      if (JewelleryPartnerData && JewelleryPartnerData.length > 0) {
        JewelleryPartnerData.forEach(function (item) {
          var tr = document.createElement("tr");
          tr.classList.add("jewellery-partnership-row");
          tr.innerHTML = `
            <td><select class="jp_partner"><option value="">Select Partner</option></select></td>
            <td><input type="text" class="jp_shares" value="${item.Partnership_shares || ""}"></td>
            <td><input type="text" class="jp_partnership_percentage" value="${item.Partnership || ""}"></td>
            <td><input type="text" class="jp_commission_percentage" value="${item.Commission || ""}"></td>
            <td><input type="checkbox" class="jp_commission_itemization" ${item.Commission_Itemized_on_Invoice ? "checked" : ""}></td>
            <td><textarea class="jp_description">${item.Description || ""}</textarea></td>
            <td><button type="button" class="btn-delete-row" onclick="removeJewelleryPartnershipRow(this)">Remove</button></td>
          `;
          JewelleryPartnerbody.appendChild(tr);
          populateJewelleryPartnerDropdowns();
          setTimeout(function () {
            const selectEl = tr.querySelector(".jp_partner");
            selectEl.value = item.Partner_Name?.ID || "";
          }, 100);
        });
      } else {
        console.log("⚠️ No jewellery partnership data found");
        addJewelleryPartnershipRow();
      }
    })
    .catch(function (err) {
      console.error("loadExistingRecord error:", err);
    });
}

/* =================================================================================
    CLEAR PAGE AFTER SAVE
  ================================================================================= */

function clearPageAfterSave() {
  document.querySelectorAll("input, textarea, select").forEach(function (el) {
    if (el.type === "button" || el.type === "submit" || el.type === "hidden") return;
    if (el.type === "checkbox" || el.type === "radio") el.checked = false;
    else if (el.type === "file") el.value = "";
    else el.value = "";
  });

  document.querySelectorAll("select").forEach(function (sel) {
    sel.selectedIndex = 0;
  });

  diaImageFile = null;
  stoneImageFile = null;

  let diaPrev = document.getElementById("imagePreview");
  if (diaPrev) { diaPrev.src = ""; diaPrev.style.display = "none"; }

  let stonePrev = document.getElementById("stoneImagePreview");
  if (stonePrev) { stonePrev.src = ""; stonePrev.style.display = "none"; }

  let clearImg = document.getElementById("clearImage");
  if (clearImg) clearImg.style.display = "none";

  let clearStone = document.getElementById("clearStoneImage");
  if (clearStone) clearStone.style.display = "none";

  if (document.getElementById("diamand_imageText"))
    document.getElementById("diamand_imageText").style.display = "block";

  if (document.getElementById("imageText"))
    document.getElementById("imageText").style.display = "block";

  let certBody = document.getElementById("certificateBody");
  if (certBody) { certBody.innerHTML = ""; addCertificateRow(); }

  certificateFiles.clear();
  certificateFilesToUpload = [];

  let partnerBody = document.getElementById("partnerBody");
  if (partnerBody) { partnerBody.innerHTML = ""; addPartnerRow(); }

  let jewelleryPartnerBody = document.getElementById("jewelleryPartnershipBody");
  if (jewelleryPartnerBody) { jewelleryPartnerBody.innerHTML = ""; addJewelleryPartnershipRow(); }

  ["total_price","rapport_price","Rapport_Price","cs_short_description",
   "cs_long_description","diashort_description","dialong_description",
   "hts_field","code_field"].forEach(function (id) {
    let f = document.getElementById(id);
    if (f) f.value = "";
  });

  ["colorStoneSection","diamondSection","jewelleryWrapper","pricingSection",
   "Dimensionssection","neededcertificatesec","certificateuploadsec","partnershipsec"]
    .forEach(function (id) {
      let sec = document.getElementById(id);
      if (sec) sec.style.display = "none";
    });

  recId = null;
  lot_edit = false;
  window.scrollTo(0, 0);
  console.log("Form Cleared Successfully");
}
