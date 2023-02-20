var axios = require('axios');

const CustomCLU = async (query) => {

  var data = JSON.stringify({
    "kind": "Conversation",
    "analysisInput": {
      "conversationItem": {
        "id": "PARTICIPANT_ID_HERE",
        "text": query,
        "modality": "text",
        "language":"en",
        "participantId": "PARTICIPANT_ID_HERE"
      }
    },
    "parameters": {
      "projectName": "My_eby_bot",
      "verbose": true,
      "deploymentName": "My_eby_bot",
      "stringIndexType": "TextElement_V8"
    }
  });
  
  var config = {
    method: 'post',
    url: 'https://wbakb.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview',
    headers: { 
      'Ocp-Apim-Subscription-Key': '86198e5f031546a9a9f8f5c7e1862de1', 
      'Apim-Request-Id': '4ffcac1c-b2fc-48ba-bd6d-b69d9942995a', 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  
  
try{
    let response = await axios(config)
    return response.data.result.prediction 
}
catch(error){
    console.log(error)
}

}

module.exports.CustomCLU = CustomCLU