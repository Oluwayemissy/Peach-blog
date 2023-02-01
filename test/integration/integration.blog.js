import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
import { newPost } from "../payloads/payload.blog";

const {expect} = chai;
chai.use(chaiHttp);
describe('Blog Tests', () => {
    it('Should create a post', (done) => {
        chai.request(app)
            .post('/api/v1/blogs/add_post')
            .set('Authorization', process.env.PEACH_USER_ONE_TOKEN)
            .attach('cover', path.resolve(__dirname, '../files/aiony-haust-3TLl_97HNJo-unsplash.jpg'))
            .send(newPost)
            .end((err, res) => {
                console.log('Authorization',process.env.PEACH_USER_ONE_TOKEN, rea.body, 'create-post====>>')
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('Post created sucessufully');
                expect(res.body.status).to.equal('successful');
                process.env.PEACH_POST_ID = res.body.data.id;
                done();
            });
    })

    it('Should not create a post if title is absent', (done) => {
        chai.request(app)
            .post('/api/v1/blogs/add_post')
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN})
            .send(newPost)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('Title is a required field');
                done();
            });
    })

    it("Should fetch all posts", (done) => {
        chai.request(app)
            .get('/api/v1/blogs/all_posts')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
            });
    });

    it("Should fetch latest posts", (done) => {
        chai.request(app)
            .get('/api/v1/blogs/latest_posts')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
            });
    });

    // it('Should like a post', (done) => {
    //     chai.request(app)
    //         .post(`/api/v1/blogs/like/${process.env.PEACH_POST_ID}`)
    //         .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN})      
    //         .end((err, res) => {
    //         expect(res.statusCode).to.equal(200);
    //             expect(res.body).to.have.property('message');
    //             expect(res.body).to.have.property('status');
    //             expect(res.body.message).to.equal('Posts liked successfully');
    //             expect(res.body.status).to.equal('successful');
    //             process.env.PEACH_LIKE_ID = res.body.data
    //             done();
    //         });
    // })

    // it('Should comment on a post', (done) => {
    //     chai.request(app)
    //         .post(`/api/v1/blogs/comment/${process.env.PEACH_POST_ID}`)
    //         .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
    //         .send({ comment: "it’s a very nice article" })
    //         .end((err, res) => {
    //             expect(res.statusCode).to.equal(200);
    //             expect(res.body).to.have.property('message');
    //             expect(res.body).to.have.property('status');
    //             expect(res.body).to.have.property('data');
    //             expect(res.body.message).to.equal('Comment made successfully');
    //             expect(res.body.status).to.equal('successful');
    //             process.env.PEACH_COMMENT_ID = res.body.data;
    //             done();
    //         });
    // }) 

    it("Should return error if comment is absent", (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/comment/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
            .send({})
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('comment is required');
                done();
            });
    });

    it('Should repost a post', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/repost/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
            .end((err, res) => {
                // expect(res.statusCode).to.equal(200);
                // expect(res.body).to.have.property('message');
                // expect(res.body).to.have.property('status');
                // expect(res.body.message).to.equal('Repost made successfully');
                // expect(res.body.status).to.equal('successful');
                // process.env.PEACH_REPOST_ID = res.body.data;
                done();
            });
    })

    it("Should fetch user profile", (done) => {
        chai.request(app)
            .get(`/api/v1/blogs/profile/${process.env.PEACH_USER_ONE_USER_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
            });
    });
    
    it("Should fetch a post", (done) => {
        chai.request(app)
            .get(`api/v1/blogs/view_post/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
            });
    });

    it("Should fetch Top Views", (done) => {
        chai.request(app)
            .get('/api/v1/blogs/top_views')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
            });
    });

    it("Should fetch Most Liked", (done) => {
        chai.request(app)
            .get('/api/v1/blogs/most_liked')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
            });
    });

    it('Should delete a post', (done) => {
        chai.request(app)
            .delete(`/api/v1/users/delete_post/${process.env.PEACH_POST_ID}`)         
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(`User with id:${process.env.PEACH_POST_ID} deleted`);
                done();
            });
    })

});