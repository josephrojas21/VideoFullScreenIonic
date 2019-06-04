import { Component, OnInit } from '@angular/core';
import { ToastController} from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { Autostart } from '@ionic-native/autostart/ngx';
import { FileTransferObject, FileTransfer} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { StreamingVideoOptions, StreamingMedia} from '@ionic-native/streaming-media/ngx'; 
import { LoadingController } from '@ionic/angular';





@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  cant = 1;
  dirVideo = 'file:///storage/emulated/0/Android/data/io.prueba.mkdigital/files/';
  dirVideo2 = 'file:///storage/emulated/0/Android/data/io.prueba.mkdigital/files/';
  dirCarpeta = 'file:///storage/emulated/0/Android/data/io.prueba.mkdigital';
  dirVer = 'file:///storage/emulated/0/Android/data/io.prueba.mkdigital/variables/';
  dirVariable = '';
  repro = true;
  dispo = 0;
  url = '';
  resultado = '';
  resultado2 = '';


  constructor(private toast: ToastController,public loadingController: LoadingController,
              private transfer: FileTransfer, public httpClient: HttpClient,
              public autostart: Autostart, public file: File,
              private streamingMedia: StreamingMedia
              ){
              
                 this.autostart.enable();

              }

  ngOnInit(){
    this.toast.create({
      message: `Bienvenido`,
      duration: 2000
    })
    console.log('holas');
    
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Descargando video...',
      duration: 2000000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  getUrls(dispositivo:number){
    this.dispo=dispositivo;
    this.presentLoading();
    // direccion del web services
    var post = 'http:///144.217.222.96:54800/Video';

    new Promise(resolve => {
      this.httpClient.post(post,JSON.stringify({"id_device":dispositivo}))
        .subscribe(data => {
          for(var i in data){
            if(data.hasOwnProperty(i)){
              if(i == 'video_url')
                this.resultado = data[i];
            }
          }
          this.url = this.resultado

          //descarga el video
          let file_name = 'Video'+this.cant+'.mp4';

          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer.download(this.url,this.file.externalDataDirectory+file_name).then((entry) => {
            alert('descargo')
            this.loadingController.dismiss()
            this.dirVideo = entry.toUrl();
            this.cant++;
            this.guardarVariables();
            this.playVideo();
          }, (error) => {
            alert('no descarga')
          });
        }, (error) => {
          alert('error')
        });
    });
  }

  playVideo(){
    let options: StreamingVideoOptions = {
      successCallback: () => {
        if(this.repro == true){
          this.playVideo();
        }else if (this.repro == false){
          this.repro = true;
          this.playVideo();
        }
      }, errorCallback: (e) => {alert(e +  '  algo psa') },
      orientation: 'landscape',
      shouldAutoClose: true,
      controls: false
    };
    this.streamingMedia.playVideo(this.dirVideo,options);
  }

  intervalo(){
    setInterval(function(){
      this.actualizarURL();
    }.bind(this),7200000)
  }

  actualizarURL(){
    var post = 'http://144.217.222.96:54800/Video';
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
           this.repro = false;

           this.url = this.resultado2

           //descarga del video
           let file_name = 'video'+this.cant+'.mp4'; // any file name you like
           this.repro = false;
           const fileTransfer : FileTransferObject = this.transfer.create();
           fileTransfer.download(this.url,this.file.externalDataDirectory + file_name).then((entry) => {
             //se remplaza la nueva url por la anterior
             this.dirVideo = entry.toUrl();
             //se elimina el video anterior en el dispositivo
             let num = this.cant-1;
             this.file.removeFile(this.dirVideo2,'video'+num+'.mp4');
             this.cant++;
             this.guardarVariables();
           }, (error) => {
             //error de descarga
           });
          }
        }, (error) => {
          console.log(error);
        });
    });
  }

  verificarVideo(){
    this.file.checkFile(this.dirVer,'varaibles.txt').then((succes) => {
      this.asignarVariables();
    }, (error) => {
      alert('Hubo un error de inicio por favor desconecte y vuelva a conectar el dispositivo')
    });
  }

  crearArchivos(){
    this.file.createDir(this.dirCarpeta,'variables',true).then((succes) => {
      this.dirVariable = this.dirCarpeta+'/variables';
      this.file.createFile(this.dirVariable,'variables.txt',true);
    }, (error) => {
      //alert(error)
    });
  }

  guardarVariables(){
    let vars = {
      id: this.dispo,
      url: this.url,
      dir: this.dirVideo,
      count: this.cant
    }
    this.file.writeExistingFile(this.dirVariable,'variables.txt',JSON.stringify(vars)).then((succes) => {
      //se agregaron las variables
    }, (error) => {
      // no creo nada
    });
  }

  asignarVariables(){
     this.file.readAsText(this.dirCarpeta+'/variables','variables.txt').then((succes) => {
       var info = JSON.parse(succes);

       this.dispo = parseInt(info.id);
       this.url = info.url;
       this.dirVideo = info.dir;
       this.cant = info.count;

       this.playVideo();
     }, (error) => {
        alert('Hubo un error de inicio por favor desconecte y vuelva a conectar el dispositivo')
     })
  }


}
