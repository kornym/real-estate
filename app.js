//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );
url = 'https://www.leboncoin.fr/ventes_immobilieres/1076257949.htm?ca=12_s';

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory

/*
app.get( '/', function ( req, res ) {
    request( 'https://www.leboncoin.fr/ventes_immobilieres/1076257949.htm?ca=12_s [https://www.leboncoin.fr/ventes_immobilieres/1076257949.htm?ca=12_s_green]', function ( error, response, body ) {
        if ( !error && response.statusCode == 200 ) {

            var $ = cheerio.load( body )

            console.log( $( 'div.line h2.item_price.clearfix span.value ' ).get() );

            res.render( 'home', {
                message: ''

            });
        }
    })
});
*/

app.get( '/', function ( req, res ) {
    request( url, function ( error, response, body ) {
        if ( !error ) {
            var $ = cheerio.load( body ),
                data = $( ".selector" ).html();
            console.log( data );
        } else {
            console.log( "Erreur : " + error );
        }
    });

});
//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});

