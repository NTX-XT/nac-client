const sdk = require('@nwc-sdk/client')

const run = async(req, res, next) => {
    res.json(sdk.Specifications.swagger())
}

module.exports = run