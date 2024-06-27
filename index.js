require('dotenv').config();
const session = require("express-session");
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe SDK
// const stripe = require('stripe')(process.env.STRIPE_PUBLISHABLE_KEY); // Stripe SDK


// Logging for debugging
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

const app = express(); // Define the app


// Set the view engine and views directory on the main app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//it is for body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use('/', paymentRoute);

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;




const connect = require("net");
const { resolve } = require("path");
const { rejects } = require("assert");
const { error } = require("console");
const { rootCertificates } = require("tls");

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root', /* MySQL User */
    password: 'root', /* MySQL Password */
    database: 'communitygrow' /* MySQL Database */
});


//connection established to the mysql
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected with App...');
});


// to encrypt the pswd
function sha1Hash(text) {
    const hash = crypto.createHash('sha1');
    hash.update(text);
    return hash.digest('hex');
}

//it is folder of css which inside the public folder
app.use(express.static('public'));




//it is for ejs
// app.set('views', path.join(COMMUNTIYGROWPROJECT, 'views'));
app.set('view engine', 'ejs');


app.get('/pay', function(req, res){
    res.render('payment')
})
//for using session-package
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Invest',
            },
            unit_amount: 200,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4000/success',
      cancel_url: 'http://localhost:4000/failure',
    });
  
    res.redirect(303, session.url);
  });






app.get("/", function (req, res) {
    res.render('index')
})

app.get("/footer", function (req, res) {
    res.render('footer')
})


app.get("/login", function (req, res) {
    res.render('login')
})

app.get('/user', function(req, res){
    res.render('dashboard')
})


app.get("/investment/fixed-deposit", function (req, res) {
    res.render('investment/fixed-deposit')
})

app.get("/investment/us-stock", function (req, res) {
    res.render('investment/us-stock')
})
app.get("/investment/help", function (req, res) {
    res.render('investment/help')
})
app.get("/registration", function (req, res) {
    res.render('registration')
})

app.get("/navbar", function(req, res){
    res.render('include/navbar')
})
app.get("/forget", function (req, res) {
    res.render('forgetpswd')
})

app.get("/deposit", function (req, res) {
    res.render("deposit")
})

app.get("/investment", function (req, res) {
    res.render("investment")
})

app.get("/finance", function (req, res) {
    res.render("finance")
})
app.get("/service", function (req, res) {
    res.render('service')
})

app.get("/about", function (req, res) {
    res.render('about')
})

app.get("/contact", function (req, res) {
    res.render('contact')
})

app.get("/profile", function (req, res) {
    res.render('profile')
})

app.get("/apply", function (req, res) {
    res.render('applyfund')
})

app.get("/insurance", function (req, res) {
    res.render('insurance')
})

app.get("/re-finance", function (req, res) {
    res.render('re-finance')
})

app.get("/include/navbar", function (req, res) {
    res.render('include/navbar')
})

app.get("/insurance/businessinsurance", function (req, res) {
    res.render('insurance/businessinsurance')
})

app.get("/insurance/lifeinsurance", function (req, res) {
    res.render('insurance/lifeinsurance')
})

app.get("/insurance/healthinsurance", function (req, res) {
    res.render('insurance/healthinsurance')
})

app.get("/insurance/homeinsurance", function (req, res) {
    res.render('insurance/homeinsurance')
})

app.get("/insurance/propertyinsurance", function (req, res) {
    res.render('insurance/propertyinsurance')
})

app.get("/insurance/vehicleinsurance", function (req, res) {
    res.render('insurance/vehicleinsurance')
})

app.get("/enterpreneurshipreg", function (req, res) {
    res.render('applyfund/enterpreneurshipreg')
})

app.get("/startup", function (req, res) {
    res.render('applyfund/startup')
})

app.get("/grow", function (req, res) {
    res.render('applyfund/grow')
})


//for registration
app.post("/registerdata", (req, res) => {
    let name = req.body.fullname;
    let address = req.body.address;
    let contactno = req.body.contactno;
    let question = req.body.selectOption;
    let answer = req.body.answer;
    let email = req.body.email;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;

    let newpaasword = sha1Hash(password)


    //console.log(name, address, conta/ctno, question, answer, email, password, confirm_password);

    const data = {
        full_name: name,
        user_address: address,
        user_contact: contactno,
        question: question,
        answer: answer,
        user_email: email,
        user_password: newpaasword
    };


    let sqlQuery = 'INSERT INTO communitygrow.registration_page SET ?';


    let query = conn.query(sqlQuery, data, (error, results) => {
        if (error) throw error;
        else {
            console.log("Data inserted successfully"); // Log success message
            res.send("Data inserted successfully"); // Send response to client
        }
    });
});

