//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


app.get( '/', function ( req, res ) {

    res.render( 'home', {
        message_1: '',
        message_2: '',
        message_3: '',
        message_4: '',

    });
});

app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});

app.get( '/compare', function ( req, res ) {
    //var url = req.query.urlLBC
    var url = req.query.urlLbc

    request( url, function ( error, response, html ) {
        if ( !error && response.statusCode ) {

            var $ = cheerio.load( html )

            var lbcDataArray = $( 'section.properties span.value' )

            var lbcData = {
                price: parseInt( $( lbcDataArray.get( 0 ) ).text().replace( /\s/g, '' ), 10 ),
                city: $( lbcDataArray.get( 1 ) ).text().trim().toLowerCase().replace( /\_|\s/g, '-' ),
                type: $( lbcDataArray.get( 2 ) ).text().trim().toLowerCase(),
                surface: parseInt( $( lbcDataArray.get( 4 ) ).text().replace( /\s/g, '' ), 10 )
            }
            console.log( 'data:', lbcData )
        }
        else {
            console.log( 'error:', error )
        }

        var url2 = 'https://www.meilleursagents.com/prix-immobilier/' + lbcData.city.toLowerCase()

        request( url2, function ( error, response, html ) {
            if ( !error && response.statusCode ) {

                var $ = cheerio.load( html )

                var estData = {
                    pric_met_maison: parseInt( $( $( $( '.prices-summary__values .row' )[2] ).find( '.columns' )[2] ).text().replace( /\s/g, '' ), 10 ),
                    pric_met_appart: parseInt( $( $( $( '.prices-summary__values .row' )[1] ).find( '.columns' )[2] ).text().replace( /\s/g, '' ), 10 )
                }
                console.log( 'data:', estData )
            }
            else {
                console.log( 'error:', error )
            }

            if ( lbcData.type == 'maison' ) {
                var calcul_prix = estData.pric_met_maison * lbcData.surface
                if ( calcul_prix > lbcData.price ) {
                    res.render( 'home', {
                        message_1: 'Type de l\'immobilier: ' + lbcData.type,
                        message_2: 'Ville: ' + lbcData.city,
                        message_3: 'Prix: ' + lbcData.price + ' €',
                        message_4: 'Le prix du bien est en dessous de la moyenne pour cette ville'
                    });
                }
                else {
                    res.render( 'home', {
                        message_1: 'Type de l\'immobilier: ' + lbcData.type,
                        message_2: 'Ville: ' + lbcData.city,
                        message_3: 'Prix: ' + lbcData.price + ' €',
                        message_4: 'Le prix du bien est au dessus de la moyenne pour cette ville'
                    });
                }
            }

            if ( lbcData.type == 'appartement' ) {
                var calcul_prix = estData.pric_met_appart * lbcData.surface
                if ( calcul_prix > lbcData.price ) {
                    res.render( 'home', {
                        message_1: 'Type de l\'immobilier: ' + lbcData.type,
                        message_2: 'Ville: ' + lbcData.city,
                        message_3: 'Prix: ' + lbcData.price + ' €',
                        message_4: 'Le prix du bien est en dessous de la moyenne pour cette ville'
                    });
                }
                else {
                    res.render( 'home', {
                        message_1: 'Type de l\'immobilier: ' + lbcData.type,
                        message_2: 'Ville: ' + lbcData.city,
                        message_3: 'Prix: ' + lbcData.price + ' €',
                        message_4: 'Le prix du bien est au dessus de la moyenne pour cette ville'
                    });
                }
            }

        })

    })
});


