/* ================= LOOKUP LOADS ================= */

document.addEventListener("DOMContentLoaded", function () {
  loadJewelleryTypeLookup();
  loadOriginCountryDropdown();
  loadContactLookup();
  loadMetalTypeLookup();
  loadColorLookup();
  loadDiamondLookup();
  loadUnitLookup();
  loadBrandLookup();
  loadPurityLookup();
});

/* ================= LOOKUP LOADS ================= */

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
      Jewellery_1_Metal_Details: document.getElementById(
        "Jewellery_1_Metal_Details",
      ),
      Jewellery_2_Diamond_Details: document.getElementById(
        "Jewellery_2_Diamond_Details",
      ),
      Jewellery_3_Color_Stone: document.getElementById(
        "Jewellery_3_Color_Stone",
      ),
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
    hide(certificateuploadsec);
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

  /* ================= LOOKUP LOADS ================= */

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
  typeof loadDiaFluorescenceLookup === "function" &&
    loadDiaFluorescenceLookup();
  typeof loadDiaFluorescenceColorLookup === "function" &&
    loadDiaFluorescenceColorLookup();
  typeof loaddiaShapeLookup === "function" && loaddiaShapeLookup();
  typeof loadPartnerLookup === "function" && loadPartnerLookup();
  typeof loadPartnerdataLookup === "function" && loadPartnerdataLookup();
  typeof initTotalCalculation === "function" && initTotalCalculation();
  typeof initRapportPriceTriggers === "function" && initRapportPriceTriggers();
  typeof loadCertificateSubformLookups === "function" &&
    loadCertificateSubformLookups();

  /* ================= COLOR STONE AUTO DESCRIPTION ================= */

  const treatmentEl = document.getElementById("treatment_lookup");
  const speciesEl = document.getElementById("species_lookup");
  const surfaceEl = document.getElementById("surface_lookup");
  const shapeEl = document.getElementById("shape_lookup");
  const shortDescEl = document.getElementById("cs_short_description");
  const longDescEl = document.getElementById("cs_long_description");

  function stoneupdateDescriptions() {
    const treatment = treatmentEl?.selectedOptions[0]?.text || "";
    const species = speciesEl?.selectedOptions[0]?.text || "";
    const surface = surfaceEl?.selectedOptions[0]?.text || "";
    const shape = shapeEl?.selectedOptions[0]?.text || "";
    const shortText = [treatment, species, surface, shape]
      .filter(Boolean)
      .join(" ");
    const longText = [treatment, species, surface, shape]
      .filter(Boolean)
      .join(", ");
    if (shortDescEl) shortDescEl.value = shortText;
    if (longDescEl) longDescEl.value = longText;
  }

  [treatmentEl, speciesEl, surfaceEl, shapeEl].forEach((el) => {
    if (el) el.addEventListener("change", stoneupdateDescriptions);
  });

  stoneupdateDescriptions();

  /* ================= AUTO TOTAL PRICE (ZOHO FIX) ================= */

  function initTotalCalculation() {
    const weightField = document.getElementById("dia_weight");
    const priceField = document.getElementById("price_per_carat");
    const totalField = document.getElementById("total_price");

    if (!weightField || !priceField || !totalField) {
      setTimeout(initTotalCalculation, 500);
      return;
    }

    function calculateTotal() {
      const weight = parseFloat(weightField.value) || 0;
      const price = parseFloat(priceField.value) || 0;
      const total = weight * price;
      totalField.value = total ? total.toFixed(2) : "";
    }

    weightField.addEventListener("input", calculateTotal);
    priceField.addEventListener("input", calculateTotal);
  }

  initTotalCalculation();

  /* ================= DIAMOND AUTO DESCRIPTION ================= */

  const diashapeEl = document.getElementById("dia_shape");
  const diacolorEl = document.getElementById("dia_color");
  const diaclarityEl = document.getElementById("dia_clarity");
  const diacutEl = document.getElementById("dia_cut");
  const diapolishEl = document.getElementById("dia_polish");
  const diasymmetryEl = document.getElementById("dia_symmetry");
  const diaculetEl = document.getElementById("dia_culet");
  const diafluorescenceEl = document.getElementById("dia_fluorescence");
  const diafluorescencecolorEl = document.getElementById(
    "dia_colour_fluorescence",
  );
  const diashortDescEl = document.getElementById("diashort_description");
  const dialongDescEl = document.getElementById("dialong_description");

  function updateDescriptions() {
    const diashape = diashapeEl?.selectedOptions[0]?.text || "";
    const diacolor = diacolorEl?.selectedOptions[0]?.text || "";
    const diaclarity = diaclarityEl?.selectedOptions[0]?.text || "";
    const diacut = diacutEl?.selectedOptions[0]?.text || "";
    const diapolish = diapolishEl?.selectedOptions[0]?.text || "";
    const diasymmetry = diasymmetryEl?.selectedOptions[0]?.text || "";
    const diaculet = diaculetEl?.selectedOptions[0]?.text || "";
    const diafluorescence = diafluorescenceEl?.selectedOptions[0]?.text || "";
    const diafluorescencecolor =
      diafluorescencecolorEl?.selectedOptions[0]?.text || "";

    const parts = [
      diashape,
      diacolor,
      diaclarity,
      diacut,
      diapolish,
      diasymmetry,
      diaculet,
      diafluorescence,
      diafluorescencecolor,
    ].filter(Boolean);
    if (diashortDescEl) diashortDescEl.value = parts.join(" ");
    if (dialongDescEl) dialongDescEl.value = parts.join(", ");
  }

  [
    diashapeEl,
    diacolorEl,
    diaclarityEl,
    diashapeEl,
    diacutEl,
    diapolishEl,
    diasymmetryEl,
    diaculetEl,
    diafluorescenceEl,
    diafluorescencecolorEl,
  ].forEach((el) => {
    if (el) el.addEventListener("change", updateDescriptions);
  });

  updateDescriptions();

  /* ================= DIAMOND IMAGE UPLOAD ================= */

  const diaInput = document.getElementById("dia_image");
  const preview = document.getElementById("imagePreview");
  const clearBtn = document.getElementById("clearImage");

  if (diaInput && preview && clearBtn) {
    diaInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("File must be under 5MB");
        diaInput.value = "";
        return;
      }
      diaImageFile = file;
      const reader = new FileReader();
      reader.onload = function (ev) {
        preview.src = ev.target.result;
        preview.style.display = "block";
        clearBtn.style.display = "inline-block";
        document.getElementById("diamand_imageText").style.display = "none";
      };
      reader.readAsDataURL(file);
    });

    clearBtn.addEventListener("click", function () {
      diaImageFile = null;
      diaInput.value = "";
      preview.style.display = "none";
      clearBtn.style.display = "none";
      document.getElementById("diamand_imageText").style.display = "block";
    });
  }

  /* ================= STONE IMAGE UPLOAD ================= */

  const stoneInput = document.getElementById("stone_image");
  const stonePreview = document.getElementById("stoneImagePreview");
  const stoneClearBtn = document.getElementById("clearStoneImage");

  if (stoneInput && stonePreview && stoneClearBtn) {
    stoneInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("File must be under 5MB");
        stoneInput.value = "";
        return;
      }
      stoneImageFile = file;
      const reader = new FileReader();
      reader.onload = function (ev) {
        stonePreview.src = ev.target.result;
        stonePreview.style.display = "block";
        stoneClearBtn.style.display = "inline-block";
        document.getElementById("imageText").style.display = "none";
      };
      reader.readAsDataURL(file);
    });

    stoneClearBtn.addEventListener("click", function () {
      stoneImageFile = null;
      stoneInput.value = "";
      stonePreview.style.display = "none";
      stoneClearBtn.style.display = "none";
      document.getElementById("imageText").style.display = "block";
    });
  }
});

