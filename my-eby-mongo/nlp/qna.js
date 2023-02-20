var axios = require('axios');

const CustomQNA = async (query) => {

var data = JSON.stringify({
  "question": query,
  "top": 1
});

var config = {
  method: 'post',
  url: 'https://wbakb.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=Sample-project&api-version=2021-10-01&deploymentName=production',
  headers: { 
    'Ocp-Apim-Subscription-Key': '86198e5f031546a9a9f8f5c7e1862de1', 
    'Content-Type': 'application/json'
  },
  data : data
};

try{
    let qna_response = await axios (config)
    return qna_response.data
    
}
catch(error){
    console.log(error)
}

}

module.exports.CustomQNA = CustomQNA
