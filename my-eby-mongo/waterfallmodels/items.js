const { ComponentDialog, WaterfallDialog, TextPrompt, DialogTurnStatus } = require("botbuilder-dialogs");
const { CardFactory, AttachmentLayoutTypes } = require("botbuilder")
var Foodcard = require('../adaptivecards/foodcard.json')
const {FoodItems} = require('../mongo/fooditems')

class items extends ComponentDialog {

    constructor(id) {
        super(id)
    
        this.addDialog(new TextPrompt('instructions'));
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.showingCards.bind(this) 
        ]))
        this.initialDialogId = 'WaterFall'
    }

    async showingCards(stepContext) {
        var carousel = [];
        let food = await FoodItems()
        var fooditems1 =  food.data
       
        // fooditems.forEach(element => {
        //     let card = JSON.parse(JSON.stringify(Foodcard))

        //     card.body[0].text= element.item
        //     card.body[1].columns[1].items[0].text= element.quantity
        //     card.body[1].columns[1].items[1].text= element.availability
        //     card.body[1].columns[0].items[0].url = element.image
        //     carousel.push(CardFactory.adaptiveCard(card))
        // });
        for (var i = 0; i < fooditems1.length; i++) {
            let card = JSON.parse(JSON.stringify(Foodcard))

            card.body[0].text = fooditems1[i].item
            card.body[1].columns[1].items[0].text = `cost : ${fooditems1[i].cost}$`
            card.body[1].columns[1].items[1].text = `Availability :${fooditems1[i].availability}`
            card.body[1].columns[0].items[0].url = fooditems1[i].image
             card.body[2].actions[0].data.materialId = fooditems1[i].id
            card.body[2].actions[0].data.name = fooditems1[i].item
            card.body[2].actions[0].data.cost = fooditems1[i].cost
            card.body[2].actions[0].data.url = fooditems1[i].image


            carousel.push(CardFactory.adaptiveCard(card))
        }

        await stepContext.context.sendActivity("Here is the menu that we provide");
        await stepContext.context.sendActivity({
            "attachments": carousel,
            "attachmentLayout": AttachmentLayoutTypes.Carousel
        })
        
        return stepContext.endDialog()
    }
}
module.exports.items = items;



// await stepContext.context.sendActivity({ attachments: [CardFactory.adaptiveCard(_group)] })
// fooditems[i].cost