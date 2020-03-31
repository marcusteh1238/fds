const router = require('express').Router({ mergeParams: true });

const controllerPath = "../controller";
const RestaurantListController = require(`${controllerPath}/restaurant/list`);

router.get("/list", async(req, res) => {
    try {
        const response = await RestaurantListController.get(req.params);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        const errorCode = error.statusCode ? error.statusCode : 400;
        res.status(errorCode).send({
            msg: error.message,
            error: error
        })
    }
});

module.exports = router;
