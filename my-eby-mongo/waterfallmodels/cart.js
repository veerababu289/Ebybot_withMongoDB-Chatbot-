const { ComponentDialog, WaterfallDialog, TextPrompt, DialogTurnStatus } = require("botbuilder-dialogs");
const { CardFactory, AttachmentLayoutTypes, AdaptiveCards } = require("botbuilder")
var ACData = require("adaptivecards-templating");
var cartcart = require('../adaptivecards/cartcart.json')
const { registerdData } = require('../mongo/getting_regdata_mongo')
class cart extends ComponentDialog {
    constructor(id, conversationState) {
        super(id);
        this.conversationState = conversationState
        this.cartinfo = conversationState.createProperty("CART_INFO");
        this.cartinfo1 = conversationState.createProperty("CART_INFO1");
        this.cartinfo2 = conversationState.createProperty("CART_INFO2");
        this.addDialog(new TextPrompt('instructions'));
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.showingCart.bind(this)


        ]))
        this.initialDialogId = 'WaterFall'
    }

    async showingCart(stepContext) {


        var loginemail = await this.cartinfo2.get(stepContext.context)
        var loginemail1 = loginemail.user
        var registerdata = await registerdData()
        var registerdata1 = registerdata.data
        var cartdetailsnew = ""
        for (let i = 0; i < registerdata1.length; i++) {
            if (registerdata1[i].email == loginemail1) {
                cartdetailsnew = registerdata1[i].cart
            }
        }

        
        if ( cartdetailsnew[0] ) {
            var cartdetails1 = cartdetailsnew
            var totalcost = 0;
            for (let i = 0; i < cartdetails1.length; i++) {
                let totalcost1 = cartdetails1[i].cost * cartdetails1[i].quantity
                totalcost = totalcost + totalcost1
            }
            let cartcart1 = JSON.parse(JSON.stringify(cartcart))
            cartcart1.body[2].columns[3].items[0].text = totalcost.toString() + '$'

            var cartjson = {}
            var cart = cartdetailsnew
            cartjson.cart = cart

            var template = new ACData.Template(cartcart1);
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
            await stepContext.context.sendActivity("No items were added to cart")
            return stepContext.endDialog()
        }
    }


}
module.exports.cart = cart;

