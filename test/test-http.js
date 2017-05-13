
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Api', function () {
    before(function () {
        return runServer();
    });
    after(function () {
        return closeServer();
    });

    it('Should get all blog post', function () {
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body.forEach(function (item) {
                    item.should.have.all.keys(
                        'id', 'title', 'author', 'content', 'publishDate'
                    );
                })
            })
    })

    it('Should post new blog posts', function () {
        let createNewBlogPost = { title: 'HelloTest', content: 'testing blog posts', author: 'Steve-o' }
        return chai.request(app)
            .post('/blog-posts')
            .send(createNewBlogPost)
            .then(function (res) {
                res.should.have.status(201);
            })
    })
})
