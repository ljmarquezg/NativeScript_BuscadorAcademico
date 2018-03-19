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
        this.page.actionBarHidden = true;
        //Permitir Acceso al GPS
        this.locationService.permitirLocalizacion();
    }
    /*==================== Verificar si hay error ===============================*/
    clearError() {
        //Cambiar el estado del mensaje de error
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
    /*==================== Mostrar Contador de resultados en pantalla ===============================*/
    showResults() {
        //Ocultar el loader
        this.isLoading = false;
        //Mostrar - Ocultar Panel de busqueda
        if (this.universidaditems.length > 0) {
            this.totalItems = "Resultados Obtenidos:" + this.universidaditems.length;
            this.toggleVisivility();
        } else {
            this.totalItems = "Su consulta no generó resultados. Intente nuevamente";
        }
    }
    /*==================== Mostrar Dialogos o Alertas en pantalla ===============================*/
    showDialog(title, message) {
        var options = {
            title: "" + title + "",
            message: "" + message + "",
            okButtonText: "OK"
        };
        dialogs.alert(options)
        this.isLoading = false;
    }
    /*==================== Mostrar Loader ===============================*/
    showLoader(message) {
        //Vaciar los resultados obtenidos en la ultima consulta
        this.universidaditems = [];
        //Vaciar el texto de total de resultados
        this.totalItems = "";
        //Activar estado del loader
        this.isLoading = true;
        //Mostrar mensaje de loader
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
            this.showResults();
        }, err => {
            //Mostrar mensaje de error si no se recibe una respuesta del servidor
            this.showDialog("Se ha producido un error.", "Error de comunicación con el servidor.")
        });
    }
    /*==================== Ubicar al usuario con el GPS del dispositivo ===============================*/
    ubicarme() {
        //Cambiar el estado del mensaje de error
        this.error = false;
        //Limpiar el mensaje de alerta y las opciones interactivas
        let alertTitle = "";
        let alertMessaje = "";
        let alertActions = [];
        //Mostrar opciones de acuerdo a la ubicación del dispositivo
        if (this.locationService.country === "") {
            //Mensaje si no se ha detectado la ubicación del dispositivo
            alertTitle = "Ubicación del dispositivo no disponible"
            alertMessaje = ""
            //Agregar opción al array de opciones
            alertActions.push("Ubicar mi dispositivo")
            this.isLoading = false;
        } else {
            alertMessaje = "Selecciona filtro de búsqueda";
            //Agregar opción al array de opciones
            alertActions.push("Buscar en mi ubicación")
        }
        //Agregar opción al array de opciones
        alertActions.push("Buscar en todo el mundo")
        //Generar opciones para el dialogo de acción
        var options = {
            title: alertTitle,
            message: alertMessaje,
            cancelButtonText: "Cancel",
            actions: alertActions
        };
        //Mostrar el cuadro de diálogo
        dialogs.action(options).then((result) => {
            this.buscadorService.universidad = this.page.getViewById<TextField>("buscarTextField").text;
            //Definir Opciones y acciones de diálogo
            switch (result) {
                case "Ubicar mi dispositivo":
                    //Localizar el dipositivo
                    this.locationService.permitirLocalizacion();
                    //Obtener el nombre de la ciudad mas cercanañ
                    this.locationService.getNearBy();
                    //Ocultar el loader
                    this.isLoading = false
                    break;

                case "Buscar en mi ubicación":
                    //Obtener la localización del dispositivo
                    this.locationService.permitirLocalizacion();
                    //Mostrar Loader
                    this.showLoader("Consultando Información");
                    //Consultar el nombre de la ciudad mas cercana
                    this.locationService.getNearBy()
                    //Obtener el nombre de la cuidad mas cercana
                    this.buscadorService.country = this.locationService.country;
                    //Consultar enviando como parámetro la ciudad
                    this.buscadorService.getUniversidadCiudad().subscribe(universidad => {
                        this.universidaditems = universidad;
                        this.showResults();
                    }, err => {
                        //Mostrar error
                        this.showDialog("Se ha producido un error.", "Error de comunicación con el servidor.")
                    })
                    break;

                case "Buscar en todo el mundo":
                    //Consultar las universidades por nombre
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
    }

    /*==================== Acciones a realizar al presionar enter ===============================*/
    onReturn(args: EventData) {
        //Verificar que el buscado no sea vacío
        if (!this.validarBuscador()) {
            this.getAll();
        }
    }


};
