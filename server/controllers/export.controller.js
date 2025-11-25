const pdfService = require('../services/pdf.service');

// Export a single timesheet as PDF
const exportTimesheet = async (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const timesheetId = parseInt(req.params.id);

    if (!timesheetId || isNaN(timesheetId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid timesheet ID'
      });
    }

    const employee = {
      name: req.session.user.name,
      employee_id: req.session.user.employee_id,
      department: req.session.user.department
    };

    const pdfDoc = await pdfService.exportTimesheetPDF(timesheetId, employeeId, employee);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=timesheet-${timesheetId}.pdf`);

    // Pipe PDF to response
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    if (error.message === 'Timesheet not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    next(error);
  }
};

// Export all expenses as PDF
const exportExpenses = async (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const category = req.query.category;

    const employee = {
      name: req.session.user.name,
      employee_id: req.session.user.employee_id,
      department: req.session.user.department
    };

    const pdfDoc = await pdfService.exportExpensesPDF(employeeId, employee, category);

    // Set response headers
    const filename = category
      ? `expenses-${category.toLowerCase()}.pdf`
      : 'expenses-all.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Pipe PDF to response
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportTimesheet,
  exportExpenses
};
