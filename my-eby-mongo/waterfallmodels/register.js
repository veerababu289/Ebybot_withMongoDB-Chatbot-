const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");
const { ActivityHandler, MessageFactory, CardFactory } = require('botbuilder');
const registercard = require('../adaptivecards/registercard.json')
const samplecard = require('../adaptivecards/sampledataregister.json')
var ACData = require("adaptivecards-templating");

class register extends ComponentDialog{
    constructor(id){
        super(id)
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.registerform.bind(this) 
        ]))
        this.initialDialogId = 'WaterFall'
    }

    async registerform (stepContext){
        var template = new ACData.Template(registercard);
        var contextdata = {
            $root: samplecard
        };

        var cards = template.expand(contextdata);

        await stepContext.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(cards)]
        })

        return stepContext.endDialog()
    }
}
module.exports.register = register