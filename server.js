const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
const data = require("./mockData.json");
app.get("/users", (req, res) => {
  res.send(data);
});

const logInCheck = (req, res, next) => {
  const password = req.body.password;
  const name = req.body.name;
  const currentUser = data.find((user) => {
    return user.password === password && user.name === name;
  });
  if (currentUser) {
    res.send(currentUser);
  } else {
    res.send("NOT FOUND");
  }
  next();
};

app.post("/login", logInCheck, (request, response) => {
  response.send("done!");
});

const signUpCheck = (req, res, next) => {
  const body = req.body;
  const userFound = data.find((user) => {
    return body.name === user.name && body.password === user.password;
  });
  if (userFound) {
    return res.send("FOUND ERROR");
  }
  next();
};

app.post("/signup", signUpCheck, (request, response) => {
  const body = request.body;
  const idGenerator = () => {
    return Math.ceil(Math.random() * 1000);
  };
  data.push({ ...body, id: idGenerator() });
  response.send("SUCCESS");
  fs.writeFileSync("./mockData.json", JSON.stringify(data), (err) => {
    console.log(err);
  });
});

app.listen(3000);
