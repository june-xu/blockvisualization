$.get( "http://localhost:5000/getTime", function( data ) {
  console.log(data);
  // console.log(data.result);
  // var d = data.result

  // var timestamps = [];
  // for (var x = 0; x < d.length; x++){
  //     var date = moment(d[x].timeStamp);
  //     timestamps.push(date.format("dd.mm.yyyy hh:MM:ss"));//new Date(d[x].timeStamp).toString());
  // }
  // console.log(timestamps)
});