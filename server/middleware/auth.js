// Authentication middleware for session validation
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Please login to continue'
    });
  }
  next();
};

const requireEmployeeAuth = (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.userType !== 'employee') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Employee access required'
    });
  }
  next();
};

const requireManagerAuth = (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user.userType !== 'manager') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Manager access required'
    });
  }
  next();
};

module.exports = {
  requireAuth,
  requireEmployeeAuth,
  requireManagerAuth
};
