import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Productos } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  private path = 'Productos/'

  newProducto: Productos = {

    nombre: '',
    precio: null,
    precioReducido: null,
    foto: '',
    id: this.firestoreService.getId(),
    fecha: new Date()
  }

  constructor(
    public menucontroler: MenuController,
    public firestoreService : FirestoreService
  ) { }

  ngOnInit() {}

  saveProduct(){

    this.firestoreService.createDoc(this.newProducto,this.path,this.newProducto.id);
  }


}
