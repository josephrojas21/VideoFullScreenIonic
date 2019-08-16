import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SoportePage } from './soporte.page';
var routes = [
    {
        path: '',
        component: SoportePage
    }
];
var SoportePageModule = /** @class */ (function () {
    function SoportePageModule() {
    }
    SoportePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [SoportePage]
        })
    ], SoportePageModule);
    return SoportePageModule;
}());
export { SoportePageModule };
//# sourceMappingURL=soporte.module.js.map