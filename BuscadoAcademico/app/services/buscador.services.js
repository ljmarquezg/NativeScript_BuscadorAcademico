"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var BuscadorService = /** @class */ (function () {
    function BuscadorService(http) {
        this.http = http;
    }
    BuscadorService.prototype.getUniversidad = function () {
        console.log("http://universities.hipolabs.com/search?name=" + this.universidad);
        this.url = "http://universities.hipolabs.com/search?name=" + this.universidad;
        return this.http.get(this.url).map(function (response) { return response.json(); });
    };
    BuscadorService.prototype.getUniversidadCity = function () {
        this.url = "http://universities.hipolabs.com/search?country=" + this.country;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVzY2Fkb3Iuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidXNjYWRvci5zZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBcUM7QUFDckMsaUNBQStCO0FBSS9CO0lBTUkseUJBQW1CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO0lBRTdCLENBQUM7SUFFRCx3Q0FBYyxHQUFkO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLEdBQUcsR0FBRywrQ0FBK0MsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzlFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQyxDQUFBO0lBQ25FLENBQUM7SUFFRCw0Q0FBa0IsR0FBbEI7UUFDSSxJQUFJLENBQUMsR0FBRyxHQUFHLGtEQUFrRCxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDN0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDLENBQUE7SUFDbkUsQ0FBQztJQXBCUSxlQUFlO1FBRjNCLGlCQUFVLEVBQUU7eUNBUWdCLFdBQUk7T0FOcEIsZUFBZSxDQXFCM0I7SUFBRCxzQkFBQztDQUFBLEFBckJELElBcUJDO0FBckJZLDBDQUFlO0FBcUIzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCBcInJ4anMvYWRkL29wZXJhdG9yL21hcFwiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ1c2NhZG9yU2VydmljZSB7XHJcbiAgICB1cmw6IHN0cmluZ1xyXG4gICAgY291bnRyeTogc3RyaW5nO1xyXG4gICAgdW5pdmVyc2lkYWQ6IHN0cmluZztcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIGh0dHA6IEh0dHApIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VW5pdmVyc2lkYWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJodHRwOi8vdW5pdmVyc2l0aWVzLmhpcG9sYWJzLmNvbS9zZWFyY2g/bmFtZT1cIiArIHRoaXMudW5pdmVyc2lkYWQpO1xyXG4gICAgICAgIHRoaXMudXJsID0gXCJodHRwOi8vdW5pdmVyc2l0aWVzLmhpcG9sYWJzLmNvbS9zZWFyY2g/bmFtZT1cIiArIHRoaXMudW5pdmVyc2lkYWQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy51cmwpLm1hcChyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VW5pdmVyc2lkYWRDaXR5KCkge1xyXG4gICAgICAgIHRoaXMudXJsID0gXCJodHRwOi8vdW5pdmVyc2l0aWVzLmhpcG9sYWJzLmNvbS9zZWFyY2g/Y291bnRyeT1cIiArIHRoaXMuY291bnRyeTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnVybClcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh0aGlzLnVybCkubWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIH1cclxufTsiXX0=