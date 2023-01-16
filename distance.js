function distance (x,y)  {
   var x_loc = 250000;
   
   var y_loc = x_loc;
   
   var x_distance = 0;
   var y_distance = 0;
   
 // if the position of the drone is lower than the position of the origin then distance = coordinates of the origin - coordinates of the drone
   if (x <= x_loc) {
    x_distance = x_loc - x;
    if(y <= y_loc) {
        y_distance = y_loc - y;
    }
    else {
        y_distance = y - y_loc;
    }
   }
// if the position of the drone is larger than the position of the origin then distance = coordinates of the drone - coordinates of the origin
   else if (x > x_loc) {
    x_distance = x - x_loc;
    if(y <= y_loc) {
        y_distance = y_loc - y;
    }
    else {
        y_distance = y - y_loc;
    }
   }
return {x_distance , y_distance};
}

module.exports = {
    distance: distance
}