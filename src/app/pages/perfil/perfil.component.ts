import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cliente, Producto } from 'src/app/models';
import { FireBaseAuthService } from 'src/app/services/fire-base-auth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  //data of user in bd firebase------------------------------

  newFile: any;

  uid = '';

  cliente: Cliente = {
    uid: '',
    nombre: '',
    email: '',
    celular: '',
    foto: '',
    referecia: '',
    ubicacion: null
  }

  suscriberUserInfo: Subscription;

  constructor(
    public fireBaseAuthService: FireBaseAuthService,
    public firestorageService : FirestorageService,
    public firestoreService : FirestoreService
  ) {

    this.fireBaseAuthService.stateAuth().subscribe(res =>{
      console.log(res);
      if(res !== null){
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      }else{
        this.initClient();
      };
    });

  }

  async ngOnInit() {
    const uid = await this.fireBaseAuthService.getUid();
    console.log(uid);
  }


  initClient(){
    this.uid = '';
        this.cliente = {
          uid: '',
          nombre: '',
          email: '',
          celular: '',
          foto: '',
          referecia: '',
          ubicacion: null
        };
  }


  async newImageUpload(event: any ) {
      if(event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) =>{
        this.cliente.foto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  async CheckIn(){
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.celular,
    };
    const res = await this.fireBaseAuthService.registrar(credenciales.email, credenciales.password)
        .catch(err =>{
           console.log('error =>', err);
        })
        this.cliente.uid = await this.fireBaseAuthService.getUid();
        this.saveUser();
  }

  getIn(){
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.celular,
    };
    this.fireBaseAuthService.login(credenciales.email,credenciales.password)
        .then(res=>{
          console.log('Ingreso con exito');
        });
  }

  async saveUser(){
    const path = 'Clientes';
    const name = this.cliente.nombre;
    if(this.newFile !== undefined){
      const res = await this.firestorageService.uploadImage(this.newFile,path,name);
      this.cliente.foto = res;
    }
    this.firestoreService.createDoc(this.cliente,path,this.cliente.uid)
    .then(res =>{
      console.log('Guardado con exito');
    }).catch(err =>{
      console.log('error del documento');
    });
  }

  async Exit(){
    this.fireBaseAuthService.logout();
    this.suscriberUserInfo.unsubscribe();
  }

  getUserInfo(uid:string) {

    const path = 'Clientes';
    this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path,uid).subscribe(res =>{
      this.cliente = res;
    })

  }


}














