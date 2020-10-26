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


// [GET] get all users
app.get('/api/users', (req, res) => {
    try {
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({errorMessage: "The users information could not be retrieved."})
    }
})

// [GET] get one user depending on the id

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);

    try {
        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(500).json({errorMessage: "The user information could not be retrieved."})
    }
})


// [DELETE] deletes user
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params

    try {
        if (!users.find(user => user.id === id)){
            res.status(404).json({message: "The user with the specified ID does not exist."})
        } else {
            users = users.filter(user => user.id !== id)
            res.status(200).json({message: `User with the id ${id} got deleted!`})
        }
    } catch (error) {
        res.status(500).json({errorMessage: "The user could not be removed"})
    }
})

// [PUT] update user credentials
app.put('/api/users/:id', (req, res) => {

    const { id } = req.params

    const { name, bio } = req.body

    const indexOfUser = users.findIndex(user => user.id === id)

    try {
        if(indexOfUser !== -1) {
            if(name && bio) {
                users[indexOfUser] = { id, name, bio}  
                res.status(200).json({id, name, bio})
            } else {
                res.status(400).json({message: 'Name and bio are required'})
            }
           
        } else {
            res.status(404).json({message: "The user with the specified ID does not exist." })
        }
    }
    catch(error) {
        res.status(500).json({errorMessage: "The user information could not be modified."})
    }
})




app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Listen for incoming requests

app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
