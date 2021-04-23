import { CompileTemplateMetadata, rendererTypeName } from '@angular/compiler';
import { RenderFlags } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  constructor(
    public menucontroler: MenuController,
    public firestoreService : FirestoreService,
    public loadingController : LoadingController,
    public toastController: ToastController,
    public alertController: AlertController
  ) { }

  //manejo de data en bd
  private path = 'Productos/'
  public productos: Producto[] = [];

  newProducto: Producto;


  //experiencia de usuario

  enableNewProducto = false;

  loading: any;

  nuevo(){
    this.enableNewProducto = true;
    this.newProducto = {
      nombre: '',
      precio: null,
      precioReducido: null,
      foto: '',
      id: this.firestoreService.getId(),
      fecha: new Date()
    }
  }


  ngOnInit() {
    this.getProductos();
  }

  saveProduct(){
    this.presentLoading();
    this.firestoreService.createDoc(this.newProducto,this.path,this.newProducto.id)
    .then(res =>{
      this.loading.dismiss();
      this.presentToast('Guardado con Exito');
    }).catch(err =>{
      this.presentToast('No se logro guardar');
    });

  }

  getProductos() {
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
      this.productos = res;
    });
  }

  async deleteProducto(producto : Producto){

      const alert = await this.alertController.create({
        cssClass: 'normal',
        header: 'Advertencia',
        message: '¿Seguro desea <strong>eliminar</strong> este producto?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'normal',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Ok',
            handler: () => {
              this.firestoreService.deleteDoc(this.path, producto.id)
              .then(res =>{
                this.presentToast('Eliminado');
              }).catch(err =>{
                this.presentToast('No se logro Eliminar');
              });
            }
          }
        ]
      });
      await alert.present();
  }


  //experiencia de usuario funciones-----------------------------------------------------


  async presentLoading() {
     this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando...',
    });
    await this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      cssClass: 'normal',
      message: msg ,
      duration: 2000,
      color: 'primary'

    });
    toast.present();
  }

}
