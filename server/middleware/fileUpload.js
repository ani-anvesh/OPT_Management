const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '..', 'uploads', 'work-eligibility'),
    path.join(__dirname, '..', 'uploads', 'receipts')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureUploadDirs();

// Storage configuration for work eligibility documents
const workEligibilityStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'work-eligibility'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'eligibility-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage configuration for expense receipts
const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'receipts'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for work eligibility (PDF only)
const workEligibilityFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF files are allowed for work eligibility documents.'));
  }
};

// File filter for receipts (PDF, JPG, PNG)
const receiptFileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Allowed formats: PDF, JPG, PNG'));
  }
};

// Multer configurations
const uploadWorkEligibility = multer({
  storage: workEligibilityStorage,
  fileFilter: workEligibilityFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
}).single('workEligibilityDoc');

const uploadReceipt = multer({
  storage: receiptStorage,
  fileFilter: receiptFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
}).single('receipt');

module.exports = {
  uploadWorkEligibility,
  uploadReceipt
};