/* ================= DIAMOND AUTO DESCRIPTION (GLOBAL) ================= */

const diaShapeEl = document.getElementById("dia_shape");
const diaColorEl = document.getElementById("dia_color");
const diaClarityEl = document.getElementById("dia_clarity");
const diaCutEl = document.getElementById("dia_cut");
const diaPolishEl = document.getElementById("dia_polish");
const diaSymmetryEl = document.getElementById("dia_symmetry");
const diaCuletEl = document.getElementById("dia_culet");
const diaFluorescenceEl = document.getElementById("dia_fluorescence");
const shortDescEl = document.getElementById("short_description");
const longDescEl = document.getElementById("long_description");

function updateDiamondDescriptions() {
  const shape = diaShapeEl?.selectedOptions[0]?.text || "";
  const color = diaColorEl?.selectedOptions[0]?.text || "";
  const clarity = diaClarityEl?.selectedOptions[0]?.text || "";
  const cut = diaCutEl?.selectedOptions[0]?.text || "";
  const polish = diaPolishEl?.selectedOptions[0]?.text || "";
  const symmetry = diaSymmetryEl?.selectedOptions[0]?.text || "";
  const culet = diaCuletEl?.selectedOptions[0]?.text || "";
  const fluorescence = diaFluorescenceEl?.selectedOptions[0]?.text || "";

  const parts = [
    color,
    clarity,
    cut,
    shape,
    polish,
    symmetry,
    culet,
    fluorescence,
  ].filter(Boolean);
  if (shortDescEl) shortDescEl.value = parts.join(" ");
  if (longDescEl) longDescEl.value = parts.join(", ");
}

[
  diaShapeEl,
  diaColorEl,
  diaClarityEl,
  diaCutEl,
  diaPolishEl,
  diaSymmetryEl,
  diaCuletEl,
  diaFluorescenceEl,
].forEach((el) => {
  if (el) el.addEventListener("change", updateDiamondDescriptions);
});

updateDiamondDescriptions();

/* =================================================================================
   CERTIFICATE SUBFORM LOOKUPS
================================================================================= */

/* ─── LOAD ALL LOOKUPS (ONLY ONCE) ─── */
function loadCertificateSubformLookups() {
  return Promise.all([
    ZOHO.CREATOR.DATA.getRecords({
      app_name: "feiny-app",
      report_name: "All_Labs",
    }),
    ZOHO.CREATOR.DATA.getRecords({
      app_name: "feiny-app",
      report_name: "Lab_Descriptor_Report",
    }),
    ZOHO.CREATOR.DATA.getRecords({
      app_name: "feiny-app",
      report_name: "All_Laboratory_Supplements",
    }),
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

/* ─── POPULATE SELECTS IN A GIVEN ROW ─── */
function populateRowSelects(row) {
  const labSelect = row.querySelector(".cert-lab");
  const labDescSelect = row.querySelector(".cert-lab-desc");
  const labSupSelect = row.querySelector(".cert-lab-sup");

  if (labSelect && labSelect.options.length <= 1)
    fillSelect(labSelect, certificateLookupCache.labs, "Lab");
  if (labDescSelect && labDescSelect.options.length <= 1)
    fillSelect(
      labDescSelect,
      certificateLookupCache.descriptors,
      "Lab_Descriptor",
    );
  if (labSupSelect && labSupSelect.options.length <= 1)
    fillSelect(
      labSupSelect,
      certificateLookupCache.supplements,
      "Laboratory_Supplement",
    );
}

/* ─── FILL A SINGLE SELECT ─── */
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

/* ─── ADD NEW CERTIFICATE ROW ─── */
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

/* ─── REMOVE ROW ─── */
function removeRow(btn) {
  btn.closest("tr").remove();
}
/* ================= COUNTRY DROPDOWNS ================= */

function loadCountryDropdown() {
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Belgium",
    "Bhutan",
    "Bolivia",
    "Brazil",
    "Bulgaria",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Chile",
    "China",
    "Colombia",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "Estonia",
    "Ethiopia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Greenland",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lithuania",
    "Luxembourg",
    "Malaysia",
    "Maldives",
    "Mexico",
    "Mongolia",
    "Morocco",
    "Myanmar",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "North Korea",
    "Norway",
    "Oman",
    "Pakistan",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Saudi Arabia",
    "Singapore",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];
  const select = document.getElementById("origin_country");
  if (!select) return;
  select.innerHTML = `<option value="">Select Country</option>`;
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.text = country;
    select.appendChild(option);
  });
}

