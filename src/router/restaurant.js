const router = require('express').Router({ mergeParams: true });

const controllerPath = "../controller";
const RestaurantListController = require(`${controllerPath}/restaurant/list`);
const ViewMonthlyOrderController = require(`${controllerPath}/restaurant/viewMonthlyOrder`);
const ViewTotalCostOfOrderController = require(`@{controllerPath}/restaurant/viewTotalCostOfOrder`);
const ViewTopFiveFoodItemsController = require(`@{controllerPath}/restaurant/viewTopFiveFoodItems`);

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

router.get("/viewMonthlyOrder/:startDate/:endDate", async(req, res) => {
    try {
        const response = await ViewMonthlyOrderController.get(req.params);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        const errorCode = error.statusCode ? error.statusCode: 400;
        res.status(errorCode).send({
            msg: error.message,
            error: error
        })
    }
});

router.get("/viewTotalCostOfOrder/:startDate/:endDate", async(req, res) => {
    try {
        const response = await ViewTotalCostOfOrderController.get(req.params);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        const errorCode = error.statusCode ? error.statusCode: 400;
        res.status(errorCode).send({
            msg: error.message,
            error: error
        })
    }
});

router.get("/viewTopFiveItems/:rId", async(req, res) => {
    try {
        const response = awati ViewTopFiveFoodItemsController.get(req.params);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        const errorCode = error.statusCode ? error.statusCode: 400;
        res.status(errorCode).send({
            msg: error.message,
            error: error
        })
    }
});

module.exports = router;
