import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private db: AngularFirestore) { }
  //for yoga videos
  getAllVideos() {
    return new Promise<any>((resolve) => {
      this.db.collection('yoga_videos').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }
  addVideos(title: any, thumbUrl: string, url: string) {
    this.db.collection("yoga_videos").doc().set({ title: title, thumbUrl: thumbUrl, url: url });
  }
  updateVideos(_id: any,title: string,thumbUrl: string , url: string) {
    this.db.doc(`yoga_videos/${_id}`).update({ title: title,thumbUrl: thumbUrl, url: url });
  }
  deleteVideos(_id: any) {
    this.db.doc(`yoga_videos/${_id}`).delete();
  }
  getVideos(_id: any) {
    return this.db.doc('yoga_videos/' + _id).valueChanges({ idField: 'id' });
  }

  //for meditation audio

  getAllAudios() {
    return new Promise<any>((resolve) => {
      this.db.collection('meditation_audio').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }
  addAudios(title: any, thumbUrl: string, url: string) {
    this.db.collection("meditation_audio").doc().set({ title: title, thumbUrl: thumbUrl, url: url });
  }
  updateAudios(_id: any, title: string,thumbUrl: string, url: string) {
    this.db.doc(`meditation_audio/${_id}`).update({ title: title,thumbUrl: thumbUrl, url: url });
  }
  deleteAudios(_id: any) {
    this.db.doc(`meditation_audio/${_id}`).delete();
  }
  getSingleAudio(_id: any) {
    return this.db.doc('meditation_audio/' + _id).valueChanges({ idField: 'id' });
  }
  //for Courses

  getAllCourses() {
    return new Promise<any>((resolve) => {
      this.db.collection('courses').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }
  AddCourses(courseName: any, courseDescription: any, courseImage: any, questions: any[], suggestions: any[]) {
    this.db.collection("courses").doc().set({
      courseName: courseName, courseDescription: courseDescription, courseImage: courseImage, questions: questions
      , suggestions: suggestions
    });
  }
  UpdateCourses(_id:any,courseName: any, courseDescription: any, courseImage: any, questions: any[], suggestions: any[]) {
    this.db.doc(`courses/${_id}`).update({
      courseName: courseName, courseDescription: courseDescription, courseImage: courseImage, questions: questions
      , suggestions: suggestions
    });
    return true;
  }
  deleteCourses(_id: any) {
    this.db.doc(`courses/${_id}`).delete();
  }

  getSingleCourses(_id: any) {
    return this.db.doc('courses/' + _id).valueChanges({ idField: 'id' });
  }
  //for relaxation media

  getAllrelaxVideos() {
    return new Promise<any>((resolve) => {
      this.db.collection('relaxation_media').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }
  addrelaxVideos(title: any, thumbUrl: string, url: string) {
    this.db.collection("relaxation_media").doc().set({ isVideo: title, thumb: thumbUrl, url: url });
    return true;
  }
  updaterelaxVideos(_id: any, title: string,thumbUrl: string, url: string) {
    this.db.doc(`relaxation_media/${_id}`).update({ isVideo: title,thumb: thumbUrl, url: url });
    return true;
  }
  deleterelaxVideos(_id: any) {
    this.db.doc(`relaxation_media/${_id}`).delete();
  }
  getrelaxVideos(_id: any) {
    return this.db.doc('relaxation_media/' + _id).valueChanges({ idField: 'id' });
  }

  //for relaxation media

  getAllVRVideos() {
    return new Promise<any>((resolve) => {
      this.db.collection('vr_media').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }
  addVRVideos(title: any, thumbUrl: string, url: string) {
    this.db.collection("vr_media").doc().set({ isVideo: title, thumb: thumbUrl, url: url });
    return true;
  }
  updateVRVideos(_id: any, title: string,thumbUrl: string, url: string) {
    this.db.doc(`vr_media/${_id}`).update({ isVideo: title,thumb: thumbUrl, url: url });
    return true;
  }
  deleteVRVideos(_id: any) {
    this.db.doc(`vr_media/${_id}`).delete();
  }
  getVRVideos(_id: any) {
    return this.db.doc('vr_media/' + _id).valueChanges({ idField: 'id' });
  }

  //For Quotes
  getAllQuotes() {
    return new Promise<any>((resolve) => {
      this.db.collection('quotes').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
    })
  }
  addQuotes(mood: any, quote: string, emotion:string) {
    this.db.collection("quotes").doc().set({ mood: mood, quote: quote ,emotion:emotion});
    return true;
  }
  updateQuotes(_id: any, mood: string, quote: string, emotion:string) {
    this.db.doc(`quotes/${_id}`).update({ mood: mood, quote: quote ,emotion:emotion});
    return true;
  }
  deleteQuotes(_id: any) {
    this.db.doc(`quotes/${_id}`).delete();
  }
  getsingleQuote(_id: any) {
    return this.db.doc('quotes/' + _id).valueChanges({ idField: 'id' });
  }

  //For login

  checkUser(username:any,password:any){
    return new Promise<any>((resolve)=> {
      this.db.collection('admin_users', ref => ref.where('username', '==', username) &&  ref.where('password', '==', password)).valueChanges({ idField: 'id' }).subscribe(users => resolve(users))
    })
  }
   checkUserName(userid:any){
    return this.db.doc('admin_users/' + userid).valueChanges({ idField: 'id' });
  }

//counts for image/video uploads

  count(type:any){
    return new Promise<any>((resolve)=> {
      this.db.collection('counts', ref => ref.where('type', '==', type)).valueChanges({ idField: 'id' }).subscribe(counts => resolve(counts))
    })
  }
  updateCount(_id: any, type: string, count: string) {
    this.db.doc(`counts/${_id}`).update({ type: type, count: count });
    return true;
  }

//Get emotions for moods
getAllEmojis() {
  return new Promise<any>((resolve) => {
    this.db.collection('Emojis').valueChanges({ idField: 'id' }).subscribe(users => resolve(users));
  })
}

}
