import ExcelJS from "exceljs";

export const generateExcel = async (tableData: any[]) => {
  console.log(tableData);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("medication-list");

  worksheet.columns = [
    { header: "S/N", key: "serial", width: 5 },
    { header: "Medication Name", key: "drugName", width: 30 },
    { header: "Dose Instruction", key: "dosingInstruction", width: 30 },
    { header: "Special Instruction", key: "auxInstruction", width: 30 },
    { header: "Counselling Points", key: "counsellingPointsText", width: 50 },
  ];

  tableData.forEach((item, index) => {
    worksheet.addRow({
      serial: index + 1,
      drugName: item.drugName,
      dosingInstruction: item.dosingInstruction,
      auxInstruction: item.auxInstruction,
      counsellingPointsText: item.counsellingPointsText,
    });
  });

  // Use a Blob to generate a file in-memory and trigger a download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor to trigger download
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "my-medication-list.xlsx"; // Name of the file to be downloaded
  document.body.appendChild(anchor); // Required for Firefox
  anchor.click();

  // Clean up
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
