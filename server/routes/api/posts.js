const express = require('express');
const mongodb = require('mongodb');
var fs = require('fs');
const util = require('util');
const router = express.Router();

const readFile = util.promisify(fs.readFile);

var cnstring;

async function readCnString() { 
    if (cnstring) return cnstring;
    console.log('getting cnstring...')
    var filename = process.argv[2];
    var text = await readFile(filename, 'utf8')
    cnstring = text.split(/\r?\n/)[0].trim();
    return cnstring;
};

(async () => await readCnString())();


// GET Posts

router.get('/', async (req, res) => {
    const posts = await loadPosts ();
    return res.send(await posts.find({}).toArray())
})

// ADD Post

router.post('/', async (req, res) => {
    const posts = await loadPosts ();
    await posts.insertOne({
        text : req.body.text,
        createdAt: new Date()
    })
    return res.status(201).send();
})

// Delete Post

router.delete('/:id', async (req, res) => {
    const idString =  new mongodb.ObjectID(req.params.id);
    const posts = await loadPosts ();
    const postById = await posts.findOne({_id: idString});
    if (postById == null) 
        return res.status(204).send();

    await posts.deleteOne({_id: idString});

    return res.status(200).send();
})

var cnstring = "";
async function loadPosts () {

    const client = await mongodb.MongoClient.connect(await readCnString(), { useNewUrlParser: true });
    return client.db('fullstack-express').collection('posts');
}


module.exports = router
