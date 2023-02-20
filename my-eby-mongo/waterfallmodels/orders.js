const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder")
var ACData = require("adaptivecards-templating");
const { registerdData } = require('../mongo/getting_regdata_mongo')
var orderscard = require('../adaptivecards/orderscard.json')
class orders extends ComponentDialog {

    constructor(id, conversationState) {
        super(id)
        this.conversationState = conversationState
        this.cartinfo2 = conversationState.createProperty("CART_INFO2");
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.showingItems.bind(this)
        ]))
        this.initialDialogId = 'WaterFall'
    }

    async showingItems(stepContext) {


        var registerdata = await registerdData()
        var registerdata1 = registerdata.data
        var loginemail = await this.cartinfo2.get(stepContext.context)
        var loginemail1 = loginemail.user

        var cartdetailsnew = ""

        for (let i = 0; i < registerdata1.length; i++) {

            if (registerdata1[i].email == loginemail1) {
                if (registerdata1[i].order[0]) {
                    cartdetailsnew = registerdata1[i].order[registerdata1[i].order.length - 1].orders1
                    break;
                }
            }
        }

        if (cartdetailsnew[0]) {

            var cartdetails1 = cartdetailsnew
            var totalcost = 0;
            for (let i = 0; i < cartdetails1.length; i++) {
                let totalcost1 = cartdetails1[i].cost * cartdetails1[i].quantity
                totalcost = totalcost + totalcost1
            }

            let orderscard1 = JSON.parse(JSON.stringify(orderscard))
            orderscard1.body[2].columns[3].items[0].text = totalcost.toString() + '$'

            var cartjson = {}
            var cart = cartdetailsnew
            cartjson.cart = cart

            var template = new ACData.Template(orderscard1);
            var contextdata = {
                $root: cartjson
            };

            var cards = template.expand(contextdata);

            await stepContext.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(cards)]
            })
            return stepContext.endDialog()
        }
        else {
            await stepContext.context.sendActivity("No items were ordered  yet")
            return stepContext.endDialog()
        }
    }
}
module.exports.orders = orders




// var cart = {
//     "title": "Tell us about yourself",
//     "body": "We just need a few more details to get you booked for the trip of a lifetime!",
//     "disclaimer": "Don't worry, we'll never share or sell your information.",
//     "properties": [
//         {
//             "id": "myName",
//             "label": "Your name (Last, First)",
//             "validation": "^[A-Z][a-z]+, [A-Z][a-z]+$",
//             "error": "Please enter your name in the specified format"
//         },
//         {
//             "id": "myEmail",
//             "label": "Your email",
//             "validation": "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z0-9-]{2,4}$",
//             "error": "Please enter a valid email address"
//         },
//         {
//             "id": "myTel",
//             "label": "Phone Number (xxx-xxx-xxxx)",
//             "validation": "^[0-9]{3}-[0-9]{3}-[0-9]{4}$",
//             "error": "Invalid phone number. Use the specified format: 3 numbers, hyphen, 3 numbers, hyphen and 4 numbers"
//         }
//     ],
//     "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Diver_Silhouette%2C_Great_Barrier_Reef.jpg",
//     "thumbnailAlt": "Diver in the Great Barrier Reef"
// }