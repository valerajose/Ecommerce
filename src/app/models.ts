export interface Producto {
  nombre: string;
  precio: number;
  precioReducido: number;
  foto: string;
  id: string;
  fecha: Date;
}

export interface Cliente {
  uid: string;
  nombre: string;
  email: string;
  celular: string;
  foto: string;
  referecia: string;
  ubicacion: any;
}
