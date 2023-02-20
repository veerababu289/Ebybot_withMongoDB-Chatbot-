const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");

var axios = require('axios');


class deleteoneitem extends ComponentDialog {
    constructor(id, conversationState) {
        super(id)
        this.conversationState = conversationState
        this.cartinfo2 = conversationState.createProperty("CART_INFO2");
        this.deleteoneItem = conversationState.createProperty("DELETE_ONE_ITEM");
        this.addDialog(new WaterfallDialog('WaterFall', [
            this.deleteoneitem.bind(this)
        ]))
        this.initialDialogId = 'WaterFall'
    }

    async deleteoneitem(stepContext) {
        var loginemail = await this.cartinfo2.get(stepContext.context)
        var loginemail1 = loginemail.user
        var material_Id = await this.deleteoneItem.get(stepContext.context)
        var materialId = material_Id.materialid

        var data = JSON.stringify({
            "email":loginemail1 ,
            "name": materialId
        });
       
        var config = {
            method: 'put',
            url: 'http://localhost:8080/deleteoneincart',
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
module.exports.deleteoneitem = deleteoneitem