// for login  
app.post("/login", (req, res) => {
    let email = req.body.email;
    let pswd = req.body.pswd;
    let epswd = sha1Hash(pswd);
    console.log(email, epswd)
    if (email && epswd)
        conn.query('SELECT * FROM registration_page WHERE user_email = ? AND user_password = ?', [email, epswd],
            function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                if (results.length > 0) {
                    req.session.email = email
                    req.session.loggedin = true
                    res.redirect('/');
                } else {
                    res.send('Incorrect Username and/or Password!');
                }
                res.end();
            });

    else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

app.get('/dashboard', (req, res)=>{
    res.render('dashboard');
})


// Middleware
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'
},
    (accessToken, refreshToken, profile, done) => {
        // Here you would typically find or create a user in your database using profile info
        return done(null, profile);
    }
));

// Serialize and Deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});


app.get('/read', (req, res) => {
    res.render('read')
})
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

app.post("/forget", function (req, res) {
    let email = req.body.email;

    let sqlquery = "SELECT * from registration_page WHERE user_email='" + email + "'";
    let query = conn.query(sqlquery, (error, results) => {
        if (error) throw error;
        else {
            console.log(results); // Log success message
            // Send response to client

            res.render("retrieve", { datas: results })
        }
    })
})

//post for retrive the paasword
app.post("/retrieve", function (req, res) {
    let email = req.body.email;
    console.log(email);
    let sqlQuery = "SELECT * from registration_page WHERE user_email='" + email + "'";

    let query = conn.query(sqlQuery, (error, results) => {
        // Access the value of the `answer` property and save it in a variable
        const answerValue = results[0].answer;

        // Now, `answerValue` contains the value of the `answer` property
        console.log('Answer:', answerValue);
        if (answerValue == req.body.answer) {
            res.render("reset", { data: email })
        }

    })
})

//post for reset
app.post("/reset", function (req, res) {
    let saved_paasword = req.body.password;
    let confirm_password = sha1Hash(req.body.confirm_password);
    if (saved_paasword == req.body.confirm_password) {
        let sqlQuery = "UPDATE registration_page SET user_password ='" + confirm_password + "'" + " WHERE user_email ='" + req.body.email + "'";
        let query = conn.query(sqlQuery, (error, results) => {
            console.log(results);
            res.redirect("/login")
        })

    }

}

)






// app.post('/payment', (req, res) => {
//     const amount = req.body.amount;
//     const paymentMethod = req.body.paymentMethod;

//     if (paymentMethod === 'upi') {
//         res.render('payment/upi_details', { amount });
//     } else if (paymentMethod === 'card') {
//         res.render('payment/card_details', { amount });
//     } else {
//         res.send('Invalid payment method selected.');
//     }
// });

// // Route to handle payment success
// app.get('/payment', (req, res) => {
//     // Assuming amount is available here, for example, from a query parameter or session
//     const amount = req.query.amount || 0;
//     res.render('payment/PaymentPage', { amount });
// });

// app.post('/payment', (req, res) => {
//     const amount = req.body.amount;  
//        res.render('payment/PaymentPage', { amount });
// });





// app.post('/paymentsuccess', (req, res) => {
//     const amount = req.body.amount;
//     res.render('payment/paymentsuccess', { data: amount });
// });
// post for re-finance
app.post("/re-finance", function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let contact_no = req.body.mobileNo;
    let prev_details = req.body.previous_details;
    let sub = req.body.subject;
    let msg = req.body.msg;

    console.log(name, email, contact_no, prev_details, sub, msg)

    const data = {
        name: name,
        email: email,
        contactno: contact_no,
        prevservice: prev_details,
        newservice: sub,
        msg: msg
    };
    let sqlQuery = 'INSERT INTO refinance SET ?';


    let query = conn.query(sqlQuery, data, (error, results) => {
        if (error) throw error;
        else {
            console.log("Data inserted successfully"); // Log success message
            res.send("Data inserted successfully"); // Send response to client
        }
    });



})

//post for creating profile
app.post("/profile", function (req, res) {
    let fullname = req.body.fullname;
    let email = req.body.email;

    let aadharnumber = req.body.aadharnumber;
    let aadharfrontimg = req.body.aadharfrontimg;
    let aadharbackimg = req.body.aadharbackimg;
    let pancardnumber = req.body.pancardnumber;
    let pancardfrontimg = req.body.pancardbackimg;
    let pancardbackimg = req.body.pancardbackimg;
    let selfimg = req.body.selfimg;

    console.log(fullname, email, aadharfrontimg, aadharbackimg, aadharnumber, pancardnumber, pancardfrontimg, pancardbackimg, selfimg);


    const data = {
        fullname: fullname,
        email: email,
        aadharnumber: aadharnumber,
        aadharfrontomg: aadharfrontimg,
        aadharbackimg: aadharbackimg,
        pancardnumber: pancardnumber,
        pancardfrontimg: pancardfrontimg,
        pancardbackimg: pancardbackimg,
        selfimg: selfimg
    };


    let sqlQuery = 'INSERT INTO profile SET ?';


    let query = conn.query(sqlQuery, data, (error, results) => {
        if (error) throw error;
        else {
            console.log("Data inserted successfully"); // Log success message
            res.send("Data inserted successfully"); // Send response to client
        }
    });

})


