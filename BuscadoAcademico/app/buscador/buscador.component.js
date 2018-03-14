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
    /*==================== Mostrar Ccontador de resultados en pantalla ===============================*/
    BuscadorComponent.prototype.showResults = function () {
        this.totalItems = "Resultados Obtenidos:" + this.universidaditems.length;
        this.isLoading = false;
        // this.toggleVisivility();
    };
    BuscadorComponent.prototype.showDialog = function (title, message) {
        var options = {
            title: "" + title + "",
            message: "" + message + "",
            okButtonText: "OK"
        };
        dialogs.alert(options);
        this.isLoading = false;
    };
    BuscadorComponent.prototype.showLoader = function (message) {
        this.isLoading = true;
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
            if (respuesta.length === 0) {
                _this.totalItems = "Su consulta no generó resultados. Intente nuevamente";
                _this.isLoading = false;
            }
            else {
                _this.showResults();
            }
        }, function (err) {
            _this.showDialog("Se ha producido un error.", err);
        });
    };
    /*==================== Ubicar al usuario con el GPS del dispositivo ===============================*/
    BuscadorComponent.prototype.ubicarme = function () {
        var _this = this;
        this.showLoader("Obteniendo Localizacion");
        this.locationService.permitirLocalizacion();
        if (this.locationService.longitud === "" && this.locationService.latitud === "") {
            this.showDialog("Sin Localización", "Debe habilitar el servicio de geolocalización");
        }
        else {
            if (this.locationService.country === "") {
                console.log("No se ha localizado el dispositivo");
                this.isLoading = false;
            }
            else {
                this.showLoader("Consultando Información");
                var options = {
                    title: "Tu ubicación es: " + this.locationService.country,
                    message: "Selecciona filtro de búsqueda",
                    cancelButtonText: "Cancel",
                    actions: ["Buscar en mi ubicación", "Buscar en todo el mundo"]
                };
                dialogs.action(options).then(function (result) {
                    console.log(result);
                    var textField = _this.page.getViewById("buscarTextField").text;
                    switch (result) {
                        case "Buscar en mi ubicación":
                            _this.locationService.getNearBy();
                            _this.buscadorService.country = _this.locationService.country;
                            _this.buscadorService;
                            _this.buscadorService.universidad = textField;
                            if (_this.buscadorService.universidad === "") {
                                _this.buscadorService.universidad = "";
                            }
                            _this.buscadorService.getUniversidad().subscribe(function (universidad) {
                                _this.universidaditems = universidad;
                                _this.showResults();
                            }, function (err) {
                                _this.showDialog("Se ha producido un error.", err);
                            });
                            break;
                        case "Buscar en todo el mundo":
                            _this.buscadorService.universidad = textField;
                            _this.buscadorService.country = "";
                            if (_this.buscadorService.universidad === "") {
                                _this.buscadorService.universidad = "";
                            }
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
            }
            ;
        }
    };
    BuscadorComponent.prototype.onReturn = function (args) {
        if (!this.validarBuscador()) {
            this.buscadorService.country = "";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVzY2Fkb3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVzY2Fkb3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBR3pFLG9DQUFzQztBQUt0QyxnQ0FBK0I7QUFDL0IsK0JBQThCO0FBQzlCLFdBQVc7QUFDWCxtRUFBZ0U7QUFDaEUsbUVBQWdFO0FBUWhFO0lBdUJJOzt3RUFFb0U7SUFDcEUsMkJBQW9CLGVBQWdDLEVBQVUsSUFBVSxFQUFVLGVBQWdDO1FBQTlGLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFibEgsZUFBVSxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakQsYUFBUSxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsZUFBVSxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakQsWUFBTyxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFXMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsMkJBQTJCLENBQUM7SUFDaEQsQ0FBQztJQUNEOzt3RUFFb0U7SUFFcEUsb0NBQVEsR0FBUjtRQUNJLDRCQUE0QjtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGFBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FB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LEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDMUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzRCQUMxQyxDQUFDOzRCQUNELEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFDZCxLQUFLLENBQUM7d0JBRVYsS0FBSyxRQUFROzRCQUNULEtBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFBOzRCQUN0QixLQUFLLENBQUM7d0JBQ1Y7NEJBQ0ksS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7NEJBQ3RCLEtBQUssQ0FBQztvQkFDZCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUFBLENBQUM7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVELG9DQUFRLEdBQVIsVUFBUyxJQUFlO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLENBQUM7SUFDTCxDQUFDO0lBN0s0QjtRQUE1QixnQkFBUyxDQUFDLGdCQUFnQixDQUFDO2tDQUFpQixpQkFBVTs2REFBQztJQUovQyxpQkFBaUI7UUFON0IsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSwyQkFBMkI7WUFDeEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1NBQ3RCLENBQUM7eUNBNEJ1QyxtQ0FBZSxFQUFnQixXQUFJLEVBQTJCLG1DQUFlO09BMUJ6RyxpQkFBaUIsQ0FvTDdCO0lBQUQsd0JBQUM7Q0FBQSxBQXBMRCxJQW9MQztBQXBMWSw4Q0FBaUI7QUFvTDdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgRWxlbWVudFJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEV2ZW50RGF0YSB9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IEFjdGl2aXR5SW5kaWNhdG9yIH0gZnJvbSBcInVpL2FjdGl2aXR5LWluZGljYXRvclwiO1xyXG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ1aS9kaWFsb2dzXCI7XHJcbi8vQ29tcG9uZW50ZXMgZGUgZXN0aWxvc1xyXG5pbXBvcnQgeyBUZXh0RmllbGQgfSBmcm9tICd1aS90ZXh0LWZpZWxkJztcclxuaW1wb3J0IHsgQWN0aW9uQmFyLCBBY3Rpb25JdGVtIH0gZnJvbSAndWkvYWN0aW9uLWJhcic7XHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tICd1aS9jb3JlL3ZpZXcnXHJcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICd1aS9wYWdlJztcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICdjb2xvcic7XHJcbi8vU2VydmljaW9zXHJcbmltcG9ydCB7IEJ1c2NhZG9yU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2J1c2NhZG9yLnNlcnZpY2VzJztcclxuaW1wb3J0IHsgTG9jYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbG9jYXRpb24uc2VydmljZXMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2J1c2NhZG9yJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9idXNjYWRvci5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgQnVzY2Fkb3JDb21wb25lbnQge1xyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgICAgICAgICAgICAgICAgREVGSU5JQ0nDk04gREUgVkFSSUFCTEVTIFxyXG4gICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIEBWaWV3Q2hpbGQoXCJlcnJvckNvbnRhaW5lclwiKSBlcnJvckNvbnRhaW5lcjogRWxlbWVudFJlZjtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0gIFN0cmluZyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGFwcFRpdGxlOiBzdHJpbmc7XHJcbiAgICBjaXVkYWQ6IHN0cmluZztcclxuICAgIHRpdHVsbzogc3RyaW5nO1xyXG4gICAgdW5pdmVyc2lkYWQ6IHN0cmluZztcclxuICAgIHZpc2liaWxpdHk6IHN0cmluZztcclxuICAgIHZpc2liaWxpdHlUZXh0OiBzdHJpbmc7XHJcbiAgICB0b3RhbEl0ZW1zOiBzdHJpbmc7XHJcbiAgICBpY29uU2VhcmNoOiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZTk4Nyk7XHJcbiAgICBpY29uSGlkZTogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGVhNDIpO1xyXG4gICAgaWNvbkdwc09mZjogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGU5YjQpO1xyXG4gICAgaWNvbkdwczogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGU5NGMpO1xyXG4gICAgaXNMb2FkaW5nVGV4dDogU3RyaW5nO1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLSAgQXJyYXlzICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdW5pdmVyc2lkYWRpdGVtczogQXJyYXk8YW55PjtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0gIEJvb2xlbmFzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGlzTG9hZGluZzogYm9vbGVhbjtcclxuICAgIGVycm9yOiBib29sZWFuO1xyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENPTlNUUkNUT1JcclxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJ1c2NhZG9yU2VydmljZTogQnVzY2Fkb3JTZXJ2aWNlLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgbG9jYXRpb25TZXJ2aWNlOiBMb2NhdGlvblNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcclxuICAgICAgICB0aGlzLnZpc2liaWxpdHlUZXh0ID0gdGhpcy5pY29uSGlkZTtcclxuICAgICAgICB0aGlzLmFwcFRpdGxlID0gXCJCdXNjYWRvciBkZSB1bml2ZXJzaWRhZGVzXCI7XHJcbiAgICB9XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgRlVOQ0lPTkVTXHJcbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIC8vUGVyc29uYWxpemFjacOzbiBkZSBlc3RpbG9zXHJcbiAgICAgICAgdGhpcy5wYWdlLmJhY2tncm91bmRDb2xvciA9IG5ldyBDb2xvcihcIiNlZWVlZWVcIik7XHJcbiAgICAgICAgLy9QZXJtaXRpciBBY2Nlc28gYWwgR1BTXHJcbiAgICAgICAgdGhpcy5sb2NhdGlvblNlcnZpY2UucGVybWl0aXJMb2NhbGl6YWNpb24oKTtcclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gVmVyaWZpY2FyIHNpIGhheSBlcnJvciA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIGNsZWFyRXJyb3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gTW9zdHJhciB1IE9jdWx0YXIgcGFuZWwgZGUgYnVzcXVlZGEgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICB0b2dnbGVWaXNpdmlsaXR5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnZpc2liaWxpdHkgPT09IFwidmlzaWJsZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJpbGl0eSA9IFwiY29sbGFwc2VkXCI7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJpbGl0eVRleHQgPSB0aGlzLmljb25TZWFyY2g7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJpbGl0eVRleHQgPSB0aGlzLmljb25IaWRlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gTW9zdHJhciBDY29udGFkb3IgZGUgcmVzdWx0YWRvcyBlbiBwYW50YWxsYSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIHNob3dSZXN1bHRzKCkge1xyXG4gICAgICAgIHRoaXMudG90YWxJdGVtcyA9IFwiUmVzdWx0YWRvcyBPYnRlbmlkb3M6XCIgKyB0aGlzLnVuaXZlcnNpZGFkaXRlbXMubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgLy8gdGhpcy50b2dnbGVWaXNpdmlsaXR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0RpYWxvZyh0aXRsZSwgbWVzc2FnZSkge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICB0aXRsZTogXCJcIiArIHRpdGxlICsgXCJcIixcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJcIiArIG1lc3NhZ2UgKyBcIlwiLFxyXG4gICAgICAgICAgICBva0J1dHRvblRleHQ6IFwiT0tcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGlhbG9ncy5hbGVydChvcHRpb25zKVxyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBzaG93TG9hZGVyKG1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmdUZXh0ID0gbWVzc2FnZTtcclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gVmVyaWZpY2FyIHF1ZSBlbCBidXNjYWRvciBubyBzZWEgdmFjaW8gYWwgcHJlc2lvbmFyIGVudGVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgdmFsaWRhckJ1c2NhZG9yKCkge1xyXG4gICAgICAgIC8vVmFjaWFyIHRleHRvIGRlIHJlc3VsdGFkb3MgYW50ZXJpb3Jlc1xyXG4gICAgICAgIHRoaXMudG90YWxJdGVtcyA9IFwiXCI7XHJcbiAgICAgICAgLy9FbnZpYXIgZWwgdmFsb3IgZGVsIGNhbXBvIGJ1c2NhclRleHRGaWVsZCBhbCBzZXJ2aWNpbyBwYXJhIGNvbnN1bHRhciBsYSBiYXNlIGRlIGRhdG9zXHJcbiAgICAgICAgbGV0IHRleHRGaWVsZCA9IHRoaXMucGFnZS5nZXRWaWV3QnlJZDxUZXh0RmllbGQ+KFwiYnVzY2FyVGV4dEZpZWxkXCIpLnRleHQ7XHJcbiAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UudW5pdmVyc2lkYWQgPSB0ZXh0RmllbGQ7XHJcbiAgICAgICAgLy9WZXJpZmljYXIgcXVlIGVsIGNhbXBvIG5vIGVzdMOpIHZhY8Otb1xyXG4gICAgICAgIGlmICh0ZXh0RmllbGQgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09IFZlcmlmaWNhciBxdWUgZWwgYnVzY2Fkb3Igbm8gc2VhIHZhY2lvIGFsIHByZXNpb25hciBlbnRlciA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIGdldEFsbCgpIHtcclxuICAgICAgICAvL01vc3RyYXIgQWN0aXZpdHlJbmRpY2F0b3JcclxuICAgICAgICB0aGlzLnNob3dMb2FkZXIoXCJDb25zdWx0YW5kbyBJbmZvcm1hY2nDs25cIik7XHJcbiAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UuZ2V0VW5pdmVyc2lkYWQoKS5zdWJzY3JpYmUocmVzcHVlc3RhID0+IHtcclxuICAgICAgICAgICAgLy9Bc2lnbmFyIGVsIGFycmVnbG8gZGUgaXRlbXMgYSBsYSB2YXJpYWJsZSB1bml2ZXJzaWRhZGl0ZW1zXHJcbiAgICAgICAgICAgIHRoaXMudW5pdmVyc2lkYWRpdGVtcyA9IHJlc3B1ZXN0YTtcclxuICAgICAgICAgICAgaWYgKHJlc3B1ZXN0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG90YWxJdGVtcyA9IFwiU3UgY29uc3VsdGEgbm8gZ2VuZXLDsyByZXN1bHRhZG9zLiBJbnRlbnRlIG51ZXZhbWVudGVcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dSZXN1bHRzKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0RpYWxvZyhcIlNlIGhhIHByb2R1Y2lkbyB1biBlcnJvci5cIiwgZXJyKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PSBVYmljYXIgYWwgdXN1YXJpbyBjb24gZWwgR1BTIGRlbCBkaXNwb3NpdGl2byA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIHViaWNhcm1lKCkge1xyXG4gICAgICAgIHRoaXMuc2hvd0xvYWRlcihcIk9idGVuaWVuZG8gTG9jYWxpemFjaW9uXCIpO1xyXG4gICAgICAgIHRoaXMubG9jYXRpb25TZXJ2aWNlLnBlcm1pdGlyTG9jYWxpemFjaW9uKClcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubG9jYXRpb25TZXJ2aWNlLmxvbmdpdHVkID09PSBcIlwiICYmIHRoaXMubG9jYXRpb25TZXJ2aWNlLmxhdGl0dWQgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zaG93RGlhbG9nKFwiU2luIExvY2FsaXphY2nDs25cIiwgXCJEZWJlIGhhYmlsaXRhciBlbCBzZXJ2aWNpbyBkZSBnZW9sb2NhbGl6YWNpw7NuXCIpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubG9jYXRpb25TZXJ2aWNlLmNvdW50cnkgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gc2UgaGEgbG9jYWxpemFkbyBlbCBkaXNwb3NpdGl2b1wiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dMb2FkZXIoXCJDb25zdWx0YW5kbyBJbmZvcm1hY2nDs25cIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJUdSB1YmljYWNpw7NuIGVzOiBcIiArIHRoaXMubG9jYXRpb25TZXJ2aWNlLmNvdW50cnksXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJTZWxlY2Npb25hIGZpbHRybyBkZSBiw7pzcXVlZGFcIixcclxuICAgICAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IFtcIkJ1c2NhciBlbiBtaSB1YmljYWNpw7NuXCIsIFwiQnVzY2FyIGVuIHRvZG8gZWwgbXVuZG9cIl1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGRpYWxvZ3MuYWN0aW9uKG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRGaWVsZCA9IHRoaXMucGFnZS5nZXRWaWV3QnlJZDxUZXh0RmllbGQ+KFwiYnVzY2FyVGV4dEZpZWxkXCIpLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkJ1c2NhciBlbiBtaSB1YmljYWNpw7NuXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2F0aW9uU2VydmljZS5nZXROZWFyQnkoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UuY291bnRyeSA9IHRoaXMubG9jYXRpb25TZXJ2aWNlLmNvdW50cnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1c2NhZG9yU2VydmljZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UudW5pdmVyc2lkYWQgPSB0ZXh0RmllbGRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1c2NhZG9yU2VydmljZS51bml2ZXJzaWRhZCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVzY2Fkb3JTZXJ2aWNlLnVuaXZlcnNpZGFkID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVzY2Fkb3JTZXJ2aWNlLmdldFVuaXZlcnNpZGFkKCkuc3Vic2NyaWJlKHVuaXZlcnNpZGFkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuaXZlcnNpZGFkaXRlbXMgPSB1bml2ZXJzaWRhZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dSZXN1bHRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0RpYWxvZyhcIlNlIGhhIHByb2R1Y2lkbyB1biBlcnJvci5cIiwgZXJyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkJ1c2NhciBlbiB0b2RvIGVsIG11bmRvXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1c2NhZG9yU2VydmljZS51bml2ZXJzaWRhZCA9IHRleHRGaWVsZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UuY291bnRyeSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5idXNjYWRvclNlcnZpY2UudW5pdmVyc2lkYWQgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1c2NhZG9yU2VydmljZS51bml2ZXJzaWRhZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEFsbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQ2FuY2VsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblJldHVybihhcmdzOiBFdmVudERhdGEpIHtcclxuICAgICAgICBpZiAoIXRoaXMudmFsaWRhckJ1c2NhZG9yKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UuY291bnRyeSA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0QWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn07XHJcbiJdfQ==