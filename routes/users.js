import express from 'express';
function requireLogin(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ error: 'Login required.' });
    next();
}
var router = express.Router();

/* GET users listing. */
router.get('/', requireLogin,async function(req, res, next) {
  const user=await req.models.User.findById(req.session.userId);
  res.json({user})
});

export default router;
