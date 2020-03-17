const express = require("express");
const router = express.Router();
var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "s2s9p75q6crcqbh2",
    publicKey: "5jvv2r3phj3svp57",
    privateKey: "bff82aae91ef8da5ec0ec0e8ff030fea"
});

router.get("/client_token", async (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        var clientToken = response.clientToken
        res.json({
            clientToken
        })
    });
});

router.post("/checkout", async (req, res) => {
    const nonceFromTheClient = req.body.payment_method_nonce;

    gateway.customer.create({
        id: req.body.id,
        paymentMethodNonce: nonceFromTheClient,
        creditCard: {
            options: {
                verifyCard: true
            }
        },
        deviceData: req.body.deviceData
    }, function (err, result) {
        if(err) {
            return res.send({
                message: 'could not complete order',
                success: false
            })
        }
        console.log(result);
        if (!result.success) {
            return res.send({
                message: 'Trouble processing card',
                success: false
            })
        }
        // "Decline"
        gateway.subscription.create({
            paymentMethodToken: result.customer.paymentMethods[0].token,
            planId: req.body.planId
        }, function (err, result) {
            if(err) {
                return res.send({
                    message: 'could not complete order',
                    success: false
                })
            }
            res.send({
                result,
                success: true
            });

        });
    });
});


module.exports = router;