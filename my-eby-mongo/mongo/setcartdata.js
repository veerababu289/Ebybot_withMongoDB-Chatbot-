const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");

var axios = require('axios');


class setcart extends ComponentDialog {
    constructor(id, conversationState) {
        super(id)
        this.conversationState = conversationState
        this.cartinfo = conversationState.createProperty("CART_INFO");
        this.cartinfo2 = conversationState.createProperty("CART_INFO2");
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.setcart.bind(this)
        ]))
        this.initialDialogId = 'WaterFall'
    }

    async setcart(stepContext) {
        var cartdetails = await this.cartinfo.get(stepContext.context)
        var email = await this.cartinfo2.get(stepContext.context)
         var cartdetails1 = cartdetails.cart
        //  var cartdetails2 =  JSON.stringify(
        //     cartdetails1
        // );
        var email1 =  email.user
            
        
     
     
        var data = JSON.stringify({
          "email": email1,
          "cart":  cartdetails1
           
          
        });
        
        var config = {
          method: 'put',
          url: 'http://localhost:8080/updatecart',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios(config)
        .then(function (response) {
          // console.log("setcartdata",JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
        


        return stepContext.endDialog()
    }
}
module.exports.setcart = setcart