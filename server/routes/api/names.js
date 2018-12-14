const express = require('express');
const mongodb = require('mongodb');
const fs = require('fs');
const util = require('util');
const router = express.Router();
const readFile = util.promisify(fs.readFile);

var cnstring = (async function readCnString() { 
    console.log('getting cnstring...')
    var filename = process.argv[2];
    var text = await readFile(filename, 'utf8')
    return text.split(/\r?\n/)[0].trim();
}());

// GET Names

router.get('/', async (req, res) => {
    const names = await loadNames ();
    return res.send(await names.find({}).toArray())
})

async function loadNames () {
    
    const client = await mongodb.MongoClient.connect(await cnstring, { useNewUrlParser: true });
    return client.db('navnedb').collection('navne');
}

module.exports = router
