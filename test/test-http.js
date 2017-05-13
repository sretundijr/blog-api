
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
        let createNewBlogPost =
            {
                title: 'HelloTest',
                content: 'testing blog posts',
                author: 'Steve-o',
                publishDate: '10/25/2017'
            }
        return chai.request(app)
            .post('/blog-posts')
            .send(createNewBlogPost)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.include.key('title', 'content', 'author', 'id', 'publishDate');
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(Object.assign(createNewBlogPost, { id: res.body.id }));
            })
    })

    it('Should delete a blog post by id', function () {
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`);
            }).then(function (res) {
                res.should.have.status(204);
            })
    })

    it('Should edit a blog post by id', function () {
        var updatePost = {
            title: 'Hello edited post',
            content: 'has been modified'
        }
        return chai.request(app)
            .get('/blog-posts')
            .then(function (res) {
                updatePost.id = res.body[0].id;
                updatePost.author = res.body[0].author;
                updatePost.publishDate = res.body[0].publishDate;
                return chai.request(app)
                    .put(`/blog-posts/${updatePost.id}`)
                    .send(updatePost);
            }).then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.include.key('title', 'content', 'author', 'id', 'publishDate');
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(Object.assign(updatePost, { id: res.body.id }));
            })
    })
})
