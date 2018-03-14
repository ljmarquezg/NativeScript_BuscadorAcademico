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
        return string.replace(/ /g, "%20");
    }
    /*================== Consultar base de datos ==============================*/
    getUniversidad() {
        let universidad = this.universidad
        if (universidad === "") {
            universidad = ""
        }
        this.url = "http://universities.hipolabs.com/search?name=" + this.htmlFormat(universidad) + "&country=" + this.htmlFormat(this.country);
        console.log(this.url);
        return this.http.get(this.url).map(response => response.json());
    }
};