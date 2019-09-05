var express = require('express');
var router = express.Router();
var moment = require('moment');
const ObjectId = require('mongodb').ObjectId
moment().format();


module.exports = (db) => {
  const collection = db.collection('inputan');

  router.get('/', function (req, res, next) {

    const { ck1, ck2, ck3, ck4, ck5, ck6, nmid, nmstring, nminteger, nmfloat, nmdatestart, nmdateend,
      nmboolean } = req.query;

    // data untuk menampung filter
    let temp = []

    let stat = false

    // ---------------------------- function filter ----------------------------
    if (ck1 && nmid) {
      temp.push(`id = ${nmid}`)
      stat = true
    }

    if (ck2 && nmstring) {
      temp.push(`"dataString" = '${nmstring}'`)
      stat = true
    }

    if (ck3 && nminteger) {
      temp.push(`"dataInteger" = ${nminteger}`)
      stat = true
    }

    if (ck4 && nmfloat) {
      temp.push(`"dataFloat" = ${nmfloat}`)
      stat = true
    }

    if (ck5 && nmdatestart && nmdateend) {
      temp.push(`"dataDate" BETWEEN '${nmdatestart}' and '${nmdateend}'`)
      stat = true
    }

    if (ck6 && nmboolean) {
      temp.push(`"dataBoolean" = '${nmboolean}'`)
      stat = true
    }
    //------------------------------------------------------------------------------------ 
    // conversi dari array ke string
    let joindata = temp.join(' and ');

    console.log(joindata);
    

    collection.find({}).toArray(function (err, row) {
      //console.log(docs)
      res.render('index', { data:row, moment });

      
    })
  });

  //---------ADD-----------\\
  router.get('/add', (req, row) => { row.render('add') })

  router.post('/add', (req, res) => {
    collection.insertOne({
      dataString: req.body.dataString
      , dataInteger: parseInt(req.body.dataInteger)
      , dataFloat: parseFloat(req.body.dataFloat)
      , dataDate: new Date(req.body.dataDate)
      , dataBoolean: req.body.dataBoolean
    })

    console.log(req.body);
    res.redirect('/');

  })

  //====================Edit==============\\
  router.get('/edit/:id', (req, res) => {
    collection.findOne({ _id: ObjectId(req.params.id)}, (err, data) => {
      if (err) throw err;
      console.log(data);
      
      res.render('edit', { item: data, moment })
      console.log(req.params.id);
    })
  });

  router.post('/edit/:id', (req, res) => {
    collection.updateOne({ _id: ObjectId(req.params.id) }, {
      $set: {
        dataString: req.body.dataString
        , dataInteger: parseInt(req.body.dataInteger)
        , dataFloat: parseFloat(req.body.dataFloat)
        , dataDate: new Date(req.body.dataDate)
        , dataBoolean: req.body.dataBoolean
      }
    }, (err, row) => {
      if (err) throw err;

      res.redirect('/');
    })
    console.log(req.params.id);

  })




  //=============Deleted=================\\
  router.get('/deleted/:id', (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
      if (err) throw err
      res.redirect('/')
    })
    console.log(req.params, "deleted sukses")
  })

  return router;
}
