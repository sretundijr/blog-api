const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { BlogPosts } = require('./models');

// seed data
BlogPosts.create('Hello world', "all the content here", 'Yours truly');
BlogPosts.create('Hand written routes', 'server side info', 'Steve');

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredField = ['title', 'content', 'author'];
    requiredField.find((item) => {
        if (!(item in req.body)) {
            const message = `Missing \`${item}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    })
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
});

router.delete('/:id', (req, res) => {

});

router.put('/:id', jsonParser, (req, res) => {

});

module.exports = router;