import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";

const collections = {
  products: "products",
  solicitudes: "solicitudes"
};

// Productos crediticios
export async function getProducts() {
  const snapshot = await getDocs(collection(db, collections.products));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function createProduct(data) {
  return addDoc(collection(db, collections.products), data);
}

export async function updateProduct(id, data) {
  const ref = doc(db, collections.products, id);
  await updateDoc(ref, data);
  return ref;
}

export async function deleteProduct(id) {
  const ref = doc(db, collections.products, id);
  await deleteDoc(ref);
}

// Solicitudes de crédito
export async function getSolicitudes() {
  const snapshot = await getDocs(collection(db, collections.solicitudes));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function getSolicitudById(id) {
  const ref = doc(db, collections.solicitudes, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createSolicitud(data) {
  return addDoc(collection(db, collections.solicitudes), data);
}

export async function updateSolicitud(id, data) {
  const ref = doc(db, collections.solicitudes, id);
  await updateDoc(ref, data);
  return ref;
}

export async function deleteSolicitud(id) {
  const ref = doc(db, collections.solicitudes, id);
  await deleteDoc(ref);
}
