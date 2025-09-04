const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filteredUsers = users.filter((pair)=>{return pair["username"] === username})
    if(filteredUsers.length > 0){
        return false;
    }else{
        return username.length > 0;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user)=>{return (user.username === username && user.password === password)});
    return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error logging in."});
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60*60});

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User " + username + " successfully logged in!")
  }else{
    return res.status(208).json({message:"Invalid Login. Check username and password."})
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization["username"];
  
  if(books[ISBN]["reviews"][username]){
    books[ISBN]["reviews"][username] = review;
    return res.status(200).json({message:"Successfully updated review for user " + username + "."})
  }else{
    books[ISBN]["reviews"][username] = review;
    return res.status(200).json({message:"Successfully uploaded review for user " + username + "."})
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const username = req.session.authorization["username"];
  
  if(books[ISBN]["reviews"][username]){
    delete books[ISBN]["reviews"][username]
    return res.status(200).json({message:"Successfully deleted review for user " + username + "."})
  }else{
    return res.status(400).json({message:"Could not find reviews for user " + username + "."})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
