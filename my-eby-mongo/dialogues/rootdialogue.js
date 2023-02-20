const {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  WaterfallDialog,
} = require("botbuilder-dialogs");
var axios = require('axios');
const { CustomCLU } = require("../nlp/Clu");
const { CustomQNA } = require("../nlp/qna");
const { chatGPT } = require("../nlp/chatgpt");
const { items } = require("../waterfallmodels/items");
const { cart } = require("../waterfallmodels/cart");
const { orders } = require("../waterfallmodels/orders");
const { authdata } = require('../mongo/registered_to_mongo')
const { login } = require('../waterfallmodels/login')
const { register } = require('../waterfallmodels/register')
const { registerdData } = require('../mongo/getting_regdata_mongo')
const { setcart } = require('../mongo/setcartdata')
const { setorder } = require('../mongo/setordersdata')
const { deletecart } = require('../mongo/deletecartdata')
const { deleteoneitem } = require('../mongo/deleteoneItemInCart')

class RootDialog extends ComponentDialog {
  constructor(conversationState, userState) {
    super("MainDialog");
    this.conversationState = conversationState;
    this.userState = userState;
    this.cartinfo = conversationState.createProperty("CART_INFO");
    this.cartinfo1 = conversationState.createProperty("CART_INFO1");
    this.cartinfo2 = conversationState.createProperty("CART_INFO2");
    this.deleteoneItem = conversationState.createProperty("DELETE_ONE_ITEM");
    this.addDialog(new items("items", conversationState));
    this.addDialog(new cart("cart", conversationState));
    this.addDialog(new orders("orders", conversationState));
    this.addDialog(new authdata("authdata", conversationState));
    this.addDialog(new login("login"));
    this.addDialog(new register("register"));
    this.addDialog(new setorder("setorder", conversationState));
    this.addDialog(new setcart("setcart", conversationState));
    this.addDialog(new deletecart("deletecart", conversationState));
    this.addDialog(new deleteoneitem("deleteoneitem", conversationState));
    this.addDialog(new WaterfallDialog("WATERFALL", [this.botflow.bind(this)]));
    this.initialDialogId = "WATERFALL";
  }

