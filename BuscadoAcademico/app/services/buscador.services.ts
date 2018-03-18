import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";

@Injectable()

export class BuscadorService {
    url: string
    country: string;
    universidad: string;

    constructor(public http: Http) {

    }

    /*================== Convertir string en HTML ==============================*/
    htmlFormat(string) {
        //Reemplazar los espacios " " por el valor %20 para coincidir con el formato HTML
        return string.replace(/ /g, "%20");
    }
    /*================== Consultar base de datos ==============================*/
    getUniversidad() {
        this.url = "http://universities.hipolabs.com/search?name=" + this.htmlFormat(this.universidad);
        console.log(this.url);
        return this.http.get(this.url).map(response => response.json());
    }

    getUniversidadCiudad() {
        //Si el pais es Venezuela, cambiar por el siguiente nombre
        if (this.country === "Venezuela") {
            this.country = "Venezuela, Bolivarian Republic of";
        }
        this.url = "http://universities.hipolabs.com/search?name=" + this.htmlFormat(this.universidad) + "&country=" + this.htmlFormat(this.country);
        console.log(this.url);
        return this.http.get(this.url).map(response => response.json());
    }
};