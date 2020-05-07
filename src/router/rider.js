const router = require('express').Router({ mergeParams: true });

const controllerPath = "../controller";
const LoginController = require(`${controllerPath}/rider/login`);
const GetOrderController = require(`${controllerPath}/rider/getOrder`);
const ViewTotalNumberOfOrdersController = require(`${controllerPath}/rider/viewTotalNumberOfOrders`);
const UpdateOrderStatus_AcceptOrderController = require(`${controllerPath}/rider/updateOrderStatus_acceptOrder`);
const UpdateOrderStatus_ArrivedController = require(`${controllerPath}/rider/updateOrderStatus_arrived`);
const UpdateOrderStatus_DeliveredController = require(`${controllerPath}/rider/updateOrderStatus_delivered`);

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

router.get("/rider/getOrder/:oid", async(req, res) => {
    try {
        const response = await GetOrderController.get(req.params);
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

router.get("/viewTotalNumberOfOrders/:rid/:startDate/:endDate", async(req, res) => {
    try {
        const response = await ViewTotalNumberOfOrdersController.get(req.params);
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

router.post(":riderId/updateOrder/accept/:oid", async(req, res) => {
    try {
        const response = await UpdateOrderStatus_AcceptOrderController.get(req.params);
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

router.post(":riderId/updateOrder/arrived/:oid", async(req, res) => {
    try {
        const response = await UpdateOrderStatus_ArrivedController.get(req.params);
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

router.post(":riderId/updateOrder/delivered/:oid", async(req, res) => {
    try {
        const response = await UpdateOrderStatus_DeliveredController.get(req.params);
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