function loadCountrycutDropdown() {
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Belgium",
    "Bhutan",
    "Bolivia",
    "Brazil",
    "Bulgaria",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Chile",
    "China",
    "Colombia",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "Estonia",
    "Ethiopia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Greenland",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lithuania",
    "Luxembourg",
    "Malaysia",
    "Maldives",
    "Mexico",
    "Mongolia",
    "Morocco",
    "Myanmar",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "North Korea",
    "Norway",
    "Oman",
    "Pakistan",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Saudi Arabia",
    "Singapore",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];
  const select = document.getElementById("country_cut");
  if (!select) return;
  select.innerHTML = `<option value="">Select Country</option>`;
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.text = country;
    select.appendChild(option);
  });
}

/* ================= PARTNER LOOKUP ================= */

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
  document
    .querySelectorAll(".partnerlookup, .partnerdatalookup")
    .forEach(function (dropdown) {
      const selectedValue = dropdown.value;
      dropdown.innerHTML = '<option value="">Select Partner</option>';

      partnerList.forEach(function (record) {
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
            <select class="partnerdatalookup">
                <option value="">Select Partner</option>
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
            <textarea class="partner-desc"></textarea>
        </td>
    `;

  tbody.appendChild(newRow);

  // Refill partner lookup for new row if function exists
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

/* ================= UNIT LOOKUP ================= */
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

/* ================= SURFACE LOOKUP ================= */
function loadSurfaceLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Surface",
  })
    .then(function (response) {
      const unitSelect = document.getElementById("surface_lookup");
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
      console.error("Surface lookup error:", error);
    });
}

/* ================= TREATMENT LOOKUP ================= */
function loadTreatmentLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Treatment",
  })
    .then(function (response) {
      const select = document.getElementById("treatment_lookup");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Treatment lookup error:", error);
    });
}

/* ================= SHAPE LOOKUP ================= */
function loadShapeLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Shape" })
    .then(function (response) {
      const select = document.getElementById("shape_lookup");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Shape lookup error:", error);
    });
}

/* ================= DIA SHAPE LOOKUP ================= */
function loaddiaShapeLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Shape" })
    .then(function (response) {
      const select = document.getElementById("dia_shape");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Dia Shape lookup error:", error);
    });
}

/* ================= DIAMOND COLOR LOOKUP ================= */
function loadDiaColorLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Color" })
    .then(function (response) {
      const select = document.getElementById("dia_color");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Colour lookup error:", error);
    });
}

/* ================= DIAMOND CLARITY LOOKUP ================= */
function loadDiaClarityLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Clarity",
  })
    .then(function (response) {
      const select = document.getElementById("dia_clarity");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Clarity lookup error:", error);
    });
}

/* ================= DIAMOND CUT LOOKUP ================= */
function loadDiaCutLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Cut" })
    .then(function (response) {
      const select = document.getElementById("dia_cut");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Cut lookup error:", error);
    });
}

/* ================= DIAMOND POLISH LOOKUP ================= */
function loadDiaPolishLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Polish" })
    .then(function (response) {
      const select = document.getElementById("dia_polish");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Polish lookup error:", error);
    });
}

/* ================= DIAMOND SYMMETRY LOOKUP ================= */
function loadDiaSymmetryLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Polish" })
    .then(function (response) {
      const select = document.getElementById("dia_symmetry");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Symmetry lookup error:", error);
    });
}

/* ================= DIAMOND CULET LOOKUP ================= */
function loadDiaCuletLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Cutlet" })
    .then(function (response) {
      const select = document.getElementById("dia_culet");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Culet lookup error:", error);
    });
}

/* ================= DIAMOND FLUORESCENCE LOOKUP ================= */
function loadDiaFluorescenceLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Fluroscence",
  })
    .then(function (response) {
      const select = document.getElementById("dia_fluorescence");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Fluorescence lookup error:", error);
    });
}

/* ================= DIAMOND FLUORESCENCE COLOR LOOKUP ================= */
function loadDiaFluorescenceColorLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Fluroscence_color",
  })
    .then(function (response) {
      const select = document.getElementById("dia_colour_fluorescence");
      if (!select) return;
      select.innerHTML = `<option value="">None</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Fluorescence color lookup error:", error);
    });
}

/* ================= SPECIES LOOKUP ================= */
function loadSpeciesLookup() {
  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Stone_Species",
  })
    .then(function (response) {
      const select = document.getElementById("species_lookup");
      if (!select) return;

      select.innerHTML = `<option value="">None</option>`;

      if (!response.data || response.data.length === 0) return;

      response.data.forEach(function (record) {
        speciesMap[record.ID] = record;

        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Species;
        select.appendChild(option);
      });

      // Initialize auto fill after loading species
      setupSpeciesAutoFill();
    })
    .catch(function (error) {
      console.error("Species lookup error:", error);
    });
}
/* ================= AUTO FILL SUB SPECIES ================= */
function setupSpeciesAutoFill() {
  const speciesSelect = document.getElementById("species_lookup");
  const subSpeciesField = document.getElementById("sub_species");

  if (!speciesSelect || !subSpeciesField) return;

  speciesSelect.addEventListener("change", function () {
    const selectedId = this.value;

    // If no species selected clear field
    if (!selectedId) {
      subSpeciesField.value = "";
      return;
    }

    // Get selected species record from speciesMap
    const selectedRecord = speciesMap[selectedId];

    if (selectedRecord && selectedRecord.Sub_species) {
      subSpeciesField.value = selectedRecord.Sub_species;
    } else {
      subSpeciesField.value = "";
    }
  });
}

