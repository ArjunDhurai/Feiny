/* =================================================================================
    DIAMOND — Lookups, Auto Description, Image Upload, Rapaport Price
  ================================================================================= */

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
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Fluroscence" })
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
  ZOHO.CREATOR.DATA.getRecords({ app_name: "feiny-app", report_name: "Fluroscence_color" })
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

/* ================= DIAMOND AUTO DESCRIPTION ================= */

document.addEventListener("DOMContentLoaded", function () {
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
    const parts = [
      diashapeEl?.selectedOptions[0]?.text || "",
      diacolorEl?.selectedOptions[0]?.text || "",
      diaclarityEl?.selectedOptions[0]?.text || "",
      diacutEl?.selectedOptions[0]?.text || "",
      diapolishEl?.selectedOptions[0]?.text || "",
      diasymmetryEl?.selectedOptions[0]?.text || "",
      diaculetEl?.selectedOptions[0]?.text || "",
      diafluorescenceEl?.selectedOptions[0]?.text || "",
      diafluorescencecolorEl?.selectedOptions[0]?.text || "",
    ].filter(Boolean);

    if (diashortDescEl) diashortDescEl.value = parts.join(" ");
    if (dialongDescEl) dialongDescEl.value = parts.join(", ");
  }

  [diashapeEl, diacolorEl, diaclarityEl, diacutEl, diapolishEl,
   diasymmetryEl, diaculetEl, diafluorescenceEl, diafluorescencecolorEl]
    .forEach((el) => { if (el) el.addEventListener("change", updateDescriptions); });

  updateDescriptions();
});

/* ================= DIAMOND IMAGE UPLOAD ================= */

document.addEventListener("DOMContentLoaded", function () {
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

  const previewEl = document.getElementById("imagePreview");
  if (previewEl) {
    previewEl.style.cursor = "pointer";
    previewEl.onclick = function () {
      if (previewEl.src) window.open(previewEl.src, "_blank");
    };
  }
});

/* ================= DIAMOND IMAGE UPLOAD TO ZOHO ================= */

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

/* ================= RAPAPORT PRICE ================= */

function fetchRapportPrice() {
  const shapeId = document.getElementById("dia_shape")?.value;
  const colorId = document.getElementById("dia_color")?.value;
  const clarityId = document.getElementById("dia_clarity")?.value;
  const weight = parseFloat(document.getElementById("dia_weight")?.value);
  const priceEl = document.getElementById("rapport_price");

  if (!shapeId || !colorId || !clarityId || isNaN(weight) || weight <= 0) {
    if (priceEl) priceEl.value = "";
    return;
  }

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
        console.warn("No Rapaport records returned");
        if (priceEl) priceEl.value = "";
        return;
      }

      const filtered = response.data.filter(function (rec) {
        const highWeight = parseFloat(rec.Weight_high_size1);
        return !isNaN(highWeight) && highWeight >= weight;
      });

      if (filtered.length === 0) {
        console.warn("No Rapaport record covers this weight");
        if (priceEl) priceEl.value = "";
        return;
      }

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

/* ================= TOTAL PRICE CALCULATION (weight × price per carat) ================= */

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

document.addEventListener("DOMContentLoaded", function () {
  initTotalCalculation();
  initRapportPriceTriggers();
});

/* ================= GET DIAMOND SUBFORM DATA (for color stone / diamond save) ================= */

function getDiamondRowsData() {
  const diamondRows = [];
  document.querySelectorAll("#jewel2Body .jewel2-row").forEach(function (row) {
    diamondRows.push({
      Diamond_Lot: row.querySelector(".j2-lot")?.value || "",
      Shape: row.querySelector(".j2-shape")?.value || "",
      Diamond_Quality: row.querySelector(".j2-quality")?.value || "",
      No_of_Stones: row.querySelector(".j2-stones")?.value || "",
      Total_Ct_Wt: row.querySelector(".j2-total-ct")?.value || "",
      Price: row.querySelector(".j2-price")?.value || "",
      Diamond_cost: row.querySelector(".j2-cost")?.value || "",
      Remarks: row.querySelector(".j2-remarks")?.value || "",
    });
  });
  return diamondRows;
}

/* ================= GET COLOR STONE SUBFORM DATA (for color stone / diamond save) ================= */

function getColorStoneRowsData() {
  const colorstoneRows = [];
  document.querySelectorAll("#jewel3Body .jewel3-row").forEach(function (row) {
    colorstoneRows.push({
      Colorstone_Lot: row.querySelector(".j3-lot")?.value || "",
      Stone_Type: row.querySelector(".j3-stone-type")?.value || "",
      Shape: row.querySelector(".j3-shape")?.value || "",
      Stone_Quality: row.querySelector(".j3-quality")?.value || "",
      Range_Sieve_Mm: row.querySelector(".j3-range")?.value || "",
      No_of_Stones: row.querySelector(".j3-no-stones")?.value || "",
      CT_WT: row.querySelector(".j3-ctwt")?.value || "",
      Price: row.querySelector(".j3-price")?.value || "",
      Stone_Cost: row.querySelector(".j3-cost")?.value || "",
      Remarks: row.querySelector(".j3-remarks")?.value || "",
      Wt_Per_Stone: row.querySelector(".j3-wt-stone")?.value || "",
      Cut: row.querySelector(".j3-cut")?.value || "",
      Stone_Color: row.querySelector(".j3-color")?.value || "",
      Stone_Clarity: row.querySelector(".j3-clarity")?.value || "",
      Supplier: row.querySelector(".j3-supplier")?.value || "",
      Setter1: row.querySelector(".j3-setter")?.value || "",
      C_S: row.querySelector(".j3-cs")?.checked || false,
      Duty: row.querySelector(".j3-duty")?.checked || false,
    });
  });
  return colorstoneRows;
}
