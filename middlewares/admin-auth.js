const adminApiKey = 'your-admin-api-key';

const adminAuthMiddleware = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (!apiKey || apiKey !== adminApiKey) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  next();
};

module.exports = adminAuthMiddleware;