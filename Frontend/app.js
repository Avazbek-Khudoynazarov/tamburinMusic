const express = require("express");
const path = require("path"); // react build 폴더에 접근하기 위해 필요.
const port = process.env.PORT || 6000;

const app = express();
 
app.use(express.static(path.join(__dirname, "build")));
 
app.use("/", function (req, res, next) {
  res.sendFile(path.join(__dirname + "/build", "index.html"));
});
 
app.listen(port, function () {
  console.log("server works on port :" + port);
});