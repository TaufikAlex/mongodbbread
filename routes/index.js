var express = require('express');
var router = express.Router();
var moment = require('moment');
const ObjectId = require('mongodb').ObjectId
moment().format();


module.exports = (db) => {
  const collection = db.collection('inputan');

  router.get('/', function (req, res, next) {

    const { ck2, ck3, ck4, ck5, ck6, nmstring, nminteger, nmfloat, nmdatestart, nmdateend,
      nmboolean } = req.query;

    // data untuk menampung filter
    console.log(req.query.nminteger);
    
    let temp = {};

    // ---------------------------- function filter ----------------------------
    if (ck2 && nmstring) temp.dataString = nmstring;   

    if (ck3 && nminteger) temp.dataInteger = parseInt(nminteger);
    
    if (ck4 && nmfloat) temp.dataFloat =parseFloat(nmfloat);
    
    if (ck5 && nmdatestart && nmdateend) temp.dataString =new Date(nmdatestart);
    
    if (ck6 && nmboolean) temp.dataBoolean = nmboolean;
    
    console.log(temp);
    //------------------------------------------------------------------------------------ 
    
    // let url = req.url == '/' ? '/?page=1' : req.url;
    let query = req.query;
    let page = req.query.page || 1;
    let limit = 2;
    // let totalPage = Math.ceil(6 / limit);
    let url = req.url === '/' ? '/page=1' : req.url

    let pages = (page - 1) * limit
    // console.log(rows);
    
    

    collection.find(temp).limit(limit).skip(pages).toArray().then(row => {
      collection.find(temp).count().then(count => {

        res.render('index', { data: row, moment, current: page, pages: Math.ceil(count / limit), query: query, url: url });

        // res.render('index', { data: row, moment, query:req.query, current:page, pages:Math.ceil(count/limit), pages:totalPage ,query:query, url:url });
      })      

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
    collection.findOne({ _id: ObjectId(req.params.id) }, (err, data) => {
      if (err) throw err;
      console.log(data);

      res.render('edit', { item: data, moment })
      console.log(req.params.id);
    })
  });

  router.post('/edit/:id', (req, res) => {
    collection.updateMany({ _id: ObjectId(req.params.id) }, {
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
