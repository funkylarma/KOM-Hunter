var express = require( 'express' ),
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
  response.render( 'index', {title:"Sample Node App"} );
});

// Finally create the server
http.createServer( app ).listen( app.get( 'port' ), function() {
  console.log( 'Express server listening on port ' + app.get( 'port' ) );
});