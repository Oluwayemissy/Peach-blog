import "dotenv/config";
import chai, { request } from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
import * as Payload from  "../payloads/payload.auth";
import path from "path"

const { userOne, userOneMissingFirstName, userOneMissingLastName, userOneMissingPassword, userOneMissingEmail, userLogin, userLoginMissingPassword, 
    userLoginMissingEmail, userForgotPassword, userUpdate, userUpdateMissingFirstName, userUpdateMissingLastName, userUpdateMissingBio, userUpdateMissingTagLine } = Payload;

const { userTwo, userTwoLogin, userThree, userThreeLogin, userTwoMissingFirstName, userTwoMissingLastName, userTwoMissingPassword, userTwoMissingEmail } = Payload;

const {expect} = chai;
chai.use(chaiHttp);

describe('User Auth Tests', () => {
    it('Should create user one successfully', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userOne)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data.first_name).to.equal(userOne.first_name);
                expect(res.body.data.last_name).to.equal(userOne.last_name);
                expect(res.body.data.email_address).to.equal(userOne.email_address);
                process.env.PEACH_USER_ONE_USER_ID = res.body.data.id;
                process.env.PEACH_USER_ONE_EMAIL = res.body.data.email_address;
                done();
            });
    })

    it('Should create user two successfully', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userTwo)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data.first_name).to.equal(userTwo.first_name);
                expect(res.body.data.last_name).to.equal(userTwo.last_name);
                expect(res.body.data.email_address).to.equal(userTwo.email_address);
                process.env.PEACH_USER_TWO_USER_ID = res.body.data.id;
                process.env.PEACH_USER_TWO_EMAIL = res.body.data.email_address;
                done();
            });
    })
    
    it('Should create user three successfully', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userThree)
            .end((err, res) => { 
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data.first_name).to.equal(userThree.first_name);
                expect(res.body.data.last_name).to.equal(userThree.last_name);
                expect(res.body.data.email_address).to.equal(userThree.email_address)
                process.env.PEACH_USER_THREE_USER_ID = res.body.data.id;
                process.env.PEACH_USER_THREE_EMAIL = res.body.data.email_address;
                done();
            })
    })

    it('Should return error if first_name does not exist for user one', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userOneMissingFirstName)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('first_name is required');
                done();
            });
    })

    it('Should return error if first_name does not exist for user two', (done) => {
        chai.request(app)
        .post('/api/v1/users/signup')
        .send(userTwoMissingFirstName)
        .end((err, res) => {
            expect(res.statusCode).to.equal(422);
            expect(res.body).to.have.property('message');
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('first_name is required');
            done();
        })
    })

    it('Should return error if last_name does not exist for user one', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userOneMissingLastName)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('last_name is required');
                done();
            });
    })

    it('Should return error if last_name does not exist for user two', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userTwoMissingLastName)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('last_name is required');
                done();
            });
    })

    it('Should return error if password does not exist for user one', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userOneMissingPassword)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('password is required');
                done();
            });
    })

    it('Should return error if password does not exist for user two', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userTwoMissingPassword)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('password is required');
                done();
            });
    })

    it('Should return error if email is does not exist for user one', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userOneMissingEmail)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('email_address is required');
                done();
            });
    })


    it('Should return error if email is does not exist for user two', (done) => {
        chai.request(app)
            .post('/api/v1/users/signup')
            .send(userTwoMissingEmail)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('email_address is required');
                done();
            });
    })


    it("Should login user one", (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .send(userLogin)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data.user.email_address).to.equal(userLogin.email_address);
                expect(res.body.data.user.id).to.equal(process.env.PEACH_USER_ONE_USER_ID);
                process.env.PEACH_USER_ONE_TOKEN = res.body.data.token;
                done();
            });
    });

    it("Should login user Two", (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .send(userTwoLogin)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data.user.email_address).to.equal(userTwoLogin.email_address);
                expect(res.body.data.user.id).to.equal(process.env.PEACH_USER_TWO_USER_ID);
                process.env.PEACH_USER_TWO_TOKEN = res.body.data.token;
                done();
            });
    });

    it("Should login user Three", (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .send(userThreeLogin)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data.user.email_address).to.equal(userThreeLogin.email_address);
                expect(res.body.data.user.id).to.equal(process.env.PEACH_USER_THREE_USER_ID);
                process.env.PEACH_USER_THREE_TOKEN = res.body.data.token;
                done()
            });
    })


    it("Should not login user if password is absent", (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .send(userLoginMissingPassword)
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('password is required');
                done();
            });
    });

    it("Should not login user if email is absent", (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .send(userLoginMissingEmail)
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('email_address is required');
                done();
            });
    });

    it("should send forget password mail", (done) => {
        chai.request(app)
            .post('/api/v1/users/forgot_password')
            .send(userForgotPassword)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('a link to reset your password has been sent to your email')
                process.env.PEACH_USER_ONE_PASSWORD_RESET_CODE = res.body.data;
                done();
            });
    });

    it("Should not send forgot password mail if email is absent", (done) => {
        chai.request(app)
            .post('/api/v1/users/forgot_password')
            .send({})
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('email_address is required');
                done();
            });
    });
    
    it("should send verify code password mail", (done) => {
        chai.request(app)
            .patch('/api/v1/users/verify_code')
            .send({
                email_address: "holuwayemissy36@gmail.com",
                code: process.env.PEACH_USER_ONE_PASSWORD_RESET_CODE
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('verification successful, a link to reset your password has been sent to your email')
                process.env.PEACH_USER_ONE_PASSWORD_RESET_TOKEN = res.body.data;
                done();
            });
    });

    it("Should not send verify code password mail if email is absent", (done) => {
        chai.request(app)
            .patch('/api/v1/users/verify_code')
            .send({ code: process.env.PEACH_USER_ONE_PASSWORD_RESET_CODE })
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('email_address is required');
                done();
            });
    }); 


    it("Should not send verify code password mail if code is absent", (done) => {
        chai.request(app)
            .patch('/api/v1/users/verify_code')
            .send({ email_address: "holuwayemissy36@gmail.com" })
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('code is required');
                done();
            });
    }); 

    it("Should reset users passsword", (done) => {
        chai.request(app)
            .patch('/api/v1/users/reset_password')
            .send({ 
                token: process.env.PEACH_USER_ONE_PASSWORD_RESET_TOKEN,
                password: "Yemissy$6"
            })
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('password updated successfully');
                done();
            });
    })

    it("Should not reset users password if password is absent", (done) => {
        chai.request(app)
            .patch('/api/v1/users/reset_password')
            .send({ token: process.env.PEACH_USER_ONE_PASSWORD_RESET_TOKEN })
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('password is required');
                done();
            });
    }); 

    it("Should not reset users password if token is absent", (done) => {
        chai.request(app)
            .patch('/api/v1/users/reset_password')
            .send({  password: "Yemissy$6" })
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('token is required');
                done();
            });
    }); 
    
    it("Should update user profile", (done) => {
        chai.request(app)
            .patch(`/api/v1/users/update_user/${process.env.PEACH_USER_ONE_USER_ID}`)
            .send(userUpdate)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('User profile updated successfully')
                done();
            });
    });
    
    

    it('Should not update user if first_name is absent', (done) => {
        chai.request(app)
            .patch(`/api/v1/users/update_user/${process.env.PEACH_USER_ONE_USER_ID}`)
            .send(userUpdateMissingFirstName)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('first_name is required');
                done();
            });
    })

    it('Should not update user if last_name is absent', (done) => {
        chai.request(app)
            .patch(`/api/v1/users/update_user/${process.env.PEACH_USER_ONE_USER_ID}`)
            .send(userUpdateMissingLastName)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('last_name is required');
                done();
            });
    })
    
    it('Should not update user if tagline is absent', (done) => {
        chai.request(app)
            .patch(`/api/v1/users/update_user/${process.env.PEACH_USER_ONE_USER_ID}`)
            .send(userUpdateMissingTagLine)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('tagline is required');
                done();
            });
    })

    it('Should not update user if bio is absent', (done) => {
        chai.request(app)
            .patch(`/api/v1/users/update_user/${process.env.PEACH_USER_ONE_USER_ID}`)
            .send(userUpdateMissingBio)          
            .end((err, res) => {
                expect(res.statusCode).to.equal(422);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.status).to.equal('error');
                expect(res.body.message).to.equal('bio is required');
                done();
            });
    })

    it("Should fetch all users", (done) => {
        chai.request(app)
            .get('/api/v1/users/users')
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                done();
            });
    });

    it('Should delete user three', (done) => {
        chai.request(app)
            .delete(`/api/v1/users/delete_user/${process.env.PEACH_USER_THREE_USER_ID}`)         
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body.message).to.equal(`User with id:${process.env.PEACH_USER_THREE_USER_ID} deleted`);
                done();
            });
    })
})