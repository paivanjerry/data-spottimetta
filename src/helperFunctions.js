
// If first is bigger, returns true.
export function compareDates(date1, date2){
  
  let list1 = date1.split(".");
  let list2 = date2.split(".");
  if(parseInt(list1[2]) > parseInt(list2[2])){
    return true;
  }
  if(parseInt(list1[2]) < parseInt(list2[2])){
    return false;
  }
  if(parseInt(list1[1]) > parseInt(list2[1])){
    return true;
  }
  if(parseInt(list1[1]) < parseInt(list2[1])){
    return false;
  }
  if(parseInt(list1[0]) > parseInt(list2[0])){
    return true;
  }
  if(parseInt(list1[0]) < parseInt(list2[0])){
    return false;
  }
  return true;
}

// If first is bigger, returns true.
export function getDatediff(date1, date2){
  let dayMillis = 86400000;

  let split1 = date1.split(".");
  let day1 = parseInt(split1[0]);
  let month1 = parseInt(split1[1]) -1;
  let year1 = parseInt(split1[2]);
  let dateObj1 = new Date(year1, month1, day1);

  let split2 = date2.split(".");
  let day2 = parseInt(split2[0]);
  let month2 = parseInt(split2[1]) -1;
  let year2 = parseInt(split2[2]);
  let dateObj2 = new Date(year2, month2, day2);

  let millis1 = dateObj1.getTime();
  let millis2 = dateObj2.getTime();
  return (Math.abs(millis1-millis2) / dayMillis);

}