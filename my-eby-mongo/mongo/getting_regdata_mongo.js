var axios = require('axios');


const registerdData = async () => {


    var data = '';
    
    var config = {
        method: 'get',
        url: 'http://localhost:8080/getauth',
        headers: {},
        data: data
    };

    try{
        let authback = await axios(config)
       
        return authback
    }
    catch(error){
        console.log(error)
    }
}
module.exports.registerdData = registerdData
