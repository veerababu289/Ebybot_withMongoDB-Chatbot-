

var axios = require('axios');
const { ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');


class authdata extends ComponentDialog {

    constructor(id, conversationState) {
        super(id)
        this.conversationState = conversationState
        this.cartinfo1 = conversationState.createProperty("CART_INFO1");
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.posting_auth_data.bind(this)
        ]))
        this.initialDialogId = 'WaterFall'
    }

    async posting_auth_data(stepContext) {
        var authDetails = await this.cartinfo1.get(stepContext.context)
        var authDetails1 = authDetails.cart
         delete authDetails1.id
        var data = JSON.stringify([
            authDetails1
        ]);
        
        

        var config = {
            method: 'post',
            url: 'http://localhost:8080/postauth',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                // console.log("auth.js",JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

        return stepContext.endDialog()
    }
}

module.exports.authdata = authdata