// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory, CardFactory } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            await this.dialog.run(context, this.dialogState);
            await conversationState.saveChanges(context, false)
            await userState.saveChanges(context, false)
           
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;

            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {

                    const welcomecard = CardFactory.heroCard('Haii! my name is eby, food delivery chatbot', ' I can help you with order food.', ['https://img.freepik.com/free-vector/delivery-staff-ride-motorcycles-shopping-concept_1150-34879.jpg'])
                    await context.sendActivity({ attachments: [welcomecard] })
                    
                    // function timeout() {
                    //     return new Promise(resolve => {
                    //         setTimeout(resolve, 5000);
                    //     });
                    // }
                    // await context.sendActivity({ type: 'typing' });
                    // await timeout()

                    const infocard =  CardFactory.heroCard('Click on your type', [], ['Register','Login'])
                    await context.sendActivity({ attachments: [infocard] })
           
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;

