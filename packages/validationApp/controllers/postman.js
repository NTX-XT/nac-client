const sdk = require('@nwc-sdk/client')

const run = async(req, res, next) => {
    res.json(sdk.Specifications.postman())

}

module.exports = run