const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");
const { ActivityHandler, MessageFactory, CardFactory } = require('botbuilder');
const registercard = require('../adaptivecards/logincard.json')
const samplecard = require('../adaptivecards/sampledatalogin.json')
var ACData = require("adaptivecards-templating");

class login extends ComponentDialog{
    constructor(id){
        super(id)
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.loginform.bind(this) 
        ]))
        this.initialDialogId = 'WaterFall'
    }

    async loginform (stepContext){
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
module.exports.login = login