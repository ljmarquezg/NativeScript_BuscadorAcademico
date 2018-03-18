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
        //Reemplazar los espacios " " por el valor %20 para coincidir con el formato HTML
        return string.replace(/ /g, "%20");
    };
    /*================== Consultar base de datos ==============================*/
    BuscadorService.prototype.getUniversidad = function () {
        this.url = "http://universities.hipolabs.com/search?name=" + this.htmlFormat(this.universidad);
        console.log(this.url);
        return this.http.get(this.url).map(function (response) { return response.json(); });
    };
    BuscadorService.prototype.getUniversidadCiudad = function () {
        //Si el pais es Venezuela, cambiar por el siguiente nombre
        if (this.country === "Venezuela") {
            this.country = "Venezuela, Bolivarian Republic of";
        }
        this.url = "http://universities.hipolabs.com/search?name=" + this.htmlFormat(this.universidad) + "&country=" + this.htmlFormat(this.country);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVzY2Fkb3Iuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidXNjYWRvci5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBcUM7QUFDckMsaUNBQStCO0FBSS9CO0lBS0kseUJBQW1CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO0lBRTdCLENBQUM7SUFFRCw4RUFBOEU7SUFDOUUsb0NBQVUsR0FBVixVQUFXLE1BQU07UUFDYixpRkFBaUY7UUFDakYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDRCw2RUFBNkU7SUFDN0Usd0NBQWMsR0FBZDtRQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsK0NBQStDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVELDhDQUFvQixHQUFwQjtRQUNJLDBEQUEwRDtRQUMxRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxtQ0FBbUMsQ0FBQztRQUN2RCxDQUFDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsR0FBRywrQ0FBK0MsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQTdCUSxlQUFlO1FBRjNCLGlCQUFVLEVBQUU7eUNBT2dCLFdBQUk7T0FMcEIsZUFBZSxDQThCM0I7SUFBRCxzQkFBQztDQUFBLEFBOUJELElBOEJDO0FBOUJZLDBDQUFlO0FBOEIzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL21hcFwiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ1c2NhZG9yU2VydmljZSB7XHJcbiAgICB1cmw6IHN0cmluZ1xyXG4gICAgY291bnRyeTogc3RyaW5nO1xyXG4gICAgdW5pdmVyc2lkYWQ6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaHR0cDogSHR0cCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKj09PT09PT09PT09PT09PT09PSBDb252ZXJ0aXIgc3RyaW5nIGVuIEhUTUwgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuICAgIGh0bWxGb3JtYXQoc3RyaW5nKSB7XHJcbiAgICAgICAgLy9SZWVtcGxhemFyIGxvcyBlc3BhY2lvcyBcIiBcIiBwb3IgZWwgdmFsb3IgJTIwIHBhcmEgY29pbmNpZGlyIGNvbiBlbCBmb3JtYXRvIEhUTUxcclxuICAgICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyAvZywgXCIlMjBcIik7XHJcbiAgICB9XHJcbiAgICAvKj09PT09PT09PT09PT09PT09PSBDb25zdWx0YXIgYmFzZSBkZSBkYXRvcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG4gICAgZ2V0VW5pdmVyc2lkYWQoKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSBcImh0dHA6Ly91bml2ZXJzaXRpZXMuaGlwb2xhYnMuY29tL3NlYXJjaD9uYW1lPVwiICsgdGhpcy5odG1sRm9ybWF0KHRoaXMudW5pdmVyc2lkYWQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMudXJsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh0aGlzLnVybCkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VW5pdmVyc2lkYWRDaXVkYWQoKSB7XHJcbiAgICAgICAgLy9TaSBlbCBwYWlzIGVzIFZlbmV6dWVsYSwgY2FtYmlhciBwb3IgZWwgc2lndWllbnRlIG5vbWJyZVxyXG4gICAgICAgIGlmICh0aGlzLmNvdW50cnkgPT09IFwiVmVuZXp1ZWxhXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3VudHJ5ID0gXCJWZW5lenVlbGEsIEJvbGl2YXJpYW4gUmVwdWJsaWMgb2ZcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cmwgPSBcImh0dHA6Ly91bml2ZXJzaXRpZXMuaGlwb2xhYnMuY29tL3NlYXJjaD9uYW1lPVwiICsgdGhpcy5odG1sRm9ybWF0KHRoaXMudW5pdmVyc2lkYWQpICsgXCImY291bnRyeT1cIiArIHRoaXMuaHRtbEZvcm1hdCh0aGlzLmNvdW50cnkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMudXJsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh0aGlzLnVybCkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSk7XHJcbiAgICB9XHJcbn07Il19