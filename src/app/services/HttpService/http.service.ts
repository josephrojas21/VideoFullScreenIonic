import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
providedIn: 'root'
})
export class HttpService {
constructor(private http: HttpClient) { }

  //get url video

  getUrl(url:string,body:string){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Acccess-Control', '*');


    this.http.post(url,body,{headers})
  }

}