import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../app";
import {userOne, userOneMissingEmail, userOneMissingFirstName, userOneMissingLastName, userOneMissingPassword, userLogin, userLoginMissingEmail, userLoginMissingPassword, userForgotPassword} from "../payloads/payload.auth"

const {expect} = chai;
chai.use(chaiHttp);
describe('User Auth Tests', () => {
    it('Should create user one sucessfully', (done) => {
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

    it('Should not create user if first_name is absent', (done) => {
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

    it('Should not create user if last_name is absent', (done) => {
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

    it('Should not create user if password is absent', (done) => {
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

    it('Should not create user if email is absent', (done) => {
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

    it("Should login user", (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .set("Content-Type", "application/json")
            .send(userLogin)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.data.user.email_address).to.equal(userLogin.email_address);
                expect(res.body.data.user.id).to.equal(process.env.PEACH_USER_ONE_USER_ID);
                process.env.PEACH_USER_ONE_TOKEN = res.body.data.user.sessionToken;
                done();
            });
    });

    it("Should not login user if password is absent", (done) => {
        chai.request(app)
            .post('/api/v1/users/login')
            .set("Content-Type", "application/json")
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
            .set("Content-Type", "application/json")
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
            .set("Content-Type", "application/json")
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
            .set("Content-Type", "application/json")
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
        console.log('Here')
        chai.request(app)
            .post('/api/v1/users/verify_code')
            .set("Content-Type", "application/json")
            .send({
                email_address: "holuwayemissy36@gmail.com",
                code: process.env.PEACH_USER_ONE_PASSWORD_RESET_CODE
            })
            .end((err, res) => {
                console.log('UKGejydwjghwd')
                console.log(res.body)
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('message');
                expect(res.body).to.have.property('status');
                expect(res.body).to.have.property('data');
                expect(res.body.message).to.equal('verification successful, a link to reset your password has been sent to your email')
                process.env.PEACH_USER_ONE_PASSWORD_RESET_TOKEN = res.body.data;
                done();
            });
    });

})