const moment = require('moment');
const timestring = require('timestring')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('file.in')
});

const finished = [];

lineReader.on('line', function (line) {
  // console.log('Line from file:', line);
  // console.log(line);
  const obj = extract(line);
  
  finished.push(obj);
});

lineReader.on('close',function (){
  finished.sort((a, b) => (a.mpy > b.mpy) ? -1 : 1);

  console.log(finished);
});


function extract(content) {
  /*
  input : iCal file content
  return : Event summary
  */

  var myRegexp = /(.+)(\s?-?\s[-]?)([-+]?[0-9]*\.?[0-9]+\s*[m\w]+\s*\/\s*[-+]?[0-9]*\.?[0-9]+[k|K]*\s*[kKmM]*$)/g;
  var arr = myRegexp.exec(content);
  const name = arr[1].replace(/\s/g, "").replace('-','')
  const ratio = arr[3].split('/');
  let time = timestring(ratio[0]);
  let hours = timestring(ratio[0], 'h');
  let days = timestring(ratio[0], 'd');
  let weeks = timestring(ratio[0], 'w');
  let months = timestring(ratio[0], 'mth');
  let years = timestring(ratio[0], 'y');
  // if (time.indexOf('months') > -1) {
  //   console.log('months', time);
  // }
  let mileage = ratio[1].toLowerCase().replace('km', '');
  
  if (arr[3].indexOf('day') === -1) {
    if (mileage.indexOf('k') === -1 && mileage.indexOf('.') > -1 ) {
      mileage =   mileage + 'k';
      // mileage = mileage.replace(/\s/g, "");      
    }
  }    
  // console.log('mileage', mileage);
  if (mileage.indexOf('k') > 0 && mileage.indexOf('km') === -1) {
    mileage = Number(mileage.substring(0, mileage.indexOf('k')))*1000;
  }
  
  
  // console.log(hours, days, weeks, months);
  const obj = { name, timeInHuman:ratio[0],  time, mileage, mpd: mileage/days, mpw: mileage/weeks, mpm: mileage/months, mpy: mileage/years};
  return obj;
}
