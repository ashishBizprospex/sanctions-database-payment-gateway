import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReceipt = (orderDetails) => {
  const doc = new PDFDocument({ size: 'A5', margin: 30 });

  const filePath = path.join(__dirname, 'receipts', `${orderDetails.orderid}.pdf`);
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Company header
  doc
    .image('./SanctionsDatabase_logo.png', 30, 20, { width: 40 })
    .fontSize(14)
    .text('ExhibitorsData.com', 80, 30)
    .fontSize(10)
    .text('1234 Main Street', { align: 'right' }) // Removed overlapping positioning
    .text('City, State, ZIP Code', { align: 'right' })
    .text('Phone: (555) 555-5555', { align: 'right' })
    .text('Email: info@exhibitorsdata.com', { align: 'right' })
    .moveDown(2);

  // Receipt title
  doc
    .fontSize(18)
    .text('Receipt', { align: 'center' })
    .moveDown(1);

  // Billing Information Section
  const leftX = 30;
  const rightX = 300; // Adjusted right margin for better spacing
  const startY = 140;

  doc
    .fontSize(12)
    .text('Billing Information', leftX, startY, { underline: true })
    .moveDown(0.5)
    .fontSize(10)
    .text('Name:', leftX, startY + 20)
    .text(orderDetails.name, rightX, startY + 20)
    .text('Order ID:', leftX, startY + 35)
    .text(orderDetails.orderid, rightX, startY + 35)
    .text('Receipt ID:', leftX, startY + 50)
    .text(orderDetails.receiptid, rightX, startY + 50)
    .text('Order Date:', leftX, startY + 65)
    .text(new Date().toLocaleString(), rightX, startY + 65)
    .text('Order Status:', leftX, startY + 80)
    .text(orderDetails.status, rightX, startY + 80)
    .moveDown(1);

  // Line separator
  doc.moveTo(leftX, startY + 100).lineTo(550, startY + 100).stroke();

  // Table headers
  const tableY = startY + 120;
  doc
    .fontSize(12)
    .text('Description', leftX, tableY)
    .text('Amount', rightX, tableY, { align: 'right' });

  // Line separator after headers
  doc.moveTo(leftX, tableY + 15).lineTo(550, tableY + 15).stroke();

  // Order Payment entry
  const itemPositionY = tableY + 30;
  doc
    .fontSize(10)
    .text('Order Payment', leftX, itemPositionY)
    .text(`${orderDetails.amount} ${orderDetails.currency}`, rightX, itemPositionY, { align: 'right' });

  // Line separator after item
  doc.moveTo(leftX, itemPositionY + 20).lineTo(550, itemPositionY + 20).stroke();

  // Summary Section
  const summaryY = itemPositionY + 30;
  doc
    .fontSize(12)
    .text('Subtotal:', rightX - 80, summaryY) // Align summary to the right side
    .text(`${orderDetails.amount} ${orderDetails.currency}`, rightX, summaryY, { align: 'right' });

  const totalY = summaryY + 20;
  doc
    .fontSize(14)
    .text('Total:', rightX - 80, totalY)
    .text(`${orderDetails.amount} ${orderDetails.currency}`, rightX, totalY, { align: 'right' });

  // Footer with contact details
  const footerY = totalY + 40;
  doc
    .fontSize(8)
    .text('If you have any questions, please contact us at info@exhibitorsdata.com.', leftX, footerY, { align: 'center' })
    .text('Thank you for your business!', leftX, footerY + 12, { align: 'center' });

  // Finalize the PDF and end the stream
  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', (error) => reject(error));
  });
};
