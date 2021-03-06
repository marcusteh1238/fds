const router = require('express').Router({ mergeParams: true });

const controllerPath = "../controller";
const LoginController = require(`${controllerPath}/restaurantstaff/login`);
const AddFoodItemController = require(`${controllerPath}/restaurantstaff/addFoodItem`);

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

router.post("/:rid/:rstaffId/addFoodItem", async(req, res) => {
    try {
        const response = await AddFoodItemController.post(req.params, req.body);
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
