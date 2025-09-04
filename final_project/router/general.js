const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let user = req.body.username;
  let pass = req.body.password;
  //console.log(users)
  if(!user){
    return res.status(400).json({message: "Missing username"})
  }
  if(!pass){
    return res.status(400).json({message: "Missing password"})
  }
  if(isValid(user)){
    users.push({"username":user, "password":pass})
    return res.status(200).json("Registered user " + user + "!")
  }else{
    return res.status(400).json({message: "Invalid username"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let promise = new Promise((resolve, reject) => {
    resolve("Promise resolved.");
    })
  promise.then((successMessage)=>{
    return res.send(JSON.stringify(books, null, 4));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let promise = new Promise((resolve, reject) => {
    resolve("Promise resolved.");
  })
  promise.then((successMessage)=>{
    const ISBN = req.params.isbn;
    let book = books[ISBN];
    if(book){
        return res.send(JSON.stringify(book, null, 4));
    }else{
        return res.status(404).json({message:"ISBN not found"});
    }
  })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let promise = new Promise((resolve, reject) => {
    resolve("Promise resolved.");
  })
  promise.then((successMessage)=>{
    const author = req.params.author;
    const keys = Object.keys(books);
    const matches = keys.filter((key)=>books[key]["author"] === author)
    if(matches.length>0){
        let bookDetails = {};
        matches.forEach((isbn, index)=>bookDetails[isbn]=books[isbn]);
        return res.send(JSON.stringify(bookDetails, null, 4));
    }else{
        return res.status(404).json({message:"Author not found"})
    }
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let promise = new Promise((resolve, reject) => {
    resolve("Promise resolved.");
  })
  promise.then((successMessage)=>{
    const title = req.params.title;
    const keys = Object.keys(books);
    const matches = keys.filter((key)=>books[key]["title"] === title)
    if(matches.length>0){
        let bookDetails = {};
        matches.forEach((isbn, index)=>bookDetails[isbn]=books[isbn]);
        return res.send(JSON.stringify(bookDetails, null, 4));
    }else{
        return res.status(404).json({message:"Title not found"})
    }
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  let book = books[ISBN];
  if(book){
    return res.send(JSON.stringify(book["reviews"], null, 4));
  }else{
    return res.status(404).json({message:"ISBN not found"});
  }
});

module.exports.general = public_users;
