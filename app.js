var      express = require( 'express' ),
  request_client = require("request"),
            http = require( 'http' ),
             app = express(),
             hbs = require( 'hbs' );

// Set the port number
app.set( 'port', process.env.PORT || 1337 );

// Set the view engine
app.set( 'view engine', 'html' );

// Configure handlebars
app.engine( 'html', hbs.__express );

// Give us a layout
app.use( express.bodyParser() );

// Create a public static folder
app.use( express.static( 'public' ) );

// Time to define some routes
app.get( '/', function( request, response ) {
  response.render( 'index', {title:"KOM Hunter", description:"Experiments in geolocation with my friend Strava"} );
});

app.get( '/segments/:sw_lat/:sw_lng/:ne_lat/:ne_lng', function( request, response ) {
  var sw_latitude = request.params.sw_lat;
  var sw_longitude = request.params.sw_lng;
  var ne_latitude = request.params.ne_lat;
  var ne_longitude = request.params.ne_lng;
  //console.log( 'Access to the api. Get location for bounds: ' + sw_latitude + ' ' + sw_longitude + ' ' + ne_latitude + ' ' + ne_longitude );
  //var segments = {"segments":[{"id":3482282,"name":"Gallows Hill Hadleigh","climb_category":0,"climb_category_desc":"NC","avg_grade":3.4,"start_latlng":[52.04891963861883,0.9475077688694],"end_latlng":[52.051857160404325,0.9459141176193953],"elev_difference":12.3,"distance":356.9,"points":"uxt|H{`xDc@n@eBzA_BxAgBfAiB`@qBG]I"},{"id":1052078,"name":"Aldham Mill Hill","climb_category":0,"climb_category_desc":"NC","avg_grade":5.8,"start_latlng":[52.056571184705994,0.9516420587906164],"end_latlng":[52.06040829424938,0.952807813883715],"elev_difference":26.2,"distance":453.5,"points":"qhv|HwzxD{@C_A?e@Di@TYDa@Nk@DqAK]MQQeBwB_As@i@[o@[a@Ke@?"},{"id":2328058,"name":"Road into Hadleigh","climb_category":0,"climb_category_desc":"NC","avg_grade":0.2,"start_latlng":[52.06840476732513,0.9314216195637718],"end_latlng":[52.05323734118062,0.944523105657504],"elev_difference":15.5,"distance":2090.5,"points":"orx|Hk|tDr@JzC`An@Lr@?r@E`Ee@p@Cl@Dl@Aj@UpAy@rAo@pAc@f@KvBEd@C|Cg@jA?f@KvEuBbA]bAS^S\\]p@oAtAqDt@iA`BgB`@m@\\m@t@iBVw@Ty@V}BL{@Ro@t@mAxAwGt@}DVu@v@cBt@eBh@mBfAyB|@kAhAy@ZQZUJS"},{"id":1998067,"name":"Up to Raydon","climb_category":0,"climb_category_desc":"NC","avg_grade":2.0,"start_latlng":[52.021304,0.969959],"end_latlng":[52.013077,0.981556],"elev_difference":32.1,"distance":1338.1,"points":"clo|Hem|DdDGzBOrAc@`CiDv@qAbAwCxBmIn@iB`@cCh@kEl@iAb@YtAe@`@I^Oz@iAv@oAt@_AnBgBt@eAFaAEoF@WRyAf@_@hCgA"},{"id":3522185,"name":"Wenham Road dip (west)","climb_category":0,"climb_category_desc":"NC","avg_grade":0.1,"start_latlng":[52.022256,1.026873],"end_latlng":[52.019632,1.018394],"elev_difference":8.1,"distance":662.1,"points":"aro|H}pgEl@hEb@fCh@zB~BpH`AnEz@nET|AL|ALlDT~@Zf@l@l@"},{"id":2565807,"name":"Station Road Climb","climb_category":0,"climb_category_desc":"NC","avg_grade":4.6,"start_latlng":[52.04125408245342,0.9560225351584452],"end_latlng":[52.041430984034285,0.964047063935519],"elev_difference":25.8,"distance":559.3,"points":"yhs|HcvyDa@uEOwCFqC?kBJqAH{CA{ASgCW}B?g@Dc@AaALgBFc@BmB"},{"id":2349026,"name":"Mill Hill Double Crest","climb_category":0,"climb_category_desc":"NC","avg_grade":2.0,"start_latlng":[52.0636597,0.9349804],"end_latlng":[52.0618246,0.9499216],"elev_difference":21.7,"distance":1061.0,"points":"ytw|HsruDLqB~AgGl@iCJqCOuCA}CNqCFsC?gD@gDLcDByCJ_DRcDdAqMf@kC\\kC"},{"id":1797040,"name":"Church Hill - Standing Start","climb_category":0,"climb_category_desc":"NC","avg_grade":6.8,"start_latlng":[52.0591668,0.9168826],"end_latlng":[52.0567393,0.9184963],"elev_difference":21.3,"distance":311.8,"points":"wxv|HoarDHULUXWT_@pAiB~@aAZEb@Jz@^`@AtA}@VW"},{"id":1193148,"name":"The St Aldham","climb_category":0,"climb_category_desc":"NC","avg_grade":-1.0,"start_latlng":[52.06749019026233,0.9829972367508157],"end_latlng":[52.06182226929997,0.9660043688984679],"elev_difference":14.5,"distance":1342.6,"points":"ylx|Hu~~DXx@n@jCfBtJ|@lGpAfK`@zAl@lAn@x@j@`Ad@lAxA`GtEvLfAfC\\hAt@dDz@zFr@rFVvCDdA"},{"id":2246767,"name":"Airfield to train rush","climb_category":0,"climb_category_desc":"NC","avg_grade":-0.0,"start_latlng":[52.01627801299406,0.9972645767217633],"end_latlng":[52.025844812379084,1.0047846623136087],"elev_difference":4.3,"distance":1308.3,"points":"uln|H{waECz@Kx@Ml@YHa@U{BgBoCqBq@e@w@[y@KyDX_AE_AM}@WaAa@}@g@aAo@y@w@_BwBmCaDg@o@e@w@e@_AeAaCyDoG{@_Bm@qBo@eB"}]};
  var url = "https://www.strava.com/api/v3/segments/explore?access_token=894ab124cefb52711e0048ad5ed6bd94a7e5d3f3&bounds=" + sw_latitude + ',' + sw_longitude + ',' + ne_latitude + ',' + ne_longitude;
  //response.send( 200, segments );
  
  request_client.get(url, function (strava_err, strava_res, strava_body) {
      if (!strava_err) {
          response.send( 200, strava_body );
      } else {
        console.log(strava_err);
      }
  });
});

