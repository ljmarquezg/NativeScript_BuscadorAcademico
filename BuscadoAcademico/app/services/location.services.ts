import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
//Componentes Geolocalización
import { registerElement } from 'nativescript-angular/element-registry';
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
import { Accuracy } from "ui/enums";

@Injectable()

export class LocationService {
    url: string;
    latitud: string = "40.6643";
    longitud: string = "-73.9385";
    username: string = "ljmarquezg";
    //-------------- Variables localización ------------------
    miUbicacion: any = {
        latitud: 0,
        longitud: 0,
        zoom: 0,
        bearing: 0,
        tilt: 0,
        padding: [40, 40, 40, 40]
    };
    constructor(public http: Http) {

    }

    /*==================== Verificar Acceso a GPS ===============================*/
    permitirLocalizacion() {
        this.myLocation();
        if (!isEnabled()) {
            enableLocationRequest().then(() => {
                this.myLocation();
                console.log('location enabled!');
            }, e => {
                console.log('Failed to enable', e);
            });
        }
        console.log("No paso nada")
    }


    myLocation() {
        getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 10000 })
            .then(location => {
                this.miUbicacion = {
                    latitud: location.latitude,
                    longitud: location.longitude,
                    zoom: 11
                }
                console.log("Latitud: " + location.latitude + " Longitud: " + location.latitude)
            }, err => {
                console.log('Error: ' + err.message);
            })
        //console.log(location);
    }

    getNearBy() {
        this.url = "http://api.geonames.org/findNearbyPlaceNameJSON?username=" + this.username + "&lat=" + this.latitud + "&lng=" + this.longitud;
        return this.http.get(this.url).map(response => response.json())
    }
};

