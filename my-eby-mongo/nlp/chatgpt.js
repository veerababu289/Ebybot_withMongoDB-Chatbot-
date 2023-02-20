const path = require('path');
const dotenv = require('dotenv');
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });
var axios = require('axios');

const chatGPT = async (query) => {

    var data = JSON.stringify({
        "model": process.env.ChatGPTModelCapability,
        "prompt": query,
        "temperature": 0,
        "max_tokens": 100,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "stop": [" end"]
    });
    console.log(data)
    var config = {
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+process.env.ChatGPTkey
        },
        data: data
    };

    try {
        let response = await axios(config)
        console.log(response.data)
        return response
    }
    catch (error) {
        console.log(error)
    }
}
module.exports.chatGPT = chatGPT


