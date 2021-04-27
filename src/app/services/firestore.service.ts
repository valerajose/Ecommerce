import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    public database: AngularFirestore
  ) { }

  createDoc(data: any, path: string, id: string) {
    const colection = this.database.collection(path);
    return colection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string) {
    const colection = this.database.collection<tipo>(path);
    return colection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string) {
    const selection = this.database.collection(path);
    return selection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string) {
    const selection = this.database.collection(path);
    selection.doc(id).update(data);
  }

  getId(){
    return this.database.createId();
  }

  getCollection<tipo>(path: string) {
    const colection =  this.database.collection<tipo>(path);
    return colection.valueChanges();
  }


}
