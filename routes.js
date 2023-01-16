const express = require('express');
const router = express.Router();
const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const check_violations = require('./violations');
const d = require('./distance');
const Data= require('./models/data');
const NumberOfViolation = require('./models/violationscount');
const Visualization = require("./sketch");


async function getdata () {
    https.get("https://assignments.reaktor.com/birdnest/drones",async function(res) {
    let data = '';
    if (res.statusCode >= 200 && res.statusCode < 400) {
        res.on('data', function(data_) { data += data_.toString(); });
        res.on('end', async function() {
          parser.parseString(data, async function(err, result) {
          x_nearest = 100000;
          y_nearest = 100000;  
          for (var i = 0 ; i< Object.keys( result.report.capture[0].drone ).length ; i++) {
            let newobject = {};
            serialnum = result.report.capture[0].drone[i].serialNumber;
            pilot_n = JSON.stringify(result.report.capture[0].drone[i].serialNumber);
            pilot_num='';
            for (var x = 2 ; x<pilot_n.length-2; x++) {
                pilot_num+=pilot_n[x];
            }
            posY = parseFloat(result.report.capture[0].drone[i].positionY);
            posX = parseFloat(result.report.capture[0].drone[i].positionX);
            answer = check_violations.Check_violations(posX,posY);
            distance_check = d.distance(posX,posY);
            x_distance_check = distance_check.x_distance;
            y_distance_check = distance_check.y_distance;
            
            nearest_answer = "No";
            numofvio = 0;
            if (answer == "Yes") {
                // if there is the information of violations in the database then plus the number violation , else add the information to the database  
                if (await NumberOfViolation.find({serialNumber: pilot_num}).count() > 0) {
                    NumberOfViolation.find({serialNumber: pilot_num},function(err,result) {
                        console.log(result);
                        // if the number of violation is equal 10 then there will be the notification to ban this device not fly in the 500x500 meter zone for a period of time. Then after that time , if the device still violate the zone , it will be counted again. 
                        if (result.Violations>=1 && result.Violations <10) {
                            numofvio = result.Violations+1;
                            NumberOfViolation.updateOne({serialNumber: pilot_num},{Violations: numofvio},{new: true}, function(err,result) {
                                if(err) throw err;
                                console.log("updated");
                            })
                        }
                        else {
                            numofvio = 1;
                            NumberOfViolation.updateOne({serialNumber: pilot_num},{Violations: 1},{new: true}, function(err,result) {
                                if(err) throw err;
                                console.log("renewed");
                            })
                        } 
                    });
                }    
                else {
                    numofvio = 1;
                   
                    let newvio = new NumberOfViolation({
                        serialNumber: pilot_num,
                        Violations: numofvio
                    });
                    newvio.save();
                }
                
                // if there is the new nearest device then change the nearest_answer of the previous device to "No"
                if (x_distance_check < x_nearest && y_distance_check < y_nearest) {
                    x_nearest = x_distance_check;
                    y_nearest = y_distance_check;

                    nearest_answer = "Yes";
                    Data.updateMany({Nearest: "Yes"}, {Nearest: "No"}, {new: true}, function(err,result) {
                        if(err) throw err;
                        console.log("change old nearest to No");
                    })
                }
                
            
            // if there is the data of the pilot in the database , then just update 
            // else add the data to the database
            console.log(await Data.findOne({serialNumber: pilot_num}).count());
            if (await Data.findOne({serialNumber: pilot_num}).count() > 0 ) {
                Data.updateOne({serialNumber: pilot_num},{Posx: x_distance_check, Posy:y_distance_check,Nearest: nearest_answer},{new: true}, function(err,result) {
                    if(err) throw err;
                    console.log("exists pilot data updated");
                })

            }
            else {
            newobject= {
                serialNumber: pilot_num,
                Posx: x_distance_check,
                Posy: y_distance_check,
                Violations: answer,
                Nearest: nearest_answer,
                NumberOfViolations: numofvio
            }
           
            https.get(`https://assignments.reaktor.com/birdnest/pilots/${serialnum}`,function(res) {
              
                body= ''; 
                if (res.statusCode >= 200 && res.statusCode < 400) {
                  res.on('data', function(bodyy) { body += bodyy; });
                  res.on('end', function() {
                  body = JSON.parse(body);
                  let fullname = body.firstName + " " + body.lastName;
                  
                  newobject= {...newobject, PilotName: fullname,PilotEmail: body.email,PilotPhone: body.phoneNumber};
                  let newData = new Data(newobject);
                  newData.save();
                } );     };
         
            }); }
          };
          }; 
        });
      });
    }
});     
       
        
        // delete the data that are created 10 minuted ago
        Data.deleteMany({createdAt: { "$lt": Date.now() - 1000 * 60 * 10}},function(err,result) {
            console.log(result);
        })
    }

setInterval(getdata,2000);// takes a function argument that will run an infinite number of times within 2 seconds delay as the second argument.
setInterval(Visualization.draw,2000);

router.get("/", async (req, res) => {
    try {
      // get data that is currently in the database
      const datas = await Data.find();
      res.render('datas', {datas: datas});
      
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  })

router.get("/Visualization",(req,res) => {
     res.render('visualization');
    
});


module.exports = router;