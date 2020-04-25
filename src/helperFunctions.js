
// If first is bigger, returns true.
export function compareDates(date1, date2){
  console.log("Datejen vertailua " + date1 + " - " + date2);
  
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