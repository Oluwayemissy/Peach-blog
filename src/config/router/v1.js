import { Router } from "express";

import users from '../../api/routes/user.route';
import blogs from '../../api/routes/blog.route';
const api = Router();

api.get('/', (req, res) => {
    res.send({ message: 'Welcome' });
});

api.use('/users', users)

api.use('/blogs', blogs)

export default api;