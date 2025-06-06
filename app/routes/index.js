var express = require("express");
var router = express.Router();
var formdable = require("formidable");
var fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/file", (req, res) => {
  let path = "./" + req.query.path;

  if (fs.existsSync(path)) {
    fs.readFile(path, (err, data) => {
      if (err) {
        console.error(err);
        res.status(400).json({
          error: err,
        });
      } else {
        res.status(200).end(data);
      }
    });
  } else {
    res.status(404).json({
      erros: "file not found",
    });
  }
});

router.delete("/file", (req, res) => {
  let form = new formdable.IncomingForm({
    uploadDir: "./upload",
    keepExtensions: true,
  });
  form.parse(req, (err, fields, files) => {
    let path = "./" + fields.path;

    if (fs.existsSync(path)) {
      fs.unlink(path, (err) => {
        if (err) {
          res.status(400).json({
            err,
          });
        } else {
          res.json({
            fields,
          });
        }
      });
    } else {
      res.status(404).json({
        erros: "file not found",
      });
    }
  });
});

router.post("/upload", (req, res) => {
  let form = new formdable.IncomingForm({
    uploadDir: "./upload",
    keepExtensions: true,
  });
  form.parse(req, (err, fields, files) => {
    res.json({
      files,
    });
  });
});

module.exports = router;
