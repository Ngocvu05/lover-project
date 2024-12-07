const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { PDFDocument } = require("pdf-lib");

// Define a local directory path on the D: drive
const dirPath = path.join('D:', 'myFolder', 'subFolder');


// Paths
const templatePath = path.join(__dirname, "temple_out_v1.docx");
const outputDir = path.join(__dirname, "output_pdfs");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Function to populate template and generate PDFs
async function generatePDFs(jsonData) {
  try {
    // Read the Word template
    const templateContent = fs.readFileSync(templatePath, "binary");

    // Initialize Docxtemplater
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    for (let i = 0; i < jsonData.length; i++) {
      const data = jsonData[i];

      // Populate the template with data
      doc.render(data);

      // Generate a new Word file (buffer)
      const generatedWordBuffer = doc.getZip().generate({ type: "nodebuffer" });

      // Convert Word buffer to PDF
      const pdfDoc = await PDFDocument.create();
      const pdfPage = pdfDoc.addPage([595.28, 841.89]); // Standard A4 size in points
      const text = JSON.stringify(data); // Example: Insert plain text
      pdfPage.drawText(text, { x: 50, y: 800 });

      const pdfBytes = await pdfDoc.save();

      // Save the generated PDF
      const pdfPath = path.join(outputDir, `file_${i + 1}.pdf`);
      fs.writeFileSync(pdfPath, pdfBytes);
      console.log(`Generated: ${pdfPath}`);
    }

    alert("PDF generation complete! Check the output directory.");
  } catch (error) {
    console.error("Error generating PDFs:", error);
    alert("An error occurred while generating PDFs. Check the console for details.");
  }
}
