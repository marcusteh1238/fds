const router = require('express').Router({ mergeParams: true });

const controllerPath = "../controller/customer";
const CustomerLoginController = require(`${controllerPath}/login`);
const GetCustomerController = require(`${controllerPath}/getCustomer`);

router.get("/login/:username", async(req, res) => {
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

module.exports = router;
