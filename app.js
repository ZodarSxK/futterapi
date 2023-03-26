var express = require("express");

var bodyParser = require("body-parser");

var app = express();

const db = require("./db.js");

// เข้ารหัสส่งข้อมูล

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// start server

app.listen(3000, () => {
  console.log("Server running port 3000");
});


//!--------------------------------------------------------------------------------------------------------------------------

// แสดงผล
app.get("/", function (req, res) {
  res.send("Hello Restful database API");
});


app.get("/testdb", function (req, res) {
  res.send("Want");
});
// ดึงข้อมูล db

// เรียกข้อมูลใน db มาแสดง

app.get("/orderall", function (req, res) {
  // ติดต่อ db

  let sql = "SELECT order_no,product_name,product_source,order_num,cust_id,price FROM tb_order";

  db.query(sql, (err, result, fields) => {
    if (err) {
      res.status(500).json({
        status: 500,

        message: "ไม่สามารถแสดงข้อมูลได้ :" + err.sqlMessage,
      });
    } else {
      let data = { Data: result };

      res.json(data);
    }
  });
});

//!--------------------------------------------------------------------------------------------------------------------------


// ส่งค่าไปเพิ่อเพิ่มข้อมูลใน ฐานข้อมูล
app.post('/order', function (req, res) {
    // รับค่าผ่าน form post
    let data = {
        cust_id: req.body.cust_id,
        product_name: req.body.product_name,
        order_num: req.body.order_num,
        product_source: req.body.product_source,
        amount: req.body.amount
    }

 // บันทึกข้อมูลลง db
    let sql = 'INSERT INTO tb_order SET ?'
    

    db.query(sql, data, (err, results, fields) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                'status': 500,
                'message': 'ไม่สามารถเพิ่มข้อมูลได้ :' + err.sqlMessage
            })
        } else {
            let result = {
                'status' : 200,
                'message' : 'เพิ่มข้อมูลเรียบร้อย'
            }
            res.json(result)
        }
    })
})
//!--------------------------------------------------------------------------------------------------------------------------

app.delete('/order/:cust_id/product/:product_name', function (req, res) {
  // รับค่าผ่าน form post
   let data= {
     cust_id  :req.params.cust_id,
     product_name : req.params.product_name
   }
  //  let order_no = req.params.id;
    // let product_name = req.body.product_name;
    
  
  

// บันทึกข้อมูลลง db
  // let sql = 'DELETE FROM tb_order WHERE product_name=?'
  let sql = "DELETE FROM tb_order WHERE cust_id=? and product_name=?";
  db.query(sql, [data.cust_id,data.product_name], (err, results, fields) => {
      if (err) {
          console.log(err)
          res.status(500).json({
              'status': 500,
              'message': 'ไม่สามารถลบข้อมูลได้ :' + err.sqlMessage
          })
      } else {
          let result = {
              'status' : 200,
              'message' : 'ลบข้อมูลเรียบร้อย'
          }
          res.json(result)
      }
  })
})


//!--------------------------------------------------------------------------------------------------------------------------

//select where

app.get('/order/:cust_id',function(req,res){
    // รับค่าผ่าน form get
    let cust_id = req.params.cust_id
    // ติดต่อ db
     //let sql = 'SELECT order_no,product_name,product_source,order_num,amount FROM tb_order WHERE cust_id=?'
   // let sql = 'SELECT product_name, SUM(order_num*amount) FROM tb_order WHERE cust_id=? GROUPBY product_name'
    let sql='SELECT order_no,product_name,product_source,order_num,amount,SUM(order_num)piece, (SUM(order_num)*amount)price  FROM tb_order GROUP BY product_name'
    db.query(sql, cust_id, (err, results, fields) => {
        if (err) {
            res.status(500).json({
                'status': 500,
                'message': 'ไม่พบข้อมูล :' + err.sqlMessage
            });
        } else {
                let rs= {'Data': results};
        res.json(rs);
        }
    })
})