const mysql = require('mysql');
const db = mysql.createConnection({
    host     : process.env.DATABASE_HOST,
    user     : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});

//Subcategory
exports.subCategory = (req,res)=>{
 const id=req.params.id
    db.query(`SELECT * FROM subcategory WHERE category_id = ${id}`, async(error,response)=>{
        if(error)
            console.log(error);
        else 
            return res.status(200).json(response);
    })
}
/*
{
    "review_body":"Very Good Ambience",
    "userid":"1",
    "restuarantid":"2"
}
*/

//Add Review
exports.addReview = (req,res) => {
    const {review_body,userid,restaurantid} = req.body;
    db.query(`insert into review (review_body, userid, restaurantid) values('${review_body}',${userid},${restaurantid})`,async (err,result) => {
        if(err)
            console.log(err);
        else
            res.status(200).json(result);
    })
}

//View Review by id
exports.viewReview = (req,res) => {
    const id = req.params.id;
    db.query(`select * from review where reviewid = ${id}`,async (err,result) => {
        if(err) 
            console.log(err);
        
        else
            res.status(200).json(result);
    })
}

//View all reviews of particular User
exports.allUserReviews = (req,res) => {
    const id = req.params.id;
    db.query(`select * from review where userid = ${id}`,async (err,result) => {
        if(err) 
            console.log(err);
        
        else
            res.status(200).json(result);
    })
}

//View all reviews of particular Restaurant
exports.allRestaurantReviews = (req,res) => {
    const id = req.params.id;
    db.query(`select * from review where restaurantid = ${id}`,async (err,result) => {
        if(err) 
            console.log(err);
        
        else
            res.status(200).json(result);
    })
}

//View all reviews
exports.allReviews = (req,res) => {
    db.query(`select * from review`,async (err,result) => {
        if(err) 
            console.log(err);
        
        else
            res.status(200).json(result);
    })
}

//Cart
exports.cart = (req,res) => {
    const {userid,foodid,quantity} = req.body;
    db.query(`insert into cart (userid, foodid, quantity, cost) values (${userid},${foodid},${quantity},(select ${quantity}*price from fooditem where foodid=${foodid}))`,async (err,result) => {
        if(err) 
            console.log(err);
        
        else
            res.status(200).json(result);
    })
}

//Place Order
exports.placeOrder = (req,res) => {
    const {restaurantid,userid} = req.body;
    db.query(`insert into orders (cost, restaurantid, statusOrder, userid) values((select sum(cost) from cart where userid=${userid}), ${restaurantid}, 'Placed Order', ${userid});
    `,async (err,result) => {
        if(err) 
            console.log(err);
        
        else
            res.status(200).json(result);
    })
}

//Payment
exports.payment = (req,res) => {
    const {orderid} = req.body;
    db.query(`insert into payment (payment_amount,orderid) values((select cost from orders where orderid=${orderid}),${orderid})`,async (err,result) => {
        if(err){ 
            console.log(err);
            return;
        }
        else{
            res.status(200).json(result);
            return;
        }
    });
    db.query(`update orders set statusOrder='Payment Successful' where orderid=${orderid}`,async (err,result) => {
        if(err){ 
            console.log(err);
            return;
        }
        else{
            res.status(200).json(result);
            return;
        }
    });
}

