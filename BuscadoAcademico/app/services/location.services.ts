import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
//Componentes Geolocalización
import { registerElement } from 'nativescript-angular/element-registry';
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import * as dialogs from 'ui/dialogs';

@Injectable()

export class LocationService {
    /*========================================================
                      DEFINICIÓN DE VARIABLES 
     ========================================================*/
    //--------------  String  --------------------------------
    url: string;
    latitud: string = ""; //= "40.6643";
    longitud: string = ""; //= "-73.9385";
    country: string = "";  // United States
    username: string = "ljmarquezg";
    // locationError: string;
    errorText: string;
    //--------------  Boolenas -------------------------------
    locationStatus: boolean;
    errorStatus: boolean;
    /*================================================================
                        CONSTRCTOR
    ==================================================================*/
    constructor(public http: Http) {
        // this.locationError = "";
        this.locationStatus = false;
        this.errorStatus = false;
        this.errorText = ""
    }
    /*================================================================
                        FUNCIONES
    ==================================================================*/
    /*==================== Verificar Acceso a GPS ===============================*/
    permitirLocalizacion() {
        const timer = require("timer");
        //Definir el estado del GPS como falso
        this.locationStatus = false;
        //Crear una vatiable booleana para manejar el estado del GPS
        let status: boolean = false;
        this.errorStatus = false;
        this.errorText = "";
        //Definir un tiempo máximo de espera para obtener ubicación en 60segundos
        let totalTime = 60;
        if (!isEnabled()) {
            enableLocationRequest().then(() => {
                //Mostrar mensaje al usuario de busqueda de ubicación del GPS     
                //Iniciar función contador regresivo el cual se repetirá cada 1000 milisegundos (1segundo)
                const countdown = timer.setInterval(() => {
                    //Mostrar mensaje en pantalla
                    this.errorText = "Calculando su ubicación. Espere " + totalTime + " segundos.";
                    //Verificar que el contador no sea menor a cero
                    if (--totalTime < 0) {
                        //Detener el contador
                        timer.clearInterval(countdown)
                        //Definir el status como falso
                        this.errorText = "";
                        status = false;
                    }
                }, 1000);
                //Definir el estado de la localización como verdadero
                this.locationStatus = true;
                status = this.myLocation();
                console.log('Se ha activado la localización!');
            }, err => {
                //Si existe un error, limpiar las coordenadas guardadas
                this.latitud = "";
                this.longitud = "";
                //Definir el estado del GPS como falso
                this.locationStatus = false;
                //Definir el estado del error como verdadero
                this.errorStatus = true;
                //Mostrar mensaje en pantalla
                this.errorText = 'GPS apagado';
                //Definir el estado como falso
                status = false;
                //Mostrar mensaje en cónsola
                console.log('Error al activar localización', err);
            });
        } else {
            //Definir el estado del GPS como verdadero
            this.locationStatus = true;
            //Definir el mensaje a mostrar
            this.errorText = "Calculando su ubicación"
            //Obtener el resultado de la localización del dispositivo
            status = this.myLocation()
            //Mostrar mensaje en cónsola
            console.log('Localización Activada')
        }
        //detener el contador
        timer.clearInterval(this.country)
        //Devolver el estado actual al componente para ser validado
        return status;
    }


    myLocation() {
        let status: boolean;
        //Obtener la localización actual enviando como parámetro una ubicación precisa y un tiempo de respuesta de 60 segundos
        getCurrentLocation({ desiredAccuracy: Accuracy.high, timeout: 60000 })//, maximumAge: 5000, 
            .then(location => {
                this.latitud = location.latitude.toString();
                this.longitud = location.longitude.toString();
                //Consultar el nombre de la ciudad mas cercana utilizando los valores de las coordenadas recibidas
                this.getNearBy()
                status = true;
            }, err => {
                //Activar el estado de error en el dispositivo
                this.errorStatus = true;
                this.errorText = "Error al obtener información del GPS. " + err
                console.log(this.errorText + err);
                status = false
            })
        return status;
    }

    getNearBy() {
        //Inicializar la variable de estatus de error
        this.errorStatus = false;
        this.errorText = "";
        //Verificar que exista una latitud y longitud
        if (this.latitud === "" || this.longitud === "") {
            //Mostrar mensaje de error
            this.errorStatus = true;
            //Definir el mensaje de error
            this.errorText = "Error al obtener coordenadas de su posición. "
            console.log(this.errorText);
        }
        //Verificar que no exista información sobre el nombre del país
        if (this.country === "") {
            //Definir la url de la base de datos enviando como parámetros el nombre del usuario creado y las coordenadas obtenidas por el GPS del dispositivo
            this.url = "http://api.geonames.org/findNearbyPlaceNameJSON?username=" + this.username + "&lat=" + this.latitud + "&lng=" + this.longitud;
            //Obtener la información desde el servidor
            this.http.get(this.url)
                .map(response => response.json())
                .subscribe(country => {
                    //Definir el nombre obtenido desde la base de datos
                    this.country = country.geonames[0].countryName;
                }, err => {
                    //Definir estado de error como verdadero
                    this.errorStatus = true;
                    //Definir mensaje de error
                    this.errorText = "Error al obtener el nombre de su ubicación. Verifique su conexión a internet ";;
                    console.log(this.errorText);
                })
        }
        //Si no existe errores mostrar la información obtenida en cónsola.
        if (!this.errorStatus) {
            console.log("País: " + this.country);
            console.log("Latitud: " + this.latitud);
            console.log("Longitud: " + this.longitud)
        }
    }
};

