const path = require("path")

exports.get_homepage = (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.sendFile(path.join(__dirname, "../static/home.html"));
};

exports.get_image = (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.sendFile(path.join(__dirname, "../static/a.jpg"));
};


exports.get_favicon = (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.sendFile(path.join(__dirname, "../static/1.ico"));
};