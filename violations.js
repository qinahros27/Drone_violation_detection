function Check_violations(x,y) {
   

    x_min = 250000 - 100000;
    y_min = x_min;
    x_max = 250000 + 100000;
    y_max = x_max;
    answer = '';
    // if the coodinates of the drones are between value min(150000) and max(350000) then the drone is violation.  
    if (x >= x_min && x <= x_max && y >= y_min && y <= y_max ) {
        return answer = 'Yes';
    }
    else {
        return answer = 'No';
    }
}

module.exports = {
    Check_violations: Check_violations
}