/* ================= RAPPORT PRICE ================= */
function fetchRapportPrice() {
  // Lookup fields — .value gives the linked record ID
  const shapeId = document.getElementById("dia_shape")?.value;
  const colorId = document.getElementById("dia_color")?.value;
  const clarityId = document.getElementById("dia_clarity")?.value;
  const weight = parseFloat(document.getElementById("dia_weight")?.value);

  // console.log("IDs:", { shapeId, colorId, clarityId, weight });

  const priceEl = document.getElementById("rapport_price");

  if (!shapeId || !colorId || !clarityId || isNaN(weight) || weight <= 0) {
    if (priceEl) priceEl.value = "";
    return;
  }

  // Both forms share the same lookup tables so IDs match directly.
  // Use FieldName.ID = numericId for each lookup field.
  const criteria =
    "Shapes.ID = " +
    shapeId +
    " && Colors.ID = " +
    colorId +
    " && Claritys.ID = " +
    clarityId;

  console.log("CRITERIA:", criteria);

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Rapaport_Masters",
    criteria: criteria,
    max_records: 200,
  })
    .then(function (response) {
      console.log("FULL RESPONSE:", response);

      if (
        response.code !== 3000 ||
        !response.data ||
        response.data.length === 0
      ) {
        console.warn(
          "No Rapaport records returned — check IDs match Rapaport Master lookup IDs",
        );
        if (priceEl) priceEl.value = "";
        return;
      }

      console.log("SAMPLE RECORD:", response.data[0]);

      // Filter by weight — Weight_high_size1 must be >= the entered weight
      const filtered = response.data.filter(function (rec) {
        const highWeight = parseFloat(rec.Weight_high_size1);
        return !isNaN(highWeight) && highWeight >= weight;
      });

      console.log("WEIGHT FILTERED:", filtered);

      if (filtered.length === 0) {
        console.warn("No Rapaport record covers this weight");
        if (priceEl) priceEl.value = "";
        return;
      }

      // Smallest upper bound that still covers the entered weight
      const sorted = [...filtered].sort(
        (a, b) =>
          parseFloat(a.Weight_high_size1) - parseFloat(b.Weight_high_size1),
      );

      const price = sorted[0].Rapaport_Price || "";
      console.log("FINAL PRICE:", price);
      if (priceEl) priceEl.value = price;
    })
    .catch(function (error) {
      console.error("Rapaport fetch error:", error);
      if (priceEl) priceEl.value = "";
    });
}

/* ================= RAPPORT PRICE TRIGGERS ================= */
function initRapportPriceTriggers() {
  const shapeEl = document.getElementById("dia_shape");
  const colorEl = document.getElementById("dia_color");
  const clarityEl = document.getElementById("dia_clarity");
  const weightEl = document.getElementById("dia_weight");

  [shapeEl, colorEl, clarityEl].forEach(function (el) {
    if (el) el.addEventListener("change", fetchRapportPrice);
  });

  if (weightEl) weightEl.addEventListener("input", fetchRapportPrice);

  fetchRapportPrice();
}

/* ================= SPECIES CHANGE → HTS / CODE ================= */
const speciesLookupEl = document.getElementById("species_lookup");
if (speciesLookupEl) {
  speciesLookupEl.addEventListener("change", function () {
    const recordId = this.value;
    if (!recordId) {
      document.getElementById("hts_field").value = "";
      document.getElementById("code_field").value = "";
      return;
    }
    ZOHO.CREATOR.DATA.getRecordById({
      app_name: "feiny-app",
      report_name: "All_Stone_Species",
      id: recordId,
    })
      .then(function (response) {
        if (response.code !== 3000 || !response.data) return;
        document.getElementById("hts_field").value = response.data.HTS || "";
        document.getElementById("code_field").value =
          response.data.Default_Treatment_Code || "";
      })
      .catch(function (error) {
        console.error("Species record error:", error);
      });
  });
}

/* ================= HELPER FUNCTION - GET NUMBER ================= */
function getNumber(id) {
  let val = document.getElementById(id)?.value;
  if (!val) return null;
  val = val.trim().replace(",", ".");
  const num = Number(val);
  return isNaN(num) ? null : num;
}

