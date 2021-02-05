import Express from 'express';
import logger from '../log';
import applicationService from '../application/application.service';

const router = Express.Router();

/* GET users listing. */
router.get('/', function (req: any, res, next) {
    applicationService.getApplications().then((apps) => {
        res.send(JSON.stringify(apps));
    });
});

router.get('/myApplications', function (req, res, next) {
    applicationService.getApplicationByName(req.params.name).then((apps) => {
        res.send(JSON.stringify(apps));
    });
});

router.get('/:id-:name', function (req, res, next) {
    applicationService
        .getApplicationsByIDAndName(req.params.name, Number(req.params.id))
        .then((rest) => {
            res.send(JSON.stringify(rest));
        });
});

router.post('/', (req: any, res, next) => {
    applicationService
        .addApplication(req.body)
        .then((data) => {
            res.sendStatus(201); // Created
        })
        .catch((err) => {
            logger.error(err);
            res.sendStatus(500); // Server error, sorry
        });
});

router.put('/', (req, res, next) => {
    applicationService.updateApplication(req.body).then((data) => {
        res.send(data);
    });
});
export default router;
