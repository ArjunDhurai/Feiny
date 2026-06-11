/* ================= STONE LOOKUP ================= */

let stoneLookupData = [];

/* LOAD STONE LOOKUP */
function loadStoneLookup(
  targetElement = null,
  selectedId = ""
) {

  // Already loaded
  if (stoneLookupData.length > 0) {
    renderStoneOptions(
      targetElement,
      selectedId
    );
    return;
  }

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "All_Stone_Species"
  })
    .then(function (response) {

      console.log(
        "Stone Lookup Response:",
        response
      );

      if (
        response &&
        response.data &&
        response.data.length > 0
      ) {

        stoneLookupData =
          response.data;

        renderStoneOptions(
          targetElement,
          selectedId
        );
      }
    })
    .catch(function (error) {
      console.error(
        "Stone lookup error:",
        error
      );
    });
}


/* RENDER OPTIONS */
function renderStoneOptions(
  targetElement = null,
  selectedId = ""
) {

  const selects = targetElement
    ? [targetElement]
    : document.querySelectorAll(
        ".j3-stone-type, .j1-stone, .j3-stone, #selectstone, .selectstone, #stonelookup"
      );

  selects.forEach(function (
    select
  ) {

    if (!select) return;

    // Preserve selected value
    const currentValue =
      selectedId ||
      select.dataset.selected ||
      select.value ||
      "";

    // Clear old options
    select.innerHTML =
      `<option value="">Select</option>`;

    // Add dropdown values
    stoneLookupData.forEach(
      function (record) {

        const option =
          document.createElement(
            "option"
          );

        // Record ID
        option.value =
          record.ID;

        // Species dropdown field
        option.textContent =
          record.Species
            ?.display_value ||
          record.Species ||
          "";

        // Selected value
        if (
          currentValue &&
          currentValue ==
            record.ID
        ) {
          option.selected =
            true;
        }

        select.appendChild(
          option
        );
      }
    );

    // Restore selection
    setTimeout(function () {

      if (currentValue) {
        select.value =
          currentValue;
      }

    }, 300);
  });
}