import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
var HttpService = /** @class */ (function () {
    function HttpService(http) {
        this.http = http;
    }
    //get url video
    HttpService.prototype.getUrl = function (url, body) {
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Acccess-Control', '*');
        this.http.post(url, body, { headers: headers });
    };
    HttpService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], HttpService);
    return HttpService;
}());
export { HttpService };
//# sourceMappingURL=http.service.js.map