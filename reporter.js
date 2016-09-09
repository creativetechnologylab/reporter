var config = require( __dirname + '/config.json' );

var mqtt = require( 'mqtt' );
var client = mqtt.connect( config.mqtt.host );
var os = require( 'os' );

client.on( 'connect', function() {
	report();
	setInterval( report, config.update_frequency );
} );

function report() {
	var ip = false;
	var interfaces = os.networkInterfaces();
	for ( var i in interfaces ) {
		var interface = interfaces[i];
		if ( interface[1] != undefined &&
			 interface[1].address != undefined &&
		 	 interface[1].address.split( '.' )[0] == '10' )
			ip = interface[1].address;
	}

	if ( ip ) {
		var hostname = os.hostname().split( '.' )[0];
		console.log( 'Reported: computers/' + hostname + ' ' + ip );
		client.publish( 'computers/' + hostname, ip );
	}
}
