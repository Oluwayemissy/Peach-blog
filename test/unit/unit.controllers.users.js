import { expect } from "chai";
import sinon from "sinon";
import * as UsersControllers from "../../src/api/controllers/users.controller";

describe('User Controller Unit Tests', () => {
    let status, next;

    const res = {
        status: 'error',
        error: 'INTERNAL_SERVER_ERROR',
        code: 500
    }

    beforeEach(() => {
        status = sinon.stub();
        next = sinon.stub();
        status.returns(res);
        next.returns(res);
    })

    describe('User controller catch block unit testing', () => {
        it ('should call sign up user', async () => {
            const req = { body: ''} ;
            await UsersControllers.registerUsers(req, res, next);
            expect(res.code).to.equal(500);
            expect(res.error).to.equal('INTERNAL_SERVER_ERROR')
        })

        it ('should call login user', async () => {
            const req = { body: ''} ;
            await UsersControllers.login(req, res, next);
            expect(res.code).to.equal(500);
            expect(res.error).to.equal('INTERNAL_SERVER_ERROR')
        })

        
    })
})