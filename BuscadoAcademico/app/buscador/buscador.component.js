"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialogs = require("ui/dialogs");
var page_1 = require("ui/page");
var color_1 = require("color");
//Servicios
var buscador_services_1 = require("../services/buscador.services");
var location_services_1 = require("../services/location.services");
var BuscadorComponent = /** @class */ (function () {
    /*================================================================
                        CONSTRCTOR
    ==================================================================*/
    function BuscadorComponent(buscadorService, page, locationService) {
        this.buscadorService = buscadorService;
        this.page = page;
        this.locationService = locationService;
        this.iconSearch = String.fromCharCode(0xe987);
        this.iconHide = String.fromCharCode(0xea42);
        this.iconGpsOff = String.fromCharCode(0xe9b4);
        this.iconGps = String.fromCharCode(0xe94c);
        this.isLoading = false;
        this.error = false;
        this.visibility = "visible";
        this.visibilityText = this.iconHide;
        this.appTitle = "Buscador de universidades";
    }
    /*================================================================
                        FUNCIONES
    ==================================================================*/
    BuscadorComponent.prototype.ngOnInit = function () {
        //Personalización de estilos
        this.page.backgroundColor = new color_1.Color("#eeeeee");
        //Permitir Acceso al GPS
        this.locationService.permitirLocalizacion();
    };
    /*==================== Verificar si hay error ===============================*/
    BuscadorComponent.prototype.clearError = function () {
        //Cambiar el estado del mensaje de error
        if (this.error) {
            this.error = false;
        }
    };
    /*==================== Mostrar u Ocultar panel de busqueda ===============================*/
    BuscadorComponent.prototype.toggleVisivility = function () {
        if (this.visibility === "visible") {
            this.visibility = "collapsed";
            this.visibilityText = this.iconSearch;
        }
        else {
            this.visibility = "visible";
            this.visibilityText = this.iconHide;
        }
    };
    /*==================== Mostrar Contador de resultados en pantalla ===============================*/
    BuscadorComponent.prototype.showResults = function () {
        //Ocultar el loader
        this.isLoading = false;
        //Mostrar - Ocultar Panel de busqueda
        if (this.universidaditems.length > 0) {
            this.totalItems = "Resultados Obtenidos:" + this.universidaditems.length;
            this.toggleVisivility();
        }
        else {
            this.totalItems = "Su consulta no generó resultados. Intente nuevamente";
        }
    };
    /*==================== Mostrar Dialogos o Alertas en pantalla ===============================*/
    BuscadorComponent.prototype.showDialog = function (title, message) {
        var options = {
            title: "" + title + "",
            message: "" + message + "",
            okButtonText: "OK"
        };
        dialogs.alert(options);
        this.isLoading = false;
    };
    /*==================== Mostrar Loader ===============================*/
    BuscadorComponent.prototype.showLoader = function (message) {
        //Vaciar los resultados obtenidos en la ultima consulta
        this.universidaditems = [];
        //Vaciar el texto de total de resultados
        this.totalItems = "";
        //Activar estado del loader
        this.isLoading = true;
        //Mostrar mensaje de loader
        this.isLoadingText = message;
    };
    /*==================== Verificar que el buscador no sea vacio al presionar enter ===============================*/
    BuscadorComponent.prototype.validarBuscador = function () {
        //Vaciar texto de resultados anteriores
        this.totalItems = "";
        //Enviar el valor del campo buscarTextField al servicio para consultar la base de datos
        var textField = this.page.getViewById("buscarTextField").text;
        this.buscadorService.universidad = textField;
        //Verificar que el campo no esté vacío
        if (textField === "") {
            this.error = true;
            return true;
        }
        return false;
    };
    /*==================== Verificar que el buscador no sea vacio al presionar enter ===============================*/
    BuscadorComponent.prototype.getAll = function () {
        var _this = this;
        //Mostrar ActivityIndicator
        this.showLoader("Consultando Información");
        this.buscadorService.getUniversidad().subscribe(function (respuesta) {
            //Asignar el arreglo de items a la variable universidaditems
            _this.universidaditems = respuesta;
            _this.showResults();
        }, function (err) {
            //Mostrar mensaje de error si no se recibe una respuesta del servidor
            _this.showDialog("Se ha producido un error.", "Error de comunicación con el servidor.");
        });
    };
    /*==================== Ubicar al usuario con el GPS del dispositivo ===============================*/
    BuscadorComponent.prototype.ubicarme = function () {
        var _this = this;
        //Cambiar el estado del mensaje de error
        this.error = false;
        //Limpiar el mensaje de alerta y las opciones interactivas
        var alertTitle = "";
        var alertMessaje = "";
        var alertActions = [];
        //Mostrar opciones de acuerdo a la ubicación del dispositivo
        if (this.locationService.country === "") {
            //Mensaje si no se ha detectado la ubicación del dispositivo
            alertTitle = "Ubicación del dispositivo no disponible";
            alertMessaje = "";
            //Agregar opción al array de opciones
            alertActions.push("Ubicar mi dispositivo");
            this.isLoading = false;
        }
        else {
            alertMessaje = "Selecciona filtro de búsqueda";
            //Agregar opción al array de opciones
            alertActions.push("Buscar en mi ubicación");
        }
        //Agregar opción al array de opciones
        alertActions.push("Buscar en todo el mundo");
        //Generar opciones para el dialogo de acción
        var options = {
            title: alertTitle,
            message: alertMessaje,
            cancelButtonText: "Cancel",
            actions: alertActions
        };
        //Mostrar el cuadro de diálogo
        dialogs.action(options).then(function (result) {
            _this.buscadorService.universidad = _this.page.getViewById("buscarTextField").text;
            //Definir Opciones y acciones de diálogo
            switch (result) {
                case "Ubicar mi dispositivo":
                    //Localizar el dipositivo
                    _this.locationService.permitirLocalizacion();
                    //Obtener el nombre de la ciudad mas cercanañ
                    _this.locationService.getNearBy();
                    //Ocultar el loader
                    _this.isLoading = false;
                    break;
                case "Buscar en mi ubicación":
                    //Obtener la localización del dispositivo
                    _this.locationService.permitirLocalizacion();
                    //Mostrar Loader
                    _this.showLoader("Consultando Información");
                    //Consultar el nombre de la ciudad mas cercana
                    _this.locationService.getNearBy();
                    //Obtener el nombre de la cuidad mas cercana
                    _this.buscadorService.country = _this.locationService.country;
                    //Consultar enviando como parámetro la ciudad
                    _this.buscadorService.getUniversidadCiudad().subscribe(function (universidad) {
                        _this.universidaditems = universidad;
                        _this.showResults();
                    }, function (err) {
                        //Mostrar error
                        _this.showDialog("Se ha producido un error.", "Error de comunicación con el servidor.");
                    });
                    break;
                case "Buscar en todo el mundo":
                    //Consultar las universidades por nombre
                    _this.getAll();
                    break;
                case "Cancel":
                    _this.isLoading = false;
                    break;
                default:
                    _this.isLoading = true;
                    break;
            }
        });
    };
    /*==================== Acciones a realizar al presionar enter ===============================*/
    BuscadorComponent.prototype.onReturn = function (args) {
        //Verificar que el buscado no sea vacío
        if (!this.validarBuscador()) {
            this.getAll();
        }
    };
    __decorate([
        core_1.ViewChild("errorContainer"),
        __metadata("design:type", core_1.ElementRef)
    ], BuscadorComponent.prototype, "errorContainer", void 0);
    BuscadorComponent = __decorate([
        core_1.Component({
            selector: 'buscador',
            templateUrl: './buscador.component.html',
            moduleId: module.id
        }),
        __metadata("design:paramtypes", [buscador_services_1.BuscadorService, page_1.Page, location_services_1.LocationService])
    ], BuscadorComponent);
    return BuscadorComponent;
}());
exports.BuscadorComponent = BuscadorComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVzY2Fkb3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVzY2Fkb3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBR3pFLG9DQUFzQztBQUt0QyxnQ0FBK0I7QUFDL0IsK0JBQThCO0FBQzlCLFdBQVc7QUFDWCxtRUFBZ0U7QUFDaEUsbUVBQWdFO0FBUWhFO0lBdUJJOzt3RUFFb0U7SUFDcEUsMkJBQW9CLGVBQWdDLEVBQVUsSUFBVSxFQUFVLGVBQWdDO1FBQTlGLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFibEgsZUFBVSxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakQsYUFBUSxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsZUFBVSxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakQsWUFBTyxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFXMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsMkJBQTJCLENBQUM7SUFDaEQsQ0FBQztJQUNEOzt3RUFFb0U7SUFDcEUsb0NBQVEsR0FBUjtRQUNJLDRCQUE0QjtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGFBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FB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OENBQWlCO0FBOE03QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBFdmVudERhdGEgfSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBBY3Rpdml0eUluZGljYXRvciB9IGZyb20gXCJ1aS9hY3Rpdml0eS1pbmRpY2F0b3JcIjtcclxuaW1wb3J0ICogYXMgZGlhbG9ncyBmcm9tIFwidWkvZGlhbG9nc1wiO1xyXG4vL0NvbXBvbmVudGVzIGRlIGVzdGlsb3NcclxuaW1wb3J0IHsgVGV4dEZpZWxkIH0gZnJvbSAndWkvdGV4dC1maWVsZCc7XHJcbmltcG9ydCB7IEFjdGlvbkJhciwgQWN0aW9uSXRlbSB9IGZyb20gJ3VpL2FjdGlvbi1iYXInO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAndWkvY29yZS92aWV3J1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAndWkvcGFnZSc7XHJcbmltcG9ydCB7IENvbG9yIH0gZnJvbSAnY29sb3InO1xyXG4vL1NlcnZpY2lvc1xyXG5pbXBvcnQgeyBCdXNjYWRvclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9idXNjYWRvci5zZXJ2aWNlcyc7XHJcbmltcG9ydCB7IExvY2F0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2xvY2F0aW9uLnNlcnZpY2VzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdidXNjYWRvcicsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYnVzY2Fkb3IuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ1c2NhZG9yQ29tcG9uZW50IHtcclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgICAgICAgICAgIERFRklOSUNJw5NOIERFIFZBUklBQkxFUyBcclxuICAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICBAVmlld0NoaWxkKFwiZXJyb3JDb250YWluZXJcIikgZXJyb3JDb250YWluZXI6IEVsZW1lbnRSZWY7XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tICBTdHJpbmcgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBhcHBUaXRsZTogc3RyaW5nO1xyXG4gICAgY2l1ZGFkOiBzdHJpbmc7XHJcbiAgICB0aXR1bG86IHN0cmluZztcclxuICAgIHVuaXZlcnNpZGFkOiBzdHJpbmc7XHJcbiAgICB2aXNpYmlsaXR5OiBzdHJpbmc7XHJcbiAgICB2aXNpYmlsaXR5VGV4dDogc3RyaW5nO1xyXG4gICAgdG90YWxJdGVtczogc3RyaW5nO1xyXG4gICAgaWNvblNlYXJjaDogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGU5ODcpO1xyXG4gICAgaWNvbkhpZGU6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhlYTQyKTtcclxuICAgIGljb25HcHNPZmY6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhlOWI0KTtcclxuICAgIGljb25HcHM6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhlOTRjKTtcclxuICAgIGlzTG9hZGluZ1RleHQ6IFN0cmluZztcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0gIEFycmF5cyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHVuaXZlcnNpZGFkaXRlbXM6IEFycmF5PGFueT47XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tICBCb29sZW5hcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW47XHJcbiAgICBlcnJvcjogYm9vbGVhbjtcclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBDT05TVFJDVE9SXHJcbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBidXNjYWRvclNlcnZpY2U6IEJ1c2NhZG9yU2VydmljZSwgcHJpdmF0ZSBwYWdlOiBQYWdlLCBwcml2YXRlIGxvY2F0aW9uU2VydmljZTogTG9jYXRpb25TZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgdGhpcy52aXNpYmlsaXR5VGV4dCA9IHRoaXMuaWNvbkhpZGU7XHJcbiAgICAgICAgdGhpcy5hcHBUaXRsZSA9IFwiQnVzY2Fkb3IgZGUgdW5pdmVyc2lkYWRlc1wiO1xyXG4gICAgfVxyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZVTkNJT05FU1xyXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIC8vUGVyc29uYWxpemFjacOzbiBkZSBlc3RpbG9zXHJcbiAgICAgICAgdGhpcy5wYWdlLmJhY2tncm91bmRDb2xvciA9IG5ldyBDb2xvcihcIiNlZWVlZWVcIik7XHJcbiAgICAgICAgLy9QZXJtaXRpciBBY2Nlc28gYWwgR1BTXHJcbiAgICAgICAgdGhpcy5sb2NhdGlvblNlcnZpY2UucGVybWl0aXJMb2NhbGl6YWNpb24oKTtcclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gVmVyaWZpY2FyIHNpIGhheSBlcnJvciA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIGNsZWFyRXJyb3IoKSB7XHJcbiAgICAgICAgLy9DYW1iaWFyIGVsIGVzdGFkbyBkZWwgbWVuc2FqZSBkZSBlcnJvclxyXG4gICAgICAgIGlmICh0aGlzLmVycm9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09IE1vc3RyYXIgdSBPY3VsdGFyIHBhbmVsIGRlIGJ1c3F1ZWRhID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgdG9nZ2xlVmlzaXZpbGl0eSgpIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmlsaXR5ID09PSBcInZpc2libGVcIikge1xyXG4gICAgICAgICAgICB0aGlzLnZpc2liaWxpdHkgPSBcImNvbGxhcHNlZFwiO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2liaWxpdHlUZXh0ID0gdGhpcy5pY29uU2VhcmNoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2liaWxpdHlUZXh0ID0gdGhpcy5pY29uSGlkZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09IE1vc3RyYXIgQ29udGFkb3IgZGUgcmVzdWx0YWRvcyBlbiBwYW50YWxsYSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIHNob3dSZXN1bHRzKCkge1xyXG4gICAgICAgIC8vT2N1bHRhciBlbCBsb2FkZXJcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIC8vTW9zdHJhciAtIE9jdWx0YXIgUGFuZWwgZGUgYnVzcXVlZGFcclxuICAgICAgICBpZiAodGhpcy51bml2ZXJzaWRhZGl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy50b3RhbEl0ZW1zID0gXCJSZXN1bHRhZG9zIE9idGVuaWRvczpcIiArIHRoaXMudW5pdmVyc2lkYWRpdGVtcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlVmlzaXZpbGl0eSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudG90YWxJdGVtcyA9IFwiU3UgY29uc3VsdGEgbm8gZ2VuZXLDsyByZXN1bHRhZG9zLiBJbnRlbnRlIG51ZXZhbWVudGVcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09IE1vc3RyYXIgRGlhbG9nb3MgbyBBbGVydGFzIGVuIHBhbnRhbGxhID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgc2hvd0RpYWxvZyh0aXRsZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICB0aXRsZTogXCJcIiArIHRpdGxlICsgXCJcIixcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJcIiArIG1lc3NhZ2UgKyBcIlwiLFxyXG4gICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKVxyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09IE1vc3RyYXIgTG9hZGVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgc2hvd0xvYWRlcihtZXNzYWdlKSB7XHJcbiAgICAgICAgLy9WYWNpYXIgbG9zIHJlc3VsdGFkb3Mgb2J0ZW5pZG9zIGVuIGxhIHVsdGltYSBjb25zdWx0YVxyXG4gICAgICAgIHRoaXMudW5pdmVyc2lkYWRpdGVtcyA9IFtdO1xyXG4gICAgICAgIC8vVmFjaWFyIGVsIHRleHRvIGRlIHRvdGFsIGRlIHJlc3VsdGFkb3NcclxuICAgICAgICB0aGlzLnRvdGFsSXRlbXMgPSBcIlwiO1xyXG4gICAgICAgIC8vQWN0aXZhciBlc3RhZG8gZGVsIGxvYWRlclxyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAvL01vc3RyYXIgbWVuc2FqZSBkZSBsb2FkZXJcclxuICAgICAgICB0aGlzLmlzTG9hZGluZ1RleHQgPSBtZXNzYWdlO1xyXG4gICAgfVxyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PSBWZXJpZmljYXIgcXVlIGVsIGJ1c2NhZG9yIG5vIHNlYSB2YWNpbyBhbCBwcmVzaW9uYXIgZW50ZXIgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICB2YWxpZGFyQnVzY2Fkb3IoKSB7XHJcbiAgICAgICAgLy9WYWNpYXIgdGV4dG8gZGUgcmVzdWx0YWRvcyBhbnRlcmlvcmVzXHJcbiAgICAgICAgdGhpcy50b3RhbEl0ZW1zID0gXCJcIjtcclxuICAgICAgICAvL0VudmlhciBlbCB2YWxvciBkZWwgY2FtcG8gYnVzY2FyVGV4dEZpZWxkIGFsIHNlcnZpY2lvIHBhcmEgY29uc3VsdGFyIGxhIGJhc2UgZGUgZGF0b3NcclxuICAgICAgICBsZXQgdGV4dEZpZWxkID0gdGhpcy5wYWdlLmdldFZpZXdCeUlkPFRleHRGaWVsZD4oXCJidXNjYXJUZXh0RmllbGRcIikudGV4dDtcclxuICAgICAgICB0aGlzLmJ1c2NhZG9yU2VydmljZS51bml2ZXJzaWRhZCA9IHRleHRGaWVsZDtcclxuICAgICAgICAvL1ZlcmlmaWNhciBxdWUgZWwgY2FtcG8gbm8gZXN0w6kgdmFjw61vXHJcbiAgICAgICAgaWYgKHRleHRGaWVsZCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gVmVyaWZpY2FyIHF1ZSBlbCBidXNjYWRvciBubyBzZWEgdmFjaW8gYWwgcHJlc2lvbmFyIGVudGVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgZ2V0QWxsKCkge1xyXG4gICAgICAgIC8vTW9zdHJhciBBY3Rpdml0eUluZGljYXRvclxyXG4gICAgICAgIHRoaXMuc2hvd0xvYWRlcihcIkNvbnN1bHRhbmRvIEluZm9ybWFjacOzblwiKTtcclxuICAgICAgICB0aGlzLmJ1c2NhZG9yU2VydmljZS5nZXRVbml2ZXJzaWRhZCgpLnN1YnNjcmliZShyZXNwdWVzdGEgPT4ge1xyXG4gICAgICAgICAgICAvL0FzaWduYXIgZWwgYXJyZWdsbyBkZSBpdGVtcyBhIGxhIHZhcmlhYmxlIHVuaXZlcnNpZGFkaXRlbXNcclxuICAgICAgICAgICAgdGhpcy51bml2ZXJzaWRhZGl0ZW1zID0gcmVzcHVlc3RhO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dSZXN1bHRzKCk7XHJcbiAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgLy9Nb3N0cmFyIG1lbnNhamUgZGUgZXJyb3Igc2kgbm8gc2UgcmVjaWJlIHVuYSByZXNwdWVzdGEgZGVsIHNlcnZpZG9yXHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0RpYWxvZyhcIlNlIGhhIHByb2R1Y2lkbyB1biBlcnJvci5cIiwgXCJFcnJvciBkZSBjb211bmljYWNpw7NuIGNvbiBlbCBzZXJ2aWRvci5cIilcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gVWJpY2FyIGFsIHVzdWFyaW8gY29uIGVsIEdQUyBkZWwgZGlzcG9zaXRpdm8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICB1YmljYXJtZSgpIHtcclxuICAgICAgICAvL0NhbWJpYXIgZWwgZXN0YWRvIGRlbCBtZW5zYWplIGRlIGVycm9yXHJcbiAgICAgICAgdGhpcy5lcnJvciA9IGZhbHNlO1xyXG4gICAgICAgIC8vTGltcGlhciBlbCBtZW5zYWplIGRlIGFsZXJ0YSB5IGxhcyBvcGNpb25lcyBpbnRlcmFjdGl2YXNcclxuICAgICAgICBsZXQgYWxlcnRUaXRsZSA9IFwiXCI7XHJcbiAgICAgICAgbGV0IGFsZXJ0TWVzc2FqZSA9IFwiXCI7XHJcbiAgICAgICAgbGV0IGFsZXJ0QWN0aW9ucyA9IFtdO1xyXG4gICAgICAgIC8vTW9zdHJhciBvcGNpb25lcyBkZSBhY3VlcmRvIGEgbGEgdWJpY2FjacOzbiBkZWwgZGlzcG9zaXRpdm9cclxuICAgICAgICBpZiAodGhpcy5sb2NhdGlvblNlcnZpY2UuY291bnRyeSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAvL01lbnNhamUgc2kgbm8gc2UgaGEgZGV0ZWN0YWRvIGxhIHViaWNhY2nDs24gZGVsIGRpc3Bvc2l0aXZvXHJcbiAgICAgICAgICAgIGFsZXJ0VGl0bGUgPSBcIlViaWNhY2nDs24gZGVsIGRpc3Bvc2l0aXZvIG5vIGRpc3BvbmlibGVcIlxyXG4gICAgICAgICAgICBhbGVydE1lc3NhamUgPSBcIlwiXHJcbiAgICAgICAgICAgIC8vQWdyZWdhciBvcGNpw7NuIGFsIGFycmF5IGRlIG9wY2lvbmVzXHJcbiAgICAgICAgICAgIGFsZXJ0QWN0aW9ucy5wdXNoKFwiVWJpY2FyIG1pIGRpc3Bvc2l0aXZvXCIpXHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWxlcnRNZXNzYWplID0gXCJTZWxlY2Npb25hIGZpbHRybyBkZSBiw7pzcXVlZGFcIjtcclxuICAgICAgICAgICAgLy9BZ3JlZ2FyIG9wY2nDs24gYWwgYXJyYXkgZGUgb3BjaW9uZXNcclxuICAgICAgICAgICAgYWxlcnRBY3Rpb25zLnB1c2goXCJCdXNjYXIgZW4gbWkgdWJpY2FjacOzblwiKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL0FncmVnYXIgb3BjacOzbiBhbCBhcnJheSBkZSBvcGNpb25lc1xyXG4gICAgICAgIGFsZXJ0QWN0aW9ucy5wdXNoKFwiQnVzY2FyIGVuIHRvZG8gZWwgbXVuZG9cIilcclxuICAgICAgICAvL0dlbmVyYXIgb3BjaW9uZXMgcGFyYSBlbCBkaWFsb2dvIGRlIGFjY2nDs25cclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IGFsZXJ0VGl0bGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGFsZXJ0TWVzc2FqZSxcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgYWN0aW9uczogYWxlcnRBY3Rpb25zXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvL01vc3RyYXIgZWwgY3VhZHJvIGRlIGRpw6Fsb2dvXHJcbiAgICAgICAgZGlhbG9ncy5hY3Rpb24ob3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVzY2Fkb3JTZXJ2aWNlLnVuaXZlcnNpZGFkID0gdGhpcy5wYWdlLmdldFZpZXdCeUlkPFRleHRGaWVsZD4oXCJidXNjYXJUZXh0RmllbGRcIikudGV4dDtcclxuICAgICAgICAgICAgLy9EZWZpbmlyIE9wY2lvbmVzIHkgYWNjaW9uZXMgZGUgZGnDoWxvZ29cclxuICAgICAgICAgICAgc3dpdGNoIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJVYmljYXIgbWkgZGlzcG9zaXRpdm9cIjpcclxuICAgICAgICAgICAgICAgICAgICAvL0xvY2FsaXphciBlbCBkaXBvc2l0aXZvXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NhdGlvblNlcnZpY2UucGVybWl0aXJMb2NhbGl6YWNpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAvL09idGVuZXIgZWwgbm9tYnJlIGRlIGxhIGNpdWRhZCBtYXMgY2VyY2FuYcOxXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NhdGlvblNlcnZpY2UuZ2V0TmVhckJ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9PY3VsdGFyIGVsIGxvYWRlclxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiQnVzY2FyIGVuIG1pIHViaWNhY2nDs25cIjpcclxuICAgICAgICAgICAgICAgICAgICAvL09idGVuZXIgbGEgbG9jYWxpemFjacOzbiBkZWwgZGlzcG9zaXRpdm9cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2F0aW9uU2VydmljZS5wZXJtaXRpckxvY2FsaXphY2lvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vTW9zdHJhciBMb2FkZXJcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dMb2FkZXIoXCJDb25zdWx0YW5kbyBJbmZvcm1hY2nDs25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9Db25zdWx0YXIgZWwgbm9tYnJlIGRlIGxhIGNpdWRhZCBtYXMgY2VyY2FuYVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9jYXRpb25TZXJ2aWNlLmdldE5lYXJCeSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLy9PYnRlbmVyIGVsIG5vbWJyZSBkZSBsYSBjdWlkYWQgbWFzIGNlcmNhbmFcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1c2NhZG9yU2VydmljZS5jb3VudHJ5ID0gdGhpcy5sb2NhdGlvblNlcnZpY2UuY291bnRyeTtcclxuICAgICAgICAgICAgICAgICAgICAvL0NvbnN1bHRhciBlbnZpYW5kbyBjb21vIHBhcsOhbWV0cm8gbGEgY2l1ZGFkXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UuZ2V0VW5pdmVyc2lkYWRDaXVkYWQoKS5zdWJzY3JpYmUodW5pdmVyc2lkYWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuaXZlcnNpZGFkaXRlbXMgPSB1bml2ZXJzaWRhZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93UmVzdWx0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vTW9zdHJhciBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dEaWFsb2coXCJTZSBoYSBwcm9kdWNpZG8gdW4gZXJyb3IuXCIsIFwiRXJyb3IgZGUgY29tdW5pY2FjacOzbiBjb24gZWwgc2Vydmlkb3IuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiQnVzY2FyIGVuIHRvZG8gZWwgbXVuZG9cIjpcclxuICAgICAgICAgICAgICAgICAgICAvL0NvbnN1bHRhciBsYXMgdW5pdmVyc2lkYWRlcyBwb3Igbm9tYnJlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRBbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiQ2FuY2VsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09IEFjY2lvbmVzIGEgcmVhbGl6YXIgYWwgcHJlc2lvbmFyIGVudGVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgb25SZXR1cm4oYXJnczogRXZlbnREYXRhKSB7XHJcbiAgICAgICAgLy9WZXJpZmljYXIgcXVlIGVsIGJ1c2NhZG8gbm8gc2VhIHZhY8Otb1xyXG4gICAgICAgIGlmICghdGhpcy52YWxpZGFyQnVzY2Fkb3IoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdldEFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59O1xyXG4iXX0=