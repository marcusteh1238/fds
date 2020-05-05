const router = require('express').Router({ mergeParams: true });

const controllerPath = "../controller";
const LoginController = require(`${controllerPath}/fdsmanager/login`);
const GetMonthlyNewCustomerController = require(`${controllerPath}/fdsmanager/getMonthlyNewCustomer`);
const GetMonthlyTotalOrderController = require(`${controllerPath}/fdsmanager/getMonthlyTotalOrders`);
const ViewTotalCostOfAllOrdersController = require(`${controllerPath}/fdsmanager/viewTotalCostOfAllOrders`);
router.get("/login/:username/:password", async(req, res) => {
    try {
        const response = await LoginController.get(req.params);
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

router.get("/getMonthlyNewCustomer/:startDate/:endDate", async(req, res) => {
    try {
        const response = await GetMonthlyNewCustomerController.get(req.params);
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

router.get("/getMonthlyTotalOrder/:startDate/:endDate", async(req, res) => {
    try {
        const response = await GetMonthlyTotalOrderController.get(req.params);
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

router.get("/viewTotalCostOfAllOrders/:startDate/:endDate", async(req, res) => {
    try {
        const response = await ViewTotalCostOfAllOrdersController.get(req.params);
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
