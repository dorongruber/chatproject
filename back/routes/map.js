const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/reversegeo', (req,res) => {
  const {lat,lng} = req.body;
  // console.log('reversegeo req.body -> ', req.body);
  let latlng ={
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  }
  let key = 'AIzaSyARCorSfAJpcNdl7_MabBZWptaf2HMJsu8';
  // console.log(' router.post.reversegeo latlang -> ', latlng);
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`
  )
  .then(response => {

    if (response.data.status === 'OK') {
      // console.log('results === OK -> ', response.data.results);
      res.json(response.data.results[0].address_components);
    }
  })
  .catch(err => {
    res.json({message: err});
  })
})

module.exports = router;
