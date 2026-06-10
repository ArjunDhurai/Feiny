// Date: 2024-06-20 time: 12:00 PM  ddddyy
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
  let unitLookupData = null;

  /* ─── Cached lookup data for the four fixed lookups ─── */
  let culetLookupData = null;
  let fluorescenceLookupData = null;
  let fluorescenceColorLookupData = null;
  let speciesLookupData = null;

  /* ─── Safe error message extractor ─── */
  function getErrorMessage(err) {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;

    if (err.responseText) {
      try {
        const parsed = JSON.parse(err.responseText);
        return parsed.message || parsed.code || err.responseText;
      } catch (e) {
        return err.responseText;
      }
    }

    if (err.message) return err.message;
    if (err.error) return err.error;
    return JSON.stringify(err);
  }

  /* ─── Clean null/undefined top-level fields ─── */
  function cleanRecordData(obj) {
    const cleaned = {};
    Object.keys(obj).forEach(function (key) {
      const val = obj[key];
      // Keep booleans (false is valid), keep 0, skip only null/undefined
      if (val === null || val === undefined) return;
      cleaned[key] = val;
    });
    return cleaned;
  }

  function getLookupId(value) {
    if (!value) return "";
    if (typeof value === "object") {
      return value.ID || value.id || value.value || "";
    }
    return String(value);
  }

  function getLookupDisplayValue(value) {
    if (!value) return "";
    if (typeof value === "object") {
      return (
        value.zc_display_value ||
        value.display_value ||
        value.Name ||
        value.Customer_Name ||
        value.Legal_Name ||
        value.Full_Name ||
        value.Display_Name ||
        value.ID ||
        ""
      );
    }
    return String(value);
  }

  function ensureSelectOption(select, value, text) {
    if (!select || !value) return;

    const valueText = String(value);
    const exists = Array.from(select.options).some(function (option) {
      return option.value === valueText;
    });

    if (!exists) {
      const option = document.createElement("option");
      option.value = valueText;
      option.text = text || valueText;
      select.appendChild(option);
    }

    select.value = valueText;
  }

  /* ─── Clean subform rows: remove nulls inside each row, skip fully empty rows ─── */
  function cleanSubformRows(rows) {
    if (!Array.isArray(rows)) return [];
    return rows
      .map(function (row) {
        const cleaned = {};
        const hasExistingId =
          row.ID !== null && row.ID !== undefined && String(row.ID).trim() !== "";

        Object.keys(row).forEach(function (key) {
          const val = row[key];
          if (val === null || val === undefined) return;
          if (
            typeof val === "string" &&
            val.trim() === "" &&
            key !== "ID" &&
            !hasExistingId
          ) {
            return;
          }
          cleaned[key] = val;
        });
        return cleaned;
      })
      .filter(function (row) {
        const meaningfulKeys = Object.keys(row).filter(function (k) {
          return k !== "ID";
        });
        return meaningfulKeys.length > 0;
      });
  }

  /* ================= DIAMOND DESCRIPTION HELPERS ================= */

  /* Maps full select text → short abbreviation for the short description */
  const DIA_SHORT_MAP = {
    // Shapes
    "Oval": "OV", "Round": "RD", "Princess": "PR", "Cushion": "CU",
    "Emerald": "EM", "Asscher": "AS", "Radiant": "RA", "Pear": "PE",
    "Marquise": "MQ", "Heart": "HT", "Trillion": "TR", "Baguette": "BG",

    // Cut / Polish / Symmetry grades
    "Excellent": "X", "Very Good": "VG", "Good": "G",
    "Fair": "F", "Poor": "P",

    // Fluorescence
    "None": null,
    "Faint": "Fnt",
    "Medium": "Med",
    "Strong": "Str",
    "Very Strong": "VSt",

    // Fluorescence Color
    "Blue": "Blue", "Yellow": "Yel", "Green": "Grn",
    "Orange": "Org", "White": "Wht",
  };

  function abbr(text) {
    if (!text) return "";
    return DIA_SHORT_MAP.hasOwnProperty(text) ? (DIA_SHORT_MAP[text] || "") : text;
  }

  function buildDiamondDescriptions({
    shape, color, clarity, cut, polish, symmetry,
    culet, fluorescence, fluorescenceColor,
    length, width, depth,
    labName, certId
  }) {
    /* ── Dimensions string ── */
    const dims = [length, width, depth]
      .map(v => (v && !isNaN(parseFloat(v))) ? parseFloat(v).toFixed(2) : null)
      .filter(Boolean);
    const dimsLong  = dims.length === 3 ? `${dims[0]} x ${dims[1]} x ${dims[2]}mm` : "";
    const dimsShort = dims.length === 3 ? `${dims[0]}X${dims[1]}X${dims[2]}MM`     : "";

    /* ── Certificate block (only if both lab and ID exist) ── */
    const certLong  = (labName && certId) ? `(${labName} ${certId})` : "";

    /* ── Fluorescence block — omit entirely if none/empty ── */
    const fluor = fluorescence && fluorescence.toLowerCase() !== "none" ? fluorescence : "";
    const fluorColor = (fluor && fluorescenceColor) ? fluorescenceColor : "";
    const fluorLong  = fluor ? `${fluor}${fluorColor ? " " + fluorColor : ""}` : "";
    const fluorShort = fluor ? `${abbr(fluor)}${fluorColor ? " " + abbr(fluorColor) : ""}`.trim() : "";

    /* ─────────────── LONG DESCRIPTION ─────────────── */
    let longParts = ["Diamond"];
    if (shape)    longParts.push(shape);
    if (dimsLong) longParts.push(dimsLong);
    if (certLong) longParts.push(certLong);

    let gradeBlock = [];
    if (color)   gradeBlock.push(`${color} color`);
    if (clarity) gradeBlock.push(`${clarity} clarity`);
    let gradeLine = gradeBlock.join(", ");

    let gradeParts = [];
    if (gradeLine) gradeParts.push(gradeLine);
    if (cut)       gradeParts.push(`| Cut: ${cut}`);
    if (polish)    gradeParts.push(`| Polish: ${polish}`);
    if (symmetry)  gradeParts.push(`| Symmetry: ${symmetry}`);
    if (fluorLong) gradeParts.push(`| ${fluorLong}`);

    if (gradeParts.length) longParts.push(gradeParts.join(" "));
    const longDesc = longParts.join(" ");

    /* ─────────────── SHORT DESCRIPTION ─────────────── */
    let shortParts = ["DIA"];
    if (shape)     shortParts.push(abbr(shape) || shape.toUpperCase().slice(0, 3));
    if (dimsShort) shortParts.push(dimsShort);

    let colorClarity = [color, clarity].filter(Boolean).join("-");
    if (colorClarity) shortParts.push(colorClarity);

    let cps = [abbr(cut), abbr(polish), abbr(symmetry)].filter(Boolean);
    if (cps.length) shortParts.push(cps.join("-"));

    if (fluorShort) shortParts.push(fluorShort);

    const shortDesc = shortParts.join(" ");

    return { longDesc, shortDesc };
  }

  /* ── Pull first cert row's lab name and cert ID ── */
  function getFirstCertInfo() {
    const firstRow = document.querySelector("#certificateBody tr.cert-row");
    if (!firstRow) return { labName: "", certId: "" };
    const labSelect = firstRow.querySelector(".cert-lab");
    const labName = labSelect?.selectedOptions[0]?.text?.trim() || "";
    const certIdInput = firstRow.querySelector(".cert-id");
    const certId = certIdInput?.value?.trim() || "";
    const cleanLab = (labName === "Select" || labName === "") ? "" : labName;
    return { labName: cleanLab, certId };
  }

  /* =====================================================
     AUTO SELECT FEI IN FIRST ROW  (GLOBAL — called after any partner dropdown is populated)
  ===================================================== */
  function setDefaultFEI() {
    // NORMAL PARTNERSHIP
    const firstPartnerDropdown = document.querySelector(
      "#partnerBody tr.partner-row .partnerdatalookup"
    );
    if (firstPartnerDropdown && !firstPartnerDropdown.value) {
      const feiOption = Array.from(firstPartnerDropdown.options).find(function (option) {
        return option.text.trim().toUpperCase() === "FEI";
      });
      if (feiOption) {
        firstPartnerDropdown.value = feiOption.value;
      }
    }

    // JEWELLERY PARTNERSHIP
    const firstJewelleryDropdown = document.querySelector(
      "#jewelleryPartnershipBody tr.jewellery-partnership-row .jp_partner_select_contact"
    );
    if (firstJewelleryDropdown && !firstJewelleryDropdown.value) {
      const feiOption = Array.from(firstJewelleryDropdown.options).find(function (option) {
        return option.text.trim().toUpperCase() === "FEI";
      });
      if (feiOption) {
        firstJewelleryDropdown.value = feiOption.value;
      }
    }
  }

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
        show(certificateuploadsec);
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

    document.addEventListener("change", function (e) {
      if (e.target && e.target.id === "itemType") {
        setTimeout(applyVisibility, 100);
      }
    });

    const observer = new MutationObserver(function () {
      if (document.getElementById("itemType") && !isApplying) {
        applyVisibility();
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
    typeof loadDiaFluorescenceLookup === "function" && loadDiaFluorescenceLookup();
    typeof loadDiaFluorescenceColorLookup === "function" && loadDiaFluorescenceColorLookup();
    typeof loaddiaShapeLookup === "function" && loaddiaShapeLookup();
    typeof loadPartnerLookup === "function" && loadPartnerLookup();
    typeof initTotalCalculation === "function" && initTotalCalculation();
    typeof initRapportPriceTriggers === "function" && initRapportPriceTriggers();
    typeof loadCertificateSubformLookups === "function" && loadCertificateSubformLookups();
    typeof loadJewelleryTypeLookup === "function" && loadJewelleryTypeLookup();
    typeof loadBrandLookup === "function" && loadBrandLookup();
    typeof loadContactLookup === "function" && loadContactLookup();
    typeof loadDiamondLookup === "function" && loadDiamondLookup();
    typeof loadUnitLookup === "function" && loadUnitLookup();
    typeof loadMetalTypeLookup === "function" && loadMetalTypeLookup();
    typeof loadPurityLookup === "function" && loadPurityLookup();
    typeof loadColorLookup === "function" && loadColorLookup();
    typeof loadCutLookup === "function" && loadCutLookup();
    typeof loadClarityLookup === "function" && loadClarityLookup();
    typeof loadOriginCountryDropdown === "function" && loadOriginCountryDropdown();
    typeof loadcategoryLookup === "function" && loadcategoryLookup();
    typeof loadStoneLookup === "function" && loadStoneLookup();

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
      const shortText = [treatment, species, surface, shape].filter(Boolean).join(" ");
      const longText = [treatment, species, surface, shape].filter(Boolean).join(", ");
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
    const diafluorescencecolorEl = document.getElementById("dia_colour_fluorescence");
    const diashortDescEl = document.getElementById("diashort_description");
    const dialongDescEl = document.getElementById("dialong_description");

    function updateDescriptions() {
      const { labName, certId } = getFirstCertInfo();
      const { longDesc, shortDesc } = buildDiamondDescriptions({
        shape:             diashapeEl?.selectedOptions[0]?.text || "",
        color:             diacolorEl?.selectedOptions[0]?.text || "",
        clarity:           diaclarityEl?.selectedOptions[0]?.text || "",
        cut:               diacutEl?.selectedOptions[0]?.text || "",
        polish:            diapolishEl?.selectedOptions[0]?.text || "",
        symmetry:          diasymmetryEl?.selectedOptions[0]?.text || "",
        culet:             diaculetEl?.selectedOptions[0]?.text || "",
        fluorescence:      diafluorescenceEl?.selectedOptions[0]?.text || "",
        fluorescenceColor: diafluorescencecolorEl?.selectedOptions[0]?.text || "",
        length: document.getElementById("dia_length")?.value || "",
        width:  document.getElementById("dia_width")?.value  || "",
        depth:  document.getElementById("dia_depth")?.value  || "",
        labName,
        certId,
      });
      if (diashortDescEl) diashortDescEl.value = shortDesc;
      if (dialongDescEl)  dialongDescEl.value  = longDesc;
    }

    [
      diashapeEl, diacolorEl, diaclarityEl, shapeEl, diacutEl,
      diapolishEl, diasymmetryEl, diaculetEl, diafluorescenceEl, diafluorescencecolorEl,
    ].forEach((el) => {
      if (el) el.addEventListener("change", updateDescriptions);
    });

    ["dia_length", "dia_width", "dia_depth"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", updateDescriptions);
    });

    /* Cert row lab/id changes should also refresh descriptions */
    document.addEventListener("change", function (e) {
      if (e.target && e.target.classList.contains("cert-lab")) {
        updateDescriptions();
      }
    });
    document.addEventListener("input", function (e) {
      if (e.target && e.target.classList.contains("cert-id")) {
        updateDescriptions();
      }
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

    /* ================= JEWELLERY IMAGE UPLOAD ================= */

    const jewelleryInput = document.getElementById("main_image");
    const jewelleryPreview = document.getElementById("mainImagePreview");
    const jewelleryClearBtn = document.getElementById("clearMainImage");

    if (jewelleryInput && jewelleryPreview && jewelleryClearBtn) {
      jewelleryInput.addEventListener("change", function (e) {
        const file = e.target.files[0];

        if (!file) return;

        // File size validation (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("Image must be under 5MB");
          jewelleryInput.value = "";
          return;
        }

        jewelleryImageFile = file;

        const reader = new FileReader();

        reader.onload = function (ev) {
          jewelleryPreview.src = ev.target.result;
          jewelleryPreview.style.display = "block";
          jewelleryClearBtn.style.display = "inline-block";
        };

        reader.readAsDataURL(file);
      });

      jewelleryClearBtn.addEventListener("click", function () {
        jewelleryImageFile = null;
        jewelleryInput.value = "";

        jewelleryPreview.src = "";
        jewelleryPreview.style.display = "none";
        jewelleryClearBtn.style.display = "none";
      });
    }

    /* ================= JEWELLERY SIDE IMAGE ================= */

    const jewellerySideInput = document.getElementById("side_image");
    const jewellerySidePreview = document.getElementById("sideImagePreview");
    const jewellerySideClearBtn = document.getElementById("clearSideImage");

    if (jewellerySideInput && jewellerySidePreview && jewellerySideClearBtn) {
      jewellerySideInput.addEventListener("change", function (e) {
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
          alert("Side image must be under 5MB");
          jewellerySideInput.value = "";
          return;
        }

        jewellerySideImageFile = file;

        const reader = new FileReader();

        reader.onload = function (ev) {
          jewellerySidePreview.src = ev.target.result;
          jewellerySidePreview.style.display = "block";
          jewellerySideClearBtn.style.display = "inline-block";
        };

        reader.readAsDataURL(file);
      });

      jewellerySideClearBtn.addEventListener("click", function () {
        jewellerySideImageFile = null;
        jewellerySideInput.value = "";

        jewellerySidePreview.src = "";
        jewellerySidePreview.style.display = "none";
        jewellerySideClearBtn.style.display = "none";
      });
    }

    /* ================= STONE IMAGE UPLOAD ================= */

    const stoneInput = document.getElementById("stone_image");
    const stonePreview = document.getElementById("stoneImagePreview");
    const stoneClearBtn = document.getElementById("clearStoneImage");

    if (stoneInput) {
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
    }

    if (stoneClearBtn) {
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
    const { labName, certId } = getFirstCertInfo();
    const { longDesc, shortDesc } = buildDiamondDescriptions({
      shape:             diaShapeEl?.selectedOptions[0]?.text || "",
      color:             diaColorEl?.selectedOptions[0]?.text || "",
      clarity:           diaClarityEl?.selectedOptions[0]?.text || "",
      cut:               diaCutEl?.selectedOptions[0]?.text || "",
      polish:            diaPolishEl?.selectedOptions[0]?.text || "",
      symmetry:          diaSymmetryEl?.selectedOptions[0]?.text || "",
      culet:             diaCuletEl?.selectedOptions[0]?.text || "",
      fluorescence:      diaFluorescenceEl?.selectedOptions[0]?.text || "",
      fluorescenceColor: "",
      length: document.getElementById("dia_length")?.value || "",
      width:  document.getElementById("dia_width")?.value  || "",
      depth:  document.getElementById("dia_depth")?.value  || "",
      labName,
      certId,
    });
    if (shortDescEl) shortDescEl.value = shortDesc;
    if (longDescEl)  longDescEl.value  = longDesc;
  }

  [diaShapeEl, diaColorEl, diaClarityEl, diaCutEl, diaPolishEl, diaSymmetryEl, diaCuletEl, diaFluorescenceEl].forEach((el) => {
    if (el) el.addEventListener("change", updateDiamondDescriptions);
  });

  /* ================= CERTIFICATE SUBFORM LOOKUPS ================= */

  function loadCertificateSubformLookups() {
    Promise.all([
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
      <td><input class="cert-id"></td>
      <td class="cert-file-cell">
        <input type="file" class="cert-file" accept=".pdf,.jpg,.jpeg,.png,.gif">
        <div class="existing-file-display" style="margin-top:5px;"></div>
      </td>
      <td><input type="date" class="cert-date"></td>
      <td><textarea class="cert-notes"></textarea></td>
      <td><select class="cert-lab"></select></td>
      <td><select class="cert-lab-desc"></select></td>
      <td><select class="cert-lab-sup"></select></td>
      <td><input type="text" class="cert-rowUnique-id" value="" style="display:none;"></td>
      <td>
        <button type="button" class="btn-remove" onclick="removeRow(this)">❌</button>
      </td>
    `;

    tbody.appendChild(tr);
    populateRowSelects(tr);
  }

  function removeRow(btn) {
    btn.closest("tr").remove();
  }

  /* ================= COUNTRY DROPDOWNS ================= */

  function loadCountryDropdown() {
    const countries = [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
      "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
      "Bangladesh", "Belgium", "Bhutan", "Bolivia", "Brazil", "Bulgaria",
      "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia",
      "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
      "Dominican Republic", "Ecuador", "Egypt", "Estonia", "Ethiopia",
      "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Greenland",
      "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
      "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
      "Kuwait", "Laos", "Latvia", "Lebanon", "Lithuania", "Luxembourg",
      "Malaysia", "Maldives", "Mexico", "Mongolia", "Morocco", "Myanmar",
      "Nepal", "Netherlands", "New Zealand", "Nigeria", "North Korea",
      "Norway", "Oman", "Pakistan", "Philippines", "Poland", "Portugal",
      "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore",
      "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden",
      "Switzerland", "Thailand", "Turkey", "Ukraine",
      "United Arab Emirates", "United Kingdom", "United States",
      "Uruguay", "Uzbekistan", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
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
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
      "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
      "Bangladesh", "Belgium", "Bhutan", "Bolivia", "Brazil", "Bulgaria",
      "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia",
      "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
      "Dominican Republic", "Ecuador", "Egypt", "Estonia", "Ethiopia",
      "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Greenland",
      "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
      "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
      "Kuwait", "Laos", "Latvia", "Lebanon", "Lithuania", "Luxembourg",
      "Malaysia", "Maldives", "Mexico", "Mongolia", "Morocco", "Myanmar",
      "Nepal", "Netherlands", "New Zealand", "Nigeria", "North Korea",
      "Norway", "Oman", "Pakistan", "Philippines", "Poland", "Portugal",
      "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore",
      "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden",
      "Switzerland", "Thailand", "Turkey", "Ukraine",
      "United Arab Emirates", "United Kingdom", "United States",
      "Uruguay", "Uzbekistan", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
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
      max_records: 200,
    })
      .then(function (response) {
        console.log("Partner Response:", response);
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

  function populatePartnerDropdowns(targetElement = null) {
    const selects = targetElement
      ? [targetElement]
      : document.querySelectorAll(".partnerdatalookup, .jp_partner_select_contact");

    selects.forEach(function (dropdown) {
      const selectedValue = dropdown.value;
      dropdown.innerHTML = `<option value="">Select Contact</option>`;
      partnerList.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text =
          record.zc_display_value ||
          record.Name ||
          record.Customer_Name ||
          record.Legal_Name ||
          record.Full_Name ||
          record.Display_Name ||
          "No Name";
        if (selectedValue == record.ID) {
          option.selected = true;
        }
        dropdown.appendChild(option);
      });
    });

    // ── After populating, set FEI as default on the first row of each section ──
    setDefaultFEI();
  }

  /* =====================================================
     SHARE CALCULATION
  ===================================================== */
  document.addEventListener("input", function (e) {

    /* ==========================
       NORMAL PARTNERSHIP
    ========================== */
    if (e.target.classList.contains("partner-share")) {

      const rows = document.querySelectorAll("#partnerBody tr.partner-row");

      const firstShare = parseFloat(rows[0]?.querySelector(".partner-share")?.value) || 0;

      // Row 1 %
      rows[0].querySelector(".partner-percent").value = (firstShare / 100).toFixed(2);

      // Row 2 remaining
      if (rows.length > 1) {
        const secondRow = rows[1];
        const secondPartner = secondRow.querySelector(".partnerdatalookup")?.value;

        if (secondPartner) {
          const remaining = 100 - firstShare;
          secondRow.querySelector(".partner-share").value = remaining;
          secondRow.querySelector(".partner-percent").value = (remaining / 100).toFixed(2);
        }
      }
    }

    /* ==========================
       JEWELLERY PARTNERSHIP
    ========================== */
    if (e.target.classList.contains("jp_shares")) {

      const rows = document.querySelectorAll("#jewelleryPartnershipBody tr.jewellery-partnership-row");

      const firstShare = parseFloat(rows[0]?.querySelector(".jp_shares")?.value) || 0;

      // Row 1 %
      rows[0].querySelector(".jp_partnership_percentage").value = (firstShare / 100).toFixed(2);

      // Row 2 remaining
      if (rows.length > 1) {
        const secondRow = rows[1];
        const secondPartner = secondRow.querySelector(".jp_partner_select_contact")?.value;

        if (secondPartner) {
          const remaining = 100 - firstShare;
          secondRow.querySelector(".jp_shares").value = remaining;
          secondRow.querySelector(".jp_partnership_percentage").value = (remaining / 100).toFixed(2);
        }
      }
    }
  });

  /* =====================================================
     WHEN SECOND PARTNER SELECTED
  ===================================================== */
  document.addEventListener("change", function (e) {

    // NORMAL
    if (e.target.classList.contains("partnerdatalookup")) {
      const rows = document.querySelectorAll("#partnerBody tr.partner-row");

      if (rows.length > 1) {
        const firstShare = parseFloat(rows[0].querySelector(".partner-share").value) || 0;
        const remaining = 100 - firstShare;
        rows[1].querySelector(".partner-share").value = remaining;
        rows[1].querySelector(".partner-percent").value = (remaining / 100).toFixed(2);
      }
    }

    // JEWELLERY
    if (e.target.classList.contains("jp_partner_select_contact")) {
      const rows = document.querySelectorAll("#jewelleryPartnershipBody tr.jewellery-partnership-row");

      if (rows.length > 1) {
        const firstShare = parseFloat(rows[0].querySelector(".jp_shares").value) || 0;
        const remaining = 100 - firstShare;
        rows[1].querySelector(".jp_shares").value = remaining;
        rows[1].querySelector(".jp_partnership_percentage").value = (remaining / 100).toFixed(2);
      }
    }
  });

  /* ================= UNIT LOOKUP ================= */
  function loadUnitLookup(targetElement = null) {
    if (unitLookupData) {
      renderUnitOptions(targetElement);
      return;
    }

    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Unit" })
      .then(function (response) {
        unitLookupData = response.data || [];
        renderUnitOptions(targetElement);
      })
      .catch(function (error) {
        console.error("Unit lookup error:", error);
      });
  }

  function renderUnitOptions(targetElement = null) {
    const selects = targetElement
      ? [targetElement]
      : document.querySelectorAll("#unit_lookup, .select_unit, .j1-unit, .j3-unit");

    selects.forEach(function (select) {
      const selectedValue = select.value;
      select.innerHTML = `<option value="">Select Unit</option>`;
      unitLookupData.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1 || record.zc_display_value || "No Name";
        if (selectedValue && selectedValue == record.ID) {
          option.selected = true;
        }
        select.appendChild(option);
      });
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

  /* ================= CATEGORY LOOKUP ================= */
  function loadcategoryLookup() {
    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Jewellery_Type" })
      .then(function (response) {
        const unitSelect = document.getElementById("category");
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
        console.error("Category lookup error:", error);
      });
  }

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
    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Clarity" })
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
    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Symmetry" })
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
  function loadDiaCuletLookup(selectedValue = null) {
    if (culetLookupData) {
      renderCuletOptions(selectedValue);
      return;
    }
    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Cutlet" })
      .then(function (response) {
        culetLookupData = response.data || [];
        renderCuletOptions(selectedValue);
      })
      .catch(function (error) {
        console.error("Culet lookup error:", error);
      });
  }

  function renderCuletOptions(selectedValue = null) {
    const select = document.getElementById("dia_culet");
    if (!select) return;
    select.innerHTML = `<option value="">None</option>`;
    culetLookupData.forEach(function (record) {
      const option = document.createElement("option");
      option.value = record.ID;
      option.text = record.Description1;
      select.appendChild(option);
    });
    if (selectedValue) select.value = selectedValue;
  }

  /* ================= DIAMOND FLUORESCENCE LOOKUP ================= */
  function loadDiaFluorescenceLookup(selectedValue = null) {
    if (fluorescenceLookupData) {
      renderFluorescenceOptions(selectedValue);
      return;
    }
    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Fluroscence" })
      .then(function (response) {
        fluorescenceLookupData = response.data || [];
        renderFluorescenceOptions(selectedValue);
      })
      .catch(function (error) {
        console.error("Fluorescence lookup error:", error);
      });
  }

  function renderFluorescenceOptions(selectedValue = null) {
    const select = document.getElementById("dia_fluorescence");
    if (!select) return;
    select.innerHTML = `<option value="">None</option>`;
    fluorescenceLookupData.forEach(function (record) {
      const option = document.createElement("option");
      option.value = record.ID;
      option.text = record.Description1;
      select.appendChild(option);
    });
    if (selectedValue) select.value = selectedValue;
  }

  /* ================= DIAMOND FLUORESCENCE COLOR LOOKUP ================= */
  function loadDiaFluorescenceColorLookup(selectedValue = null) {
    if (fluorescenceColorLookupData) {
      renderFluorescenceColorOptions(selectedValue);
      return;
    }
    ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Fluroscence_color" })
      .then(function (response) {
        fluorescenceColorLookupData = response.data || [];
        renderFluorescenceColorOptions(selectedValue);
      })
      .catch(function (error) {
        console.error("Fluorescence Color lookup error:", error);
      });
  }

  function renderFluorescenceColorOptions(selectedValue = null) {
    const select = document.getElementById("dia_colour_fluorescence");
    if (!select) return;
    select.innerHTML = `<option value="">None</option>`;
    fluorescenceColorLookupData.forEach(function (record) {
      const option = document.createElement("option");
      option.value = record.ID;
      option.text = record.Description1;
      select.appendChild(option);
    });
    if (selectedValue) select.value = selectedValue;
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

      if (!selectedId) {
        subSpeciesField.value = "";
        return;
      }

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
  const shapeId   = document.getElementById("dia_shape")?.value;
  const colorId   = document.getElementById("dia_color")?.value;
  const clarityId = document.getElementById("dia_clarity")?.value;
  const weight    = parseFloat(document.getElementById("dia_weight")?.value);

  console.log("IDs:", { shapeId, colorId, clarityId, weight });

  const priceEl = document.getElementById("rapport_price");

  if (!shapeId || !colorId || !clarityId || isNaN(weight) || weight <= 0) {
    if (priceEl) priceEl.value = "";
    return;
  }

  // Both forms share the same lookup tables so IDs match directly.
  // Use FieldName.ID = numericId for each lookup field.
  const criteria =
    "Shapes.ID = " + shapeId +
    " && Colors.ID = " + colorId +
    " && Claritys.ID = " + clarityId;

  console.log("CRITERIA:", criteria);

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Rapaport_Masters",
    criteria: criteria,
    max_records: 200,
  })
    .then(function (response) {
      console.log("FULL RESPONSE:", response);

      if (response.code !== 3000 || !response.data || response.data.length === 0) {
        console.warn("No Rapaport records returned — check IDs match Rapaport Master lookup IDs");
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
        (a, b) => parseFloat(a.Weight_high_size1) - parseFloat(b.Weight_high_size1)
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
  const shapeEl   = document.getElementById("dia_shape");
  const colorEl   = document.getElementById("dia_color");
  const clarityEl = document.getElementById("dia_clarity");
  const weightEl  = document.getElementById("dia_weight");

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
          document.getElementById("code_field").value = response.data.Default_Treatment_Code || "";
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
    FIX: getMetalDetailsRowsData
  ================================================================================= */
  function getMetalDetailsRowsData() {
    const rows = [];
    document.querySelectorAll("#jewel1Body tr.jewel1-row").forEach(function (row) {
      const castNo      = row.querySelector(".j1-cast-no")?.value || "";
      const vendor      = row.querySelector(".j1-vendor")?.value || "";
      const metalType   = row.querySelector(".j1-metal-type")?.value || "";
      const metalColor  = row.querySelector(".j1-metal-color")?.value || "";
      const metalPurity = row.querySelector(".j1-metal-purity")?.value || "";
      const unit        = row.querySelector(".j1-unit")?.value || "";
      const weight      = row.querySelector(".j1-weight")?.value || "";
      const qty         = row.querySelector(".j1-qty")?.value || "";
      const market      = row.querySelector(".j1-market")?.value || "";
      const price       = row.querySelector(".j1-price")?.value || "";
      const goldCost    = row.querySelector(".j1-gold-cost")?.value || "";
      const remarks     = row.querySelector(".j1-remarks")?.value || "";
      const rowId       = row.dataset.rowId || "";

      const rowData = {
        Cast:         castNo,
        Vendor1:      vendor,
        Metal_Type1:  metalType,
        Metal_Color:  metalColor,
        Metal_Purity: metalPurity,
        Unit1:        unit,
        Weight:       weight,
        Quantity:     qty,
        Metal_Market: market,
        Price:        price,
        Gold_Cost:    goldCost,
        Remarks:      remarks,
      };

      if (rowId) rowData.ID = rowId;

      rows.push(rowData);
    });
    return rows;
  }

  /* =================================================================================
    FIX: getDiamondDetailsRowsData
  ================================================================================= */
  function getDiamondDetailsRowsData() {
    const rows = [];
    document.querySelectorAll("#jewel2Body tr.jewel2-row").forEach(function (row) {
      const lot      = row.querySelector(".j2-lot")?.value || "";
      const shape    = row.querySelector(".j2-shape")?.value || "";
      const quality  = row.querySelector(".j2-quality")?.value || "";
      const stones   = row.querySelector(".j2-stones")?.value || "";
      const totalCt  = row.querySelector(".j2-total-ct")?.value || "";
      const price    = row.querySelector(".j2-price")?.value || "";
      const cost     = row.querySelector(".j2-cost")?.value || "";
      const remarks  = row.querySelector(".j2-remarks")?.value || "";
      const rowId    = row.dataset.rowId || "";

      const rowData = {
        Diamond_Lot:     lot,
        Shape1:          shape,
        Diamond_Quality: quality,
        No_of_Stones:    stones,
        Total_Ct_Wt:     totalCt,
        Price:           price,
        Diamond_cost:    cost,
        Remarks:         remarks,
      };

      if (rowId) rowData.ID = rowId;

      rows.push(rowData);
    });
    return rows;
  }

  /* =================================================================================
    FIX: getColorStoneDetailsRowsData
  ================================================================================= */
  function getColorStoneDetailsRowsData() {
    const rows = [];
    document.querySelectorAll("#jewel3Body tr.jewel3-row").forEach(function (row) {
      const lot       = row.querySelector(".j3-lot")?.value || "";
      const stoneType = row.querySelector(".j3-stone-type")?.value || "";
      const shape     = row.querySelector(".select_shape")?.value || "";
      const quality   = row.querySelector(".j3-quality")?.value || "";
      const range     = row.querySelector(".j3-range")?.value || "";
      const noStones  = row.querySelector(".j3-no-stones")?.value || "";
      const wtStone   = row.querySelector(".j3-wt-stone")?.value || "";
      const ctWt      = row.querySelector(".j3-ctwt")?.value || "";
      const unit      = row.querySelector(".j3-unit")?.value || "";
      const cut       = row.querySelector(".j3-cut")?.value || "";
      const color     = row.querySelector(".j3-color")?.value || "";
      const clarity   = row.querySelector(".Select_Clarity_j3-clarity")?.value || "";
      const price     = row.querySelector(".j3-price")?.value || "";
      const cost      = row.querySelector(".j3-cost")?.value || "";
      const cs        = row.querySelector(".j3-cs")?.checked || false;
      const duty      = row.querySelector(".j3-duty")?.checked || false;
      const remarks   = row.querySelector(".j3-remarks")?.value || "";
      const rowId     = row.dataset.rowId || "";

      const rowData = {
        Colorstone_Lot:  lot,
        Stone_Type:      stoneType,
        Stone_Shape:     shape,
        Stone_Quality:   quality,
        Range_Sieve_Mm:  range,
        No_Of_Stones:    noStones,
        Wt_Per_Stone:    wtStone,
        CT_WT:           ctWt,
        Stone_Unit:      unit,
        Stone_Cut:       cut,
        Stone_Color:     color,
        Stone_Clarity:   clarity,
        Stone_Price:     price,
        Stone_Cost:      cost,
        C_S:             cs,
        Duty:            duty,
        Remarks:         remarks,
      };

      if (rowId) rowData.ID = rowId;

      rows.push(rowData);
    });
    return rows;
  }

  /* =================================================================================
    FIX: getLabourDetailsRowsData
  ================================================================================= */
  function getLabourDetailsRowsData() {
    const rows = [];
    document.querySelectorAll("#jewel4Body tr.jewel4-row").forEach(function (row) {
      const laborNo     = row.querySelector(".j4-labor-no")?.value || "";
      const description = row.querySelector(".j4-description")?.value || "";
      const price       = row.querySelector(".j4-price")?.value || "";
      const qty         = row.querySelector(".j4-qty")?.value || "";
      const duty        = row.querySelector(".j4-duty")?.checked || false;
      const amount      = row.querySelector(".j4-amount")?.value || "";
      const rowId       = row.dataset.rowId || "";

      const rowData = {
        Labor:       laborNo,
        Description: description,
        Price:       price,
        Quantity:    qty,
        Duty:        duty,
        Amount:      amount,
      };

      if (rowId) rowData.ID = rowId;

      rows.push(rowData);
    });
    return rows;
  }

  /* =================================================================================
    addPartnerRow — Normal Partnership (Color Stone & Diamond)
  ================================================================================= */
  function addPartnerRow() {
    const tbody = document.getElementById("partnerBody");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.classList.add("partner-row");

    tr.innerHTML = `
      <td>
        <select class="partnerdatalookup">
          <option value="">Select Partner</option>
        </select>
      </td>
      <td><input type="text" class="partner-share" placeholder="Shares"></td>
      <td><input type="text" class="partner-percent" placeholder="Partnership %"></td>
      <td><input type="text" class="commission-percent" placeholder="Commission %"></td>
      <td style="text-align:center">
        <input type="checkbox" class="commission-itemized">
      </td>
      <td><textarea class="partner-desc" placeholder="Description"></textarea></td>
      <td>
        <button type="button" class="btn-remove" onclick="removeRow(this)">❌</button>
      </td>
    `;

    tbody.appendChild(tr);
    populatePartnerDropdowns(tr.querySelector(".partnerdatalookup"));
  }

  /* =================================================================================
   JEWELLERY PARTNERSHIP ADD ROW
================================================================================= */
  function addJewelleryPartnershipRow() {
    const tbody = document.getElementById("jewelleryPartnershipBody");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.classList.add("jewellery-partnership-row");

    tr.innerHTML = `
      <td>
        <select class="jp_partner_select_contact">
          <option value="">Select Contact</option>
        </select>
      </td>
      <td>
        <input type="number" class="jp_shares" step="0.01">
      </td>
      <td>
        <input type="number" class="jp_partnership_percentage" step="0.01" readonly>
      </td>
      <td>
        <input type="number" class="jp_commission_percentage" step="0.01">
      </td>
      <td class="checkbox-cell">
        <input type="checkbox" class="jp_commission_itemization">
      </td>
      <td>
        <textarea class="jp_description"></textarea>
      </td>
      <td>
        <button type="button" class="btn-remove" onclick="removeRow(this)">❌</button>
      </td>
    `;

    tbody.appendChild(tr);

    const dropdown = tr.querySelector(".jp_partner_select_contact");
    if (dropdown) {
      populatePartnerDropdowns(dropdown);
    }

    setTimeout(() => {
      setDefaultFEI();
    }, 100);
  }

  /* ================= SAVE RECORD — CREATE + UPDATE ================= */
  function saveRecord() {
    const Category1 = document.getElementById("itemType")?.value || "";
    const In_SKU = document.getElementById("In_SKU")?.value || "";

    // Determine correct cost value based on category
    let costVal = getNumber("cost_amount"); // Color Stone default
    if (Category1 === "Diamond") costVal = getNumber("dia_cost_amount");
    else if (Category1 === "Jewellery") costVal = getNumber("cost_amount_summary");

    if (!Category1 || !In_SKU) {
      alert("Please select Item Type and enter SKU");
      return;
    }

    const saveBtn = document.getElementById("addRecord");
    const originalText = saveBtn ? saveBtn.textContent : "Save";
    if (saveBtn) {
      saveBtn.textContent = "Saving...";
      saveBtn.disabled = true;
    }

    // ── Build base record object ──
    const recordData = cleanRecordData({
      Select: Category1,
      Category1: Category1,
      In_SKU: In_SKU,
      Stock_On_Hand: getNumber("Stock_On_Hand"),
      Status: document.getElementById("Status")?.value || "",
      Treatment: document.getElementById("treatment_lookup")?.value || "",
      Species: document.getElementById("species_lookup")?.value || "",
      Surface: document.getElementById("surface_lookup")?.value || "",
      Shape: document.getElementById("shape_lookup")?.value || "",
      Origin: document.getElementById("origin_country")?.value || "",
      Country_of_Cut: document.getElementById("country_cut")?.value || "",
      HTS: document.getElementById("hts_field")?.value || "",
      Code: document.getElementById("code_field")?.value || "",
      Rapport_Price: getNumber("rapport_price"),
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
      Cost_Amount: costVal,
      Sub_species: document.getElementById("sub_species")?.value || "",
      Style: document.getElementById("style")?.value || "",
      Jewellery_Type: document.getElementById("jewellery_type")?.value || "",
      Platinum: document.getElementById("platinum")?.value || "",
      Gold: document.getElementById("gold")?.value || "",
      Production: document.getElementById("production")?.value || "",
      Instructions: document.getElementById("instructions")?.value || "",
      Country_Of_Origin1: document.getElementById("countries_origin")?.value || "",
      Size: document.getElementById("size")?.value || "",
      Weight_grams: getNumber("weight_grams"),
      Circa: document.getElementById("circa")?.value || "",
      Order: document.getElementById("order")?.value || "",
      HTS1: document.getElementById("hts")?.value || "",
      Notes: document.getElementById("note")?.value || "",
      Brand: document.getElementById("brand")?.value || "",
      Jewel_Short_Description: document.getElementById("description")?.value || "",
      Jewel_Long_Description: document.getElementById("instruction")?.value || "",
      Diamond_price: getNumber("diamond_price"),
      Semi_Mount_Price: getNumber("semi_mount_price"),
      Other_Cost: getNumber("other_cost"),
      Total_Cost: getNumber("total_cost"),
      Duty2: getNumber("duty_percentage"),
      Amount: getNumber("duty_amount"),
      Final_Cost: getNumber("final_cost"),
      Selling_price_per_piece: getNumber("selling_price_piece"),
      Category: document.getElementById("category")?.value || "",
      Partnership_Details: cleanSubformRows(getPartnerRowsData()),
      Metal_Details: cleanSubformRows(getMetalDetailsRowsData()),
      Diamond_Details: cleanSubformRows(getDiamondDetailsRowsData()),
      Color_Stone1: cleanSubformRows(getColorStoneDetailsRowsData()),
      Labour_Details: cleanSubformRows(getLabourDetailsRowsData()),
    });

    console.log("Partnership Data", getPartnerRowsData());
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
            if (response.data && Array.isArray(response.data) && response.data.length > 0)
              recordId = response.data[0].ID;
            else if (response.data && response.data.ID)
              recordId = response.data.ID;
            else if (response.details && response.details.id)
              recordId = response.details.id;
            else if (response.id) recordId = response.id;

            if (!recordId)
              throw new Error("Record created but ID not found: " + JSON.stringify(response));

            // Handle file uploads after create
            let uploadPromises = [];
            const certPromises = createCertificateRecords(In_SKU, recordId);
            if (certPromises && certPromises.length > 0)
              uploadPromises = uploadPromises.concat(certPromises);
            if (recordId && diaImageFile)
              uploadPromises.push(uploadDiaImage(recordId, diaImageFile));
            if (recordId && stoneImageFile)
              uploadPromises.push(uploadStoneImage(recordId, stoneImageFile));
            if (recordId && jewelleryImageFile)
              uploadPromises.push(uploadJewelleryImage(recordId, jewelleryImageFile));
            if (recordId && jewellerySideImageFile)
              uploadPromises.push(uploadJewellerySideImage(recordId, jewellerySideImageFile));

            return Promise.all(uploadPromises);
          } else {
            throw new Error("Failed to create record: " + (response.message || JSON.stringify(response)));
          }
        })
        .then(function (uploadResults) {
          console.log("Upload results:", uploadResults);
          const successCount = uploadResults?.filter((u) => u.type === "certificate" && u.success).length || 0;
          let message = "Record created successfully!";
          if (successCount > 0) message += ` ${successCount} certificate(s) created.`;
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
          alert("❌ Error: " + getErrorMessage(error));
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
      console.log("recId:", recId);
      console.log("Update Data:", recordData);

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

            let uploadPromises = [];
            const certPromises = createCertificateRecords(In_SKU, recId);
            if (certPromises && certPromises.length > 0)
              uploadPromises = uploadPromises.concat(certPromises);
            if (recId && diaImageFile)
              uploadPromises.push(uploadDiaImage(recId, diaImageFile));
            if (recId && stoneImageFile)
              uploadPromises.push(uploadStoneImage(recId, stoneImageFile));
            if (recId && jewelleryImageFile)
              uploadPromises.push(uploadJewelleryImage(recId, jewelleryImageFile));
            if (recId && jewellerySideImageFile)
              uploadPromises.push(uploadJewellerySideImage(recId, jewellerySideImageFile));
            return Promise.all(uploadPromises);
          } else {
            throw new Error("Failed to update record: " + (res.message || JSON.stringify(res)));
          }
        })
        .then(function (uploadResults) {
          console.log("Upload results:", uploadResults);
          const successCount = uploadResults?.filter((u) => u.type === "certificate" && u.success).length || 0;
          let message = "Record updated successfully!";
          if (successCount > 0) message += ` ${successCount} certificate(s) created.`;
          alert(message);
          certificateFiles.clear();
          certificateFilesToUpload = [];

          clearPageAfterSave();

          recId = null;
          lot_edit = false;

          setTimeout(function () {
            window.location.reload();
          }, 500);
        })
        .catch(function (error) {
          console.error("❌ Save Error:", error);
          alert("❌ Error: " + getErrorMessage(error));
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

  /* ================= Jewellery IMAGE UPLOAD ================= */
  function uploadJewelleryImage(recordId, file) {
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
            throw new Error(response.message || "Jewellery image upload failed");
          }
        })
        .then((r) => {
          console.log("Jewellery custom API SUCCESS:", r);
          resolve({ type: "jewelleryImage", success: true });
        })
        .catch(reject);
    });
  }

  /* ================= Jewellery SIDE IMAGE UPLOAD ================= */
  function uploadJewellerySideImage(recordId, file) {
    return new Promise(function (resolve, reject) {
      ZOHO.CREATOR.FILE.uploadFile({
        app_name: "feiny-app",
        report_name: "All_Lot_Master",
        id: recordId,
        field_name: "Side_Image",
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
            throw new Error(response.message || "Jewellery side image upload failed");
          }
        })
        .then((r) => {
          console.log("Jewellery Side Image SUCCESS:", r);
          resolve({ type: "jewellerySideImage", success: true });
        })
        .catch(reject);
    });
  }

  /* ── Upload Certificate File ── */
  function uploadCertificateFile(recordId, file) {
    console.log("uploadCertificateFile", recordId, file);
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
            ZOHO.CREATOR.DATA.invokeCustomApi({
              api_name: "asfd",
              workspace_name: "ankit_feiny",
              http_method: "POST",
              content_type: "application/json",
              payload: { IDd: recordId, fileFormat: response.data.filename },
              public_key: "yUeF2jG7QJWCHXUaEuCQ91XvA",
            })
              .then((r) => {
                console.log("Cert custom API SUCCESS:", r);
                resolve(response);
              })
              .catch((e) => {
                console.error("Cert custom API ERROR:", e);
                reject(e);
              });
          } else {
            reject(new Error(response.message || "Certificate file upload failed"));
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
        Lot_Master_ID: lotRecordID,
      };

      // ── Update existing certificate row ──
      if (rowUniqueID && rowUniqueID.value) {
        const updatePromise = ZOHO.CREATOR.DATA.updateRecordById({
          app_name: "feiny-app",
          report_name: "All_Certificate_Details",
          id: String(rowUniqueID.value),
          payload: { data: certData },
        })
          .then(function (res) {
            console.log("Cert Row Update Response", res);
            if (rowUniqueID && fileExists) {
              return uploadCertificateFile(rowUniqueID.value, fileInput.files[0]);
            }
          })
          .catch(function (error) {
            console.error("❌ Cert UpdateRes Error:", error);
            alert("❌ Cert Update Error: " + getErrorMessage(error));
          });

        promises.push(updatePromise);
      } else {
        // ── Create new certificate row ──
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
                else if (response.data && response.data.ID)
                  certRecordId = response.data.ID;
                else if (response.details && response.details.id)
                  certRecordId = response.details.id;
                else if (response.id)
                  certRecordId = response.id;
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
                    })
                  )
                  .catch((err) =>
                    resolve({
                      type: "certificate",
                      success: true,
                      fileUploadFailed: true,
                      index,
                      error: getErrorMessage(err),
                    })
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
                error: getErrorMessage(error),
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

  /* =================================================================================
    getPartnerRowsData
    — Color Stone / Diamond  →  reads #partnerBody   (.partnerdatalookup)
    — Jewellery              →  reads #jewelleryPartnershipBody  (.jp_partner_select_contact)
  ================================================================================= */
  function getPartnerRowsData() {
    const category = document.getElementById("itemType")?.value;
    const partnerRows = [];
    const isJewellery = category === "Jewellery";

    const selector = isJewellery
      ? "#jewelleryPartnershipBody tr.jewellery-partnership-row"
      : "#partnerBody tr.partner-row";

    document.querySelectorAll(selector).forEach(function (row) {

      let partnerValue = "";
      let shares = "";
      let percent = "";
      let commission = "";
      let Commission_Itemized_on_Invoice = false;
      let Description = "";

      if (isJewellery) {
        const partnerSelect = row.querySelector(".jp_partner_select_contact");

        const datasetPartnerId =
          (row.dataset && row.dataset.partnerId && String(row.dataset.partnerId).trim() !== "")
            ? String(row.dataset.partnerId).trim()
            : (row.getAttribute("data-partner-id") && String(row.getAttribute("data-partner-id")).trim() !== "")
              ? String(row.getAttribute("data-partner-id")).trim()
              : "";

        partnerValue = (partnerSelect && partnerSelect.value && partnerSelect.value.trim() !== "")
          ? partnerSelect.value.trim()
          : datasetPartnerId;

        shares = row.querySelector(".jp_shares")?.value || "";
        percent = row.querySelector(".jp_partnership_percentage")?.value || "";
        commission = row.querySelector(".jp_commission_percentage")?.value || "";
        Commission_Itemized_on_Invoice = row.querySelector(".jp_commission_itemization")?.checked || false;
        Description = row.querySelector(".jp_description")?.value || "";
      } else {
        const partnerSelect = row.querySelector(".partnerdatalookup");

        const datasetPartnerId =
          (row.dataset && row.dataset.partnerId && String(row.dataset.partnerId).trim() !== "")
            ? String(row.dataset.partnerId).trim()
            : (row.getAttribute("data-partner-id") && String(row.getAttribute("data-partner-id")).trim() !== "")
              ? String(row.getAttribute("data-partner-id")).trim()
              : "";

        partnerValue = (partnerSelect && partnerSelect.value && partnerSelect.value.trim() !== "")
          ? partnerSelect.value.trim()
          : datasetPartnerId;

        shares = row.querySelector(".partner-share")?.value || "";
        percent = row.querySelector(".partner-percent")?.value || "";
        commission = row.querySelector(".commission-percent")?.value || "";
        Commission_Itemized_on_Invoice = row.querySelector(".commission-itemized")?.checked || false;
        Description = row.querySelector(".partner-desc")?.value || "";
      }

      if (
        !partnerValue &&
        !shares &&
        !percent &&
        !commission &&
        !Description &&
        !Commission_Itemized_on_Invoice
      ) {
        return;
      }

      const rowId =
        (row.dataset && row.dataset.rowId && String(row.dataset.rowId).trim() !== "")
          ? String(row.dataset.rowId).trim()
          : (row.getAttribute("data-row-id") && String(row.getAttribute("data-row-id")).trim() !== "")
            ? String(row.getAttribute("data-row-id")).trim()
            : null;

      const rowData = {
        Partnership_shares: shares,
        Partnership: percent,
        Commission: commission,
        Description: Description,
        Commission_Itemized_on_Invoice: Commission_Itemized_on_Invoice,
      };

      if (partnerValue) {
        rowData.Partner_Name = partnerValue;
      }

      if (rowId) {
        rowData.ID = rowId;
      }

      partnerRows.push(rowData);
    });

    console.log("Partnership Update Payload:", partnerRows);
    return partnerRows;
  }

  /* ─────────────────────────────────────────────
     JEWELLERY 1 — Metal Details
  ───────────────────────────────────────────── */
  function addJewellery1Row() {
    const tbody = document.getElementById("jewel1Body");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.className = "jewel1-row";

    tr.innerHTML = `
      <td><input type="text" class="j1-cast-no"></td>
      <td><select class="select_contact_j1_vendor j1-vendor"><option value="">Select Contact</option></select></td>
      <td><select class="select_metal_type j1-metal-type"><option value="">Select Metal Type</option></select></td>
      <td><select class="select_color j1-metal-color"><option value="">Select Color</option></select></td>
      <td><select class="select_purity j1-metal-purity"><option value="">Select Purity</option></select></td>
      <td><select class="select_unit j1-unit"><option value="">Select Unit</option></select></td>
      <td><input type="number" class="j1-weight"></td>
      <td><input type="number" class="j1-qty" placeholder="Qty"></td>
      <td><input type="number" class="j1-market" placeholder="Market"></td>
      <td><input type="text" class="j1-price" placeholder="Price"></td>
      <td><input type="text" class="j1-gold-cost" placeholder="Gold Cost"></td>
      <td><textarea class="j1-remarks" placeholder="Remarks"></textarea></td>
      <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
    `;

    tbody.appendChild(tr);

    /* Populate lookups for the new row */
    if (typeof loadContactLookup === "function")   loadContactLookup(tr.querySelector(".j1-vendor"));
    if (typeof loadMetalTypeLookup === "function") loadMetalTypeLookup(tr.querySelector(".j1-metal-type"));
    if (typeof loadColorLookup === "function")     loadColorLookup(tr.querySelector(".j1-metal-color"));
    if (typeof loadPurityLookup === "function")    loadPurityLookup(tr.querySelector(".j1-metal-purity"));
    if (typeof loadUnitLookup === "function")      loadUnitLookup(tr.querySelector(".j1-unit"));
  }

  /* ─────────────────────────────────────────────
     JEWELLERY 2 — Diamond Details
  ───────────────────────────────────────────── */
  function addJewellery2Row() {
    const tbody = document.getElementById("jewel2Body");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.className = "jewel2-row";

    tr.innerHTML = `
      <td><input type="text" class="j2-lot"></td>
      <td><select class="select_shape j2-shape"><option value="">Select Shape</option></select></td>
      <td><input type="text" class="j2-quality"></td>
      <td><input type="number" class="j2-stones"></td>
      <td><input type="number" class="j2-total-ct"></td>
      <td><input type="text" class="j2-price"></td>
      <td><input type="text" class="j2-cost"></td>
      <td><textarea class="j2-remarks"></textarea></td>
      <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
    `;

    tbody.appendChild(tr);

    /* Populate shape lookup for the new row */
    if (typeof renderShapeOptions === "function") {
      renderShapeOptions(tr.querySelector(".j2-shape"));
    }
  }

  /* ─────────────────────────────────────────────
     JEWELLERY 3 — Color Stone Details
  ───────────────────────────────────────────── */
  function addJewellery3Row() {
    const tbody = document.getElementById("jewel3Body");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.className = "jewel3-row";

    tr.innerHTML = `
      <td><input type="text" class="j3-lot"></td>
      <td><select class="j3-stone-type"><option value="">Select</option></select></td>
      <td><select class="select_shape"><option value="">Select Shape</option></select></td>
      <td><input type="text" class="j3-quality"></td>
      <td><input type="text" class="j3-range"></td>
      <td><input type="number" class="j3-no-stones"></td>
      <td><input type="number" class="j3-wt-stone"></td>
      <td><input type="number" class="j3-ctwt"></td>
      <td><select class="select_unit j3-unit"><option value="">Select Unit</option></select></td>
      <td><select class="Select_Cut j3-cut"><option value="">Select Cut</option></select></td>
      <td><select class="Select_Stone_Color j3-color"><option value="">Select Color</option></select></td>
      <td><select class="Select_Clarity_j3-clarity"><option value="">Select Clarity</option></select></td>
      <td><input type="text" class="j3-price" placeholder="Price"></td>
      <td><input type="text" class="j3-cost" placeholder="Cost"></td>
      <td style="text-align:center"><input type="checkbox" class="j3-cs"></td>
      <td style="text-align:center"><input type="checkbox" class="j3-duty"></td>
      <td><textarea class="j3-remarks" placeholder="Remarks"></textarea></td>
      <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
    `;

    tbody.appendChild(tr);

    /* Populate lookups for the new row */
    if (typeof loadUnitLookup === "function")      loadUnitLookup(tr.querySelector(".j3-unit"));
    if (typeof loadCutLookup === "function")       loadCutLookup(tr.querySelector(".j3-cut"));
    if (typeof loadColorLookup === "function")     loadColorLookup(tr.querySelector(".j3-color"));
    if (typeof loadClarityLookup === "function")   loadClarityLookup(tr.querySelector(".Select_Clarity_j3-clarity"));
    if (typeof loadStoneLookup === "function")     loadStoneLookup(tr.querySelector(".j3-stone-type"));
    if (typeof renderShapeOptions === "function")  renderShapeOptions(tr.querySelector(".select_shape"));
  }

  /* ─────────────────────────────────────────────
     JEWELLERY 4 — Labour Details
  ───────────────────────────────────────────── */
  function addJewellery4Row() {
    const tbody = document.getElementById("jewel4Body");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.className = "jewel4-row";

    tr.innerHTML = `
      <td><input type="text" class="j4-labor-no"></td>
      <td><textarea class="j4-description"></textarea></td>
      <td><input type="text" class="j4-price"></td>
      <td><input type="number" class="j4-qty"></td>
      <td style="text-align:center"><input type="checkbox" class="j4-duty"></td>
      <td><input type="text" class="j4-amount" placeholder="Amount"></td>
      <td><button type="button" class="btn-remove" onclick="removeRow(this)">❌</button></td>
    `;

    tbody.appendChild(tr);
  }

  /* ================= CLEAR FULL PAGE AFTER SAVE ================= */
  function clearPageAfterSave() {
    document.querySelectorAll("input, textarea, select").forEach(function (el) {
      if (el.type === "button" || el.type === "submit" || el.type === "hidden") return;
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
      } else if (el.type === "file") {
        el.value = "";
      } else {
        el.value = "";
      }
    });

    document.querySelectorAll("select").forEach(function (sel) {
      sel.selectedIndex = 0;
    });

    diaImageFile = null;
    stoneImageFile = null;
    jewelleryImageFile = null;
    jewellerySideImageFile = null;

    const diaPrev = document.getElementById("imagePreview");
    if (diaPrev) { diaPrev.src = ""; diaPrev.style.display = "none"; }

    const stonePrev = document.getElementById("stoneImagePreview");
    if (stonePrev) { stonePrev.src = ""; stonePrev.style.display = "none"; }

    const clearImg = document.getElementById("clearImage");
    if (clearImg) clearImg.style.display = "none";

    const clearStone = document.getElementById("clearStoneImage");
    if (clearStone) clearStone.style.display = "none";

    if (document.getElementById("diamand_imageText"))
      document.getElementById("diamand_imageText").style.display = "block";
    if (document.getElementById("imageText"))
      document.getElementById("imageText").style.display = "block";

    const certBody = document.getElementById("certificateBody");
    if (certBody) {
      certBody.innerHTML = "";
      addCertificateRow();
    }

    certificateFiles.clear();
    certificateFilesToUpload = [];

    const partnerBody = document.getElementById("partnerBody");
    if (partnerBody) {
      partnerBody.innerHTML = "";
      if (typeof addPartnerRow === "function") addPartnerRow();
    }

    ["jewel1Body", "jewel2Body", "jewel3Body", "jewel4Body", "jewelleryPartnershipBody"].forEach(function (id) {
      const body = document.getElementById(id);
      if (body) body.innerHTML = "";
    });

    [
      "total_price", "rapport_price", "Rapport_Price",
      "cs_short_description", "cs_long_description",
      "diashort_description", "dialong_description",
      "hts_field", "code_field",
    ].forEach(function (id) {
      const f = document.getElementById(id);
      if (f) f.value = "";
    });

    [
      "colorStoneSection", "diamondSection", "pricingSection",
      "Dimensionssection", "neededcertificatesec", "certificateuploadsec",
      "partnershipsec", "Jewellery_1_Metal_Details", "Jewellery_2_Diamond_Details",
      "Jewellery_3_Color_Stone", "Jewellery_4_Labour", "Jewellery_Cost_Summary",
      "Jewellery_Partnership",
    ].forEach(function (id) {
      const sec = document.getElementById(id);
      if (sec) sec.style.display = "none";
    });

    recId = null;
    lot_edit = false;
    window.scrollTo(0, 0);
    console.log("Form Cleared Successfully");
  }

  /* =================================================================================
    LOAD EXISTING RECORD (EDIT MODE)
    — FIXED: removed duplicate partnership blocks
    — FIXED: Diamond select fields restored inside setTimeout after dropdowns load
    — FIXED: Color Stone & Diamond use loadNonJewelleryPartnershipSubform(data)
    — FIXED: Jewellery uses loadJewelleryPartnershipSubform(data) inside setTimeout
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

        /* ── Image preview ── */
        if (data.item_Image) {
          const fullUrl = "https://creator.zoho.com" + data.item_Image;
          const stoneFrame = document.getElementById("stoneImagePreview");
          if (stoneFrame) {
            stoneFrame.src = fullUrl;
            stoneFrame.style.display = "block";
            const imgText = document.getElementById("imageText");
            if (imgText) imgText.style.display = "none";
            const clearStone = document.getElementById("clearStoneImage");
            if (clearStone) clearStone.style.display = "block";
          }
          const diaFrame = document.getElementById("imagePreview");
          if (diaFrame) {
            diaFrame.src = fullUrl;
            diaFrame.style.display = "block";
            const diaText = document.getElementById("diamand_imageText");
            if (diaText) diaText.style.display = "none";
            const clearDia = document.getElementById("clearImage");
            if (clearDia) clearDia.style.display = "block";
          }
        }

        /* ── Plain text / number fields (safe to set immediately) ── */
        document.getElementById("In_SKU").value                = data.In_SKU || "";
        document.getElementById("itemType").value              = data.Category1 || "";
        document.getElementById("Stock_On_Hand").value         = data.Stock_On_Hand || "1";
        document.getElementById("sub_species").value           = data.Sub_species || "";
        document.getElementById("Status").value                = data.Status || "";
        document.getElementById("origin_country").value        = data.Origin || "";
        document.getElementById("country_cut").value           = data.Country_of_Cut || "";
        document.getElementById("hts_field").value             = data.HTS || "";
        document.getElementById("code_field").value            = data.Code || "";
        document.getElementById("cs_short_description").value  = data.Name1 || "";
        document.getElementById("cs_long_description").value   = data.Long_Description || "";
        document.getElementById("min_length").value            = data.length_field || "";
        document.getElementById("min_width").value             = data.Width || "";
        document.getElementById("min_height").value            = data.Height || "";
        document.getElementById("max_length").value            = data.Length_field1 || "";
        document.getElementById("max_width").value             = data.Width1 || "";
        document.getElementById("max_height").value            = data.Height1 || "";
        document.getElementById("weight").value                = data.weight || "";
        document.getElementById("cert_other").checked          = data.Other || false;
        document.getElementById("cert_gubelin").checked        = data.Gub || false;
        document.getElementById("cert_agl").checked            = data.AGL || false;
        document.getElementById("cert_gia").checked            = data.GIA || false;
        document.getElementById("cert_ssef").checked           = data.SSEF || false;
        document.getElementById("certificate_details").value   = data.Description2 || "";
        document.getElementById("Price4").value                = data.Price4 || "";
        document.getElementById("MinimumPrice").value          = data.Minimum_Price || "";
        document.getElementById("cost_amount").value           = data.Cost_Amount || "";
        document.getElementById("dia_length").value            = data.Length_mm || "";
        document.getElementById("dia_width").value             = data.Width_mm || "";
        document.getElementById("dia_depth").value             = data.Depth1 || "";
        document.getElementById("dia_table").value             = data.Table || "";
        document.getElementById("dia_depth_percent").value     = data.Depth2 || "";
        document.getElementById("quantity").value              = data.Quantity || "";
        document.getElementById("dia_weight").value            = data.Weight_Ct || "";
        document.getElementById("price_per_carat").value       = data.Price_Per_carat || "";
        document.getElementById("total_price").value           = data.Total_Price || "";
        document.getElementById("rapport_price").value         = data.Rapport_Price1 || "";
        document.getElementById("diashort_description").value  = data.Short_Description1 || "";
        document.getElementById("dialong_description").value   = data.Long_Description2 || "";
        document.getElementById("style").value                 = data.Style || "";
        document.getElementById("platinum").value              = data.Platinum || "";
        document.getElementById("gold").value                  = data.Gold || "";
        document.getElementById("production").value            = data.Production || "";
        document.getElementById("size").value                  = data.Size || "";
        document.getElementById("weight_grams").value          = data.Weight_grams || "";
        document.getElementById("circa").value                 = data.Circa || "";
        document.getElementById("order").value                 = data.Order || "";
        document.getElementById("hts").value                   = data.HTS1 || "";
        document.getElementById("note").value                  = data.Notes || "";
        document.getElementById("description").value           = data.Jewel_Short_Description || "";
        document.getElementById("instruction").value           = data.Jewel_Long_Description || "";
        document.getElementById("diamond_price").value         = data.Diamond_price || "";
        document.getElementById("semi_mount_price").value      = data.Semi_Mount_Price || "";
        document.getElementById("other_cost").value            = data.Other_Cost || "";
        document.getElementById("total_cost").value            = data.Total_Cost || "";
        document.getElementById("duty_percentage").value       = data.Duty2 || "";
        document.getElementById("duty_amount").value           = data.Amount || "";
        document.getElementById("final_cost").value            = data.Final_Cost || "";
        document.getElementById("selling_price_piece").value   = data.Selling_price_per_piece || "";
        document.getElementById("cost_amount_summary").value   = data.Cost_Amount || "";

        /* ── Lookups that have their own render helpers (pre-select on load) ── */
        loadDiaCuletLookup(data.Culet?.ID || "");
        loadDiaFluorescenceLookup(data.Fluorescence1?.ID || "");
        loadDiaFluorescenceColorLookup(data.Fluorescence_Color?.ID || "");

        /* ── Dropdown fields: restore after a short delay so Zoho lookup
              options have finished rendering ── */
        setTimeout(function () {
          /* Color Stone lookups */
          document.getElementById("species_lookup").value   = data.Species?.ID || "";
          document.getElementById("surface_lookup").value   = data.Surface?.ID || "";
          document.getElementById("treatment_lookup").value = data.Treatment?.ID || "";
          document.getElementById("shape_lookup").value     = data.Shape?.ID || "";
          document.getElementById("unit_lookup").value      = data.Unit?.ID || "";

          /* Diamond lookups */
          document.getElementById("dia_shape").value        = data.Shape3?.ID || "";
          document.getElementById("dia_color").value        = data.Color?.ID || "";
          document.getElementById("dia_clarity").value      = data.Clarity?.ID || "";
          document.getElementById("dia_cut").value          = data.Cut?.ID || "";
          document.getElementById("dia_polish").value       = data.Polish?.ID || "";
          document.getElementById("dia_symmetry").value     = data.Symmetry?.ID || "";

          /* Jewellery lookups */
          document.getElementById("jewellery_type").value   = data.Jewellery_Type?.ID || data.Jewellery_Type || "";
          document.getElementById("brand").value            = data.Brand?.ID || data.Brand || "";
          document.getElementById("category").value         = data.Category?.ID || data.Category || "";
        }, 800);

        /* ── Certificate Subform ── */
        loadCertificateSubform(recordID);

        /* ── Trigger visibility for the correct section ── */
        document.getElementById("itemType").dispatchEvent(new Event("change"));

        /* =========================================================
           PARTNERSHIP SUBFORM
           Color Stone & Diamond  → #partnerBody
           Jewellery              → #jewelleryPartnershipBody
        ========================================================= */
        var category = data.Category1 || "";

        if (category === "Jewellery") {
          /* Jewellery subforms load after visibility settles */
          setTimeout(function () {
            loadJewelleryMetalSubform(data);
            loadJewelleryDiamondSubform(data);
            loadJewelleryColorStoneSubform(data);
            loadJewelleryLabourSubform(data);
            loadJewelleryPartnershipSubform(data);
          }, 1500);

        } else {
          /* Color Stone & Diamond partnership → #partnerBody */
          loadNonJewelleryPartnershipSubform(data);
        }
      })
      .catch(function (err) {
        console.error("loadExistingRecord error:", err);
      });
  }

  /* =================================================================================
     loadNonJewelleryPartnershipSubform
     Used by Color Stone and Diamond edit mode.
     Populates #partnerBody with Partnership_Details rows.
  ================================================================================= */
  function loadNonJewelleryPartnershipSubform(data) {
    var partnerData = data.Partnership_Details;
    var partnerTbody = document.getElementById("partnerBody");
    if (!partnerTbody) return;

    partnerTbody.innerHTML = "";

    if (partnerData && partnerData.length > 0) {
      partnerData.forEach(function (item) {
        var tr = document.createElement("tr");
        tr.classList.add("partner-row");

        /* Store the subform row ID so updates work correctly */
        if (item.ID) tr.dataset.rowId = item.ID;

        tr.innerHTML = `
          <td>
            <select class="partnerdatalookup">
              <option value="">Select Partner</option>
            </select>
          </td>
          <td><input type="text" class="partner-share" value="${item.Partnership_shares || ""}"></td>
          <td><input type="text" class="partner-percent" value="${item.Partnership || ""}"></td>
          <td><input type="text" class="commission-percent" value="${item.Commission || ""}"></td>
          <td style="text-align:center">
            <input type="checkbox" class="commission-itemized"
              ${item.Commission_Itemized_on_Invoice === "true" || item.Commission_Itemized_on_Invoice === true ? "checked" : ""}>
          </td>
          <td><textarea class="partner-desc">${item.Description || ""}</textarea></td>
          <td>
            <button type="button" class="btn-remove" onclick="removeRow(this)">❌</button>
          </td>
        `;

        partnerTbody.appendChild(tr);

        /* Populate the dropdown for this row */
        populatePartnerDropdowns(tr.querySelector(".partnerdatalookup"));

        /* Restore the selected partner after the dropdown is populated */
        var partnerId = item.Partner_Name?.ID || item.Partner_Name || "";
        if (partnerId) {
          setTimeout(function () {
            var selectEl = tr.querySelector(".partnerdatalookup");
            if (selectEl) selectEl.value = partnerId;
          }, 400);
        }
      });
    } else {
      console.log("⚠️ No partnership data found — adding blank row");
      addPartnerRow();
    }
  }

  /* =================================================================================
     loadJewelleryPartnershipSubform
     Used by Jewellery edit mode.
     Populates #jewelleryPartnershipBody with Partnership_Details rows.
  ================================================================================= */
  function loadJewelleryPartnershipSubform(data) {
    var partnerData = data.Partnership_Details;
    var tbody = document.getElementById("jewelleryPartnershipBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (partnerData && partnerData.length > 0) {
      partnerData.forEach(function (item) {
        var tr = document.createElement("tr");
        tr.classList.add("jewellery-partnership-row");

        /* Store the subform row ID so updates work correctly */
        if (item.ID) tr.dataset.rowId = item.ID;

        tr.innerHTML = `
          <td>
            <select class="jp_partner_select_contact">
              <option value="">Select Contact</option>
            </select>
          </td>
          <td>
            <input type="number" class="jp_shares" step="0.01"
              value="${item.Partnership_shares || ""}">
          </td>
          <td>
            <input type="number" class="jp_partnership_percentage" step="0.01"
              value="${item.Partnership || ""}">
          </td>
          <td>
            <input type="number" class="jp_commission_percentage" step="0.01"
              value="${item.Commission || ""}">
          </td>
          <td class="checkbox-cell">
            <input type="checkbox" class="jp_commission_itemization"
              ${item.Commission_Itemized_on_Invoice === "true" || item.Commission_Itemized_on_Invoice === true ? "checked" : ""}>
          </td>
          <td>
            <textarea class="jp_description">${item.Description || ""}</textarea>
          </td>
          <td>
            <button type="button" class="btn-remove" onclick="removeRow(this)">❌</button>
          </td>
        `;

        tbody.appendChild(tr);

        /* Populate the dropdown for this row */
        populatePartnerDropdowns(tr.querySelector(".jp_partner_select_contact"));

        /* Restore the selected partner after the dropdown is populated */
        var partnerId = item.Partner_Name?.ID || item.Partner_Name || "";
        if (partnerId) {
          setTimeout(function () {
            var selectEl = tr.querySelector(".jp_partner_select_contact");
            if (selectEl) selectEl.value = partnerId;
          }, 400);
        }
      });
    } else {
      console.log("⚠️ No Jewellery partnership data found — adding blank row");
      addJewelleryPartnershipRow();
    }
  }

  /* =================================================================================
     LOAD JEWELLERY SUBFORMS
  ================================================================================= */

  function loadJewelleryMetalSubform(data) {
    const tbody = document.getElementById("jewel1Body");
    if (!tbody) return;

    tbody.innerHTML = "";

    const rows = data.Metal_Details || [];

    if (!rows.length) {
      addJewellery1Row();
      return;
    }

    rows.forEach(function (item) {
      addJewellery1Row();

      const tr = tbody.lastElementChild;
      tr.dataset.rowId = item.ID || "";

      tr.querySelector(".j1-cast-no").value   = item.Cast || "";
      tr.querySelector(".j1-weight").value    = item.Weight || "";
      tr.querySelector(".j1-qty").value       = item.Quantity || "";
      tr.querySelector(".j1-market").value    = item.Metal_Market || "";
      tr.querySelector(".j1-price").value     = item.Price || "";
      tr.querySelector(".j1-gold-cost").value = item.Gold_Cost || "";
      tr.querySelector(".j1-remarks").value   = item.Remarks || "";

      setTimeout(function () {
        tr.querySelector(".j1-vendor").value       = item.Vendor1?.ID || item.Vendor1 || "";
        tr.querySelector(".j1-metal-type").value   = item.Metal_Type1?.ID || item.Metal_Type1 || "";
        tr.querySelector(".j1-metal-color").value  = item.Metal_Color?.ID || item.Metal_Color || "";
        tr.querySelector(".j1-metal-purity").value = item.Metal_Purity?.ID || item.Metal_Purity || "";
        tr.querySelector(".j1-unit").value         = item.Unit1?.ID || item.Unit1 || "";
      }, 1000);
    });
  }

  function loadJewelleryDiamondSubform(data) {
    const tbody = document.getElementById("jewel2Body");
    if (!tbody) return;

    tbody.innerHTML = "";

    const rows = data.Diamond_Details || [];

    if (!rows.length) {
      addJewellery2Row();
      return;
    }

    rows.forEach(function (item) {
      addJewellery2Row();

      const tr = tbody.lastElementChild;
      tr.dataset.rowId = item.ID || "";

      tr.querySelector(".j2-lot").value      = item.Diamond_Lot || "";
      tr.querySelector(".j2-quality").value  = item.Diamond_Quality || "";
      tr.querySelector(".j2-stones").value   = item.No_of_Stones || "";
      tr.querySelector(".j2-total-ct").value = item.Total_Ct_Wt || "";
      tr.querySelector(".j2-price").value    = item.Price || "";
      tr.querySelector(".j2-cost").value     = item.Diamond_cost || "";
      tr.querySelector(".j2-remarks").value  = item.Remarks || "";

      setTimeout(function () {
        tr.querySelector(".j2-shape").value = item.Shape1?.ID || item.Shape1 || "";
      }, 1000);
    });
  }

  function loadJewelleryColorStoneSubform(data) {
    const tbody = document.getElementById("jewel3Body");
    if (!tbody) return;

    tbody.innerHTML = "";

    const rows = data.Color_Stone1 || [];

    if (!rows.length) {
      addJewellery3Row();
      return;
    }

    rows.forEach(function (item) {
      addJewellery3Row();

      const tr = tbody.lastElementChild;
      tr.dataset.rowId = item.ID || "";

      tr.querySelector(".j3-lot").value       = item.Colorstone_Lot || "";
      tr.querySelector(".j3-quality").value   = item.Stone_Quality || "";
      tr.querySelector(".j3-range").value     = item.Range_Sieve_Mm || "";
      tr.querySelector(".j3-no-stones").value = item.No_Of_Stones || "";
      tr.querySelector(".j3-wt-stone").value  = item.Wt_Per_Stone || "";
      tr.querySelector(".j3-ctwt").value      = item.CT_WT || "";
      tr.querySelector(".j3-price").value     = item.Stone_Price || "";
      tr.querySelector(".j3-cost").value      = item.Stone_Cost || "";
      tr.querySelector(".j3-cs").checked      = item.C_S || false;
      tr.querySelector(".j3-duty").checked    = item.Duty || false;
      tr.querySelector(".j3-remarks").value   = item.Remarks || "";

      setTimeout(function () {
        tr.querySelector(".select_shape").value               = item.Stone_Shape?.ID || item.Stone_Shape || "";
        tr.querySelector(".j3-unit").value                    = item.Stone_Unit?.ID || item.Stone_Unit || "";
        tr.querySelector(".j3-cut").value                     = item.Stone_Cut?.ID || item.Stone_Cut || "";
        tr.querySelector(".j3-color").value                   = item.Stone_Color?.ID || item.Stone_Color || "";
        tr.querySelector(".Select_Clarity_j3-clarity").value  = item.Stone_Clarity?.ID || item.Stone_Clarity || "";
        tr.querySelector(".j3-stone-type").value              = item.Stone_Type?.ID || item.Stone_Type || "";
      }, 1000);
    });
  }

  function loadJewelleryLabourSubform(data) {
    const tbody = document.getElementById("jewel4Body");
    if (!tbody) return;

    tbody.innerHTML = "";

    const rows = data.Labour_Details || [];

    if (!rows.length) {
      addJewellery4Row();
      return;
    }

    rows.forEach(function (item) {
      addJewellery4Row();

      const tr = tbody.lastElementChild;
      tr.dataset.rowId = item.ID || "";

      tr.querySelector(".j4-labor-no").value    = item.Labor || "";
      tr.querySelector(".j4-description").value = item.Description || "";
      tr.querySelector(".j4-price").value        = item.Price || "";
      tr.querySelector(".j4-qty").value          = item.Quantity || "";
      tr.querySelector(".j4-duty").checked       = item.Duty || false;
      tr.querySelector(".j4-amount").value       = item.Amount || "";
    });
  }

  /* ─── Date string from Zoho → yyyy-mm-dd for <input type="date"> ─── */
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

        certData
          .slice()
          .reverse()
          .forEach(function (item) {
            const formattedDate = formatToYYYYMMDD(item.Date_field);
            const tr = document.createElement("tr");
            tr.classList.add("cert-row");
            tr.dataset.certRecordId = item.ID || "";

            tr.innerHTML = `
              <td><input class="cert-id" value="${item.ID1 || ""}"></td>
              <td class="cert-file-cell">
                <input type="file" class="cert-file" accept=".pdf,.jpg,.jpeg,.png,.gif">
                <div class="existing-file-display" style="margin-top:5px;"></div>
              </td>
              <td><input type="date" class="cert-date" value="${formattedDate}"></td>
              <td><textarea class="cert-notes">${item.Notes || ""}</textarea></td>
              <td><select class="cert-lab"></select></td>
              <td><select class="cert-lab-desc"></select></td>
              <td><select class="cert-lab-sup"></select></td>
              <td>
                <input type="text" class="cert-rowUnique-id" value="${item.ID || ""}" style="display:none;">
              </td>
              <td>
                <button type="button" class="btn-remove" onclick="removeRow(this)">❌</button>
              </td>
            `;

            certTbody.appendChild(tr);

            const existingFileDisplay = tr.querySelector(".existing-file-display");

            if (item.Certificate_Single) {
              const fullUrl = "https://creator.zoho.com" + item.Certificate_Single;

              function getFileNameAndExtension(url) {
                try {
                  const decodedUrl = decodeURIComponent(url);
                  const match = decodedUrl.match(/[?&]filepath=([^&]+)/);
                  let fileName = match && match[1] ? match[1] : decodedUrl.split("/").pop();
                  fileName = fileName || "Download File";
                  fileName = fileName.replace(/^\d+_/, "");
                  const parts = fileName.split(".");
                  const extension = parts.length > 1 ? parts.pop().toLowerCase() : "";
                  return { fileName, extension };
                } catch (e) {
                  return { fileName: "Download File", extension: "" };
                }
              }

              const { fileName, extension } = getFileNameAndExtension(fullUrl);

              if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
                existingFileDisplay.innerHTML = `
                  <div style="cursor:pointer;padding:10px;background:#f0f0f0;border-radius:4px;" onclick="openFilePreview('${fullUrl}','${fileName}')">
                    <img src="${fullUrl}" alt="${fileName}" style="max-width:80px;max-height:80px;display:block;margin-bottom:5px;border-radius:3px;">
                    <small style="color:#666;">Click to preview</small>
                  </div>`;
              } else if (extension === "pdf") {
                existingFileDisplay.innerHTML = `
                  <div style="cursor:pointer;padding:8px;border:1px solid #ddd;border-radius:4px;display:inline-block;background:#fff;text-align:center;" onclick="openFilePreview('${fullUrl}','${fileName}')">
                    <div style="color:#d32f2f;font-size:24px;text-align:center;margin-bottom:5px;">📄</div>
                    <small style="color:#0066cc;font-weight:bold;">Preview PDF</small><br>
                    <small style="color:#888;font-size:10px;">${fileName}</small>
                  </div>`;
              } else {
                existingFileDisplay.innerHTML = `
                  <div style="cursor:pointer;padding:8px;border:1px solid #ddd;border-radius:4px;display:inline-block;background:#fff;" onclick="openFilePreview('${fullUrl}','${fileName}')">
                    <small style="color:#333;">📎 ${fileName}</small><br>
                    <small style="color:#0066cc;">Click to view</small>
                  </div>`;
              }
            } else {
              existingFileDisplay.innerHTML = "<small>No file uploaded</small>";
            }

            populateRowSelects(tr);

            setTimeout(function () {
              tr.querySelector(".cert-lab").value      = item.Lab?.ID || "";
              tr.querySelector(".cert-lab-desc").value = item.Lab_Descriptor?.ID || "";
              tr.querySelector(".cert-lab-sup").value  = item.Laboratory_Supplement?.ID || "";
            }, 300);
          });
      })
      .catch(function (error) {
        console.error("Error fetching certificate subform:", error);
        addCertificateRow();
      });
  }

  /* ================= FILE PREVIEW ================= */
  function openFilePreview(url, fileName) {
    const modal = document.getElementById("filePreviewModal");
    const content = document.getElementById("previewContent");
    if (!modal || !content) return;
    const ext = (fileName.split(".").pop() || "").toLowerCase();
    if (["jpg","jpeg","png","gif"].includes(ext)) {
      content.innerHTML = `<img src="${url}" alt="${fileName}" style="max-width:100%;max-height:80vh;">`;
    } else if (ext === "pdf") {
      content.innerHTML = `<iframe src="${url}" style="width:80vw;height:80vh;border:none;"></iframe>`;
    } else {
      content.innerHTML = `<a href="${url}" target="_blank" style="font-size:18px;">📎 Open ${fileName}</a>`;
    }
    modal.style.display = "flex";
  }

  function closeFilePreview() {
    const modal = document.getElementById("filePreviewModal");
    const content = document.getElementById("previewContent");
    if (modal) modal.style.display = "none";
    if (content) content.innerHTML = "";
  }