/* =================================================================================
   Record Creation / Updatation - data Mapping
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

  // Common record data
  const recordData = {
    Select: itemType,
    In_SKU: In_SKU,
    Stock_On_Hand: getNumber("Stock_On_Hand"),
    Status: document.getElementById("Status")?.value || "",
    Treatment: document.getElementById("treatment_lookup")?.value || "",
    Species: document.getElementById("species_lookup")?.value || "",
    Sub_species: document.getElementById("sub_species")?.value || "",
    Surface: document.getElementById("surface_lookup")?.value || "",
    Shape: document.getElementById("shape_lookup")?.value || "",
    Origin: document.getElementById("origin_country")?.value || "",
    Country_of_Cut: document.getElementById("country_cut")?.value || "",
    HTS: document.getElementById("hts_field")?.value || "",
    Code: document.getElementById("code_field")?.value || "",
    Rapport_Price: getNumber("Rapport_Price"),
    Rough_Lot: document.getElementById("rough_lot")?.value || "",
    Name1: document.getElementById("cs_short_description")?.value || "",
    Long_Description:
      document.getElementById("cs_long_description")?.value || "",
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
    Shape3: document.getElementById("dia_shape")?.value || "",
    Color: document.getElementById("dia_color")?.value || "",
    Clarity: document.getElementById("dia_clarity")?.value || "",
    Cut: document.getElementById("dia_cut")?.value || "",
    Polish: document.getElementById("dia_polish")?.value || "",
    Culet: document.getElementById("dia_culet")?.value || "",
    Symmetry: document.getElementById("dia_symmetry")?.value || "",
    Fluorescence1: document.getElementById("dia_fluorescence")?.value || "",
    Fluorescence_Color:
      document.getElementById("dia_colour_fluorescence")?.value || "",
    Lab: document.getElementById("dia_lab")?.value || "",
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
    Short_Description1:
      document.getElementById("diashort_description")?.value || "",
    Long_Description2:
      document.getElementById("dialong_description")?.value || "",
    Style: document.getElementById("style")?.value || "",
    Jewellery__Type: document.getElementById("jewellery_type")?.value || "",
    Platinum: document.getElementById("platinum")?.value || "",
    Category: document.getElementById("category")?.value || "",
    Description3: document.getElementById("description")?.value || "",
    Gold: document.getElementById("gold")?.value || "",
    Production: document.getElementById("production")?.value || "",
    Instructions: document.getElementById("instructions")?.value || "",
    Country_Of_Origin1:
      document.getElementById("countries_origin")?.value || "",
    Size: document.getElementById("size")?.value || "",
    Weight_grams: getNumber("weight_grams"),
    Circa: document.getElementById("circa")?.value || "",
    Brand: document.getElementById("brand")?.value || "",
    HTS1: document.getElementById("hts_code")?.value || "",
    Notes: document.getElementById("notes")?.value || "",
    diamond: document.getElementById("diamond")?.value || "",
  };

  console.log("Saving config:", recordData);

  if (!recId) {
    /* ===============================
        ➕ CREATE - Record Creation - API CALL
    =============================== */
    const config = {
      app_name: "feiny-app",
      form_name: "Lot_Master",
      payload: {
        data: recordData,
      },
    };

    ZOHO.CREATOR.DATA.addRecords(config)
      .then(function (response) {
        console.log("✅ Created:", response);

        if (response.code === 3000 || response.code === "3000") {
          alert("✅ Record Saved Successfully");

          let recordId = null;
          if (
            response.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          )
            recordId = response.data[0].ID;
          else if (response.data && response.data.ID)
            recordId = response.data.ID;
          else if (response.details && response.details.id)
            recordId = response.details.id;
          else if (response.id) recordId = response.id;

          if (!recordId)
            throw new Error(
              "Record created but ID not found: " + JSON.stringify(response),
            );

          // Handle file uploads after create
          let uploadPromises = [];
          const certPromises = createCertificateRecords(In_SKU, recordId);
          if (certPromises && certPromises.length > 0)
            uploadPromises = uploadPromises.concat(certPromises);
          if (recordId && diaImageFile)
            uploadPromises.push(uploadDiaImage(recordId, diaImageFile));
          if (recordId && stoneImageFile)
            uploadPromises.push(uploadStoneImage(recordId, stoneImageFile));

          return Promise.all(uploadPromises);
        } else {
          throw new Error(
            "Failed to create record: " +
              (response.message || JSON.stringify(response)),
          );
        }
      })
      .then(function (uploadResults) {
        console.log("Upload results:", uploadResults);
        const successCount =
          uploadResults?.filter((u) => u.type === "certificate" && u.success)
            .length || 0;
        let message = "Record created successfully!";
        if (successCount > 0)
          message += ` ${successCount} certificate(s) created.`;
        alert(message);
        certificateFiles.clear();
        certificateFilesToUpload = [];

        // ✅ CLEAR PAGE AFTER SUCCESSFUL SAVE
        clearPageAfterSave();

        // Navigate to the report list
        ZOHO.CREATOR.UTIL.navigateTo({
          url: "#Report:All_Lot_Master",
          target: "same",
        });
      })
      .catch(function (error) {
        console.error("❌ Save Error:", error);
        alert("❌ Error: " + error.message);
      })
      .finally(function () {
        if (saveBtn) {
          saveBtn.textContent = originalText;
          saveBtn.disabled = false;
        }
      });
  } else {
    /* ===============================
        🔄 Record Updatation - API CALL
    =============================== */
    ZOHO.CREATOR.DATA.updateRecordById({
      app_name: "feiny-app",
      report_name: "All_Lot_Master",
      id: String(recId),
      payload: {
        data: recordData,
      },
    })
      .then(function (res) {
        console.log("✅ Updated:", res);

        if (res.code === 3000 || res.code === "3000") {
          alert("✅ Updated Successfully");

          // Handle file uploads after update
          let uploadPromises = [];

          // const certPromises = uploadCertificateFile(recId,"");
          const certPromises = createCertificateRecords(In_SKU, recId);
          if (certPromises && certPromises.length > 0)
            uploadPromises = uploadPromises.concat(certPromises);
          if (recId && diaImageFile)
            uploadPromises.push(uploadDiaImage(recId, diaImageFile));
          if (recId && stoneImageFile)
            uploadPromises.push(uploadStoneImage(recId, stoneImageFile));

          return Promise.all(uploadPromises);
        } else {
          throw new Error(
            "Failed to update record: " + (res.message || JSON.stringify(res)),
          );
        }
      })
      .then(function (uploadResults) {
        console.log("Upload results:", uploadResults);
        const successCount =
          uploadResults?.filter((u) => u.type === "certificate" && u.success)
            .length || 0;
        let message = "Record updated successfully!";
        if (successCount > 0)
          message += ` ${successCount} certificate(s) created.`;
        alert(message);
        certificateFiles.clear();
        certificateFilesToUpload = [];

        // ✅ CLEAR PAGE AFTER SUCCESSFUL UPDATE
        clearPageAfterSave();

        ZOHO.CREATOR.UTIL.navigateTo({
          url: "#Report:All_Lot_Master",
          target: "same",
        });
      })
      .catch(function (error) {
        console.error("❌ Save Error:", error);
        alert("❌ Error: " + error.message);
      })
      .finally(function () {
        if (saveBtn) {
          saveBtn.textContent = originalText;
          saveBtn.disabled = false;
        }
      });
  }
}

