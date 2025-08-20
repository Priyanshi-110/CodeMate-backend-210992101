const checkRole = (requiredRole) => {
    return (req, res, next) => {
      const user = req.user;
  
      // --- ADD THIS LINE FOR DEBUGGING ---
      console.log('Checking user permissions:', user); 
      // This will show you the full user object, including their role.
  
      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
      }
  
      next();
    };
  };
  
  module.exports = { checkRole };