import "dotenv/config";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
import { newPost, newTwoPost, newPostMissingPost, newPostMissingSubtitle, newPostMissingTitle, editNewTwoPost } from "../payloads/payload.blog";

const {expect} = chai;
chai.use(chaiHttp);
describe('Blog Tests', () => {
    it('Should create a post', (done) => {
        chai.request(app)
            .post('/api/v1/blogs/add_post')
            .set({Authorization: process.env.PEACH_USER_ONE_TOKEN})
            .send(newPost)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('Post created sucessufully');
                expect(res.body.status).to.equal('Successful');
                process.env.PEACH_POST_ID = res.body.data.id;
                done();
            });
    })


    it('Should create a post for user two', (done) => {
        chai.request(app)
            .post('/api/v1/blogs/add_post')
            .set({Authorization: process.env.PEACH_USER_TWO_TOKEN})
            .send(newTwoPost)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('Post created sucessufully');
                expect(res.body.status).to.equal('Successful');
                process.env.PEACH_POST_TWO_ID = res.body.data.id;
                done();
            });
    })

    it('Should not create a post if title is absent', (done) => {
        chai.request(app)
            .post('/api/v1/blogs/add_post')
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN})
            .send(newPostMissingTitle)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('title is required');
                done();
            });
    })

    it('Should not create a post if subtitle is absent', (done) => {
        chai.request(app)
            .post('/api/v1/blogs/add_post')
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN})
            .send(newPostMissingSubtitle)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('subtitle is required');
                done();
            });
    })

    it('Should not create a post if post is absent', (done) => {
        chai.request(app)
            .post('/api/v1/blogs/add_post')
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN})
            .send(newPostMissingPost)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('post is required');
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

    it('Should like first post with user one', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/like/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN})      
            .end((err, res) => {
            expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Posts liked successfully');
                expect(res.body.status).to.equal('successful');
                done();
            });
    })

    it('Should like first post with user two', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/like/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_TWO_TOKEN})      
            .end((err, res) => {
            expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Posts liked successfully');
                expect(res.body.status).to.equal('successful');
                done();
            });
    })

    it('Should like second post with user one', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/like/${process.env.PEACH_POST_TWO_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN})      
            .end((err, res) => {
            expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Posts liked successfully');
                expect(res.body.status).to.equal('successful');
                done();
            });
    })

    it('Should like second post with user two', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/like/${process.env.PEACH_POST_TWO_ID}`)
            .set({ Authorization: process.env.PEACH_USER_TWO_TOKEN})      
            .end((err, res) => {
            expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Posts liked successfully');
                expect(res.body.status).to.equal('successful');
                done();
            });
    })

    it('Should comment on first post with user one', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/comment/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
            .send({ comment: "it’s a very nice article" })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('Comment made successfully');
                expect(res.body.status).to.equal('successful');
                process.env.PEACH_COMMENT_ID = res.body.data;
                done();
            });
    }) 

    it('Should comment on first post with user two', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/comment/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_TWO_TOKEN }) 
            .send({ comment: "Nice writeup" })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('Comment made successfully');
                expect(res.body.status).to.equal('successful');
                process.env.PEACH_COMMENT_ID = res.body.data;
                done();
            });
    }) 

    it('Should comment on second post with user one', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/comment/${process.env.PEACH_POST_TWO_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
            .send({ comment: "Nice Ariticle" })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('Comment made successfully');
                expect(res.body.status).to.equal('successful');
                process.env.PEACH_COMMENT_ID = res.body.data;
                done();
            });
    }) 

    it('Should comment on second post with user two', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/comment/${process.env.PEACH_POST_TWO_ID}`)
            .set({ Authorization: process.env.PEACH_USER_TWO_TOKEN }) 
            .send({ comment: "it’s motivativing" })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('Comment made successfully');
                expect(res.body.status).to.equal('successful');
                process.env.PEACH_COMMENT_ID = res.body.data;
                done();
            });
    }) 

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

    it('Should repost first post with user one', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/repost/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Repost made successfully');
                expect(res.body.status).to.equal('successful');
                process.env.PEACH_REPOST_ID = res.body.data;
                done();
            });
    })

    it('Should repost first post with user two', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/repost/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_TWO_TOKEN }) 
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Repost made successfully');
                expect(res.body.status).to.equal('successful');
                process.env.PEACH_REPOST_ID = res.body.data;
                done();
            });
    })

    it('Should repost second post with user one', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/repost/${process.env.PEACH_POST_TWO_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Repost made successfully');
                expect(res.body.status).to.equal('successful');
                process.env.PEACH_REPOST_ID = res.body.data;
                done();
            });
    })

    it('Should repost second post with user two', (done) => {
        chai.request(app)
            .post(`/api/v1/blogs/repost/${process.env.PEACH_POST_TWO_ID}`)
            .set({ Authorization: process.env.PEACH_USER_TWO_TOKEN }) 
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal('Repost made successfully');
                expect(res.body.status).to.equal('successful');
                process.env.PEACH_REPOST_ID = res.body.data;
                done();
            });
    })

    it("Should fetch user one profile", (done) => {
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

    it("Should fetch user two profile", (done) => {
        chai.request(app)
            .get(`/api/v1/blogs/profile/${process.env.PEACH_USER_TWO_USER_ID}`)
            .set({ Authorization: process.env.PEACH_USER_TWO_TOKEN }) 
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
            });
    });
    
    it("Should fetch first post", (done) => {
        chai.request(app)
            .get(`/api/v1/blogs/view_post/${process.env.PEACH_POST_ID}`)
            .set({ Authorization: process.env.PEACH_USER_ONE_TOKEN }) 
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
            });
    });

    it("Should fetch second post", (done) => {
        chai.request(app)
            .get(`/api/v1/blogs/view_post/${process.env.PEACH_POST_TWO_ID}`)
            .set({ Authorization: process.env.PEACH_USER_TWO_TOKEN }) 
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

    it("Should edit a post for user two", (done) => {
        chai.request(app)
            .put(`/api/v1/blogs/edit_post/${process.env.PEACH_POST_TWO_ID}`)
            .set({ Authorization: process.env.PEACH_USER_TWO_TOKEN }) 
            .send(editNewTwoPost)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('Post Updated successfully')
                done();
            });
    });


    // it('Should delete a post', (done) => {
    //     chai.request(app)
    //         .delete(`/api/v1/users/delete_post/${process.env.PEACH_POST_ID}`)         
    //         .end((err, res) => {
    //             expect(res.statusCode).to.equal(200);
    //             expect(res.body).to.have.property('message');
    //             expect(res.body).to.have.property('status');
    //             expect(res.body.message).to.equal(`User with id:${process.env.PEACH_POST_ID} deleted`);
    //             done();
    //         });
    // })

});