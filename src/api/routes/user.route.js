import { Router } from "express";
import { registerUsers, login, updateUser, forgotPassword, resetPassword, verifyCode, getAllUsers, deleteUser} from "../controllers/users.controller";
import { verifyResetToken, checkExistingEmail } from "../middlewares/auth.middleware";
import model from '../middlewares/model.middleware';
import * as Schema from '../../lib/schema/schema.user';


const router = Router();

router.post(
    '/signup', 
    model(Schema.registerUsers, 'payload'),
    checkExistingEmail,
    registerUsers 
);

router.get('/users', getAllUsers)

router.post(
    '/login', 
    model(Schema.login, 'payload'),
    login 
);

router.patch(
    '/update_user/:id', 
    model(Schema.userId, 'params'),
    model(Schema.updateUser, 'payload'),
    updateUser 
);

router.post(
    '/forgot_password', 
    model(Schema.forgotPassword, 'payload'),
    forgotPassword 
);

router.patch(
    '/verify_code',
    model(Schema.verifyCode, 'payload'),
    verifyCode 
);

router.patch(
    '/reset_password', 
    model(Schema.resetPassword, 'payload'),
    verifyResetToken, 
    resetPassword 
);

router.delete(
    '/delete_user/:id', 
    model(Schema.userId, 'params'),
    deleteUser
);


export default router;