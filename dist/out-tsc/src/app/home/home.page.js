import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Autostart } from '@ionic-native/autostart/ngx';
import { File } from '@ionic-native/file/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { LoadingController } from '@ionic/angular';
import { Downloader, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
var HomePage = /** @class */ (function () {
    function HomePage(loadingController, httpClient, autostart, file, streamingMedia, downloader, nativeStorage) {
        this.loadingController = loadingController;
        this.httpClient = httpClient;
        this.autostart = autostart;
        this.file = file;
        this.streamingMedia = streamingMedia;
        this.downloader = downloader;
        this.nativeStorage = nativeStorage;
        this.cant = 1;
        this.dirVideo = 'file:///storage/emulated/0/Android/data/io.app.mktdigital/files/';
        this.dirVideo2 = 'file:///storage/emulated/0/Android/data/io.app.mktdigital/files/videos/';
        this.dirCarpeta = 'file:///storage/emulated/0/Android/data/io.app.mktdigital';
        this.dirVer = 'file:///storage/emulated/0/Android/data/io.app.mktdigital/variables/';
        this.dirVariable = '';
        this.repro = true;
        this.dispo = 0;
        this.url = '';
        this.resultado = '';
        this.resultado2 = '';
        this.autostart.enable();
    }
    HomePage.prototype.ngOnInit = function () {
        this.intervalo();
        this.getVar();
    };
    HomePage.prototype.presentLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loading, _a, role, data;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            message: 'Descargando video...',
                            duration: 2000000,
                            id: '1'
                        })];
                    case 1:
                        loading = _b.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, loading.onDidDismiss()];
                    case 3:
                        _a = _b.sent(), role = _a.role, data = _a.data;
                        console.log('Loading dismissed!');
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.playVideo = function () {
        var _this = this;
        var options = {
            successCallback: function () {
                if (_this.repro == true) {
                    _this.playVideo();
                }
                else if (_this.repro == false) {
                    var num = _this.cant - 1;
                    _this.file.removeFile(_this.dirVideo2, 'video' + num + '.mp4');
                    _this.cant++;
                    _this.playVideo();
                    _this.repro = true;
                }
            }, errorCallback: function (e) { },
            orientation: 'landscape',
            shouldAutoClose: true,
            controls: false
        };
        this.streamingMedia.playVideo(this.dirVideo, options);
    };
    HomePage.prototype.getUrls = function () {
        var _this = this;
        this.dispo = this.dispositivo;
        // direccion del web services
        var post = 'http://144.217.222.96:' + this.port + '/Video';
        new Promise(function (resolve) {
            _this.httpClient.post(post, JSON.stringify({ "id_device": _this.dispo }))
                .subscribe(function (data) {
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        if (i == 'video_url')
                            _this.resultado = data[i];
                    }
                }
                _this.url = _this.resultado;
                _this.presentLoading();
                //descarga el video
                _this.descargarVideo();
                _this.playVideo();
                _this.cant++;
            }, function (error) {
                alert('No hay conexion a internet');
            });
        });
    };
    HomePage.prototype.descargarVideo = function () {
        var _this = this;
        var request = {
            uri: this.url,
            description: '',
            mimeType: 'video/mp4',
            visibleInDownloadsUi: true,
            notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
            destinationInExternalFilesDir: {
                dirType: 'videos',
                subPath: 'Video' + this.cant + '.mp4'
            }
        };
        this.downloader.download(request)
            .then(function (location) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, location];
                    case 1:
                        _a.dirVideo = _b.sent();
                        this.loadingController.dismiss('1');
                        //this.guardarVariables();
                        this.setVar();
                        return [2 /*return*/];
                }
            });
        }); })
            .catch(function (error) { return alert('no descarga'); });
    };
    HomePage.prototype.descargarVideo2 = function () {
        var _this = this;
        var request = {
            uri: this.url,
            description: '',
            mimeType: 'video/mp4',
            visibleInDownloadsUi: true,
            notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
            destinationInExternalFilesDir: {
                dirType: 'videos',
                subPath: 'Video' + this.cant + '.mp4'
            }
        };
        this.downloader.download(request)
            .then(function (location) {
            _this.loadingController.dismiss('1');
            _this.dirVideo = location;
            _this.repro = false;
            //this.guardarVariables();
            _this.setVar();
        })
            .catch(function (error) { return _this.loadingController.dismiss('1'); });
    };
    HomePage.prototype.intervalo = function () {
        setInterval(function () {
            this.actualizarURL();
        }.bind(this), 300000);
    };
    HomePage.prototype.actualizarURL = function () {
        var _this = this;
        var post = 'http://144.217.222.96:' + this.port + '/Video';
        new Promise(function (resolve) {
            _this.httpClient.post(post, JSON.stringify({ "id_device": _this.dispo }))
                .subscribe(function (data) {
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        if (i == 'video_url')
                            _this.resultado2 = data[i];
                    }
                }
                // se compara si la url actual es igual con la que trae con el we services
                if (_this.url === _this.resultado2) {
                }
                else {
                    _this.url = _this.resultado2;
                    //descarga del video
                    _this.descargarVideo2();
                }
            }, function (error) {
                console.log(error);
            });
        });
    };
    HomePage.prototype.setVar = function () {
        this.nativeStorage.setItem('variables', { id: this.dispo, url: this.url, dirVideo: this.dirVideo, count: this.cant, port: this.port })
            .then(function () { return console.log('Stored item!'); }, function (error) { return console.log('Error storing item' + error); });
    };
    HomePage.prototype.getVar = function () {
        var _this = this;
        this.nativeStorage.getItem('variables')
            .then(function (data) {
            _this.dispo = data.id;
            _this.url = data.url;
            _this.dirVideo = data.dirVideo;
            _this.cant = data.count;
            _this.port = data.port;
            _this.playVideo();
        }, function (error) { return _this.getVar(); });
    };
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [LoadingController,
            HttpClient,
            Autostart, File,
            StreamingMedia, Downloader,
            NativeStorage])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map