//post for grow table
app.post("/grow", function (req, res) {
    let fullName = req.body.fullname;
    let email = req.body.email;
    let contact = req.body.phone;
    let businessName = req.body.business;
    let businessType = req.body.type;
    let currentRev = req.body.current;
    let targetRev = req.body.target;
    let strategy = req.body.strategy;
    let doc = req.body.document;

    //  console.log(fullName, email, contact, businessName,  businessType, currentRev, targetRev, strategy, doc);

    const data = {
        fullname: fullName,
        email: email,
        contactno: contact,
        businessName: businessName,
        businessType: businessType,
        currentRevenue: currentRev,
        targetRevenue: targetRev,
        strategyGrowth: strategy,
        businessPlan: doc
    };

    let sqlQuery = 'INSERT INTO growbusiness SET ?';

    let query = conn.query(sqlQuery, data, (error, results) => {
        if (error) throw error;
        else {
            console.log("Data inserted successfully"); // Log success message
            res.render('applyfund', { message: "Data inserted successfully" });
        }
    });
})

//post for start-up fund
app.post("/startup", function (req, res) {
    let fullName = req.body.fullname;
    let email = req.body.email;
    let contact = req.body.phone;
    let aadharNumber = req.body.aadhar;
    let startupType = req.body.startup;
    let desc = req.body.plan;
    let fundsAmount = req.body.funds;
    let doc = req.body.document;

    //  console.log(fullName, email, contact, aadharNumber, startupType, desc, fundsAmount, doc);

    const data = {
        fullname: fullName,
        email: email,
        contactNo: contact,
        aadharNumber: aadharNumber,
        startupType: startupType,
        descStartup: desc,
        fundsNeeded: fundsAmount,
        doc: doc
    };

    let sqlQuery = 'INSERT INTO startup SET ?';

    let query = conn.query(sqlQuery, data, (error, results) => {
        if (error) throw error;
        else {
            console.log("Data inserted successfully"); // Log success message
            res.render('applyfund', { message: "Data inserted successfully" });
        }
    });
})


//post for enterpreneurship
app.post("/enterpreneurship", function (req, res) {
    let fullName = req.body.fullname;
    let email = req.body.email;
    let contact = req.body.phone;
    let aadharNumber = req.body.aadhar;
    let companyName = req.body.company;
    let startupName = req.body.startup;
    let plan = req.body.plan;
    let fundsNeeded = req.body.funds;
    let doc = req.body.document;

    //  console.log(fullName, email, contact, businessName,  businessType, currentRev, targetRev, strategy, doc);

    const data = {
        fullname: fullName,
        email: email,
        contact: contact,
        aadharNumber: aadharNumber,
        companyName: companyName,
        startupName: startupName,
        plan: plan,
        fundsNeed: fundsNeeded,
        doc: doc
    };

    let sqlQuery = 'INSERT INTO enterpreneurship SET ?';

    let query = conn.query(sqlQuery, data, (error, results) => {
        if (error) throw error;
        else {
            console.log("Data inserted successfully"); // Log success message
            res.render('applyfund', { message: "Data inserted successfully" });

        }
    });
})

// app.get('/payment', function(req, res){
//     res.render('BuyService')
// })

// Payment routes
app.get('/buy-service', (req, res) => {
    const amount = 100; // Replace this with the actual amount logic
    const key = STRIPE_PUBLISHABLE_KEY; // Load the Stripe publishable key
    res.render('BuyService', { amount, key });
});

app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // amount in cents
            currency: 'INR',
            payment_method_types: ['card'],
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Payment Intent error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/success', (req, res) => {
    res.render('success');
});

app.get('/failure', (req, res) => {
    res.render('failure');
});


// app.post('/payment', async (req, res) => {
//     try {
//         const customer = await stripeClient.customers.create({
//             email: req.body.stripeEmail,
//             source: req.body.stripeToken,
//         });

//         const charge = await stripeClient.charges.create({
//             amount: req.body.amount,     // amount should be amount*100
//             description: req.body.serviceName,
//             currency: 'INR',
//             customer: customer.id
//         });

//         res.redirect('/success');
//     } catch (error) {
//         console.log(error.message);
//         res.redirect('/failure');
//     }
// });

app.get('/success', (req, res) => {
    res.render('success');
});

app.get('/failure', (req, res) => {
    res.render('failure');
});



app.listen(4000, function (req, res) {
    console.log("server on...")
})