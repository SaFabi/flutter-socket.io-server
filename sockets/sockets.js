const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band("Breaking Benjamin"));
bands.addBand( new Band("Bon Jovi"));
bands.addBand( new Band("Héroes del silencio"));
bands.addBand( new Band("Metallica"));

console.log(bands);


//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');


    client.emit('active-bands',bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
    });

    client.on('mensaje',( payload )=> {
        console.log('Mensaje ',payload);
        io.emit('mensaje',{admin:'Nuevo mensaje'});

    });

   /* client.on('emitir-mensaje',(payload) => {
       // console.log(payload);
       // io.emit('nuevo-mensaje',payload); // Emite a todos
        client.broadcast.emit('nuevo-mensaje',payload); //Emite a todos menos al que lo emitió
    })*/

    client.on('vote-band', (payload) => {
       // console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());

    });

    client.on('add-band', (payload) =>{
        bands.addBand(new Band(payload.name));
        io.emit('active-bands',bands.getBands());
    });


    client.on('delete-band',(payload) =>{
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

  });