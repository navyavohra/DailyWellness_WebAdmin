import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ServiceService } from '../services/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-yoga-videos',
  templateUrl: './yoga-videos.component.html',
  styleUrls: ['./yoga-videos.component.scss']
})
export class YogaVideosComponent implements OnInit {
  allUsers: any;
  resultdata: any;
  file: any;
  UpdateForm: FormGroup;
  selectedVideo: any;
  AddForm: FormGroup;
  title: any;
  progressbar: any;
  deleteId: any;
  updateId: any;
  downloadUrl: any;
  id: any;
  submitted: any;
  progress!: Observable<any>;
  deleteUrl: any;
  thumbfile: any;
  fileurl: any;
  thumbfileurl: any;
  data: any;
  countdata: any;
  successMessage: any;

  constructor(private services: ServiceService, public router: Router, private storage: AngularFireStorage, private fb: FormBuilder) {

    this.UpdateForm = this.fb.group({
      title: ['', Validators.required],
      video: [''],
      thumbUrl: ['']
    });
    this.AddForm = this.fb.group({
      title: ['', Validators.required],
      video: ['', Validators.required],
      thumbUrl: ['', Validators.required]
    })
   
  }

  get fvaladd() {
    return this.AddForm.controls;
  }
  get fvalupdate() {
    return this.UpdateForm.controls;
  }

  ngOnInit(): void {
    this.getVideos();

  }
  async getVideos() {
    this.countdata = await this.services.count('yoga_videos');
    this.allUsers = await this.services.getAllVideos();
    this.resultdata = this.allUsers;
  }
  Close() {
    this.AddForm.reset();
    this.UpdateForm.reset();
  }
  addVideos() {
    this.submitted = true;
    this.title = this.AddForm.controls['title'].value;
    this.UploadFile('add');
  }

  updateVideos() {
    this.submitted = true;
    this.UploadFile("update");
  }
  deleteVideos(id: any) {
    this.deleteId = id;
  }

  ConfirmDelete() {
    this.services.getVideos(this.deleteId).subscribe(
      (data: any) => {
        this.selectedVideo = data;
        this.deleteUrl = data.url;
        let fileRef = this.storage.refFromURL(this.deleteUrl);
        fileRef.delete();
        this.deleteUrl = data.thumbUrl;
        fileRef = this.storage.refFromURL(this.deleteUrl);
       fileRef.delete();
      });

    this.services.deleteVideos(this.deleteId);
    this.deleteId = undefined;
    $('#DeleteModal').modal('hide');
    this.successMessage = "Video deleted successfully.";
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
    this.services.getVideos(id).subscribe(
      (data: any) => {
        this.selectedVideo = data;
        this.UpdateForm.controls['title'].setValue(data.title);
        this.fileurl = data.url;
        this.thumbfileurl = data.thumbUrl;
      });
  }
  Reload() {
    location.reload()
  }

  SelectFile(event: any) {
    this.file = event.target.files[0];
  }

  SelectThumbs(event: any) {
    this.thumbfile = event.target.files[0];
  }


