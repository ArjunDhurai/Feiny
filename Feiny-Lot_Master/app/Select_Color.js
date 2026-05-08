/* ================= COLOR LOOKUP ================= */
function loadColorLookup() {
  //   console.log("Loading color lookup...");

  ZOHO.CREATOR.DATA.getRecords({
    app_name: "feiny-app",
    report_name: "Gold_Metal_Color",
  })
    .then(function (response) {
      //   console.log("Color lookup response:", JSON.stringify(response));
      const colorSelect = document.getElementById("select_color");
      colorSelect.innerHTML = `<option value="">Select Color</option>`;
      if (!response.data || response.data.length === 0) return;
      response.data.forEach(function (record) {
        const option = document.createElement("option");
        option.value = record.ID;
        option.text = record.Description1;
        colorSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Color lookup error:", error);
    });
}
