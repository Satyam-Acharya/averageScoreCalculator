const express = require("express");
const app = express();
const path = require("path");
var fs = require("fs");

app.use(express.urlencoded({ extended: true }));
let users = require("./students.json");

const port = process.env.PORT || 3000;

app.use("/static", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/view", (req, res) => {
  res.sendFile(__dirname + "/public/view.html");
});

app.post("/", function (req, res) {
  let roll = req.body.roll;

  users.forEach((item) => {
    if (item.roll == roll) {
      res.send(`<h1>Student already registered</h1>`);
    }
  });

  let avg =
    (parseInt(req.body.maths) +
      parseInt(req.body.science) +
      parseInt(req.body.english) +
      parseInt(req.body.hindi) +
      parseInt(req.body.sst)) /
    5;
  let grade = "";
  if (avg > 90) {
    grade = "A";
  } else if (avg > 80) {
    grade = "B";
  } else if (avg > 70) {
    grade = "C";
  } else if (avg > 60) {
    grade = "D";
  } else if (avg > 33) {
    grade = "E";
  } else if (avg < 33) {
    grade = "F";
  }

  let formData = {
    roll: req.body.roll,
    name: req.body.name,
    add: req.body.address,
    maths: req.body.maths,
    science: req.body.science,
    hindi: req.body.hindi,
    english: req.body.english,
    sst: req.body.sst,
    avg: avg,
    grade: grade,
  };

  res.send(`<h1>Registered successfully</h1>`);

  users.push(formData);
  console.log("submiting");

  fs.writeFile("./students.json", JSON.stringify(users), (err) => {
    if (err) throw err;

    console.log("Done writting JSON file");
  });
});
app.post("/view", function (req, res) {
  let roll = req.body.roll;

  users.forEach((item) => {
    if (item.roll == roll) {
      res.render("result", { item: item });
      res.end();
    }
  });

  res.send(`<h1>Student Not found</h1>`);
});

app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});
