import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath from the 'url' module

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReceipt = (orderDetails) => {
  const doc = new PDFDocument({ margin: 50 });
  const filePath = path.join(__dirname, 'receipts', `${orderDetails.orderid}.pdf`);

  // Create a write stream to save the PDF
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Company header
  doc
    .image('./SanctionsDatabase_logo.png', 50, 45, { width: 50 }) // Replace with your actual logo path
    .fontSize(20)
    .text('ExhibitorsData.com', 110, 57)
    .fontSize(10)
    .text('1234 Main Street', 200, 65, { align: 'right' })
    .text('City, State, ZIP Code', 200, 80, { align: 'right' })
    .text('Phone: (555) 555-5555', 200, 95, { align: 'right' })
    .text('Email: info@exhibitorsdata.com', 200, 110, { align: 'right' })
    .moveDown();

  // Receipt title
  doc
    .fontSize(24)
    .text('Receipt', { align: 'center' })
    .moveDown(1);

  // Billing Information
  doc
    .fontSize(12)
    .text('Billing Information', 50, 160)
    .moveDown(0.5)
    .text(`Name: ${orderDetails.name}`)
    .text(`Order ID: ${orderDetails.orderid}`)
    .text(`Receipt ID: ${orderDetails.receiptid}`) // Added Receipt ID
    .text(`Order Date: ${new Date().toLocaleString()}`)
    .text(`Order Status: ${orderDetails.status}`)
    .moveDown();

  // Line separator
  doc.moveTo(50, 230).lineTo(550, 230).stroke();

  // Table headers
  doc
    .moveDown(1)
    .fontSize(12)
    .text('Description', 50, 240)
    .text('Amount', 0, 240, { align: 'right' });

  // Line separator
  doc.moveTo(50, 260).lineTo(550, 260).stroke();

  // Invoice item
  const position = 280;
  doc
    .fontSize(10)
    .text('Order Payment', 50, position)
    .text(`${orderDetails.amount} ${orderDetails.currency}`, 0, position, { align: 'right' });

  // Line separator
  const subtotalPosition = position + 20;
  doc.moveTo(50, subtotalPosition).lineTo(550, subtotalPosition).stroke();

  // Summary section
  doc
    .fontSize(12)
    .text('Subtotal:', 400, subtotalPosition + 10, { align: 'right' })
    .text(`${orderDetails.amount} ${orderDetails.currency}`, 0, subtotalPosition + 10, { align: 'right' });

  // Total
  doc
    .fontSize(14)
    .text('Total:', 400, subtotalPosition + 30, { align: 'right' })
    .text(`${orderDetails.amount} ${orderDetails.currency}`, 0, subtotalPosition + 30, { align: 'right' });

  // Footer with contact details
  const footerPosition = subtotalPosition + 70;
  doc
    .fontSize(10)
    .text('If you have any questions, please contact us at info@exhibitorsdata.com.', 50, footerPosition, { align: 'center' })
    .text('Thank you for your business!', 50, footerPosition + 15, { align: 'center' });

  // Finalize the PDF and end the stream
  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve(filePath); // Return the file path when done
    });
    writeStream.on('error', (error) => {
      reject(error); // Reject the promise on error
    });
  });
};
