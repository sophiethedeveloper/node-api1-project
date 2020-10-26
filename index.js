console.log("hello there!");

// 1- Dependencies

const express = require("express");
const generate = require("shortid").generate;

// 2 Instantiate and configure the server

const app = express();
app.use(express.json());

// 3- PORT

const PORT = 6000;

// 4- FAKE DATA

let users = [
  {
    id: generate(),
    name: "Jane",
    bio: "a total boomer",
  },
];

// [POST]
app.post("/api/users", (req, res) => {
  // 1- pull out name and body

  const { name, bio } = req.body;

  try {
    if (!name || !bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      const newUser = { id: generate(), name, bio };

      // add user to the fake id
      users.push(newUser);

      // send back to the newly created resource

      res.status(201).json(newUser);
    }
  } catch (error) {
    res
      .status(500)
      .json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
  }
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Listen for incoming requests

app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
