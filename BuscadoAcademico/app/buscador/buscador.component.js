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
        this.iconHide = String.fromCharCode(0xea10);
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
    BuscadorComponent.prototype.ngOnInit = function () {
        //Personalización de estilos
        this.page.backgroundColor = new color_1.Color("#eeeeee");
        //Permitir Acceso al GPS
        //this.permitirLocalizacion();
    };
    /*==================== Verificar si hay error ===============================*/
    BuscadorComponent.prototype.clearError = function () {
        if (this.error) {
            this.error = false;
        }
    };
    /*================== Convertir string en HTML ==============================*/
    BuscadorComponent.prototype.htmlFormat = function (string) {
        return string.replace(/ /g, "%20");
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
    BuscadorComponent.prototype.showResults = function () {
        this.toggleVisivility();
        this.totalItems = "Resultados Obtenidos:" + this.universidaditems.length;
        this.isLoading = false;
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
    /*==================== Verificar que el buscador no sea vacio ===============================*/
    BuscadorComponent.prototype.validarBuscador = function () {
        //Vaciar texto de resultados anteriores
        this.totalItems = "";
        //Enviar el valor del campo buscarTextField al servicio para consultar la base de datos
        var textField = this.page.getViewById("buscarTextField").text;
        //Convertir los espacios en formato HTML
        textField = this.htmlFormat(textField);
        this.buscadorService.universidad = textField;
        //Verificar que el campo no esté vacío
        if (textField === "") {
            this.error = true;
            return true;
        }
        return false;
    };
    BuscadorComponent.prototype.getAll = function () {
        var _this = this;
        //Mostrar ActivityIndicator
        this.busqueda = true;
        this.isLoading = true;
        this.buscadorService.getUniversidad().subscribe(function (respuesta) {
            //Asignar el arreglo de items a la variable universidaditems
            _this.universidaditems = respuesta;
            //Ocultar el ActivituIndicator
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
    BuscadorComponent.prototype.ubicarme = function () {
        var _this = this;
        this.busqueda = true;
        var dialogs = require('ui/dialogs');
        var options = {
            title: "Tu ubicación es: ",
            message: "Choose your race",
            cancelButtonText: "Cancel",
            actions: ["Buscar en mi ubicación", "Buscar en todo el mundo"]
        };
        dialogs.action(options).then(function (result) {
            console.log(result);
            if (result === "Buscar en mi ubicación") {
                _this.isLoading = true;
                // this.myLocation();
                //this.locationService.permitirLocalizacion();
                _this.locationService.getNearBy().subscribe(function (result) {
                    _this.buscadorService.country = _this.htmlFormat(result.geonames[0].countryName);
                    _this.buscadorService.getUniversidadCity().subscribe(function (universidad) {
                        _this.universidaditems = universidad;
                        _this.showResults();
                    }, function (err) {
                        _this.showDialog("Se ha producido un error.", err);
                    });
                }, function (err) {
                    _this.showDialog("Se ha producido un error.", err);
                });
                console.log('Abrir GPS');
            }
            if (result === "Buscar en todo el mundo") {
                _this.buscadorService.universidad = "";
                _this.getAll();
            }
        });
    };
    BuscadorComponent.prototype.onReturn = function (args) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVzY2Fkb3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVzY2Fkb3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlFO0FBR3pFLG9DQUFzQztBQUt0QyxnQ0FBK0I7QUFDL0IsK0JBQThCO0FBQzlCLFdBQVc7QUFDWCxtRUFBZ0U7QUFDaEUsbUVBQWdFO0FBUWhFO0lBcUJJOzt3RUFFb0U7SUFDcEUsMkJBQW9CLGVBQWdDLEVBQVUsSUFBVSxFQUFVLGVBQWdDO1FBQTlGLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQU07UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFYbEgsZUFBVSxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDaEQsYUFBUSxHQUFXLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFXM0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsMkJBQTJCLENBQUM7SUFDaEQsQ0FBQztJQUNEOzt3RUFFb0U7SUFFcEUsb0NBQVEsR0FBUjtRQUNJLDRCQUE0QjtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGFBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCx3QkFBd0I7UUFDeEIsOEJBQThCO0lBQ2xDLENBQUM7SUFDRCwrRUFBK0U7SUFDL0Usc0NBQVUsR0FBVjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENB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aWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSAnZGF0YS9vYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgQWN0aXZpdHlJbmRpY2F0b3IgfSBmcm9tIFwidWkvYWN0aXZpdHktaW5kaWNhdG9yXCI7XHJcbmltcG9ydCAqIGFzIGRpYWxvZ3MgZnJvbSBcInVpL2RpYWxvZ3NcIjtcclxuLy9Db21wb25lbnRlcyBkZSBlc3RpbG9zXHJcbmltcG9ydCB7IFRleHRGaWVsZCB9IGZyb20gJ3VpL3RleHQtZmllbGQnO1xyXG5pbXBvcnQgeyBBY3Rpb25CYXIsIEFjdGlvbkl0ZW0gfSBmcm9tICd1aS9hY3Rpb24tYmFyJztcclxuaW1wb3J0IHsgVmlldyB9IGZyb20gJ3VpL2NvcmUvdmlldydcclxuaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3VpL3BhZ2UnO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJ2NvbG9yJztcclxuLy9TZXJ2aWNpb3NcclxuaW1wb3J0IHsgQnVzY2Fkb3JTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvYnVzY2Fkb3Iuc2VydmljZXMnO1xyXG5pbXBvcnQgeyBMb2NhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9sb2NhdGlvbi5zZXJ2aWNlcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYnVzY2Fkb3InLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2J1c2NhZG9yLmNvbXBvbmVudC5odG1sJyxcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWRcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBCdXNjYWRvckNvbXBvbmVudCB7XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgICAgICAgICAgICBERUZJTklDScOTTiBERSBWQVJJQUJMRVMgXHJcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgQFZpZXdDaGlsZChcImVycm9yQ29udGFpbmVyXCIpIGVycm9yQ29udGFpbmVyOiBFbGVtZW50UmVmO1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLSAgU3RyaW5nICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgYXBwVGl0bGU6IHN0cmluZztcclxuICAgIGNpdWRhZDogc3RyaW5nO1xyXG4gICAgdGl0dWxvOiBzdHJpbmc7XHJcbiAgICB1bml2ZXJzaWRhZDogc3RyaW5nO1xyXG4gICAgdmlzaWJpbGl0eTogc3RyaW5nO1xyXG4gICAgdmlzaWJpbGl0eVRleHQ6IHN0cmluZztcclxuICAgIHRvdGFsSXRlbXM6IHN0cmluZztcclxuICAgIGljb25TZWFyY2g6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhlOTg3KVxyXG4gICAgaWNvbkhpZGU6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhlYTEwKTtcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0gIEFycmF5cyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHVuaXZlcnNpZGFkaXRlbXM6IEFycmF5PGFueT47XHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tICBCb29sZW5hcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBidXNxdWVkYTogYm9vbGVhbjtcclxuICAgIGlzTG9hZGluZzogYm9vbGVhbjtcclxuICAgIGVycm9yOiBib29sZWFuO1xyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENPTlNUUkNUT1JcclxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJ1c2NhZG9yU2VydmljZTogQnVzY2Fkb3JTZXJ2aWNlLCBwcml2YXRlIHBhZ2U6IFBhZ2UsIHByaXZhdGUgbG9jYXRpb25TZXJ2aWNlOiBMb2NhdGlvblNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmJ1c3F1ZWRhID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgdGhpcy52aXNpYmlsaXR5VGV4dCA9IHRoaXMuaWNvbkhpZGU7XHJcbiAgICAgICAgdGhpcy5hcHBUaXRsZSA9IFwiQnVzY2Fkb3IgZGUgdW5pdmVyc2lkYWRlc1wiO1xyXG4gICAgfVxyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZVTkNJT05FU1xyXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICAvL1BlcnNvbmFsaXphY2nDs24gZGUgZXN0aWxvc1xyXG4gICAgICAgIHRoaXMucGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSBuZXcgQ29sb3IoXCIjZWVlZWVlXCIpO1xyXG4gICAgICAgIC8vUGVybWl0aXIgQWNjZXNvIGFsIEdQU1xyXG4gICAgICAgIC8vdGhpcy5wZXJtaXRpckxvY2FsaXphY2lvbigpO1xyXG4gICAgfVxyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PSBWZXJpZmljYXIgc2kgaGF5IGVycm9yID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgY2xlYXJFcnJvcigpIHtcclxuICAgICAgICBpZiAodGhpcy5lcnJvcikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyo9PT09PT09PT09PT09PT09PT0gQ29udmVydGlyIHN0cmluZyBlbiBIVE1MID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICBodG1sRm9ybWF0KHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvIC9nLCBcIiUyMFwiKTtcclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gTW9zdHJhciB1IE9jdWx0YXIgcGFuZWwgZGUgYnVzcXVlZGEgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICB0b2dnbGVWaXNpdmlsaXR5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnZpc2liaWxpdHkgPT09IFwidmlzaWJsZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJpbGl0eSA9IFwiY29sbGFwc2VkXCI7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJpbGl0eVRleHQgPSB0aGlzLmljb25TZWFyY2g7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJpbGl0eVRleHQgPSB0aGlzLmljb25IaWRlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1Jlc3VsdHMoKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVWaXNpdmlsaXR5KCk7XHJcbiAgICAgICAgdGhpcy50b3RhbEl0ZW1zID0gXCJSZXN1bHRhZG9zIE9idGVuaWRvczpcIiArIHRoaXMudW5pdmVyc2lkYWRpdGVtcy5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93RGlhbG9nKHRpdGxlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIlwiICsgdGl0bGUgKyBcIlwiLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBcIlwiICsgbWVzc2FnZSArIFwiXCIsXHJcbiAgICAgICAgICAgIG9rQnV0dG9uVGV4dDogXCJPS1wiXHJcbiAgICAgICAgfTtcclxuICAgICAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpXHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gVmVyaWZpY2FyIHF1ZSBlbCBidXNjYWRvciBubyBzZWEgdmFjaW8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICB2YWxpZGFyQnVzY2Fkb3IoKSB7XHJcbiAgICAgICAgLy9WYWNpYXIgdGV4dG8gZGUgcmVzdWx0YWRvcyBhbnRlcmlvcmVzXHJcbiAgICAgICAgdGhpcy50b3RhbEl0ZW1zID0gXCJcIjtcclxuICAgICAgICAvL0VudmlhciBlbCB2YWxvciBkZWwgY2FtcG8gYnVzY2FyVGV4dEZpZWxkIGFsIHNlcnZpY2lvIHBhcmEgY29uc3VsdGFyIGxhIGJhc2UgZGUgZGF0b3NcclxuICAgICAgICBsZXQgdGV4dEZpZWxkID0gdGhpcy5wYWdlLmdldFZpZXdCeUlkPFRleHRGaWVsZD4oXCJidXNjYXJUZXh0RmllbGRcIikudGV4dDtcclxuICAgICAgICAvL0NvbnZlcnRpciBsb3MgZXNwYWNpb3MgZW4gZm9ybWF0byBIVE1MXHJcbiAgICAgICAgdGV4dEZpZWxkID0gdGhpcy5odG1sRm9ybWF0KHRleHRGaWVsZCk7XHJcbiAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UudW5pdmVyc2lkYWQgPSB0ZXh0RmllbGQ7XHJcbiAgICAgICAgLy9WZXJpZmljYXIgcXVlIGVsIGNhbXBvIG5vIGVzdMOpIHZhY8Otb1xyXG4gICAgICAgIGlmICh0ZXh0RmllbGQgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWxsKCkge1xyXG4gICAgICAgIC8vTW9zdHJhciBBY3Rpdml0eUluZGljYXRvclxyXG4gICAgICAgIHRoaXMuYnVzcXVlZGEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmJ1c2NhZG9yU2VydmljZS5nZXRVbml2ZXJzaWRhZCgpLnN1YnNjcmliZShyZXNwdWVzdGEgPT4ge1xyXG4gICAgICAgICAgICAvL0FzaWduYXIgZWwgYXJyZWdsbyBkZSBpdGVtcyBhIGxhIHZhcmlhYmxlIHVuaXZlcnNpZGFkaXRlbXNcclxuICAgICAgICAgICAgdGhpcy51bml2ZXJzaWRhZGl0ZW1zID0gcmVzcHVlc3RhO1xyXG4gICAgICAgICAgICAvL09jdWx0YXIgZWwgQWN0aXZpdHVJbmRpY2F0b3JcclxuICAgICAgICAgICAgaWYgKHJlc3B1ZXN0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG90YWxJdGVtcyA9IFwiU3UgY29uc3VsdGEgbm8gZ2VuZXLDsyByZXN1bHRhZG9zLiBJbnRlbnRlIG51ZXZhbWVudGVcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dSZXN1bHRzKClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LCBlcnIgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dEaWFsb2coXCJTZSBoYSBwcm9kdWNpZG8gdW4gZXJyb3IuXCIsIGVycilcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1YmljYXJtZSgpIHtcclxuICAgICAgICB0aGlzLmJ1c3F1ZWRhID0gdHJ1ZTtcclxuICAgICAgICB2YXIgZGlhbG9ncyA9IHJlcXVpcmUoJ3VpL2RpYWxvZ3MnKTtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IFwiVHUgdWJpY2FjacOzbiBlczogXCIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiQ2hvb3NlIHlvdXIgcmFjZVwiLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJCdXNjYXIgZW4gbWkgdWJpY2FjacOzblwiLCBcIkJ1c2NhciBlbiB0b2RvIGVsIG11bmRvXCJdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBkaWFsb2dzLmFjdGlvbihvcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gXCJCdXNjYXIgZW4gbWkgdWJpY2FjacOzblwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm15TG9jYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5sb2NhdGlvblNlcnZpY2UucGVybWl0aXJMb2NhbGl6YWNpb24oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9jYXRpb25TZXJ2aWNlLmdldE5lYXJCeSgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVzY2Fkb3JTZXJ2aWNlLmNvdW50cnkgPSB0aGlzLmh0bWxGb3JtYXQocmVzdWx0Lmdlb25hbWVzWzBdLmNvdW50cnlOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVzY2Fkb3JTZXJ2aWNlLmdldFVuaXZlcnNpZGFkQ2l0eSgpLnN1YnNjcmliZSh1bml2ZXJzaWRhZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5pdmVyc2lkYWRpdGVtcyA9IHVuaXZlcnNpZGFkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dSZXN1bHRzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93RGlhbG9nKFwiU2UgaGEgcHJvZHVjaWRvIHVuIGVycm9yLlwiLCBlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93RGlhbG9nKFwiU2UgaGEgcHJvZHVjaWRvIHVuIGVycm9yLlwiLCBlcnIpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0FicmlyIEdQUycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IFwiQnVzY2FyIGVuIHRvZG8gZWwgbXVuZG9cIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UudW5pdmVyc2lkYWQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRBbGwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUmV0dXJuKGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4gICAgICAgIGlmICghdGhpcy52YWxpZGFyQnVzY2Fkb3IoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdldEFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59O1xyXG4iXX0=