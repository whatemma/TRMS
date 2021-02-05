import express from 'express';
import * as user from './user';
import logger from '../log';
import userService from './user.service';

const router = express.Router();

/* GET users listing. */

router.patch('/', function (req: any, res, next) {
    userService
        .updateUser(req.body)
        .then(() => {
            if (req.session.user.name === req.body.name) {
                req.session.user = req.body;
                req.session.save();
            }
            logger.debug('patch: ' + JSON.stringify(req.session));
            return true;
        })
        .catch((err) => {
            logger.error(err);
            return false;
        });
});

router.get('/:department-dephead', (req, res, next) => {
    userService
        .getUserByDepartmentRole(req.params.department)
        .then((data) => {
            res.send(JSON.stringify(data));
        })
        .catch((err) => {
            logger.error(err);
        });
});

router.get('/:name', (req, res, next) => {
    userService
        .getUserByName(req.params.name)
        .then((r) => {
            res.send(JSON.stringify(r));
        })
        .catch((err) => {
            res.sendStatus(404);
            logger.error(err);
        });
});

router.get('/', (req: any, res, next) => {
    logger.debug('session in get / : ' + JSON.stringify(req.session.user));
    let u = { ...req.session.user };
    //delete u.password;
    res.send(JSON.stringify(u));
});

// Legacy route, do not use.
router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => logger.error(err));
    res.redirect('/');
});

// Much more restful
router.delete('/', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            logger.error(err);
        }
    });
    res.sendStatus(204);
});

router.post('/', function (req: any, res, next) {
    user.login(req.body.name, req.body.password).then((user) => {
        if (user === null) {
            res.sendStatus(401);
        }
        req.session.user = user;
        res.send(JSON.stringify(user));
    });
});

export default router;
