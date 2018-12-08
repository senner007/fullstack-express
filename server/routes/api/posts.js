const express = require('express');
const mongodb = require('mongodb');
var fs = require('fs');
const router = express.Router();

const cnstring = (function () { 
    var filename = process.argv[2];
    var cnstring = fs.readFileSync(filename, 'utf8').split(/\r?\n/)[0].trim();
    return cnstring;
}());

// GET Posts

router.get('/', async (req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray())
})

// ADD Post

router.post('/', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text : req.body.text,
        createdAt: new Date()
    })
    res.status(201).send();
})

// Delete Post

router.delete('/:id', async (req, res) => {

    const posts = await loadPostsCollection();
    const postById = await posts.findOne({_id: new mongodb.ObjectID(req.params.id)});
    if (postById == null) return res.status(204).send();
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)})
    res.status(200).send();
})

async function loadPostsCollection() {
   
    const client = await mongodb.MongoClient.connect
    (cnstring, {
        useNewUrlParser: true
    })
    return client.db('fullstack-express').collection('posts');
}



module.exports = router;