app.get( '/segment/:id', function( request, response ) {
  var segment_id = request.params.id;
  // console.log( 'Access to the api. Get leaderboard for segment: ' + segment_id );
  // var segment = {
  //   "effort_count": 7037,
  //   "entry_count": 7037,
  //   "entries": [
  //     {
  //       "athlete_name": "Jim Whimpey",
  //       "athlete_id": 123529,
  //       "athlete_gender": "M",
  //       "average_hr": 190.5,
  //       "average_watts": 460.8,
  //       "distance": 2659.89,
  //       "elapsed_time": 360,
  //       "moving_time": 360,
  //       "start_date": "2013-03-29T13:49:35Z",
  //       "start_date_local": "2013-03-29T06:49:35Z",
  //       "activity_id": 46320211,
  //       "effort_id": 801006623,
  //       "rank": 1,
  //       "athlete_profile": "http://pics.com/227615/large.jpg"
  //     },
  //     {
  //       "athlete_name": "Chris Zappala",
  //       "athlete_id": 11673,
  //       "athlete_gender": "M",
  //       "average_hr": null,
  //       "average_watts": 368.3,
  //       "distance": 2705.7,
  //       "elapsed_time": 374,
  //       "moving_time": 374,
  //       "start_date": "2012-02-23T14:50:16Z",
  //       "start_date_local": "2012-02-23T06:50:16Z",
  //       "activity_id": 4431903,
  //       "effort_id": 83383918,
  //       "rank": 2,
  //       "athlete_profile": "http://pics.com/227615/large.jpg"
  //     }
  //   ]
  // };
  // response.send( 200, segment );
});

// Finally create the server
http.createServer( app ).listen( app.get( 'port' ), function() {
  console.log( 'Express server listening on port ' + app.get( 'port' ) );
});