const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso reservado a administradores' });
  }

  next();
};

module.exports = adminMiddleware;
