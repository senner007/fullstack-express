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


// GET Posts

router.get('/', async (req, res) => {
    const posts = await loadNames ();
    return res.send(await posts.find({}).toArray())
})

// ADD Post

router.post('/', async (req, res) => {
    const posts = await loadNames ();
    await posts.insertOne({
        text : req.body.text,
        createdAt: new Date()
    })
    return res.status(201).send();
})

// Delete Post

router.delete('/:id', async (req, res) => {
    const idString =  new mongodb.ObjectID(req.params.id);
    const posts = await loadNames ();
    const postById = await posts.findOne({_id: idString});
    if (postById == null) 
        return res.status(204).send();

    await posts.deleteOne({_id: idString});
    return res.status(200).send();
})


async function loadNames () {
    
    const client = await mongodb.MongoClient.connect(await cnstring, { useNewUrlParser: true });
    return client.db('navnedb').collection('navne');
}

module.exports = router