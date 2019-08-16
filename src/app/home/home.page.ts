import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Autostart } from '@ionic-native/autostart/ngx';
import { File } from '@ionic-native/file/ngx';
import { StreamingVideoOptions, StreamingMedia} from '@ionic-native/streaming-media/ngx'; 
import { LoadingController } from '@ionic/angular';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HTTP } from '@ionic-native/http/ngx';






@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  cant = 1;
  dirVideo = 'file:///storage/emulated/0/Android/data/io.app.mktdigital/files/';
  dirVideo2 = 'file:///storage/emulated/0/Android/data/io.app.mktdigital/files/videos/';
  dirCarpeta = 'file:///storage/emulated/0/Android/data/io.app.mktdigital';
  dirVer = 'file:///storage/emulated/0/Android/data/io.app.mktdigital/variables/';
  dirVariable = '';
  repro = true;
  dispo = 0;
  url = '';
  resultado = '';
  resultado2 = '';
  dispositivo: number ;
  port: string;


  constructor(public loadingController: LoadingController,
              public httpClient: HttpClient,
              public autostart: Autostart, public file: File,
              private streamingMedia: StreamingMedia,private downloader: Downloader,
              private nativeStorage: NativeStorage
              ){     
                 this.autostart.enable();
              }

  ngOnInit(){
    this.intervalo();
    this.getVar();
    
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Descargando video...',
      duration: 2000000,
      id: '1'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  playVideo(){
    let options: StreamingVideoOptions = {
      successCallback: () => {
        if(this.repro == true  ){
          this.playVideo();
        }else if (this.repro == false){
          let num = this.cant-1;
          this.file.removeFile(this.dirVideo2,'video'+num+'.mp4');
          this.cant++;
          this.playVideo();
          this.repro = true;
        }
      }, errorCallback: (e) => {  },
      orientation: 'landscape',
      shouldAutoClose: true,
      controls: false
    };
    this.streamingMedia.playVideo(this.dirVideo,options);
  }

  getUrls(){
    this.dispo=this.dispositivo;
    
    // direccion del web services
    var post = 'http://144.217.222.96:'+this.port+'/Video';

    new Promise(resolve => {
      this.httpClient.post(post,JSON.stringify({"id_device":this.dispo}))
        .subscribe(data => {
          for(var i in data){
            if(data.hasOwnProperty(i)){
              if(i == 'video_url')
                this.resultado = data[i];
            }
          }
          this.url = this.resultado;
          this.presentLoading();
          //descarga el video
          this.descargarVideo();
          this.playVideo();
          this.cant++;
         
        }, (error) => {
          alert('No hay conexion a internet')
          
        });
    });
  }

  descargarVideo(){  
    var request: DownloadRequest = {
      uri: this.url,
      description: '',
      mimeType: 'video/mp4',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
          dirType: 'videos',
          subPath: 'Video'+this.cant+'.mp4'
      }
    };
    this.downloader.download(request)
      .then(async (location: string) => {
        this.dirVideo = await location;
        this.loadingController.dismiss('1');
        //this.guardarVariables();
        this.setVar();
        
      })
      .catch((error: any) => alert('no descarga'));
  }

  descargarVideo2(){  
    var request: DownloadRequest = {
      uri: this.url,
      description: '',
      mimeType: 'video/mp4',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
          dirType: 'videos',
          subPath: 'Video'+this.cant+'.mp4'
      }
    };
    this.downloader.download(request)
      .then((location: string) => {
        this.loadingController.dismiss('1');
        this.dirVideo = location;
        this.repro = false;
        //this.guardarVariables();
        this.setVar();
        
        
        
      })
      .catch((error: any) => this.loadingController.dismiss('1') );
  }

  

  intervalo(){
    setInterval(function(){
      this.actualizarURL();
    }.bind(this),300000)
  }

  actualizarURL(){ 
    var post = 'http://144.217.222.96:'+this.port+'/Video';
    new Promise(resolve =>{
      this.httpClient.post(post,JSON.stringify({"id_device":this.dispo}))
        .subscribe(data =>{
          for (var i in data) {
            if (data.hasOwnProperty(i)) {
              if (i == 'video_url')
                this.resultado2 = data[i];
            }
          }                                                                                                                                                                
          // se compara si la url actual es igual con la que trae con el we services
          if (this.url === this.resultado2) {
            
          } else {
            
            this.url = this.resultado2
 
            //descarga del video
            this.descargarVideo2();
            
            
          }
        }, (error) => {
          console.log(error);
        });
        
    });
  }

  setVar(){
    this.nativeStorage.setItem('variables', {id: this.dispo, url: this.url, dirVideo: this.dirVideo,count: this.cant,port: this.port})
    .then(
        () => console.log('Stored item!'),
        error => console.log('Error storing item' + error) 
    );
  }

  getVar(){
    this.nativeStorage.getItem('variables')
    .then(
      data => {
        this.dispo = data.id
        this.url = data.url
        this.dirVideo = data.dirVideo
        this.cant = data.count
        this.port = data.port
        this.playVideo();
      },
      error => this.getVar()
    );
  }

}
