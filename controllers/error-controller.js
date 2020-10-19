exports.pageNotFound = (req, res) => {
  res.render('404', { docTitle: 'Page Not Found' });
  // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
};
