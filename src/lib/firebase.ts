// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDoyWqygxhA3-7_Bawj4Muepg4CNhrQ2k",
  authDomain: "deoxys-a6402.firebaseapp.com",
  projectId: "deoxys-a6402",
  storageBucket: "deoxys-a6402.firebasestorage.app",
  messagingSenderId: "779906189254",
  appId: "1:779906189254:web:8febc23021ef5cb5b654c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export async function uploadFile(file: File, setProgress?: (progress: number) => void){
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, file.name)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed', snapshot => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        if (setProgress) setProgress(progress)
        switch(snapshot.state){
          case "running":
            console.log('upload is running'); break;
          case "paused":
            console.log('upload is paused'); break;
        }
      }, error => {
        reject(error)
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          resolve(url as string)
        })
      })
    } catch (err){
      console.error(err)
      reject(err)
    }
  })
}