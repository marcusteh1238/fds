### How to implement Endpoints

For the sake of this guide, you are working on version `X` of the API, and you are implementing the `foo/helloWorld` endpoint. `foo` is then a router that can be routed to multiple other routes like `foo/byeWorld` and `foo/wassupWorld`, for example.

#### 1. Create `foo.js` router in the `src/router` directory.

As foo is a router that will be linked to other endpoints, we will need to create that first. If it is already created, you can skip this step.

Firstly, you will need to set up the router file `foo.js` with the following line of code:

```javascript
const router = require('express').Router({ mergeParams: true });
```

At the end of the file, export it with this line of code:

```javascript
module.exports = router;
```

We will come back to this file later.

#### 3. Create the implementation of the endpoint in `src/controller/foo` directory.

This is the file which controls what should be done whenever the endpoint is being called. Note that the implementation exists without importing anything related to `Express JS`.

Firstly, add this line `"use strict";` at the top of the file. Click [here](http://www.ecma-international.org/ecma-262/6.0/#sec-strict-mode-code) for more information on what this line does.

Then, all you need to do is create the implementation of the endpoint as a function, and set `module.exports.get` to be that.

Your `helloWorld.js` file should then look something like this:

```js
"use strict";
// additional imports
const bar = require('../../something/bar');
// error imports
const NoUserError = require("../../../errors/NoUserError");
// Controller implementation
async function helloWorldImpl(params) {
    try {
        // additional logic
        return "Hello World!";
    } catch (err) {
        logger.error({
      msg: err.message,
      err: err
    });
    }
}
// exporting the controller
module.exports.get = helloWorldImpl;
```

#### 4. Add controller to the `/foo` router

Now that the implementation for the controller is complete, you just simply need to import and add it to the `foo.js` router.

In `src/router/foo.js`, you need to add in the following:

The import for the controller,
```js
const helloWorldController = require('../../controller/foo/helloWorld');
```
And the implementation in the router.
```js
router.get('/helloWorld', async(req, res) => {
    const text = await helloWorldController.get(req.params);
    res.status(200).send(text);
})
```
Congratulations, now you can use your new endpoint!
___