  async run(context, statePropertyAccessor) {
    let dialogSet = new DialogSet(statePropertyAccessor);
    dialogSet.add(this);
    const dialogContext = await dialogSet.createContext(context);
    let results = await dialogContext.continueDialog();
    if (results.status == DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  async botflow(stepContext) {

    if (stepContext.context.activity && stepContext.context.activity.value) {
      function timeout() {
        return new Promise(resolve => {
          setTimeout(resolve, 3000);
        });
      }
      if (stepContext.context.activity.value.id) {
        if (stepContext.context.activity.value.id == "auth") {
          let authDetails = {};
          authDetails.cart = stepContext.context.activity.value;
          await this.cartinfo1.set(stepContext.context, authDetails);
          await stepContext.context.sendActivity(
            "Your registration completed successfully. Please Login to continue"
          );
          return await stepContext.beginDialog("authdata");
        }
        if (stepContext.context.activity.value.id == "login") {
          var logindata = stepContext.context.activity.value
          var logindata1 = logindata.email
          var registerdata = await registerdData()
          var registerdata1 = registerdata.data

          var flag = true
          for (let i = 0; i < registerdata1.length; i++) {
            if (registerdata1[i].email == logindata1) {
              flag = false
              var logindPerson = registerdata1[i].email
              await stepContext.context.sendActivity(
                `Hello ${registerdata1[i].name},How can i help you?`
              );
            }
          }
          let loginpersonDetails = {};
          var user = logindPerson
          loginpersonDetails.user = user;
          await this.cartinfo2.set(stepContext.context, loginpersonDetails);
          if (flag) {
            await stepContext.context.sendActivity(
              "sorry, Wrong credintials (or) You are not registerd yet, please register before to continue"
            )
          };
        }
        if (stepContext.context.activity.value.id == "itemsCard") {
          var registerdata = await registerdData()
          var registerdata1 = registerdata.data
          var email = await this.cartinfo2.get(stepContext.context)
          var logindata = email.user

          if (registerdata1) {
            for (let i = 0; i < registerdata1.length; i++) {
              if (registerdata1[i].email == logindata) {
                var email1 = registerdata1[i].email
                if (registerdata1[i].cart[0]) {
                  for (let j = 0; j < registerdata1[i].cart.length; j++) {
                    if (registerdata1[i].cart[j].name == stepContext.context.activity.value.name) {
                      var name1 = registerdata1[i].cart[j].name
                      var quantity1 = parseInt(registerdata1[i].cart[j].quantity)
                      var quantity2 = (quantity1 + 1).toString()

                      var data = JSON.stringify({
                        "email": email1,
                        "item": name1,
                        "quantity": quantity2
                      });
                      var config = {
                        method: 'put',
                        url: 'http://localhost:8080/updatequantity',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        data: data
                      };
                      axios(config)
                        .then(function (response) {
                          // console.log(JSON.stringify(response.data));
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                      await stepContext.context.sendActivity(
                        "Item updated in cart successfully"
                      );
                      return stepContext.endDialog();
                    }
                  }
                }
              }
            }
          }
          let ebyDetails = {};
          var cart = stepContext.context.activity.value
          cart.quantity = "1";
          ebyDetails.cart = cart;
          await this.cartinfo.set(stepContext.context, ebyDetails);
          await stepContext.context.sendActivity(
            "Item added to cart successfully"
          );
          return await stepContext.beginDialog("setcart");
        }
        if (stepContext.context.activity.value.id == "deleteItem") {
          var Id = stepContext.context.activity.value.materialId
          var material_Id = {}
          material_Id.materialid = Id
          await this.deleteoneItem.set(stepContext.context, material_Id);
          await stepContext.beginDialog("deleteoneitem");
          await stepContext.context.sendActivity({ type: 'typing' });
          await timeout()
          await stepContext.context.sendActivity("Item deleted succesfully");
          await stepContext.beginDialog("cart");
        }
        if (stepContext.context.activity.value.id == "savechanges") {
          var savechanges = stepContext.context.activity.value;
          var save1 = Object.keys(savechanges)
          var registerdata = await registerdData()
          var registerdata1 = registerdata.data
          var email = await this.cartinfo2.get(stepContext.context)
          var login = email.user

          for (let i = 0; i < registerdata1.length; i++) {
            if (registerdata1[i].email == login) {
              var email_id = registerdata1[i].email
              for (let j = 0; j < registerdata1[i].cart.length; j++) {
                for (let k = 0; k < save1.length; k++) {
                  if (registerdata1[i].cart[j].name == save1[k]) {
                    var item_name = registerdata1[i].cart[j].name
                    var quant = savechanges[save1[k]]
                    var data = JSON.stringify({
                      "email": email_id,
                      "item": item_name,
                      "quantity": quant
                    });
                    var config = {
                      method: 'put',
                      url: 'http://localhost:8080/updatequantity',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      data: data
                    };
                    axios(config)
                      .then(function (response) {
                        // console.log(JSON.stringify(response.data));
                      })
                      .catch(function (error) {
                        console.log(error);
                      })
                  }
                }
              }
            }
          }

          // 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

          //Deleting "0" quantity item from the cart
          for (let i = 0; i < registerdata1.length; i++) {
            if (registerdata1[i].email == login) {
              var email_id = registerdata1[i].email
              for (let j = 0; j < registerdata1[i].cart.length; j++) {
                if (registerdata1[i].cart[j].quantity == 0) {
                  var materialId1 = registerdata1[i].cart[j].materialId
                  var data = JSON.stringify({
                    "email": email_id,
                    "name": materialId1
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
                      // console.log(JSON.stringify(response.data));
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                }
              }
            }
          }
          await stepContext.context.sendActivity("Changes are saved");
          await stepContext.context.sendActivity({ type: 'typing' });
          await timeout()

          return await stepContext.beginDialog("cart");
        }
        if (stepContext.context.activity.value.id == "orderPlaced") {
          await stepContext.beginDialog("setorder");
          await stepContext.beginDialog("deletecart");
          await stepContext.context.sendActivity("Your order was placed")
        }

      }

      return stepContext.endDialog();
    }
    else {
      let CLU_Response = await CustomCLU(stepContext.context.activity.text);
      let topIntent = CLU_Response.topIntent;
      let score = CLU_Response.intents[0].confidenceScore;
      

      let QNA_Response = await CustomQNA(stepContext.context.activity.text);
      var QNA_Response_answer = QNA_Response.answers[0].answer
      var QNA_Response_score = QNA_Response.answers[0].confidenceScore

      let chatgpt_response = await chatGPT(stepContext.context.activity.text);
       var chatgpt_answer = chatgpt_response.data.choices[0].text
      // console.log("chatgpt_response",chatgpt_response.data)
    

      if (score >= 0.8) {
        switch (topIntent.toLowerCase()) {
          case "login":
            return await stepContext.beginDialog("login");
          case "register":
            return await stepContext.beginDialog("register");
        }
        var email = await this.cartinfo2.get(stepContext.context)
        if(email){
          switch (topIntent.toLowerCase()) {
            case "cart":
              return await stepContext.beginDialog("cart");
            case "order":
              return await stepContext.beginDialog("orders");
            case "items":
              return await stepContext.beginDialog("items");
          }
        }
        else{
         return await stepContext.context.sendActivity("Please Login before to make your order.")
        }
      }
      else if (score < 0.8) {
        if (QNA_Response_score >= 0.8) {
          await stepContext.context.sendActivity(QNA_Response_answer);
        }
        else{
          await stepContext.context.sendActivity(chatgpt_answer);
        }
      }
      return stepContext.endDialog();
    }

    // await next();
  }
}

module.exports.RootDialog = RootDialog;

