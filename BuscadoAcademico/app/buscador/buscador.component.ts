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
    iconSearch: string = String.fromCharCode(0xe987);
    iconHide: string = String.fromCharCode(0xea42);
    iconGpsOff: string = String.fromCharCode(0xe9b4);
    iconGps: string = String.fromCharCode(0xe94c);
    isLoadingText: String;
    //--------------  Arrays  --------------------------------
    universidaditems: Array<any>;
    //--------------  Boolenas -------------------------------
    isLoading: boolean;
    error: boolean;
    /*================================================================
                        CONSTRCTOR
    ==================================================================*/
    constructor(private buscadorService: BuscadorService, private page: Page, private locationService: LocationService) {
        this.isLoading = false;
        this.error = false;
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
        this.locationService.permitirLocalizacion();
    }
    /*==================== Verificar si hay error ===============================*/
    clearError() {
        if (this.error) {
            this.error = false;
        }
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
    /*==================== Mostrar Ccontador de resultados en pantalla ===============================*/
    showResults() {
        this.totalItems = "Resultados Obtenidos:" + this.universidaditems.length;
        this.isLoading = false;
        // this.toggleVisivility();
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
    showLoader(message) {
        this.isLoading = true;
        this.isLoadingText = message;
    }
    /*==================== Verificar que el buscador no sea vacio al presionar enter ===============================*/
    validarBuscador() {
        //Vaciar texto de resultados anteriores
        this.totalItems = "";
        //Enviar el valor del campo buscarTextField al servicio para consultar la base de datos
        let textField = this.page.getViewById<TextField>("buscarTextField").text;
        this.buscadorService.universidad = textField;
        //Verificar que el campo no esté vacío
        if (textField === "") {
            this.error = true;
            return true;
        }
        return false;
    }
    /*==================== Verificar que el buscador no sea vacio al presionar enter ===============================*/
    getAll() {
        //Mostrar ActivityIndicator
        this.showLoader("Consultando Información");
        this.buscadorService.getUniversidad().subscribe(respuesta => {
            //Asignar el arreglo de items a la variable universidaditems
            this.universidaditems = respuesta;
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
    /*==================== Ubicar al usuario con el GPS del dispositivo ===============================*/
    ubicarme() {
        this.showLoader("Obteniendo Localizacion");
        this.locationService.permitirLocalizacion()

        if (this.locationService.longitud === "" && this.locationService.latitud === "") {
            this.showDialog("Sin Localización", "Debe habilitar el servicio de geolocalización")
        } else {
            if (this.locationService.country === "") {
                console.log("No se ha localizado el dispositivo");
                this.isLoading = false;
            } else {
                this.showLoader("Consultando Información");
                var options = {
                    title: "Tu ubicación es: " + this.locationService.country,
                    message: "Selecciona filtro de búsqueda",
                    cancelButtonText: "Cancel",
                    actions: ["Buscar en mi ubicación", "Buscar en todo el mundo"]
                };


                dialogs.action(options).then((result) => {
                    console.log(result);
                    let textField = this.page.getViewById<TextField>("buscarTextField").text;
                    switch (result) {
                        case "Buscar en mi ubicación":
                            this.locationService.getNearBy()
                            this.buscadorService.country = this.locationService.country;
                            this.buscadorService
                            this.buscadorService.universidad = textField
                            if (this.buscadorService.universidad === "") {
                                this.buscadorService.universidad = "";
                            }
                            this.buscadorService.getUniversidad().subscribe(universidad => {
                                this.universidaditems = universidad;
                                this.showResults();
                            }, err => {
                                this.showDialog("Se ha producido un error.", err)
                            })
                            break;

                        case "Buscar en todo el mundo":
                            this.buscadorService.universidad = textField
                            this.buscadorService.country = "";
                            if (this.buscadorService.universidad === "") {
                                this.buscadorService.universidad = "";
                            }
                            this.getAll();
                            break;

                        case "Cancel":
                            this.isLoading = false
                            break;
                        default:
                            this.isLoading = true;
                            break;
                    }
                });
            };
        }
    }

    onReturn(args: EventData) {
        if (!this.validarBuscador()) {
            this.buscadorService.country = "";
            this.getAll();
        }
    }


};
