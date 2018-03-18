"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var nativescript_geolocation_1 = require("nativescript-geolocation");
var enums_1 = require("ui/enums");
var LocationService = /** @class */ (function () {
    /*================================================================
                        CONSTRCTOR
    ==================================================================*/
    function LocationService(http) {
        this.http = http;
        this.latitud = ""; //= "40.6643";
        this.longitud = ""; //= "-73.9385";
        this.country = ""; // United States
        this.username = "ljmarquezg";
        // this.locationError = "";
        this.locationStatus = false;
        this.errorStatus = false;
        this.errorText = "";
    }
    /*================================================================
                        FUNCIONES
    ==================================================================*/
    /*==================== Verificar Acceso a GPS ===============================*/
    LocationService.prototype.permitirLocalizacion = function () {
        var _this = this;
        var timer = require("timer");
        //Definir el estado del GPS como falso
        this.locationStatus = false;
        //Crear una vatiable booleana para manejar el estado del GPS
        var status = false;
        this.errorStatus = false;
        this.errorText = "";
        //Definir un tiempo máximo de espera para obtener ubicación en 60segundos
        var totalTime = 60;
        if (!nativescript_geolocation_1.isEnabled()) {
            nativescript_geolocation_1.enableLocationRequest().then(function () {
                //Mostrar mensaje al usuario de busqueda de ubicación del GPS     
                //Iniciar función contador regresivo el cual se repetirá cada 1000 milisegundos (1segundo)
                var countdown = timer.setInterval(function () {
                    //Mostrar mensaje en pantalla
                    _this.errorText = "Calculando su ubicación. Espere " + totalTime + " segundos.";
                    //Verificar que el contador no sea menor a cero
                    if (--totalTime < 0) {
                        //Detener el contador
                        timer.clearInterval(countdown);
                        //Definir el status como falso
                        _this.errorText = "";
                        status = false;
                    }
                }, 1000);
                //Definir el estado de la localización como verdadero
                _this.locationStatus = true;
                status = _this.myLocation();
                console.log('Se ha activado la localización!');
            }, function (err) {
                //Si existe un error, limpiar las coordenadas guardadas
                _this.latitud = "";
                _this.longitud = "";
                //Definir el estado del GPS como falso
                _this.locationStatus = false;
                //Definir el estado del error como verdadero
                _this.errorStatus = true;
                //Mostrar mensaje en pantalla
                _this.errorText = 'GPS apagado';
                //Definir el estado como falso
                status = false;
                //Mostrar mensaje en cónsola
                console.log('Error al activar localización', err);
            });
        }
        else {
            //Definir el estado del GPS como verdadero
            this.locationStatus = true;
            //Definir el mensaje a mostrar
            this.errorText = "Calculando su ubicación";
            //Obtener el resultado de la localización del dispositivo
            status = this.myLocation();
            //Mostrar mensaje en cónsola
            console.log('Localización Activada');
        }
        //detener el contador
        timer.clearInterval(this.country);
        //Devolver el estado actual al componente para ser validado
        return status;
    };
    LocationService.prototype.myLocation = function () {
        var _this = this;
        var status;
        //Obtener la localización actual enviando como parámetro una ubicación precisa y un tiempo de respuesta de 60 segundos
        nativescript_geolocation_1.getCurrentLocation({ desiredAccuracy: enums_1.Accuracy.high, timeout: 60000 }) //, maximumAge: 5000, 
            .then(function (location) {
            _this.latitud = location.latitude.toString();
            _this.longitud = location.longitude.toString();
            //Consultar el nombre de la ciudad mas cercana utilizando los valores de las coordenadas recibidas
            _this.getNearBy();
            status = true;
        }, function (err) {
            //Activar el estado de error en el dispositivo
            _this.errorStatus = true;
            _this.errorText = "Error al obtener información del GPS. " + err;
            console.log(_this.errorText + err);
            status = false;
        });
        return status;
    };
    LocationService.prototype.getNearBy = function () {
        var _this = this;
        //Inicializar la variable de estatus de error
        this.errorStatus = false;
        this.errorText = "";
        //Verificar que exista una latitud y longitud
        if (this.latitud === "" || this.longitud === "") {
            //Mostrar mensaje de error
            this.errorStatus = true;
            //Definir el mensaje de error
            this.errorText = "Error al obtener coordenadas de su posición. ";
            console.log(this.errorText);
        }
        //Verificar que no exista información sobre el nombre del país
        if (this.country === "") {
            //Definir la url de la base de datos enviando como parámetros el nombre del usuario creado y las coordenadas obtenidas por el GPS del dispositivo
            this.url = "http://api.geonames.org/findNearbyPlaceNameJSON?username=" + this.username + "&lat=" + this.latitud + "&lng=" + this.longitud;
            //Obtener la información desde el servidor
            this.http.get(this.url)
                .map(function (response) { return response.json(); })
                .subscribe(function (country) {
                //Definir el nombre obtenido desde la base de datos
                _this.country = country.geonames[0].countryName;
            }, function (err) {
                //Definir estado de error como verdadero
                _this.errorStatus = true;
                //Definir mensaje de error
                _this.errorText = "Error al obtener el nombre de su ubicación. Verifique su conexión a internet ";
                ;
                console.log(_this.errorText);
            });
        }
        //Si no existe errores mostrar la información obtenida en cónsola.
        if (!this.errorStatus) {
            console.log("País: " + this.country);
            console.log("Latitud: " + this.latitud);
            console.log("Longitud: " + this.longitud);
        }
    };
    LocationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], LocationService);
    return LocationService;
}());
exports.LocationService = LocationService;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb24uc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2NhdGlvbi5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBcUM7QUFDckMsaUNBQStCO0FBRy9CLHFFQUFxSTtBQUNySSxrQ0FBb0M7QUFLcEM7SUFlSTs7d0VBRW9FO0lBQ3BFLHlCQUFtQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQVo3QixZQUFPLEdBQVcsRUFBRSxDQUFDLENBQUMsY0FBYztRQUNwQyxhQUFRLEdBQVcsRUFBRSxDQUFDLENBQUMsZUFBZTtRQUN0QyxZQUFPLEdBQVcsRUFBRSxDQUFDLENBQUUsZ0JBQWdCO1FBQ3ZDLGFBQVEsR0FBVyxZQUFZLENBQUM7UUFVNUIsMkJBQTJCO1FBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFBO0lBQ3ZCLENBQUM7SUFDRDs7d0VBRW9FO0lBQ3BFLCtFQUErRTtJQUMvRSw4Q0FBb0IsR0FBcEI7UUFBQSxpQkEyREM7UUExREcsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLHNDQUFzQztRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1Qiw0REFBNEQ7UUFDNUQsSUFBSSxNQUFNLEdBQVksS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLHlFQUF5RTtRQUN6RSxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxvQ0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2YsZ0RBQXFCLEVBQUUsQ0FBQyxJ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LEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7WUFDbkQsQ0FBQyxFQUFFLFVBQUEsR0FBRztnQkFDRix3Q0FBd0M7Z0JBQ3hDLEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN4QiwwQkFBMEI7Z0JBQzFCLEtBQUksQ0FBQyxTQUFTLEdBQUcsK0VBQStFLENBQUM7Z0JBQUEsQ0FBQztnQkFDbEcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUE7UUFDVixDQUFDO1FBQ0Qsa0VBQWtFO1FBQ2xFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDN0MsQ0FBQztJQUNMLENBQUM7SUFsSlEsZUFBZTtRQUYzQixpQkFBVSxFQUFFO3lDQW9CZ0IsV0FBSTtPQWxCcEIsZUFBZSxDQW1KM0I7SUFBRCxzQkFBQztDQUFBLEFBbkpELElBbUpDO0FBbkpZLDBDQUFlO0FBbUozQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL21hcFwiO1xyXG4vL0NvbXBvbmVudGVzIEdlb2xvY2FsaXphY2nDs25cclxuaW1wb3J0IHsgcmVnaXN0ZXJFbGVtZW50IH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XHJcbmltcG9ydCB7IGlzRW5hYmxlZCwgZW5hYmxlTG9jYXRpb25SZXF1ZXN0LCBnZXRDdXJyZW50TG9jYXRpb24sIHdhdGNoTG9jYXRpb24sIGRpc3RhbmNlLCBjbGVhcldhdGNoIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1nZW9sb2NhdGlvblwiO1xyXG5pbXBvcnQgeyBBY2N1cmFjeSB9IGZyb20gXCJ1aS9lbnVtc1wiO1xyXG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gJ3VpL2RpYWxvZ3MnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5cclxuZXhwb3J0IGNsYXNzIExvY2F0aW9uU2VydmljZSB7XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgICAgICAgICAgICBERUZJTklDScOTTiBERSBWQVJJQUJMRVMgXHJcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLSAgU3RyaW5nICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgdXJsOiBzdHJpbmc7XHJcbiAgICBsYXRpdHVkOiBzdHJpbmcgPSBcIlwiOyAvLz0gXCI0MC42NjQzXCI7XHJcbiAgICBsb25naXR1ZDogc3RyaW5nID0gXCJcIjsgLy89IFwiLTczLjkzODVcIjtcclxuICAgIGNvdW50cnk6IHN0cmluZyA9IFwiXCI7ICAvLyBVbml0ZWQgU3RhdGVzXHJcbiAgICB1c2VybmFtZTogc3RyaW5nID0gXCJsam1hcnF1ZXpnXCI7XHJcbiAgICAvLyBsb2NhdGlvbkVycm9yOiBzdHJpbmc7XHJcbiAgICBlcnJvclRleHQ6IHN0cmluZztcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0gIEJvb2xlbmFzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGxvY2F0aW9uU3RhdHVzOiBib29sZWFuO1xyXG4gICAgZXJyb3JTdGF0dXM6IGJvb2xlYW47XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgICAgICAgICAgICAgICAgICAgQ09OU1RSQ1RPUlxyXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBodHRwOiBIdHRwKSB7XHJcbiAgICAgICAgLy8gdGhpcy5sb2NhdGlvbkVycm9yID0gXCJcIjtcclxuICAgICAgICB0aGlzLmxvY2F0aW9uU3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lcnJvclN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZXJyb3JUZXh0ID0gXCJcIlxyXG4gICAgfVxyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZVTkNJT05FU1xyXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gVmVyaWZpY2FyIEFjY2VzbyBhIEdQUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIHBlcm1pdGlyTG9jYWxpemFjaW9uKCkge1xyXG4gICAgICAgIGNvbnN0IHRpbWVyID0gcmVxdWlyZShcInRpbWVyXCIpO1xyXG4gICAgICAgIC8vRGVmaW5pciBlbCBlc3RhZG8gZGVsIEdQUyBjb21vIGZhbHNvXHJcbiAgICAgICAgdGhpcy5sb2NhdGlvblN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgIC8vQ3JlYXIgdW5hIHZhdGlhYmxlIGJvb2xlYW5hIHBhcmEgbWFuZWphciBlbCBlc3RhZG8gZGVsIEdQU1xyXG4gICAgICAgIGxldCBzdGF0dXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVycm9yU3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lcnJvclRleHQgPSBcIlwiO1xyXG4gICAgICAgIC8vRGVmaW5pciB1biB0aWVtcG8gbcOheGltbyBkZSBlc3BlcmEgcGFyYSBvYnRlbmVyIHViaWNhY2nDs24gZW4gNjBzZWd1bmRvc1xyXG4gICAgICAgIGxldCB0b3RhbFRpbWUgPSA2MDtcclxuICAgICAgICBpZiAoIWlzRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgICAgIGVuYWJsZUxvY2F0aW9uUmVxdWVzdCgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy9Nb3N0cmFyIG1lbnNhamUgYWwgdXN1YXJpbyBkZSBidXNxdWVkYSBkZSB1YmljYWNpw7NuIGRlbCBHUFMgICAgIFxyXG4gICAgICAgICAgICAgICAgLy9JbmljaWFyIGZ1bmNpw7NuIGNvbnRhZG9yIHJlZ3Jlc2l2byBlbCBjdWFsIHNlIHJlcGV0aXLDoSBjYWRhIDEwMDAgbWlsaXNlZ3VuZG9zICgxc2VndW5kbylcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50ZG93biA9IHRpbWVyLnNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvL01vc3RyYXIgbWVuc2FqZSBlbiBwYW50YWxsYVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JUZXh0ID0gXCJDYWxjdWxhbmRvIHN1IHViaWNhY2nDs24uIEVzcGVyZSBcIiArIHRvdGFsVGltZSArIFwiIHNlZ3VuZG9zLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVmVyaWZpY2FyIHF1ZSBlbCBjb250YWRvciBubyBzZWEgbWVub3IgYSBjZXJvXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0tdG90YWxUaW1lIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0RldGVuZXIgZWwgY29udGFkb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXIuY2xlYXJJbnRlcnZhbChjb3VudGRvd24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vRGVmaW5pciBlbCBzdGF0dXMgY29tbyBmYWxzb1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgLy9EZWZpbmlyIGVsIGVzdGFkbyBkZSBsYSBsb2NhbGl6YWNpw7NuIGNvbW8gdmVyZGFkZXJvXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2F0aW9uU3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHN0YXR1cyA9IHRoaXMubXlMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlIGhhIGFjdGl2YWRvIGxhIGxvY2FsaXphY2nDs24hJyk7XHJcbiAgICAgICAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgICAgICAgICAvL1NpIGV4aXN0ZSB1biBlcnJvciwgbGltcGlhciBsYXMgY29vcmRlbmFkYXMgZ3VhcmRhZGFzXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhdGl0dWQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb25naXR1ZCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAvL0RlZmluaXIgZWwgZXN0YWRvIGRlbCBHUFMgY29tbyBmYWxzb1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhdGlvblN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLy9EZWZpbmlyIGVsIGVzdGFkbyBkZWwgZXJyb3IgY29tbyB2ZXJkYWRlcm9cclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JTdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy9Nb3N0cmFyIG1lbnNhamUgZW4gcGFudGFsbGFcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JUZXh0ID0gJ0dQUyBhcGFnYWRvJztcclxuICAgICAgICAgICAgICAgIC8vRGVmaW5pciBlbCBlc3RhZG8gY29tbyBmYWxzb1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAvL01vc3RyYXIgbWVuc2FqZSBlbiBjw7Nuc29sYVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGFsIGFjdGl2YXIgbG9jYWxpemFjacOzbicsIGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vRGVmaW5pciBlbCBlc3RhZG8gZGVsIEdQUyBjb21vIHZlcmRhZGVyb1xyXG4gICAgICAgICAgICB0aGlzLmxvY2F0aW9uU3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy9EZWZpbmlyIGVsIG1lbnNhamUgYSBtb3N0cmFyXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JUZXh0ID0gXCJDYWxjdWxhbmRvIHN1IHViaWNhY2nDs25cIlxyXG4gICAgICAgICAgICAvL09idGVuZXIgZWwgcmVzdWx0YWRvIGRlIGxhIGxvY2FsaXphY2nDs24gZGVsIGRpc3Bvc2l0aXZvXHJcbiAgICAgICAgICAgIHN0YXR1cyA9IHRoaXMubXlMb2NhdGlvbigpXHJcbiAgICAgICAgICAgIC8vTW9zdHJhciBtZW5zYWplIGVuIGPDs25zb2xhXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdMb2NhbGl6YWNpw7NuIEFjdGl2YWRhJylcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9kZXRlbmVyIGVsIGNvbnRhZG9yXHJcbiAgICAgICAgdGltZXIuY2xlYXJJbnRlcnZhbCh0aGlzLmNvdW50cnkpXHJcbiAgICAgICAgLy9EZXZvbHZlciBlbCBlc3RhZG8gYWN0dWFsIGFsIGNvbXBvbmVudGUgcGFyYSBzZXIgdmFsaWRhZG9cclxuICAgICAgICByZXR1cm4gc3RhdHVzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBteUxvY2F0aW9uKCkge1xyXG4gICAgICAgIGxldCBzdGF0dXM6IGJvb2xlYW47XHJcbiAgICAgICAgLy9PYnRlbmVyIGxhIGxvY2FsaXphY2nDs24gYWN0dWFsIGVudmlhbmRvIGNvbW8gcGFyw6FtZXRybyB1bmEgdWJpY2FjacOzbiBwcmVjaXNhIHkgdW4gdGllbXBvIGRlIHJlc3B1ZXN0YSBkZSA2MCBzZWd1bmRvc1xyXG4gICAgICAgIGdldEN1cnJlbnRMb2NhdGlvbih7IGRlc2lyZWRBY2N1cmFjeTogQWNjdXJhY3kuaGlnaCwgdGltZW91dDogNjAwMDAgfSkvLywgbWF4aW11bUFnZTogNTAwMCwgXHJcbiAgICAgICAgICAgIC50aGVuKGxvY2F0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGF0aXR1ZCA9IGxvY2F0aW9uLmxhdGl0dWRlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvbmdpdHVkID0gbG9jYXRpb24ubG9uZ2l0dWRlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAvL0NvbnN1bHRhciBlbCBub21icmUgZGUgbGEgY2l1ZGFkIG1hcyBjZXJjYW5hIHV0aWxpemFuZG8gbG9zIHZhbG9yZXMgZGUgbGFzIGNvb3JkZW5hZGFzIHJlY2liaWRhc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXROZWFyQnkoKVxyXG4gICAgICAgICAgICAgICAgc3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIC8vQWN0aXZhciBlbCBlc3RhZG8gZGUgZXJyb3IgZW4gZWwgZGlzcG9zaXRpdm9cclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JTdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvclRleHQgPSBcIkVycm9yIGFsIG9idGVuZXIgaW5mb3JtYWNpw7NuIGRlbCBHUFMuIFwiICsgZXJyXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmVycm9yVGV4dCArIGVycik7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSBmYWxzZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzdGF0dXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TmVhckJ5KCkge1xyXG4gICAgICAgIC8vSW5pY2lhbGl6YXIgbGEgdmFyaWFibGUgZGUgZXN0YXR1cyBkZSBlcnJvclxyXG4gICAgICAgIHRoaXMuZXJyb3JTdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmVycm9yVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgLy9WZXJpZmljYXIgcXVlIGV4aXN0YSB1bmEgbGF0aXR1ZCB5IGxvbmdpdHVkXHJcbiAgICAgICAgaWYgKHRoaXMubGF0aXR1ZCA9PT0gXCJcIiB8fCB0aGlzLmxvbmdpdHVkID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIC8vTW9zdHJhciBtZW5zYWplIGRlIGVycm9yXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JTdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAvL0RlZmluaXIgZWwgbWVuc2FqZSBkZSBlcnJvclxyXG4gICAgICAgICAgICB0aGlzLmVycm9yVGV4dCA9IFwiRXJyb3IgYWwgb2J0ZW5lciBjb29yZGVuYWRhcyBkZSBzdSBwb3NpY2nDs24uIFwiXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZXJyb3JUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9WZXJpZmljYXIgcXVlIG5vIGV4aXN0YSBpbmZvcm1hY2nDs24gc29icmUgZWwgbm9tYnJlIGRlbCBwYcOtc1xyXG4gICAgICAgIGlmICh0aGlzLmNvdW50cnkgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgLy9EZWZpbmlyIGxhIHVybCBkZSBsYSBiYXNlIGRlIGRhdG9zIGVudmlhbmRvIGNvbW8gcGFyw6FtZXRyb3MgZWwgbm9tYnJlIGRlbCB1c3VhcmlvIGNyZWFkbyB5IGxhcyBjb29yZGVuYWRhcyBvYnRlbmlkYXMgcG9yIGVsIEdQUyBkZWwgZGlzcG9zaXRpdm9cclxuICAgICAgICAgICAgdGhpcy51cmwgPSBcImh0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2ZpbmROZWFyYnlQbGFjZU5hbWVKU09OP3VzZXJuYW1lPVwiICsgdGhpcy51c2VybmFtZSArIFwiJmxhdD1cIiArIHRoaXMubGF0aXR1ZCArIFwiJmxuZz1cIiArIHRoaXMubG9uZ2l0dWQ7XHJcbiAgICAgICAgICAgIC8vT2J0ZW5lciBsYSBpbmZvcm1hY2nDs24gZGVzZGUgZWwgc2Vydmlkb3JcclxuICAgICAgICAgICAgdGhpcy5odHRwLmdldCh0aGlzLnVybClcclxuICAgICAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShjb3VudHJ5ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvL0RlZmluaXIgZWwgbm9tYnJlIG9idGVuaWRvIGRlc2RlIGxhIGJhc2UgZGUgZGF0b3NcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnkgPSBjb3VudHJ5Lmdlb25hbWVzWzBdLmNvdW50cnlOYW1lO1xyXG4gICAgICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvL0RlZmluaXIgZXN0YWRvIGRlIGVycm9yIGNvbW8gdmVyZGFkZXJvXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvclN0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9EZWZpbmlyIG1lbnNhamUgZGUgZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yVGV4dCA9IFwiRXJyb3IgYWwgb2J0ZW5lciBlbCBub21icmUgZGUgc3UgdWJpY2FjacOzbi4gVmVyaWZpcXVlIHN1IGNvbmV4acOzbiBhIGludGVybmV0IFwiOztcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmVycm9yVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL1NpIG5vIGV4aXN0ZSBlcnJvcmVzIG1vc3RyYXIgbGEgaW5mb3JtYWNpw7NuIG9idGVuaWRhIGVuIGPDs25zb2xhLlxyXG4gICAgICAgIGlmICghdGhpcy5lcnJvclN0YXR1cykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhw61zOiBcIiArIHRoaXMuY291bnRyeSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTGF0aXR1ZDogXCIgKyB0aGlzLmxhdGl0dWQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvbmdpdHVkOiBcIiArIHRoaXMubG9uZ2l0dWQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuIl19