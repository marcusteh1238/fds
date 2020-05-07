const router = require('express').Router({ mergeParams: true });

const controllerPath = "../controller/customer";
const CustomerLoginController = require(`${controllerPath}/login`);
const GetCustomerController = require(`${controllerPath}/getCustomer`);
const AddNewCustomerController = require(`${controllerPath}/addNewCustomer`);
const CreateOrderController = require(`${controllerPath}/createOrder`);
const UpdateCustomerController = require(`${controllerPath}/updateCustomer`);
const DeleteCustomerController = require(`${controllerPath}/deleteCustomer`);

router.get("/login/:username/:password", async(req, res) => {
    try {
        const response = await CustomerLoginController.get(req.params);
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

router.get("/getCustomer/:cid", async(req, res) => {
    try {
        const response = await GetCustomerController.get(req.params);
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

router.post("/addNewCustomer", async(req, res) => {
    try {
        const response = await AddNewCustomerController.post(req.body);
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

router.post("/createOrder", async(req, res) => {
    try {
        const response = await CreateOrderController.put(req.body);
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

router.post("/updateCustomer/:cid", async(req, res) => {
    try {
        const response = await UpdateCustomerController.post(req.params, req.body);
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

router.post("/deleteCustomer/:cid", async(req, res) => {
    try {
        const response = await DeleteCustomerController.post(req.params);
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
