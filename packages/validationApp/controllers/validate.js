const newman = require('newman')
const pmEncoder = require('postman-url-encoder')
const sdk = require('@nwc-sdk/client')
const run = async(req, res, next) => {
    const vars = [{
        key: "client_id",
        value: req.body.clientId,
    }, {
        key: "client_secret",
        value: req.body.clientSecret,

    }]
    const results = []
    await newman.run({
        collection: sdk.Specifications.postman(),
        envVar: vars
    }, function(error, summary) {
        if (error) {
            res.code = "500"
            res.error = error
        } else {
            for (const execution of summary.run.executions) {
                results.push({
                    name: execution.item.name,
                    url: decodeURI(pmEncoder.toNodeUrl(execution.item.request.url).href),
                    method: execution.item.request.method,
                    status: execution.response.details.code
                })
            }
            res.json(results)
        }
    })
}

module.exports = run