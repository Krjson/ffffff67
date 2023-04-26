const userProfile = (req, res) => {
    res.render('userProfile', { user: req.user });
  };
  
  module.exports = {
    userProfile,
  };
  