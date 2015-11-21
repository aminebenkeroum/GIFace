var express = require("express");
var fs = require("fs");
var shortid = require('shortid');
var busboy =  require("connect-busboy");
var gify = require("gify");
var app = express();
var bodyParser = require("body-parser");
// configure the app to user parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(busboy());
// extension func
var getExt = function(filename){
  var i = filename.lastIndexOf(".");
  return (i < 0 ) ? '' : filename.substr(i);
};

var port = 80;
var router = express.Router(); // Router of the web app




router.get("/",function(req,res){
	res.json({mssg:"Hello Tajine !"});
});


router.post("/upload",function(req,res){
// upload video file
 var fstream;

 req.pipe(req.busboy);

 console.log("POST is Running");
 

 req.busboy.on('file',function(fieldname,file,filename){
   var ext = getExt(filename);
   if(ext !== "" && ext === ".mp4"){	
   console.log("Uploading ... " + filename);
   fstream = fs.createWriteStream("uploads/"+filename);
   file.pipe(fstream);
   fstream.on('close',function(){
	// convert video stream

	var gifFile = shortid.generate() + "myFaceWhen.gif"; 

	gify("uploads/"+filename,"uploads/"+gifFile,{width:300},function(err){
	
	if(err) throw err;

	fs.unlinkSync("uploads/" + filename);
	
	});

	res.json({message:"File converted successfully",filename:filename,url:"/gifs/"+gifFile});	

   });
  }
  else{
   res.json({error:"Please upload an MP4 file"});
  }
 });

});

app.use('/gifs',express.static("uploads"));
app.use("/api",router);

// start the server 
app.listen(port);
console.log("Magic happens ...");