/* ================= DIAMOND IMAGE UPLOAD ================= */
function uploadDiaImage(recordId, file) {
  return new Promise(function (resolve, reject) {
    ZOHO.CREATOR.FILE.uploadFile({
      app_name: "feiny-app",
      report_name: "All_Lot_Master",
      id: recordId,
      field_name: "item_Image",
      file: file,
    })
      .then(function (response) {
        if (response.code === 3000 || response.code === "3000") {
          setImagePreview(file);
          ZOHO.CREATOR.DATA.invokeCustomApi({
            api_name: "imageupload",
            workspace_name: "ankit_feiny",
            http_method: "POST",
            content_type: "application/json",
            payload: { IDd: recordId, fileFormat: file.name },
            public_key: "2hXJDxEmMyekhJ7yFtrJV5n14",
          })
            .then((r) => console.log("Custom API SUCCESS:", r))
            .catch((e) => console.error("Custom API ERROR:", e));
          resolve({ type: "image", success: true });
        } else {
          reject(new Error(response.message || "Upload failed"));
        }
      })
      .catch(reject);
  });
}
function setImagePreview(file) {
  diaImageFile = file;
  const preview = document.getElementById("imagePreview");
  if (preview && file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
}

const preview = document.getElementById("imagePreview");
if (preview) {
  preview.style.cursor = "pointer";
  preview.onclick = function () {
    if (preview.src) window.open(preview.src, "_blank");
  };
}

/* ================= STONE IMAGE UPLOAD ================= */
function uploadStoneImage(recordId, file) {
  return new Promise(function (resolve, reject) {
    ZOHO.CREATOR.FILE.uploadFile({
      app_name: "feiny-app",
      report_name: "All_Lot_Master",
      id: recordId,
      field_name: "item_Image",
      file: file,
    })
      .then(function (response) {
        if (response.code === 3000 || response.code === "3000") {
          return ZOHO.CREATOR.DATA.invokeCustomApi({
            api_name: "imageupload",
            workspace_name: "ankit_feiny",
            http_method: "POST",
            content_type: "application/json",
            payload: { IDd: recordId, fileFormat: file.name },
            public_key: "2hXJDxEmMyekhJ7yFtrJV5n14",
          });
        } else {
          throw new Error(response.message || "Stone image upload failed");
        }
      })
      .then((r) => {
        console.log("Stone custom API SUCCESS:", r);
        resolve({ type: "stoneImage", success: true });
      })
      .catch(reject);
  });
}
// ----------------Upload Certificate File-------------

function uploadCertificateFile(recordId, file) {
  console.log(uploadCertificateFile, recordId, file);
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
          reject(
            new Error(response.message || "Certificate file upload failed"),
          );
        }
      })
      .catch(reject);
  });
}

/* ================= CREATE CERTIFICATE RECORDS ================= */
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
    // -- ROw ID ---
    // const rowUniqueID = row.getAttribute("data-id");
    const rowUniqueID = row.querySelector(".cert-rowUnique-id");
    console.log(
      "rowUniqueID -- " + rowUniqueID + " --- labDescSelect" + labDescSelect,
    );
    const idValue = idInput?.value || "";
    const fileExists = fileInput?.files && fileInput.files.length > 0;

    let dateValue = "";
    if (dateInput && dateInput.value) {
      const dateObj = new Date(dateInput.value);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      dateValue = `${day}-${month}-${year}`;
    }

    const notesValue = notesInput?.value || "";
    const labValue = labSelect?.value || "";
    const labDescValue = labDescSelect?.value || "";
    const labSupValue = labSupSelect?.value || "";

    const hasData =
      idValue ||
      fileExists ||
      dateValue ||
      notesValue ||
      labValue ||
      labDescValue ||
      labSupValue;
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
    console.log("UpdateLog --", certData);

    // ========= Update Existing Row =============
    if (rowUniqueID.value != null && rowUniqueID.value != "") {
      console.log("UpdateLog --", certData);
      console.log("upload certificate record for row: " + rowUniqueID);

      // ======= ROw Data update
      const updatePromise = ZOHO.CREATOR.DATA.updateRecordById({
        app_name: "feiny-app",
        report_name: "All_Certificate_Details",
        id: String(rowUniqueID.value),
        payload: {
          data: certData,
        },
      })
        .then(function (res) {
          console.log("ROw Update Response", res);
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
      console.log("Createlog --", certData);
      // ========= Create New Row =============
      const promise = new Promise((resolve) => {
        ZOHO.CREATOR.DATA.addRecords({
          app_name: "feiny-app",
          form_name: "Certificate_Uploads",
          payload: { data: certData },
        })
          .then(function (response) {
            let certRecordId = null;
            if (response.code === 3000 || response.code === "3000") {
              if (
                response.data &&
                Array.isArray(response.data) &&
                response.data.length > 0
              )
                certRecordId = response.data[0].ID;
              else if (response.data && response.data.ID)
                certRecordId = response.data.ID;
              else if (response.details && response.details.id)
                certRecordId = response.details.id;
              else if (response.id) certRecordId = response.id;
            }
            if (certRecordId && fileExists) {
              return uploadCertificateFile(certRecordId, fileInput.files[0])
                .then(() =>
                  resolve({
                    type: "certificate",
                    success: true,
                    index,
                    sku: skuValue,
                    recordId: certRecordId,
                  }),
                )
                .catch((err) =>
                  resolve({
                    type: "certificate",
                    success: true,
                    fileUploadFailed: true,
                    index,
                    error: err.message,
                  }),
                );
            } else {
              resolve({
                type: "certificate",
                success: true,
                index,
                sku: skuValue,
                recordId: certRecordId,
                noFile: true,
              });
            }
          })
          .catch(function (error) {
            resolve({
              type: "certificate",
              success: false,
              error: error.message,
              index,
              sku: skuValue,
            });
          });
      });

      promises.push(promise);
    }
  });

  return promises;
}

/* ================= GET PARTNERSHIP SUBFORM DATA ================= */

