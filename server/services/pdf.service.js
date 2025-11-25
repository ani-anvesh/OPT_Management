const PDFDocument = require('pdfkit');
const timesheetService = require('./timesheet.service');
const expenseService = require('./expense.service');

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Generate PDF header
const addHeader = (doc, title, employee) => {
  doc
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(title, { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`Employee: ${employee.name}`, { align: 'center' })
    .text(`Employee ID: ${employee.employee_id}`, { align: 'center' })
    .text(`Department: ${employee.department}`, { align: 'center' })
    .moveDown(1);

  // Add a line separator
  doc
    .strokeColor('#cccccc')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke()
    .moveDown(1);
};

// Generate PDF footer
const addFooter = (doc) => {
  const bottom = doc.page.height - 50;

  doc
    .fontSize(8)
    .font('Helvetica')
    .text(
      `Generated on ${formatDate(new Date().toISOString())}`,
      50,
      bottom,
      { align: 'center' }
    );
};

// Generate Timesheet PDF
const generateTimesheetPDF = (timesheet, employee) => {
  const doc = new PDFDocument({ margin: 50 });

  // Add header
  addHeader(doc, 'Timesheet Report', employee);

  // Timesheet details
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Timesheet Details', { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`Week: ${formatDate(timesheet.week_start_date)} - ${formatDate(timesheet.week_end_date)}`)
    .text(`Status: ${timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}`)
    .text(`Total Hours: ${timesheet.total_hours}`)
    .moveDown(1);

  // Entries table
  if (timesheet.entries && timesheet.entries.length > 0) {
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Daily Breakdown', { underline: true })
      .moveDown(0.5);

    // Table headers
    const tableTop = doc.y;
    const colWidths = {
      date: 100,
      hours: 60,
      description: 200,
      location: 100
    };

    doc
      .fontSize(9)
      .font('Helvetica-Bold');

    doc.text('Date', 50, tableTop, { width: colWidths.date });
    doc.text('Hours', 150, tableTop, { width: colWidths.hours });
    doc.text('Project Description', 210, tableTop, { width: colWidths.description });
    doc.text('Location', 410, tableTop, { width: colWidths.location });

    // Draw header line
    doc
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // Table rows
    let yPos = tableTop + 25;
    doc.font('Helvetica').fontSize(9);

    timesheet.entries.forEach((entry, index) => {
      // Check if we need a new page
      if (yPos > 700) {
        doc.addPage();
        yPos = 50;
      }

      doc.text(formatDate(entry.date), 50, yPos, { width: colWidths.date });
      doc.text(entry.hours.toString(), 150, yPos, { width: colWidths.hours });
      doc.text(entry.project_description || '-', 210, yPos, { width: colWidths.description });
      doc.text(entry.work_location || '-', 410, yPos, { width: colWidths.location });

      yPos += 20;

      // Draw row separator
      if (index < timesheet.entries.length - 1) {
        doc
          .strokeColor('#cccccc')
          .lineWidth(0.5)
          .moveTo(50, yPos - 5)
          .lineTo(550, yPos - 5)
          .stroke();
      }
    });

    // Draw bottom line
    doc
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(50, yPos)
      .lineTo(550, yPos)
      .stroke();
  }

  // Add footer
  addFooter(doc);

  return doc;
};

// Generate Expenses PDF
const generateExpensesPDF = (expenses, employee, summary) => {
  const doc = new PDFDocument({ margin: 50 });

  // Add header
  addHeader(doc, 'Expense Report', employee);

  // Summary section
  if (summary && summary.summary.length > 0) {
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Summary', { underline: true })
      .moveDown(0.5);

    doc.fontSize(10).font('Helvetica');

    summary.summary.forEach(item => {
      doc.text(`Total Expenses (${item.currency}): ${formatCurrency(item.total_amount, item.currency)} (${item.total_count} expenses)`);
    });

    doc.moveDown(1);

    // Category breakdown
    if (summary.byCategory.length > 0) {
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('By Category:')
        .moveDown(0.3);

      doc.fontSize(9).font('Helvetica');

      summary.byCategory.forEach(cat => {
        doc.text(`  ${cat.category}: ${formatCurrency(cat.total, cat.currency)} (${cat.count} expenses)`);
      });

      doc.moveDown(1);
    }
  }

  // Expenses table
  if (expenses.length > 0) {
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Expense Details', { underline: true })
      .moveDown(0.5);

    // Table headers
    const tableTop = doc.y;
    const colWidths = {
      date: 70,
      category: 80,
      amount: 70,
      description: 180
    };

    doc
      .fontSize(9)
      .font('Helvetica-Bold');

    doc.text('Date', 50, tableTop, { width: colWidths.date });
    doc.text('Category', 120, tableTop, { width: colWidths.category });
    doc.text('Amount', 200, tableTop, { width: colWidths.amount });
    doc.text('Description', 270, tableTop, { width: colWidths.description });
    doc.text('Receipt', 450, tableTop);

    // Draw header line
    doc
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // Table rows
    let yPos = tableTop + 25;
    doc.font('Helvetica').fontSize(9);

    expenses.forEach((expense, index) => {
      // Check if we need a new page
      if (yPos > 700) {
        doc.addPage();
        yPos = 50;
      }

      doc.text(formatDate(expense.date), 50, yPos, { width: colWidths.date });
      doc.text(expense.category, 120, yPos, { width: colWidths.category });
      doc.text(formatCurrency(expense.amount, expense.currency), 200, yPos, { width: colWidths.amount });
      doc.text(expense.description || '-', 270, yPos, { width: colWidths.description });
      doc.text(expense.receipt_doc_path ? 'Yes' : 'No', 450, yPos);

      yPos += 20;

      // Draw row separator
      if (index < expenses.length - 1) {
        doc
          .strokeColor('#cccccc')
          .lineWidth(0.5)
          .moveTo(50, yPos - 5)
          .lineTo(550, yPos - 5)
          .stroke();
      }
    });

    // Draw bottom line
    doc
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(50, yPos)
      .lineTo(550, yPos)
      .stroke();
  } else {
    doc
      .fontSize(10)
      .font('Helvetica')
      .text('No expenses to display', { align: 'center' });
  }

  // Add footer
  addFooter(doc);

  return doc;
};

// Export a single timesheet as PDF
const exportTimesheetPDF = async (timesheetId, employeeId, employee) => {
  const timesheet = timesheetService.getTimesheetById(timesheetId, employeeId);

  if (!timesheet) {
    throw new Error('Timesheet not found');
  }

  return generateTimesheetPDF(timesheet, employee);
};

// Export all expenses as PDF
const exportExpensesPDF = async (employeeId, employee, category = null) => {
  const expenses = expenseService.getEmployeeExpenses(employeeId, category);
  const summary = expenseService.getExpenseSummary(employeeId);

  return generateExpensesPDF(expenses, employee, summary);
};

module.exports = {
  exportTimesheetPDF,
  exportExpensesPDF
};
