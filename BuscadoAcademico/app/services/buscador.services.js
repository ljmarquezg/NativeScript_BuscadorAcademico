"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var BuscadorService = /** @class */ (function () {
    function BuscadorService(http) {
        this.http = http;
    }
    /*================== Convertir string en HTML ==============================*/
    BuscadorService.prototype.htmlFormat = function (string) {
        return string.replace(/ /g, "%20");
    };
    /*================== Consultar base de datos ==============================*/
    BuscadorService.prototype.getUniversidad = function () {
        var universidad = this.universidad;
        if (universidad === "") {
            universidad = "";
        }
        this.url = "http://universities.hipolabs.com/search?name=" + this.htmlFormat(universidad) + "&country=" + this.htmlFormat(this.country);
        console.log(this.url);
        return this.http.get(this.url).map(function (response) { return response.json(); });
    };
    BuscadorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], BuscadorService);
    return BuscadorService;
}());
exports.BuscadorService = BuscadorService;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVzY2Fkb3Iuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidXNjYWRvci5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBcUM7QUFDckMsaUNBQStCO0FBSS9CO0lBS0kseUJBQW1CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO0lBRTdCLENBQUM7SUFFRCw4RUFBOEU7SUFDOUUsb0NBQVUsR0FBVixVQUFXLE1BQU07UUFDYixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNELDZFQUE2RTtJQUM3RSx3Q0FBYyxHQUFkO1FBQ0ksSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQTtRQUNsQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyQixXQUFXLEdBQUcsRUFBRSxDQUFBO1FBQ3BCLENBQUM7UUFDRCxJQUFJLENBQUMsR0FBRyxHQUFHLCtDQUErQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUF0QlEsZUFBZTtRQUYzQixpQkFBVSxFQUFFO3lDQU9nQixXQUFJO09BTHBCLGVBQWUsQ0F1QjNCO0lBQUQsc0JBQUM7Q0FBQSxBQXZCRCxJQXVCQztBQXZCWSwwQ0FBZTtBQXVCM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci9tYXBcIjtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuXHJcbmV4cG9ydCBjbGFzcyBCdXNjYWRvclNlcnZpY2Uge1xyXG4gICAgdXJsOiBzdHJpbmdcclxuICAgIGNvdW50cnk6IHN0cmluZztcclxuICAgIHVuaXZlcnNpZGFkOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIGh0dHA6IEh0dHApIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyo9PT09PT09PT09PT09PT09PT0gQ29udmVydGlyIHN0cmluZyBlbiBIVE1MID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICBodG1sRm9ybWF0KHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvIC9nLCBcIiUyMFwiKTtcclxuICAgIH1cclxuICAgIC8qPT09PT09PT09PT09PT09PT09IENvbnN1bHRhciBiYXNlIGRlIGRhdG9zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgICBnZXRVbml2ZXJzaWRhZCgpIHtcclxuICAgICAgICBsZXQgdW5pdmVyc2lkYWQgPSB0aGlzLnVuaXZlcnNpZGFkXHJcbiAgICAgICAgaWYgKHVuaXZlcnNpZGFkID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHVuaXZlcnNpZGFkID0gXCJcIlxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVybCA9IFwiaHR0cDovL3VuaXZlcnNpdGllcy5oaXBvbGFicy5jb20vc2VhcmNoP25hbWU9XCIgKyB0aGlzLmh0bWxGb3JtYXQodW5pdmVyc2lkYWQpICsgXCImY291bnRyeT1cIiArIHRoaXMuaHRtbEZvcm1hdCh0aGlzLmNvdW50cnkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMudXJsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh0aGlzLnVybCkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSk7XHJcbiAgICB9XHJcbn07Il19