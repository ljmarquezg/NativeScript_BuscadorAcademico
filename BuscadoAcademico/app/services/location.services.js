"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var nativescript_geolocation_1 = require("nativescript-geolocation");
var enums_1 = require("ui/enums");
var buscador_services_1 = require("../services/buscador.services");
var LocationService = /** @class */ (function () {
    function LocationService(http, buscadorService) {
        this.http = http;
        this.buscadorService = buscadorService;
        this.latitud = ""; //= "40.6643";
        this.longitud = ""; //= "-73.9385";
        this.country = "";
        this.username = "ljmarquezg";
        this.locationError = "";
        this.locationStatus = false;
    }
    /*==================== Verificar Acceso a GPS ===============================*/
    LocationService.prototype.permitirLocalizacion = function () {
        var _this = this;
        this.locationStatus = false;
        var status = false;
        if (!nativescript_geolocation_1.isEnabled()) {
            nativescript_geolocation_1.enableLocationRequest().then(function () {
                console.log('Se ha activado la localización!');
                _this.locationError = "";
                _this.locationStatus = true;
                _this.myLocation();
                status = true;
            }, function (err) {
                console.log('Error al activar localización', err);
                _this.locationStatus = false;
                _this.locationError = err;
                status = false;
            });
        }
        else {
            console.log('Localización Activada');
            this.locationError = "";
            this.locationStatus = true;
            status = true;
        }
        this.myLocation();
        return status;
    };
    LocationService.prototype.myLocation = function () {
        var _this = this;
        nativescript_geolocation_1.getCurrentLocation({ desiredAccuracy: enums_1.Accuracy.high, maximumAge: 5000, timeout: 10000 })
            .then(function (location) {
            _this.latitud = location.latitude.toString();
            _this.longitud = location.longitude.toString();
            _this.getNearBy();
        }, function (err) {
            console.log('Error: ' + err.message);
        });
    };
    LocationService.prototype.getNearBy = function () {
        var _this = this;
        this.url = "http://api.geonames.org/findNearbyPlaceNameJSON?username=" + this.username + "&lat=" + this.latitud + "&lng=" + this.longitud;
        this.http.get(this.url)
            .map(function (response) { return response.json(); })
            .subscribe(function (country) {
            _this.country = country.geonames[0].countryName;
            _this.buscadorService.country = country;
        });
        console.log("País: " + this.country);
        console.log("Latitud: " + this.latitud);
        console.log("Longitud: " + this.longitud);
    };
    LocationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, buscador_services_1.BuscadorService])
    ], LocationService);
    return LocationService;
}());
exports.LocationService = LocationService;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb24uc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2NhdGlvbi5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBcUM7QUFDckMsaUNBQStCO0FBRy9CLHFFQUFxSTtBQUNySSxrQ0FBb0M7QUFDcEMsbUVBQWdFO0FBSWhFO0lBUUkseUJBQW1CLElBQVUsRUFBVSxlQUFnQztRQUFwRCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBTnZFLFlBQU8sR0FBVyxFQUFFLENBQUMsQ0FBQyxjQUFjO1FBQ3BDLGFBQVEsR0FBVyxFQUFFLENBQUMsQ0FBQyxlQUFlO1FBQ3RDLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsYUFBUSxHQUFXLFlBQVksQ0FBQztRQUk1QixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUNoQyxDQUFDO0lBRUQsK0VBQStFO0lBQy9FLDhDQUFvQixHQUFwQjtRQUFBLGlCQXdCQztRQXZCRyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxvQ0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2YsZ0RBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztnQkFDL0MsS0FBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7Z0JBQ3hCLEtBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xCLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbEIsQ0FBQyxFQUFFLFVBQUEsR0FBRztnQkFDRixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRCxLQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztnQkFDNUIsS0FBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7Z0JBQ3pCLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUE7WUFDcEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFDM0IsTUFBTSxHQUFHLElBQUksQ0FBQTtRQUNqQixDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUdELG9DQUFVLEdBQVY7UUFBQSxpQkFTQztRQVJHLDZDQUFrQixDQUFDLEVBQUUsZUFBZSxFQUFFLGdCQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO2FBQ25GLElBQUksQ0FBQyxVQUFBLFFBQVE7WUFDVixLQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDNUMsS0FBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzlDLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUNwQixDQUFDLEVBQUUsVUFBQSxHQUFHO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFBO0lBQ1YsQ0FBQztJQUVELG1DQUFTLEdBQVQ7UUFBQSxpQkFXQztRQVZHLElBQUksQ0FBQyxHQUFHLEdBQUcsMkRBQTJELEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMxSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ2xCLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7YUFDaEMsU0FBUyxDQUFDLFVBQUEsT0FBTztZQUNkLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7WUFDL0MsS0FBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFBO1FBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDN0MsQ0FBQztJQS9EUSxlQUFlO1FBRjNCLGlCQUFVLEVBQUU7eUNBVWdCLFdBQUksRUFBMkIsbUNBQWU7T0FSOUQsZUFBZSxDQWdFM0I7SUFBRCxzQkFBQztDQUFBLEFBaEVELElBZ0VDO0FBaEVZLDBDQUFlO0FBZ0UzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL21hcFwiO1xyXG4vL0NvbXBvbmVudGVzIEdlb2xvY2FsaXphY2nDs25cclxuaW1wb3J0IHsgcmVnaXN0ZXJFbGVtZW50IH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XHJcbmltcG9ydCB7IGlzRW5hYmxlZCwgZW5hYmxlTG9jYXRpb25SZXF1ZXN0LCBnZXRDdXJyZW50TG9jYXRpb24sIHdhdGNoTG9jYXRpb24sIGRpc3RhbmNlLCBjbGVhcldhdGNoIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1nZW9sb2NhdGlvblwiO1xyXG5pbXBvcnQgeyBBY2N1cmFjeSB9IGZyb20gXCJ1aS9lbnVtc1wiO1xyXG5pbXBvcnQgeyBCdXNjYWRvclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9idXNjYWRvci5zZXJ2aWNlcyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcblxyXG5leHBvcnQgY2xhc3MgTG9jYXRpb25TZXJ2aWNlIHtcclxuICAgIHVybDogc3RyaW5nO1xyXG4gICAgbGF0aXR1ZDogc3RyaW5nID0gXCJcIjsgLy89IFwiNDAuNjY0M1wiO1xyXG4gICAgbG9uZ2l0dWQ6IHN0cmluZyA9IFwiXCI7IC8vPSBcIi03My45Mzg1XCI7XHJcbiAgICBjb3VudHJ5OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgdXNlcm5hbWU6IHN0cmluZyA9IFwibGptYXJxdWV6Z1wiO1xyXG4gICAgbG9jYXRpb25TdGF0dXM6IGJvb2xlYW47XHJcbiAgICBsb2NhdGlvbkVycm9yOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaHR0cDogSHR0cCwgcHJpdmF0ZSBidXNjYWRvclNlcnZpY2U6IEJ1c2NhZG9yU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMubG9jYXRpb25FcnJvciA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5sb2NhdGlvblN0YXR1cyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qPT09PT09PT09PT09PT09PT09PT0gVmVyaWZpY2FyIEFjY2VzbyBhIEdQUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIHBlcm1pdGlyTG9jYWxpemFjaW9uKCkge1xyXG4gICAgICAgIHRoaXMubG9jYXRpb25TdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICBsZXQgc3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCFpc0VuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBlbmFibGVMb2NhdGlvblJlcXVlc3QoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZSBoYSBhY3RpdmFkbyBsYSBsb2NhbGl6YWNpw7NuIScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhdGlvbkVycm9yID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9jYXRpb25TdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5teUxvY2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9LCBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGFsIGFjdGl2YXIgbG9jYWxpemFjacOzbicsIGVycik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2F0aW9uU3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2F0aW9uRXJyb3IgPSBlcnI7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0xvY2FsaXphY2nDs24gQWN0aXZhZGEnKVxyXG4gICAgICAgICAgICB0aGlzLmxvY2F0aW9uRXJyb3IgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2F0aW9uU3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgICAgc3RhdHVzID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm15TG9jYXRpb24oKTtcclxuICAgICAgICByZXR1cm4gc3RhdHVzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBteUxvY2F0aW9uKCkge1xyXG4gICAgICAgIGdldEN1cnJlbnRMb2NhdGlvbih7IGRlc2lyZWRBY2N1cmFjeTogQWNjdXJhY3kuaGlnaCwgbWF4aW11bUFnZTogNTAwMCwgdGltZW91dDogMTAwMDAgfSlcclxuICAgICAgICAgICAgLnRoZW4obG9jYXRpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXRpdHVkID0gbG9jYXRpb24ubGF0aXR1ZGUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9uZ2l0dWQgPSBsb2NhdGlvbi5sb25naXR1ZGUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0TmVhckJ5KClcclxuICAgICAgICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyArIGVyci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBnZXROZWFyQnkoKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSBcImh0dHA6Ly9hcGkuZ2VvbmFtZXMub3JnL2ZpbmROZWFyYnlQbGFjZU5hbWVKU09OP3VzZXJuYW1lPVwiICsgdGhpcy51c2VybmFtZSArIFwiJmxhdD1cIiArIHRoaXMubGF0aXR1ZCArIFwiJmxuZz1cIiArIHRoaXMubG9uZ2l0dWQ7XHJcbiAgICAgICAgdGhpcy5odHRwLmdldCh0aGlzLnVybClcclxuICAgICAgICAgICAgLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoY291bnRyeSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50cnkgPSBjb3VudHJ5Lmdlb25hbWVzWzBdLmNvdW50cnlOYW1lO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idXNjYWRvclNlcnZpY2UuY291bnRyeSA9IGNvdW50cnk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJQYcOtczogXCIgKyB0aGlzLmNvdW50cnkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTGF0aXR1ZDogXCIgKyB0aGlzLmxhdGl0dWQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTG9uZ2l0dWQ6IFwiICsgdGhpcy5sb25naXR1ZClcclxuICAgIH1cclxufTtcclxuXHJcbiJdfQ==