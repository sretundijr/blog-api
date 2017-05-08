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
    BlogPosts.delete(req.params.id);
    console.log(`Deleted item with id: \`${req.params.id}\`.`);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredField = ['id', 'title', 'content', 'author'];
    requiredField.find((item) => {
        if (!(item in req.body)) {
            const message = `Missing \`${item}\` in request body`;
            console.error(message);
            res.status(400).send(message);
        }
    })
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id and (${req.params.id}) and request body id `
                `(${req.body.id}) do not match`
        );
        console.log(message);
        return res.status(400).send(message);
    }
    console.log(`Updating post with id: \`${req.body.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    })
    res.status(204).json(updatedItem);
});

module.exports = router;