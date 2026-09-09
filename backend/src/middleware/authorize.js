// Middleware: membatasi akses berdasarkan role
// Contoh penggunaan: router.get('/users', authenticate, authorize('owner'), ...)

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses untuk aksi ini' });
    }
    next();
  };
}

module.exports = authorize;
