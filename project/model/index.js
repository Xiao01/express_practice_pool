
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'myproject';
//数据库连接方法封装 
function connect(callback){ 
	MongoClient.connect(url, function(err, client) {
		if(err){
			console.log("数据库连接错误",err)
		}else{
			const db = client.db(dbName);
			callback && callback(db);	
			client.close();
	  }
	});
}


module.exports ={
	connect
}