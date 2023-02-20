const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");

var axios = require('axios');


class deletecart extends ComponentDialog {
    constructor(id, conversationState) {
        super(id)   
        this.conversationState = conversationState
        this.cartinfo2 = conversationState.createProperty("CART_INFO2");
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.deletecart.bind(this)
        ]))
        this.initialDialogId = 'WaterFall'
    }

    async deletecart(stepContext) {
        var loginemail = await this.cartinfo2.get(stepContext.context)
        var loginemail1 = loginemail.user
     
        var data = JSON.stringify({
          "email": loginemail1
        });
        
        var config = {
          method: 'put',
          url: 'http://localhost:8080/deletecart',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
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
module.exports.deletecart = deletecart