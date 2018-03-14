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

    getUniversidad() {
        console.log("http://universities.hipolabs.com/search?name=" + this.universidad);
        this.url = "http://universities.hipolabs.com/search?name=" + this.universidad;
        return this.http.get(this.url).map(response => response.json())
    }

    getUniversidadCity() {
        this.url = "http://universities.hipolabs.com/search?country=" + this.country;
        console.log(this.url)
        return this.http.get(this.url).map(response => response.json())
    }
};