function getPartnerRowsData() {
  const partnerRows = [];

  document
    .querySelectorAll("#partnerBody .partner-row")
    .forEach(function (row) {
      partnerRows.push({
        Partner_Name:
          row.querySelector(".partnerdatalookup")?.ID ||
          row.querySelector(".partnerdatalookup")?.value ||
          "",

        Partnership_shares: row.querySelector(".partner-share")?.value || "",

        Partnership: row.querySelector(".partner-percent")?.value || "",

        Commission: row.querySelector(".commission-percent")?.value || "",

        Description: row.querySelector(".partner-desc")?.value || "",

        Commission_Itemized_on_Invoice:
          row.querySelector(".commission-itemized")?.checked || false,
      });
    });

  return partnerRows;
}

/* ================= CLEAR FULL PAGE AFTER SAVE ================= */

function clearPageAfterSave() {
  // ---------------- BASIC FIELDS ----------------
  document.querySelectorAll("input, textarea, select").forEach(function (el) {
    if (el.type === "button" || el.type === "submit" || el.type === "hidden") {
      return;
    }

    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = false;
    } else if (el.type === "file") {
      el.value = "";
    } else {
      el.value = "";
    }
  });

  // ---------------- RESET DEFAULT SELECT OPTIONS ----------------
  document.querySelectorAll("select").forEach(function (sel) {
    sel.selectedIndex = 0;
  });

  // ---------------- CLEAR IMAGES ----------------
  diaImageFile = null;
  stoneImageFile = null;

  let diaPrev = document.getElementById("imagePreview");
  if (diaPrev) {
    diaPrev.src = "";
    diaPrev.style.display = "none";
  }

  let stonePrev = document.getElementById("stoneImagePreview");
  if (stonePrev) {
    stonePrev.src = "";
    stonePrev.style.display = "none";
  }

  let clearImg = document.getElementById("clearImage");
  if (clearImg) {
    clearImg.style.display = "none";
  }

  let clearStone = document.getElementById("clearStoneImage");
  if (clearStone) {
    clearStone.style.display = "none";
  }

  if (document.getElementById("diamand_imageText")) {
    document.getElementById("diamand_imageText").style.display = "block";
  }

  if (document.getElementById("imageText")) {
    document.getElementById("imageText").style.display = "block";
  }

  // ---------------- CLEAR CERTIFICATE SUBFORM ----------------
  let certBody = document.getElementById("certificateBody");

  if (certBody) {
    certBody.innerHTML = "";
    addCertificateRow(); // add one blank row
  }

  certificateFiles.clear();
  certificateFilesToUpload = [];

  // ---------------- CLEAR PARTNERSHIP SUBFORM ----------------
  let partnerBody = document.getElementById("partnerBody");

  if (partnerBody) {
    partnerBody.innerHTML = "";
    addPartnerRow();
  }

  // ---------------- CLEAR AUTO CALCULATED FIELDS ----------------
  [
    "total_price",
    "rapport_price",
    "Rapport_Price",
    "cs_short_description",
    "cs_long_description",
    "diashort_description",
    "dialong_description",
    "hts_field",
    "code_field",
  ].forEach(function (id) {
    let f = document.getElementById(id);
    if (f) {
      f.value = "";
    }
  });

  // ---------------- HIDE CONDITIONAL SECTIONS ----------------
  [
    "colorStoneSection",
    "diamondSection",
    "jewelleryWrapper",
    "pricingSection",
    "Dimensionssection",
    "neededcertificatesec",
    "certificateuploadsec",
    "partnershipsec",
  ].forEach(function (id) {
    let sec = document.getElementById(id);
    if (sec) {
      sec.style.display = "none";
    }
  });

  // ---------------- RESET GLOBAL VARIABLES ----------------
  recId = null;
  lot_edit = false;

  // optional scroll top
  window.scrollTo(0, 0);

  console.log("Form Cleared Successfully");
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

      // -- Image Stone Preview Code ---

      // let fullUrl = "https://creator.zoho.com/api/v2.1/ankit_feiny/feiny-app/report/All_Lot_Master/4904766000000663048/item_Image/download?filepath=1777292396643738_apac_primary_fullcolour-e1485885228203__1_.png"
      let fullUrl = "https://creator.zoho.com" + data.item_Image;
      let frame = document.getElementById("stoneImagePreview");
      frame.src = fullUrl;
      frame.style.display = "block";
      document.getElementById("imageText").style.display = "none";
      document.getElementById("clearStoneImage").style.display = "block";

      // --- Image Preview End----

      /* ================= DIAMOND IMAGE PREVIEW ================= */

      // Replace Diamond_Image with your actual field link name
      let diaFullUrl = "https://creator.zoho.com" + data.item_Image;
      let diaFrame = document.getElementById("imagePreview");

      diaFrame.src = diaFullUrl;
      diaFrame.style.display = "block";

      document.getElementById("diamand_imageText").style.display = "none";
      document.getElementById("clearImage").style.display = "block";

      ///------DIAMOND IMAGE PREVIEW END---- ///

      document.getElementById("In_SKU").value = data.In_SKU || "";
      document.getElementById("itemType").value = data.Select || "";
      document.getElementById("surface_lookup").value = data.Surface?.ID || "";
      document.getElementById("species_lookup").value = data.Species?.ID || "";
      document.getElementById("treatment_lookup").value =
        data.Treatment?.ID || "";
      document.getElementById("shape_lookup").value = data.Shape?.ID || "";
      document.getElementById("origin_country").value = data.Origin || "";
      document.getElementById("country_cut").value = data.Country_of_Cut || "";
      document.getElementById("hts_field").value = data.HTS || "";
      document.getElementById("code_field").value = data.Code || "";
      document.getElementById("cs_short_description").value = data.Name1 || "";
      document.getElementById("cs_long_description").value =
        data.Long_Description || "";
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
      document.getElementById("certificate_details").value =
        data.Description2 || "";
      document.getElementById("Price4").value = data.Price4 || "";
      document.getElementById("MinimumPrice").value = data.Minimum_Price || "";
      document.getElementById("unit_lookup").value = data.Unit?.ID || "";

      // DIAMOND FIELDS
      document.getElementById("dia_shape").value = data.Shape3?.ID || "";
      document.getElementById("dia_color").value = data.Color?.ID || "";
      document.getElementById("dia_clarity").value = data.Clarity?.ID || "";
      document.getElementById("dia_cut").value = data.Cut?.ID || "";
      document.getElementById("dia_polish").value = data.Polish?.ID || "";
      document.getElementById("dia_symmetry").value = data.Symmetry?.ID || "";
      document.getElementById("dia_culet").value = data.Culet?.ID || "";
      document.getElementById("dia_fluorescence").value =
        data.Fluorescence1?.ID || "";
      document.getElementById("dia_colour_fluorescence").value =
        data.Fluorescence_Color?.ID || "";
      document.getElementById("dia_length").value = data.Length_mm || "";
      document.getElementById("dia_width").value = data.Width_mm || "";
      document.getElementById("dia_depth").value = data.Depth1 || "";
      document.getElementById("dia_table").value = data.Table || "";
      document.getElementById("dia_depth_percent").value = data.Depth2 || "";
      document.getElementById("quantity").value = data.Quantity || "";
      document.getElementById("dia_weight").value = data.Weight_Ct || "";
      document.getElementById("price_per_carat").value =
        data.Price_Per_carat || "";
      document.getElementById("total_price").value = data.Total_Price || "";
      document.getElementById("rapport_price").value =
        data.Rapport_Price1 || "";
      document.getElementById("diashort_description").value =
        data.Short_Description1 || "";
      document.getElementById("dialong_description").value =
        data.Long_Description2 || "";

      /* ─── CERTIFICATE UPLOADS SUBFORM ─── */
      loadCertificateSubform(recordID);

      /* ─── PARTNERSHIP DETAILS SUBFORM ─── */
      var partnerData = data.Partnership_Details;
      var partnerTbody = document.getElementById("partnerBody");
      partnerTbody.innerHTML = "";

      if (partnerData && partnerData.length > 0) {
        partnerData.forEach(function (item) {
          var tr = document.createElement("tr");
          tr.classList.add("partner-row");

          tr.innerHTML = `
    <td>
      <select class="partnerdatalookup">
        <option value="">Select Partner</option>
      </select>
    </td>
    <td><input type="text" class="partner-share" value="${
      item.Partnership_shares || ""
    }"></td>
    <td><input type="text" class="partner-percent" value="${
      item.Partnership || ""
    }"></td>
    <td><input type="text" class="commission-percent" value="${
      item.Commission || ""
    }"></td>
    <td style="text-align:center">
      <input type="checkbox" class="commission-itemized" ${
        item.Commission_Itemized_on_Invoice === "true" ? "checked" : ""
      }>
    </td>
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
    })
    .catch(function (err) {
      console.error("loadExistingRecord error:", err);
    });
}

/* ─── Date string from Zoho (dd-Mon-yyyy or ISO) → yyyy-mm-dd for <input type="date"> ─── */
function formatToYYYYMMDD(dateStr) {
  if (!dateStr) return "";

  // ISO format: 2026-04-20T00:00:00+05:30
  if (dateStr.includes("T")) return dateStr.split("T")[0];

  // Zoho Creator format: 20-Apr-2026
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [day, monthStr, year] = parts;
      const months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12",
      };
      const month = months[monthStr];
      if (month) return `${year}-${month}-${day.padStart(2, "0")}`;
    }
  }

  return "";
}

/* =================================================================================
   LOAD CERTIFICATE SUBFORM ROWS
================================================================================= */
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

      // Newest first
      certData
        .slice()
        .reverse()
        .forEach(function (item) {
          // Date formatting for <input type="date">
          const formattedDate = formatToYYYYMMDD(item.Date_field);
          const tr = document.createElement("tr");
          tr.classList.add("cert-row");
          tr.dataset.certRecordId = item.ID || "";

          tr.innerHTML = `
        <td>
          <button type="button" class="remove-btn" onclick="removeRow(this)">❌</button>
        </td>
        <td>
          <input class="cert-id" value="${item.ID1 || ""}">
        </td>
        <td class="cert-file-cell"></td>
        <td><input type="date" class="cert-date" value="${formattedDate}"></td>
        <td>
          <textarea class="cert-notes">${item.Notes || ""}</textarea>
        </td>
        <td><select class="cert-lab"></select></td>
        <td><select class="cert-lab-desc"></select></td>
        <td><select class="cert-lab-sup"></select></td>
        <td>
          <input type="text" class="cert-rowUnique-id" value="${item.ID || ""}">
        </td>
      `;

          certTbody.appendChild(tr);

          const fileCell = tr.querySelector(".cert-file-cell");

          if (item.Certificate_Single) {
            const fullUrl =
              "https://creator.zoho.com" + item.Certificate_Single;

            function getFileNameFromUrl(url) {
              try {
                const decodedUrl = decodeURIComponent(url);
                const match = decodedUrl.match(/[?&]filepath=([^&]+)/);

                let fileName =
                  match && match[1] ? match[1] : decodedUrl.split("/").pop();

                fileName = fileName || "Download File";
                fileName = fileName.replace(/^\d+_/, "");

                return fileName;
              } catch (e) {
                return "Download File";
              }
            }

            const fileName = getFileNameFromUrl(fullUrl);

            fileCell.innerHTML = `
  <a href="${fullUrl}" target="_blank" rel="noopener noreferrer">
    ${fileName}
  </a>
`;
          } else {
            fileCell.innerHTML = "No file";
          }

          populateRowSelects(tr);

          // Set saved dropdown values after options are injected
          setTimeout(function () {
            tr.querySelector(".cert-lab").value = item.Lab?.ID || "";
            tr.querySelector(".cert-lab-desc").value =
              item.Lab_Descriptor?.ID || "";
            tr.querySelector(".cert-lab-sup").value =
              item.Laboratory_Supplement?.ID || "";
          }, 300);
        });
    })
    .catch(function (error) {
      console.error("Error fetching certificate subform:", error);
      addCertificateRow();
    });
}
