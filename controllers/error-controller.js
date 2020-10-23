exports.pageNotFound = (req, res) => {
  res.status(404).render('404', { docTitle: 'Page Not Found' });
};