  UploadFile(type: any) {
    if(this.file && this.thumbfile){
      this.services.updateCount(this.countdata[0].id,this.countdata[0].type,this.countdata[0].count + 1);
      const filePath = this.file.name;
      const storageRef = this.storage.ref("Yoga/" + this.countdata[0].count + "-" + filePath);
      const uploadTask = this.storage.upload("Yoga/" + this.countdata[0].count + "-" + filePath, this.file);
      this.progress = uploadTask.percentageChanges();
      uploadTask.snapshotChanges().pipe(finalize(() => {
        storageRef.getDownloadURL().subscribe(async downloadURL => {
          this.fileurl = downloadURL;
          const thumbfilePath = this.thumbfile.name;
          const thumbstorageRef = this.storage.ref("Yoga/" + this.countdata[0].count + "-" + thumbfilePath);
          const thumbuploadTask = this.storage.upload("Yoga/" + this.countdata[0].count + "-" + thumbfilePath, this.thumbfile);
          this.progress = thumbuploadTask.percentageChanges();
          thumbuploadTask.snapshotChanges().pipe(finalize(() => {
            thumbstorageRef.getDownloadURL().subscribe(downloadURL => {
              this.thumbfileurl = downloadURL;
              if (type == 'add') {
                this.services.addVideos(this.title, this.thumbfileurl, this.fileurl);
                $('#AddModal').modal('hide');
                this.successMessage = "Video added successfully.";
                $('#SuccessModal').modal('show');
              }
  
              if (type == 'update') {
                this.services.updateVideos(this.updateId, this.UpdateForm.controls['title'].value, this.thumbfileurl, this.fileurl);
                $('#UpdateModal').modal('hide');
                this.successMessage = "Video updated successfully.";
                $('#SuccessModal').modal('show');
              }
            });
          })
          ).subscribe();
        });
      })
      ).subscribe();
    }
    else if(this.file){
      this.services.updateCount(this.countdata[0].id,this.countdata[0].type,this.countdata[0].count + 1);
      const filePath = this.file.name;
      const storageRef = this.storage.ref("Yoga/" + this.countdata[0].count + "-" + filePath);
      const uploadTask = this.storage.upload("Yoga/" + this.countdata[0].count + "-" + filePath, this.file);
      this.progress = uploadTask.percentageChanges();
      uploadTask.snapshotChanges().pipe(finalize(() => {
        storageRef.getDownloadURL().subscribe(async downloadURL => {
          this.fileurl = downloadURL;
          if (type == 'add') {
            this.services.addVideos(this.title, this.thumbfileurl, this.fileurl);
            $('#AddModal').modal('hide');
            this.successMessage = "Video added successfully.";
            $('#SuccessModal').modal('show');
          }

          if (type == 'update') {
            this.services.updateVideos(this.updateId, this.UpdateForm.controls['title'].value, this.thumbfileurl, this.fileurl);
            $('#UpdateModal').modal('hide');
            this.successMessage = "Video updated successfully.";
            $('#SuccessModal').modal('show');
          }
        });
      })
      ).subscribe();
    }
    else if(this.thumbfile) {
      this.services.updateCount(this.countdata[0].id,this.countdata[0].type,this.countdata[0].count + 1);
          const thumbfilePath = this.thumbfile.name;
          const thumbstorageRef = this.storage.ref("Yoga/" + this.countdata[0].count + "-" + thumbfilePath);
          const thumbuploadTask = this.storage.upload("Yoga/" + this.countdata[0].count + "-" + thumbfilePath, this.thumbfile);
          this.progress = thumbuploadTask.percentageChanges();
          thumbuploadTask.snapshotChanges().pipe(finalize(() => {
            thumbstorageRef.getDownloadURL().subscribe(downloadURL => {
              this.thumbfileurl = downloadURL;
              if (type == 'add') {
                this.services.addVideos(this.title, this.thumbfileurl, this.fileurl);
                $('#AddModal').modal('hide');
                this.successMessage = "Video added successfully.";
                $('#SuccessModal').modal('show');
              }
  
              if (type == 'update') {
                this.services.updateVideos(this.updateId, this.UpdateForm.controls['title'].value, this.thumbfileurl, this.fileurl);
                $('#UpdateModal').modal('hide');
                this.successMessage = "Video updated successfully.";
                $('#SuccessModal').modal('show');
              }
            });
          })
          ).subscribe();
    }
    else{
      if (type == 'add') {
        this.services.addVideos(this.title, this.thumbfileurl, this.fileurl);
        $('#AddModal').modal('hide');
        this.successMessage = "Video added successfully.";
        $('#SuccessModal').modal('show');
      }

      if (type == 'update') {
        this.services.updateVideos(this.updateId, this.UpdateForm.controls['title'].value, this.thumbfileurl, this.fileurl);
        $('#UpdateModal').modal('hide');
        this.successMessage = "Video updated successfully.";
        $('#SuccessModal').modal('show');
      }
    }
   
  }

  UploadThumb(): any {
    const thumbfilePath = this.thumbfile.name;
    const thumbstorageRef = this.storage.ref("Yoga/" + thumbfilePath);
    const thumbuploadTask = this.storage.upload("Yoga/" + thumbfilePath, this.thumbfile);
    this.progress = thumbuploadTask.percentageChanges();
    thumbuploadTask.snapshotChanges().pipe(finalize(() => {
      thumbstorageRef.getDownloadURL().subscribe(downloadURL => {
        this.thumbfileurl = downloadURL;
      });
    })
    ).subscribe();
  }
}
