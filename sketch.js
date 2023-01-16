const express = require('express');
const { createCanvas } = require('canvas');
const https = require("https");
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const check_violations = require('./violations');
const fs = require("fs");
function draw () {
    const c = createCanvas(500, 500);
    
    
    const context = c.getContext('2d');

    //draw a 500x500 meter square
    context.fillStyle = '#ADD8E6';
    context.fillRect(0, 0, c.width, c.height);
    

    const centerX = c.width / 2;
    const centerY = c.height / 2;
    const radius = 100;
    
    // draw the no-fly zone
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = '#E6E6E6';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'red';
    context.stroke();
    
    
    function point(x, y,color, canvas){
      canvas.beginPath();
      canvas.arc(x, y, 1, 0, 2 * Math.PI, false);
      canvas.fillStyle = 'white';
      canvas.fill();
      canvas.lineWidth = 2;
      canvas.strokeStyle = color;
      canvas.stroke();
      }
    point(centerX,centerY,"#0000FF",context);

    function text(x,y,mes,color,canvas) {
      canvas.font = "16px Sans-Serif";
      canvas.strokeStyle = color;
      canvas.strokeText(mes,x-45,y-10); 
    }
    
    
    https.get("https://assignments.reaktor.com/birdnest/drones",async function(res) {
        let data = '';
        if (res.statusCode >= 200 && res.statusCode < 400) {
            res.on('data', function(data_) { data += data_.toString(); });
            res.on('end', async function() {
              parser.parseString(data, async function(err, result) {
            
              for (var i = 0 ; i< Object.keys( result.report.capture[0].drone ).length ; i++) {
                posY = parseFloat(result.report.capture[0].drone[i].positionY);
                posX = parseFloat(result.report.capture[0].drone[i].positionX);
                answer = check_violations.Check_violations(posX,posY);
                if (answer == "Yes") {
                  point(posX/1000,posY/1000,"red",context);
                  text(posX/1000,posY/1000,result.report.capture[0].drone[i].serialNumber,"red",context); 
                                             
                }
                else {
                  point(posX/1000,posY/1000,"black",context);
                  text(posX/1000,posY/1000,result.report.capture[0].drone[i].serialNumber,"black",context); 
                }
              };
              });
              const buffer = c.toBuffer("image/png");
              fs.writeFileSync("./img/image.png", buffer);
        });
    };});
   
      
}

module.exports = {
  draw : draw
}