import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms'
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-vr-media',
  templateUrl: './vr-media.component.html',
  styleUrls: ['./vr-media.component.scss']
})
export class VrMediaComponent {
  allUsers: any;
  resultdata: any;
  file: any;
  UpdateImageForm: FormGroup;
  UpdateVideoForm: FormGroup;
  selectedVideo: any;
  AddImageForm: FormGroup;
  AddVideoForm: FormGroup;
  title: any;
  deleteId: any;
  updateId: any;
  downloadUrl: any;
  submitted: any;
  progress!: Observable<any>
  choice: any;
  type: any;
  thumbfile: any;
  fileurl: any;
  thumbfileurl: any;
  deleteUrl: any;
  countdata: any;
  successMessage: any;

  constructor(private services: ServiceService, private storage: AngularFireStorage, private fb: FormBuilder) {

    this.UpdateImageForm = this.fb.group({
      video: [''],
    });
    this.UpdateVideoForm = this.fb.group({
      video: [''],
      thumbUrl:['']
    });
    this.AddImageForm = this.fb.group({
      video: ['',Validators.required],
    });
    this.AddVideoForm = this.fb.group({
      video: ['',Validators.required],
      thumbUrl:['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.getVideos();

  }
  async getVideos() {
    this.allUsers = await this.services.getAllVRVideos();
    this.resultdata = this.allUsers;
  }

  addVideos() {
    this.submitted = true;
    if(this.choice == 'Video'){
      this.type = true;
    }
    else{
      this.thumbfileurl = '';
      this.type = false;
    }
    this.UploadFile("add");
  }

Choice(choice:any){
  this.choice = choice;
}

Close() {
  this.AddImageForm.reset();
  this.UpdateImageForm.reset();
  this.AddVideoForm.reset();
  this.UpdateVideoForm.reset();
  this.choice = undefined;
 }
  updateVideos() {
    this.submitted = true;
    if(this.choice == 'Video'){
      this.thumbfileurl = this.selectedVideo;
      this.type = true;
    }
    else{
      this.thumbfileurl = '';
      this.type = false;
    }
    if(this.file){
      this.UploadFile("update");
    }
   
  }
  deleteVideos(id: any) {
    this.deleteId = id;
  }

  get fvaladdimage() {
    return this.AddImageForm.controls;
  } 
  get fvalupdateimage() {
    return this.UpdateImageForm.controls;
  }  
  get fvaladdvideo() {
    return this.AddVideoForm.controls;
  } 
  get fvalupdatevideo() {
    return this.UpdateVideoForm.controls;
  }   

  ConfirmDelete() {
    this.services.getVRVideos(this.deleteId).subscribe(
      (data: any) => {
        this.deleteUrl = data.url;
        let fileRef = this.storage.refFromURL(this.deleteUrl);
        fileRef.delete();
        this.deleteUrl = data.thumbUrl;
         fileRef = this.storage.refFromURL(this.deleteUrl);
        fileRef.delete();
      });
  
    this.services.deleteVRVideos(this.deleteId);
    this.deleteId = undefined;
    $('#DeleteModal').modal('hide');
    this.successMessage = "Media deleted successfully.";
    $('#SuccessModal').modal('show');
    // this.id = setInterval(() => {
    //   location.reload();
    //  }, 1000);
  }

  CancelDelete() {
    this.deleteId = undefined;
    location.reload();
  }

  getVideosbyId(id: any) {
    this.updateId = id;
    this.services.getVRVideos(id).subscribe(
      (data: any) => {
        this.selectedVideo = data.thumb;
        this.thumbfileurl = data.thumb;
        this.fileurl = data.url;
      });
  }
  Reload(){
    location.reload()
  }

  SelectFile(event: any) {
    this.file = event.target.files[0];
  }

  SelectThumbs(event: any) {
    this.thumbfile = event.target.files[0];
  }
  
  async UploadFile(type: any) {
    if(this.file && this.thumbfile){
      this.countdata = await this.services.count('VR-media');
      this.services.updateCount(this.countdata[0].id,this.countdata[0].type,this.countdata[0].count + 1);
      const filePath = this.file.name;
      const storageRef = this.storage.ref("VR-media/"+this.countdata[0].count + "-" +filePath);
      const uploadTask = this.storage.upload("VR-media/"+this.countdata[0].count + "-" +filePath, this.file);
      this.progress = uploadTask.percentageChanges();
      uploadTask.snapshotChanges().pipe(finalize(() => {
        storageRef.getDownloadURL().subscribe(async downloadURL => {
          this.fileurl = downloadURL;
            const thumbfilePath = this.thumbfile.name;
            const thumbstorageRef = this.storage.ref("VR-media/" + this.countdata[0].count + "-" +thumbfilePath);
            const thumbuploadTask = this.storage.upload("VR-media/" + this.countdata[0].count + "-" +thumbfilePath, this.thumbfile);
            this.progress = thumbuploadTask.percentageChanges();
            thumbuploadTask.snapshotChanges().pipe(finalize(() => {
              thumbstorageRef.getDownloadURL().subscribe(downloadURL => {
                this.thumbfileurl = downloadURL;
                if (type == 'add') {
                  this.services.addVRVideos(this.type, this.thumbfileurl, this.fileurl);
                  $('#AddModal').modal('hide');
                  this.successMessage = "Media added successfully.";
                  $('#SuccessModal').modal('show');
                }
                if (type == 'update') {
                  this.services.updateVRVideos(this.updateId,this.type, this.thumbfileurl, this.fileurl);
                  $('#UpdateModal').modal('hide');
                  this.successMessage = "Media updated successfully.";
                  $('#SuccessModal').modal('show');
                }
              });
            })
            ).subscribe();
        });
      })
      ).subscribe();
    }
    else
    if(this.file){
      this.countdata = await this.services.count('VR-media');
      this.services.updateCount(this.countdata[0].id,this.countdata[0].type,this.countdata[0].count + 1);
      const filePath = this.file.name;
      const storageRef = this.storage.ref("VR-media/"+this.countdata[0].count + "-" +filePath);
      const uploadTask = this.storage.upload("VR-media/"+this.countdata[0].count + "-" +filePath, this.file);
      this.progress = uploadTask.percentageChanges();
      uploadTask.snapshotChanges().pipe(finalize(() => {
        storageRef.getDownloadURL().subscribe(async downloadURL => {
          this.fileurl = downloadURL;
          if (type == 'add') {
            this.services.addVRVideos(this.type, this.thumbfileurl, this.fileurl);
            $('#AddModal').modal('hide');
            this.successMessage = "Media added successfully.";
            $('#SuccessModal').modal('show');
          }
          if (type == 'update') {
            this.services.updateVRVideos(this.updateId,this.type, this.thumbfileurl, this.fileurl);
            $('#UpdateModal').modal('hide');
            this.successMessage = "Media updated successfully.";
            $('#SuccessModal').modal('show');
          }
        });
      })
      ).subscribe();
    }
    else
    if(this.thumbfile){
      this.countdata = await this.services.count('VR-media');
      this.services.updateCount(this.countdata[0].id,this.countdata[0].type,this.countdata[0].count + 1);
            const thumbfilePath = this.thumbfile.name;
            const thumbstorageRef = this.storage.ref("VR-media/" + this.countdata[0].count + "-" +thumbfilePath);
            const thumbuploadTask = this.storage.upload("VR-media/" + this.countdata[0].count + "-" +thumbfilePath, this.thumbfile);
            this.progress = thumbuploadTask.percentageChanges();
            thumbuploadTask.snapshotChanges().pipe(finalize(() => {
              thumbstorageRef.getDownloadURL().subscribe(downloadURL => {
                this.thumbfileurl = downloadURL;
                if (type == 'add') {
                  this.services.addVRVideos(this.type, this.thumbfileurl, this.fileurl);
                  $('#AddModal').modal('hide');
                  this.successMessage = "Media added successfully.";
                  $('#SuccessModal').modal('show');
                }
                if (type == 'update') {
                  this.services.updateVRVideos(this.updateId,this.type, this.thumbfileurl, this.fileurl);
                  $('#UpdateModal').modal('hide');
                  this.successMessage = "Media updated successfully.";
                  $('#SuccessModal').modal('show');
                }
              });
            })
            ).subscribe();
    }
    else
    {
      if (type == 'add') {
        this.services.addVRVideos(this.type, this.thumbfileurl, this.fileurl);
        $('#AddModal').modal('hide');
        this.successMessage = "Media added successfully.";
        $('#SuccessModal').modal('show');
      }
      if (type == 'update') {
        this.services.updateVRVideos(this.updateId,this.type, this.thumbfileurl, this.fileurl);
        $('#UpdateModal').modal('hide');
        this.successMessage = "Media updated successfully.";
        $('#SuccessModal').modal('show');
      }
    }
  
  }
}
