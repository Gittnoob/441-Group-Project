import express from 'express';
function requireLogin(req, res, next) {
    if (!req.session.userId) return res.status(401).json({ error: 'Login required.' });
    next();
}
var router = express.Router();

/* GET users listing. */
router.get('/', requireLogin,async function(req, res, next) {
  const user=await req.models.User.findById(req.session.userId);
  res.json(user)
});

router.put('/addToWatchList', requireLogin,async function(req, res, next) {
  try{
    console.log(req.query.itemId)
    await req.models.User.findByIdAndUpdate(req.session.userId,
    {
      $addToSet: {watchlist: req.query.itemId}
    }
  );
  res.json({})
  } catch(error) {
    console.log(error)
    res.json({
      error: "something wrong"
    })
  }
});

export default router;
