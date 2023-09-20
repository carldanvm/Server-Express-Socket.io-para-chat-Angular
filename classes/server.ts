
import express from 'express';
import { SERVER_PORT, SERVER_IP } from '../global/environment';

import * as socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';



export default class Server {

    private static _intance: Server;

    public app: express.Application;
    public port: number;
    public ip: string;

    public io: socketIO.Server;
    private httpServer: http.Server;


    private constructor() {

        this.app = express();
        this.port = SERVER_PORT;
        this.ip = SERVER_IP

        this.httpServer = new http.Server( this.app );
        this.io = new socketIO.Server( this.httpServer, {
            cors: { origin: true, credentials: true }
        } );

        this.escucharSockets();
    }

    public static get instance() {
        return this._intance || ( this._intance = new this() );
    }


    private escucharSockets() {

        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            console.log('Cliente conectado');

            // Mensajes
            socket.mensaje( cliente, this.io );

            // Desconectar
            socket.desconectar( cliente );  
            
            socket.configurarUsuario( cliente, this.io );

        });

    }


    start( callback: Function ) {

        this.httpServer.listen( this.port, this.ip  , callback );

    }

}