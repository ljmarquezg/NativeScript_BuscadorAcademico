import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
//Componentes Geolocalización
import { registerElement } from 'nativescript-angular/element-registry';
import { isEnabled, enableLocationRequest, getCurrentLocation, watchLocation, distance, clearWatch } from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { BuscadorService } from '../services/buscador.services';

@Injectable()

export class LocationService {
    url: string;
    latitud: string = ""; //= "40.6643";
    longitud: string = ""; //= "-73.9385";
    country: string = "";
    username: string = "ljmarquezg";
    locationStatus: boolean;
    locationError: string;
    constructor(public http: Http, private buscadorService: BuscadorService) {
        this.locationError = "";
        this.locationStatus = false;
    }

    /*==================== Verificar Acceso a GPS ===============================*/
    permitirLocalizacion() {
        this.locationStatus = false;
        let status = false;
        if (!isEnabled()) {
            enableLocationRequest().then(() => {
                console.log('Se ha activado la localización!');
                this.locationError = "";
                this.locationStatus = true;
                this.myLocation();
                status = true;
            }, err => {
                console.log('Error al activar localización', err);
                this.locationStatus = false;
                this.locationError = err;
                status = false;
            });
        } else {
            console.log('Localización Activada')
            this.locationError = "";
            this.locationStatus = true;
            status = true
        }
        this.myLocation();
        return status;
    }


    myLocation() {
        getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 10000 })
            .then(location => {
                this.latitud = location.latitude.toString();
                this.longitud = location.longitude.toString();
                this.getNearBy()
            }, err => {
                console.log('Error: ' + err.message);
            })
    }

    getNearBy() {
        this.url = "http://api.geonames.org/findNearbyPlaceNameJSON?username=" + this.username + "&lat=" + this.latitud + "&lng=" + this.longitud;
        this.http.get(this.url)
            .map(response => response.json())
            .subscribe(country => {
                this.country = country.geonames[0].countryName;
                this.buscadorService.country = country;
            })
        console.log("País: " + this.country);
        console.log("Latitud: " + this.latitud);
        console.log("Longitud: " + this.longitud)
    }
};

