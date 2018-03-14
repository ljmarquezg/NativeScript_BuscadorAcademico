import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EventData } from 'data/observable';
import { ActivityIndicator } from "ui/activity-indicator";
import * as dialogs from "ui/dialogs";
//Componentes de estilos
import { TextField } from 'ui/text-field';
import { ActionBar, ActionItem } from 'ui/action-bar';
import { View } from 'ui/core/view'
import { Page } from 'ui/page';
import { Color } from 'color';
//Servicios
import { BuscadorService } from '../services/buscador.services';
import { LocationService } from '../services/location.services';

@Component({
    selector: 'buscador',
    templateUrl: './buscador.component.html',
    moduleId: module.id
})

export class BuscadorComponent {
    /*========================================================
                      DEFINICIÓN DE VARIABLES 
     ========================================================*/
    @ViewChild("errorContainer") errorContainer: ElementRef;
    //--------------  String  --------------------------------
    appTitle: string;
    ciudad: string;
    titulo: string;
    universidad: string;
    visibility: string;
    visibilityText: string;
    totalItems: string;
    iconSearch: string = String.fromCharCode(0xe987)
    iconHide: string = String.fromCharCode(0xea10);
    //--------------  Arrays  --------------------------------
    universidaditems: Array<any>;
    //--------------  Boolenas -------------------------------
    busqueda: boolean;
    isLoading: boolean;
    error: boolean;
    /*================================================================
                        CONSTRCTOR
    ==================================================================*/
    constructor(private buscadorService: BuscadorService, private page: Page, private locationService: LocationService) {
        this.isLoading = false;
        this.error = false;
        this.busqueda = false;
        this.visibility = "visible";
        this.visibilityText = this.iconHide;
        this.appTitle = "Buscador de universidades";
    }
    /*================================================================
                        FUNCIONES
    ==================================================================*/

    ngOnInit() {
        //Personalización de estilos
        this.page.backgroundColor = new Color("#eeeeee");
        //Permitir Acceso al GPS
        //this.permitirLocalizacion();
    }
    /*==================== Verificar si hay error ===============================*/
    clearError() {
        if (this.error) {
            this.error = false;
        }
    }
    /*================== Convertir string en HTML ==============================*/
    htmlFormat(string) {
        return string.replace(/ /g, "%20");
    }
    /*==================== Mostrar u Ocultar panel de busqueda ===============================*/
    toggleVisivility() {
        if (this.visibility === "visible") {
            this.visibility = "collapsed";
            this.visibilityText = this.iconSearch;
        } else {
            this.visibility = "visible";
            this.visibilityText = this.iconHide;

        }
    }

    showResults() {
        this.toggleVisivility();
        this.totalItems = "Resultados Obtenidos:" + this.universidaditems.length;
        this.isLoading = false;
    }

    showDialog(title, message) {
        var options = {
            title: "" + title + "",
            message: "" + message + "",
            okButtonText: "OK"
        };
        dialogs.alert(options)
        this.isLoading = false;
    }
    /*==================== Verificar que el buscador no sea vacio ===============================*/
    validarBuscador() {
        //Vaciar texto de resultados anteriores
        this.totalItems = "";
        //Enviar el valor del campo buscarTextField al servicio para consultar la base de datos
        let textField = this.page.getViewById<TextField>("buscarTextField").text;
        //Convertir los espacios en formato HTML
        textField = this.htmlFormat(textField);
        this.buscadorService.universidad = textField;
        //Verificar que el campo no esté vacío
        if (textField === "") {
            this.error = true;
            return true;
        }
        return false;
    }

    getAll() {
        //Mostrar ActivityIndicator
        this.busqueda = true;
        this.isLoading = true;
        this.buscadorService.getUniversidad().subscribe(respuesta => {
            //Asignar el arreglo de items a la variable universidaditems
            this.universidaditems = respuesta;
            //Ocultar el ActivituIndicator
            if (respuesta.length === 0) {
                this.totalItems = "Su consulta no generó resultados. Intente nuevamente";
                this.isLoading = false;
            } else {
                this.showResults()
            }

        }, err => {
            this.showDialog("Se ha producido un error.", err)
        });
    }

    ubicarme() {
        this.busqueda = true;
        var dialogs = require('ui/dialogs');
        var options = {
            title: "Tu ubicación es: ",
            message: "Choose your race",
            cancelButtonText: "Cancel",
            actions: ["Buscar en mi ubicación", "Buscar en todo el mundo"]
        };
        dialogs.action(options).then((result) => {
            console.log(result);
            if (result === "Buscar en mi ubicación") {
                this.isLoading = true;
                // this.myLocation();
                //this.locationService.permitirLocalizacion();
                this.locationService.getNearBy().subscribe(result => {
                    this.buscadorService.country = this.htmlFormat(result.geonames[0].countryName)
                    this.buscadorService.getUniversidadCity().subscribe(universidad => {
                        this.universidaditems = universidad;
                        this.showResults();
                    }, err => {
                        this.showDialog("Se ha producido un error.", err)
                    })
                }, err => {
                    this.showDialog("Se ha producido un error.", err)
                })
                console.log('Abrir GPS');
            }
            if (result === "Buscar en todo el mundo") {
                this.buscadorService.universidad = "";
                this.getAll();
            }
        });
    }

    onReturn(args: EventData) {
        if (!this.validarBuscador()) {
            this.getAll();
        }
    }


};
