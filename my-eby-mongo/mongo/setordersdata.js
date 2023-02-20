const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");
const { registerdData } = require('../mongo/getting_regdata_mongo')
var axios = require('axios');


class setorder extends ComponentDialog {
    constructor(id, conversationState) {
        super(id)
        this.conversationState = conversationState
        this.cartinfo2 = conversationState.createProperty("CART_INFO2");
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.setorder.bind(this)
        ]))
        this.initialDialogId = 'WaterFall'
    }

    async setorder(stepContext) {

        var registerdata = await registerdData()
        var registerdata1 = registerdata.data
        var loginemail = await this.cartinfo2.get(stepContext.context)
        var loginemail1 = loginemail.user
        var cartdetailsnew = ""
        var orderdetailsnew = ""
        for (let i = 0; i < registerdata1.length; i++) {
            if (registerdata1[i].email == loginemail1) {
                cartdetailsnew = registerdata1[i].cart
                orderdetailsnew = registerdata1[i].order
            }
        }


        if (orderdetailsnew[0]) {
            var orders2 = orderdetailsnew[orderdetailsnew.length - 1]
            var orders3 = orders2.orders1
            for (let i = 0; i < orders3.length; i++) {
                var ordernew = []
                for (let j = 0; j < cartdetailsnew.length; j++) {
                    if (cartdetailsnew[j].materialId == orders3[i].materialId) {
                        var quantity1 = parseInt(orders3[i].quantity)
                        var quantity2 = (quantity1 + 1).toString()
                        orders3[i].quantity = quantity2
                        ordernew.push(...orders3)
                    }
                }
            }

            for (let i = 0; i < cartdetailsnew.length; i++) {
                var flag = true
                for (let j = 0; j < orders3.length; j++) {
                    if (orders3[j].materialId == cartdetailsnew[i].materialId) {
                        flag = false
                    }
                }
                if (flag) {
                    var ordernew = []
                    ordernew.push(...orders3)
                    ordernew.push(cartdetailsnew[i])
                }
            }
        }
        else {
            var ordernew = []
            ordernew.push(...cartdetailsnew);
        }

        var data = JSON.stringify({
            "email": loginemail1,
            "cart": {
                "orders1": ordernew
            }
        });

        var config = {
            method: 'put',
            url: 'http://localhost:8080/updateorders',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });


        return stepContext.endDialog()
    }
}
module.exports.setorder = setorder