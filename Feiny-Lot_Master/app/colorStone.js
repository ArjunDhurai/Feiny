/* =================================================================================
    COLOR STONE — Lookups, Auto Description, Image Upload, Species Logic
  ================================================================================= */

/* ================= TREATMENT LOOKUP ================= */
function loadTreatmentLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Treatment" })
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

/* ================= SHAPE LOOKUP (Color Stone) ================= */
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

/* ================= SURFACE LOOKUP ================= */
function loadSurfaceLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "All_Surface" })
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

/* ================= SPECIES LOOKUP ================= */
function loadSpeciesLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "All_Stone_Species" })
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
    if (!selectedId) { subSpeciesField.value = ""; return; }
    const selectedRecord = speciesMap[selectedId];
    subSpeciesField.value = selectedRecord?.Sub_species || "";
  });
}

/* ================= SPECIES CHANGE → HTS / CODE ================= */
document.addEventListener("DOMContentLoaded", function () {
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
          document.getElementById("code_field").value = response.data.Default_Treatment_Code || "";
        })
        .catch(function (error) {
          console.error("Species record error:", error);
        });
    });
  }
});

/* ================= COUNTRY OF ORIGIN DROPDOWN ================= */
function loadCountryDropdown() {
  const countries = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
    "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Belgium",
    "Bhutan","Bolivia","Brazil","Bulgaria","Cambodia","Cameroon","Canada","Chile",
    "China","Colombia","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
    "Denmark","Dominican Republic","Ecuador","Egypt","Estonia","Ethiopia","Finland",
    "France","Georgia","Germany","Ghana","Greece","Greenland","Hungary","Iceland",
    "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
    "Jordan","Kazakhstan","Kenya","Kuwait","Laos","Latvia","Lebanon","Lithuania",
    "Luxembourg","Malaysia","Maldives","Mexico","Mongolia","Morocco","Myanmar",
    "Nepal","Netherlands","New Zealand","Nigeria","North Korea","Norway","Oman",
    "Pakistan","Philippines","Poland","Portugal","Qatar","Romania","Russia",
    "Saudi Arabia","Singapore","South Africa","South Korea","Spain","Sri Lanka",
    "Sweden","Switzerland","Thailand","Turkey","Ukraine","United Arab Emirates",
    "United Kingdom","United States","Uruguay","Uzbekistan","Vietnam","Yemen",
    "Zambia","Zimbabwe",
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

/* ================= COUNTRY OF CUT DROPDOWN ================= */
function loadCountrycutDropdown() {
  const countries = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
    "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Belgium",
    "Bhutan","Bolivia","Brazil","Bulgaria","Cambodia","Cameroon","Canada","Chile",
    "China","Colombia","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic",
    "Denmark","Dominican Republic","Ecuador","Egypt","Estonia","Ethiopia","Finland",
    "France","Georgia","Germany","Ghana","Greece","Greenland","Hungary","Iceland",
    "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
    "Jordan","Kazakhstan","Kenya","Kuwait","Laos","Latvia","Lebanon","Lithuania",
    "Luxembourg","Malaysia","Maldives","Mexico","Mongolia","Morocco","Myanmar",
    "Nepal","Netherlands","New Zealand","Nigeria","North Korea","Norway","Oman",
    "Pakistan","Philippines","Poland","Portugal","Qatar","Romania","Russia",
    "Saudi Arabia","Singapore","South Africa","South Korea","Spain","Sri Lanka",
    "Sweden","Switzerland","Thailand","Turkey","Ukraine","United Arab Emirates",
    "United Kingdom","United States","Uruguay","Uzbekistan","Vietnam","Yemen",
    "Zambia","Zimbabwe",
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

/* ================= COLOR STONE AUTO DESCRIPTION ================= */
document.addEventListener("DOMContentLoaded", function () {
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
    const shortText = [treatment, species, surface, shape].filter(Boolean).join(" ");
    const longText = [treatment, species, surface, shape].filter(Boolean).join(", ");
    if (shortDescEl) shortDescEl.value = shortText;
    if (longDescEl) longDescEl.value = longText;
  }

  [treatmentEl, speciesEl, surfaceEl, shapeEl].forEach((el) => {
    if (el) el.addEventListener("change", stoneupdateDescriptions);
  });

  stoneupdateDescriptions();
});

/* ================= STONE IMAGE UPLOAD ================= */
document.addEventListener("DOMContentLoaded", function () {
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

/* ================= STONE IMAGE UPLOAD TO ZOHO ================= */
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

/* ================= CODE LOOKUP (used in Color Stone) ================= */
function loadCodeLookup() {
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Code" })
    .then(function (response) {
      const codeSelect = document.getElementById("code_field");
      if (!codeSelect) return;
      codeSelect.innerHTML = `<option value="">Select Code</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1 || record.Code;
        codeSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Code lookup error:", error);
    });
}
