const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { ObjectId } = require('mongodb');


router.post('/loguser', async (req,res) => {
  const {email,password} = req.body;
  User.findOne({email: email})
  .then(user => {
    if(!user) {
      res.status(401).json({userid: 'error'});
    } else {
      // console.log('user -> ', user);
      bcrypt.compare(password, user.password)
      .then(response => {
        if (response) {
          const currentuser = {
            monid: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email
          };
          const accesstoken = jwt.sign(currentuser,
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: '1h'
            })
          res.status(200).json({userid: user._id, token: accesstoken});
        } else {
          res.status(401).json({userid: 'error'});
        }
      })
    }
  })

})

router.post('/register', async (req,res) => {
  const { name, phone,email, password} = req.body;
  const by_username = await User.findOne({email: email});
  bcrypt.hash(password, Number(process.env.ENC)).then(hash => {
    const by_password = User.findOne({password: hash});
    if (!by_username || !by_password) {
      const newuser =  new User ({
        _id: new ObjectId(),
        name: name,
        phone: phone,
        email: email,
        password: hash
      });
      try {
        console.log('before save');
        const usaved =  newuser.save();
        res.json({message: true});
      } catch(err) {
        console.log('registration error -> ', err);
      }
  } else {
    res.json({message: 'Requested User Not Found'});
  }
  })
})

router.get('/currentUser/:id', Authenticatetoken, (req,res) => {
  try {
    const {id} = req.params;
    const userid = req.user.monid;
    // console.log('current user function -> ', req.user);
    User.findById(userid)
    .then(user => {
      // console.log('find by id user -> ', user);
      if (user === undefined) {
        res.status(401).json({message: 'cant find user '});
      } else {
        res.status(200).json({username: user.name, phone: user.phone, email: user.email});
      }
    })
  }catch(err) {
    res.status(404).json({error: err, location: 'user.get.currentUser'});
  }
})


module.exports = router;

function  Authenticatetoken(req, res ,next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if ( token == null ) res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
    // console.log('err -> ', err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next()
  })



}
