const express= require("express");
const app= express();

const request= require("request");
const https= require("https");

const bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static("public"));


app.get("/", function(req,res){
res.sendFile(__dirname +"/signup.html" );
});



const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "c172b3839e024b3fbcabf6636d4e1ca6-us14",
  server: "us14",
});



// https://mailchimp.com/developer/marketing/guides/create-your-first-audience/
// https://youtu.be/Gjk25N7WFkI?t=1370

app.post("/", function(req,res){

  //const listId = "cd3047f3e2";
  const firstName= req.body.fName;
  const lastName= req.body.lName;
  const email = req.body.email;

  var data = {
    members:[ {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };


const jsonData= JSON.stringify(data);
const url= "https://us14.api.mailchimp.com/3.0/lists/cd3047f3e2";

  const options = {
    method: "POST",
    body: data,
    headers:{
    Authorization : "auth c172b3839e024b3fbcabf6636d4e1ca6-us14"
  }
  };

const request= https.request(url, options, function(response){

  response.on("data", function(data){
    //console.log(JSON.parse(data));
  });

  if(response.statusCode === 200)
  {
    //res.send("subscribed Successfully");
    res.sendFile(__dirname + "/success.html");
  }
  else
  {
    //res.send("Try Again!");
    res.sendFile(__dirname + "/failure.html");
  }

});
  request.write(jsonData);
  request.end();

});




app.post("/failure", function(req,res){
res.redirect("/");
});



app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000!");
});

// api key
// c172b3839e024b3fbcabf6636d4e1ca6-us14

//  list id
//  cd3047f3e2
