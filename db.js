const mysql=require('mysql');
   
    const db = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'db_futter1'
    })
    db.connect((err)=>{
        if(err){
           console.log('error connect db :'+err)
        }else{
           console.log('connect database Success!!')
      }
    })
    module.exports = db