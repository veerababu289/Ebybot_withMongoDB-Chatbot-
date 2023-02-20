var axios = require('axios');
const FoodItems = async () => {


    var axios = require('axios');
    var data = '';
    
    var config = {
      method: 'get',
      url: 'http://localhost:8080/getitems',
      headers: { },
      data : data
    };
    
  
    try{
        let fooditems = await axios(config)
       
        return fooditems
    }
    catch(error){
        console.log(error)
    }
}

module.exports.FoodItems = FoodItems
