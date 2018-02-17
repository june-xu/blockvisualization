$.get( "http://localhost:5000/getData", function( data ) {
  // console.log(data.result);
  var d = data.result

  var timestamps = [];

  for (var x = 0; x < d.length; x++){
      timestamps.push(d[x].timeStamp);
  }
  console.log(timestamps)
});