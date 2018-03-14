"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var nativescript_geolocation_1 = require("nativescript-geolocation");
var enums_1 = require("ui/enums");
var LocationService = /** @class */ (function () {
    function LocationService(http) {
        this.http = http;
        this.latitud = "40.6643";
        this.longitud = "-73.9385";
        this.username = "ljmarquezg";
        //-------------- Variables localización ------------------
        this.miUbicacion = {
            latitud: 0,
            longitud: 0,
            zoom: 0,
            bearing: 0,
            tilt: 0,
            padding: [40, 40, 40, 40]
        };
    }
    /*==================== Verificar Acceso a GPS ===============================*/
    LocationService.prototype.permitirLocalizacion = function () {
        var _this = this;
        this.myLocation();
        if (!nativescript_geolocation_1.isEnabled()) {
            nativescript_geolocation_1.enableLocationRequest().then(function () {
                _this.myLocation();
                console.log('location enabled!');
            }, function (e) {
                console.log('Failed to enable', e);
            });
        }
        console.log("No paso nada");
    };
    LocationService.prototype.myLocation = function () {
        var _this = this;
        nativescript_geolocation_1.getCurrentLocation({ desiredAccuracy: enums_1.Accuracy.high, maximumAge: 5000, timeout: 10000 })
            .then(function (location) {
            _this.miUbicacion = {
                latitud: location.latitude,
                longitud: location.longitude,
                zoom: 11
            };
            console.log("Latitud: " + location.latitude + " Longitud: " + location.latitude);
        }, function (err) {
            console.log('Error: ' + err.message);
        });
        //console.log(location);
    };
    LocationService.prototype.getNearBy = function () {
        this.url = "http://api.geonames.org/findNearbyPlaceNameJSON?username=" + this.username + "&lat=" + this.latitud + "&lng=" + this.longitud;
        return this.http.get(this.url).map(function (response) { return response.json(); });
    };
    LocationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], LocationService);
    return LocationService;
}());
exports.LocationService = LocationService;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb24uc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2NhdGlvbi5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBcUM7QUFDckMsaUNBQStCO0FBRy9CLHFFQUFxSTtBQUNySSxrQ0FBb0M7QUFJcEM7SUFjSSx5QkFBbUIsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07UUFaN0IsWUFBTyxHQUFXLFNBQVMsQ0FBQztRQUM1QixhQUFRLEdBQVcsVUFBVSxDQUFDO1FBQzlCLGFBQVEsR0FBVyxZQUFZLENBQUM7UUFDaEMsMERBQTBEO1FBQzFELGdCQUFXLEdBQVE7WUFDZixPQUFPLEVBQUUsQ0FBQztZQUNWLFFBQVEsRUFBRSxDQUFDO1lBQ1gsSUFBSSxFQUFFLENBQUM7WUFDUCxPQUFPLEVBQUUsQ0FBQztZQUNWLElBQUksRUFBRSxDQUFDO1lBQ1AsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO1NBQzVCLENBQUM7SUFHRixDQUFDO0lBRUQsK0VBQStFO0lBQy9FLDhDQUFvQixHQUFwQjtRQUFBLGlCQVdDO1FBVkcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsb0NBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNmLGdEQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUN6QixLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNyQyxDQUFDLEVBQUUsVUFBQSxDQUFDO2dCQUNBLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUMvQixDQUFDO0lBR0Qsb0NBQVUsR0FBVjtRQUFBLGlCQWFDO1FBWkcsNkNBQWtCLENBQUMsRUFBRSxlQUFlLEVBQUUsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7YUFDbkYsSUFBSSxDQUFDLFVBQUEsUUFBUTtZQUNWLEtBQUksQ0FBQyxXQUFXLEdBQUc7Z0JBQ2YsT0FBTyxFQUFFLFFBQVEsQ0FBQyxRQUFRO2dCQUMxQixRQUFRLEVBQUUsUUFBUSxDQUFDLFNBQVM7Z0JBQzVCLElBQUksRUFBRSxFQUFFO2FBQ1gsQ0FBQTtZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsYUFBYSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNwRixDQUFDLEVBQUUsVUFBQSxHQUFHO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFBO1FBQ04sd0JBQXdCO0lBQzVCLENBQUM7SUFFRCxtQ0FBUyxHQUFUO1FBQ0ksSUFBSSxDQUFDLEdBQUcsR0FBRywyREFBMkQsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQyxDQUFBO0lBQ25FLENBQUM7SUFuRFEsZUFBZTtRQUYzQixpQkFBVSxFQUFFO3lDQWdCZ0IsV0FBSTtPQWRwQixlQUFlLENBb0QzQjtJQUFELHNCQUFDO0NBQUEsQUFwREQsSUFvREM7QUFwRFksMENBQWU7QUFvRDNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IFwicnhqcy9hZGQvb3BlcmF0b3IvbWFwXCI7XHJcbi8vQ29tcG9uZW50ZXMgR2VvbG9jYWxpemFjacOzblxyXG5pbXBvcnQgeyByZWdpc3RlckVsZW1lbnQgfSBmcm9tICduYXRpdmVzY3JpcHQtYW5ndWxhci9lbGVtZW50LXJlZ2lzdHJ5JztcclxuaW1wb3J0IHsgaXNFbmFibGVkLCBlbmFibGVMb2NhdGlvblJlcXVlc3QsIGdldEN1cnJlbnRMb2NhdGlvbiwgd2F0Y2hMb2NhdGlvbiwgZGlzdGFuY2UsIGNsZWFyV2F0Y2ggfSBmcm9tIFwibmF0aXZlc2NyaXB0LWdlb2xvY2F0aW9uXCI7XHJcbmltcG9ydCB7IEFjY3VyYWN5IH0gZnJvbSBcInVpL2VudW1zXCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcblxyXG5leHBvcnQgY2xhc3MgTG9jYXRpb25TZXJ2aWNlIHtcclxuICAgIHVybDogc3RyaW5nO1xyXG4gICAgbGF0aXR1ZDogc3RyaW5nID0gXCI0MC42NjQzXCI7XHJcbiAgICBsb25naXR1ZDogc3RyaW5nID0gXCItNzMuOTM4NVwiO1xyXG4gICAgdXNlcm5hbWU6IHN0cmluZyA9IFwibGptYXJxdWV6Z1wiO1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLSBWYXJpYWJsZXMgbG9jYWxpemFjacOzbiAtLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIG1pVWJpY2FjaW9uOiBhbnkgPSB7XHJcbiAgICAgICAgbGF0aXR1ZDogMCxcclxuICAgICAgICBsb25naXR1ZDogMCxcclxuICAgICAgICB6b29tOiAwLFxyXG4gICAgICAgIGJlYXJpbmc6IDAsXHJcbiAgICAgICAgdGlsdDogMCxcclxuICAgICAgICBwYWRkaW5nOiBbNDAsIDQwLCA0MCwgNDBdXHJcbiAgICB9O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGh0dHA6IEh0dHApIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PSBWZXJpZmljYXIgQWNjZXNvIGEgR1BTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgcGVybWl0aXJMb2NhbGl6YWNpb24oKSB7XHJcbiAgICAgICAgdGhpcy5teUxvY2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKCFpc0VuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBlbmFibGVMb2NhdGlvblJlcXVlc3QoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXlMb2NhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2xvY2F0aW9uIGVuYWJsZWQhJyk7XHJcbiAgICAgICAgICAgIH0sIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBlbmFibGUnLCBlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTm8gcGFzbyBuYWRhXCIpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIG15TG9jYXRpb24oKSB7XHJcbiAgICAgICAgZ2V0Q3VycmVudExvY2F0aW9uKHsgZGVzaXJlZEFjY3VyYWN5OiBBY2N1cmFjeS5oaWdoLCBtYXhpbXVtQWdlOiA1MDAwLCB0aW1lb3V0OiAxMDAwMCB9KVxyXG4gICAgICAgICAgICAudGhlbihsb2NhdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pVWJpY2FjaW9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGl0dWQ6IGxvY2F0aW9uLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkOiBsb2NhdGlvbi5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgem9vbTogMTFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTGF0aXR1ZDogXCIgKyBsb2NhdGlvbi5sYXRpdHVkZSArIFwiIExvbmdpdHVkOiBcIiArIGxvY2F0aW9uLmxhdGl0dWRlKVxyXG4gICAgICAgICAgICB9LCBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiAnICsgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIC8vY29uc29sZS5sb2cobG9jYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5lYXJCeSgpIHtcclxuICAgICAgICB0aGlzLnVybCA9IFwiaHR0cDovL2FwaS5nZW9uYW1lcy5vcmcvZmluZE5lYXJieVBsYWNlTmFtZUpTT04/dXNlcm5hbWU9XCIgKyB0aGlzLnVzZXJuYW1lICsgXCImbGF0PVwiICsgdGhpcy5sYXRpdHVkICsgXCImbG5nPVwiICsgdGhpcy5sb25naXR1ZDtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh0aGlzLnVybCkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIH1cclxufTtcclxuXHJcbiJdfQ==