const router = require('express').Router({ mergeParams: true });

const controllerPath = "../controller";
const GetRestaurantController = require(`${controllerPath}/restaurant/getRestaurant`)
const RestaurantListController = require(`${controllerPath}/restaurant/list`);
const ViewMonthlyOrderController = require(`${controllerPath}/restaurant/viewMonthlyOrder`);
const ViewTotalCostOfOrderController = require(`${controllerPath}/restaurant/viewTotalCostOfOrder`);
const ViewTopFiveFoodItemsController = require(`${controllerPath}/restaurant/viewTopFiveFoodItems`);
const GetPromoSummaryController = require(`${controllerPath}/restaurant/getPromoSummary`);
const GetPromoController = require(`${controllerPath}/restaurant/getPromo`);
const UpdateDailyOrderLimitController = require(`${controllerPath}/restaurant/updateDailyOrderLimit`);
const UpdateMinOrderAmountController = require(`${controllerPath}/restaurant/updateMinOrderAmt`);

router.get("/getRestaurant/:rid", async(req, res) => {
    try {
        const response = await GetRestaurantController.get(req.params);
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

router.get("/viewTotalCostOfOrder/:rid/:startDate/:endDate", async(req, res) => {
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
        const response = await ViewTopFiveFoodItemsController.get(req.params);
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

router.get("/getPromoSummary/:pid", async(req, res) => {
    try {
        const response = await GetPromoSummaryController.get(req.params);
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

router.get("/getPromo/:pid", async(req, res) => {
    try {
        const response = await GetPromoController.get(req.params);
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

router.post("/updateDailyOrderLimit/:rid/:fooditemid/:newLimit", async(req, res) => {
    try {
        const response = await UpdateDailyOrderLimitController.post(req.params);
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


router.post("/updateMinOrderAmt/:rid/:newMinAmt", async(req, res) => {
    try {
        const response = await UpdateMinOrderAmountController.post(req.params);
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
