/* ================= COLOR LOOKUP ================= */

let colorLookupData = null;

const GOLD_COLORS = new Set(["white", "yellow", "rose", "other"]);

function loadColorLookup(targetElement) {

    if (colorLookupData) {
        renderColorOptions(targetElement);
        return;
    }

    ZOHO.CREATOR.DATA.getRecords({
        app_name: "feiny-app",
        report_name: "Color"
    })
        .then(function (response) {

            if (response.data && response.data.length > 0) {
                colorLookupData = response.data;
                renderColorOptions(targetElement);
            }

        })
        .catch(function (error) {
            console.error("Color lookup error:", error);
        });

}

function renderColorOptions(targetElement) {

    const selects = targetElement
        ? [targetElement]
        : document.querySelectorAll("#select_color, .select_color, .Select_Stone_Color");

    selects.forEach(function (select) {

        const row = select.closest("tr");
        const metalSelect = row ? row.querySelector(".select_metal_type, .j1-metal-type") : null;
        const selectedMetal = metalSelect && metalSelect.selectedIndex >= 0
            ? metalSelect.options[metalSelect.selectedIndex].text.trim().toLowerCase()
            : "";

        console.log("Selected metal:", selectedMetal); // Remove after testing

        select.innerHTML = '<option value="">Select Color</option>';

        colorLookupData.forEach(function (record) {

            const colorName = record.Description1.trim().toLowerCase();

            // If Gold → only show White, Yellow, Rose, Other
            // Otherwise → show ALL colors
            if (selectedMetal === "gold" && !GOLD_COLORS.has(colorName)) {
                return;
            }

            const option = document.createElement("option");
            option.value = record.ID;
            option.text = record.Description1;
            select.appendChild(option);

        });

        select.value = "";

    });

}

/* ================= REFRESH COLOR WHEN METAL TYPE CHANGES ================= */

document.addEventListener("change", function (e) {

    if (e.target.matches(".select_metal_type, .j1-metal-type")) {

        const row = e.target.closest("tr");

        if (!row) return;

        const colorSelect = row.querySelector(".select_color, .Select_Stone_Color");

        if (colorSelect) {
            renderColorOptions(colorSelect);
        }

    }

});