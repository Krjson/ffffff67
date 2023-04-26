function getProfile(req, res) {
  res.render("adminProfile", { user: req.user });
}

module.exports = {
  getProfile,
};
