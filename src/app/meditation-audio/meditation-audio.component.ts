import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-meditation-audio',
  templateUrl: './meditation-audio.component.html',
  styleUrls: ['./meditation-audio.component.scss']
})
export class MeditationAudioComponent implements OnInit {
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
  oldFile: any;
  audio: any;
  thumbfile: any;
  fileurl: any;
  thumbfileurl: any;
  oldThumbFile: any;
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
    this.getAudios();

  }
  async getAudios() {
    this.allUsers = await this.services.getAllAudios();
    this.resultdata = this.allUsers;
  }

  addAudios() {
    this.submitted = true;
    this.title = this.AddForm.controls['title'].value;
    this.UploadFile("add");
  }

  updateAudios() {
    this.submitted = true;
    this.UploadFile("update");

  }
  deleteAudios(id: any) {
    this.deleteId = id;
  }

  ConfirmDelete() {
    this.services.getSingleAudio(this.deleteId).subscribe(
      (data: any) => {
        this.oldFile = data.url;
        this.oldThumbFile = data.thumbUrl;
        let fileRef = this.storage.refFromURL(this.oldFile);
        fileRef.delete();
        fileRef = this.storage.refFromURL(this.oldThumbFile);
        fileRef.delete();
      });
    this.services.deleteAudios(this.deleteId);
    this.deleteId = undefined;
    $('#DeleteModal').modal('hide');
    this.successMessage = "Audio deleted successfully.";
    $('#SuccessModal').modal('show');
    // this.id = setInterval(() => {
    //   location.reload();
    //  }, 1000);
  }

  CancelDelete() {
    this.deleteId = undefined;
    location.reload();
  }

  getAudiosbyId(id: any) {
    this.updateId = id;
    this.services.getSingleAudio(id).subscribe(
      (data: any) => {
        this.selectedVideo = data;
        this.UpdateForm.controls['title'].setValue(data.title);
        this.oldFile = data.url;
        this.oldThumbFile = data.thumbUrl;
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

  // UploadFile(type: any) {
  //   const filePath = this.file.name;
  //   const storageRef = this.storage.ref("Meditation-audio/"+filePath);
  //   const uploadTask = this.storage.upload("Meditation-audio/"+filePath, this.file);
  //   this.progress = uploadTask.percentageChanges();
  //   uploadTask.snapshotChanges().pipe(finalize(() => {
  //     storageRef.getDownloadURL().subscribe(downloadURL => {
  //       if (type == "add") {
  //         this.services.addAudios(this.title, "sample", downloadURL);
  //         $('#AddModal').modal('hide');
  //         $('#SuccessModal').modal('show');
  //       }
  //       if (type == "update") {

  //         this.services.updateAudios(this.updateId, this.UpdateForm.controls['title'].value, downloadURL);
  //         $('#UpdateModal').modal('hide');
  //         $('#SuccessModal').modal('show');
  //       }
  //     });
  //   })
  //   ).subscribe();
  // }
  async UploadFile(type: any) {
    if (this.file && this.thumbfile) {
      this.countdata = await this.services.count('Meditation-audio');
      this.services.updateCount(this.countdata[0].id, this.countdata[0].type, this.countdata[0].count + 1);
      const filePath = this.file.name;
      const storageRef = this.storage.ref("Meditation-audio/" + this.countdata[0].count + "-" + filePath);
      const uploadTask = this.storage.upload("Meditation-audio/" + this.countdata[0].count + "-" + filePath, this.file);
      this.progress = uploadTask.percentageChanges();
      uploadTask.snapshotChanges().pipe(finalize(() => {
        storageRef.getDownloadURL().subscribe(async downloadURL => {
          this.fileurl = downloadURL;
          const thumbfilePath = this.thumbfile.name;
          const thumbstorageRef = this.storage.ref("Meditation-audio/" + this.countdata[0].count + "-" + thumbfilePath);
          const thumbuploadTask = this.storage.upload("Meditation-audio/" + this.countdata[0].count + "-" + thumbfilePath, this.thumbfile);
          this.progress = thumbuploadTask.percentageChanges();
          thumbuploadTask.snapshotChanges().pipe(finalize(() => {
            thumbstorageRef.getDownloadURL().subscribe(downloadURL => {
              this.thumbfileurl = downloadURL;
              if (type == 'add') {
                this.services.addAudios(this.title, this.thumbfileurl, this.fileurl);
                $('#AddModal').modal('hide');
                this.successMessage = "Audio added successfully.";
                $('#SuccessModal').modal('show');
              }

              if (type == 'update') {
                this.services.updateAudios(this.updateId, this.UpdateForm.controls['title'].value, this.thumbfileurl, this.fileurl);
                $('#UpdateModal').modal('hide');
                this.successMessage = "Audio updated successfully.";
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
      if (this.file) {
        this.countdata = await this.services.count('Meditation-audio');
        this.services.updateCount(this.countdata[0].id, this.countdata[0].type, this.countdata[0].count + 1);
        const filePath = this.file.name;
        const storageRef = this.storage.ref("Meditation-audio/" + this.countdata[0].count + "-" + filePath);
        const uploadTask = this.storage.upload("Meditation-audio/" + this.countdata[0].count + "-" + filePath, this.file);
        this.progress = uploadTask.percentageChanges();
        uploadTask.snapshotChanges().pipe(finalize(() => {
          storageRef.getDownloadURL().subscribe(async downloadURL => {
            this.fileurl = downloadURL;
            if (type == 'add') {
              this.services.addAudios(this.title, this.thumbfileurl, this.fileurl);
              $('#AddModal').modal('hide');
              this.successMessage = "Audio added successfully.";
              $('#SuccessModal').modal('show');
            }

            if (type == 'update') {
              this.services.updateAudios(this.updateId, this.UpdateForm.controls['title'].value, this.thumbfileurl, this.fileurl);
              $('#UpdateModal').modal('hide');
              this.successMessage = "Audio updated successfully.";
              $('#SuccessModal').modal('show');
            }
          });
        })
        ).subscribe();
      }
      else
        if (this.thumbfile) {
          this.countdata = await this.services.count('Meditation-audio');
          this.services.updateCount(this.countdata[0].id, this.countdata[0].type, this.countdata[0].count + 1);
          const thumbfilePath = this.thumbfile.name;
          const thumbstorageRef = this.storage.ref("Meditation-audio/" + this.countdata[0].count + "-" + thumbfilePath);
          const thumbuploadTask = this.storage.upload("Meditation-audio/" + this.countdata[0].count + "-" + thumbfilePath, this.thumbfile);
          this.progress = thumbuploadTask.percentageChanges();
          thumbuploadTask.snapshotChanges().pipe(finalize(() => {
            thumbstorageRef.getDownloadURL().subscribe(downloadURL => {
              this.thumbfileurl = downloadURL;
              if (type == 'add') {
                this.services.addAudios(this.title, this.thumbfileurl, this.fileurl);
                $('#AddModal').modal('hide');
                this.successMessage = "Audio added successfully.";
                $('#SuccessModal').modal('show');
              }

              if (type == 'update') {
                this.services.updateAudios(this.updateId, this.UpdateForm.controls['title'].value, this.thumbfileurl, this.fileurl);
                $('#UpdateModal').modal('hide');
                this.successMessage = "Audio updated successfully.";
                $('#SuccessModal').modal('show');
              }
            });
          })
          ).subscribe();
        }
        else {
          if (type == 'add') {
            this.services.addAudios(this.title, this.thumbfileurl, this.fileurl);
            $('#AddModal').modal('hide');
            this.successMessage = "Audio added successfully.";
            $('#SuccessModal').modal('show');
          }

          if (type == 'update') {
            this.services.updateAudios(this.updateId, this.UpdateForm.controls['title'].value, this.thumbfileurl, this.fileurl);
            $('#UpdateModal').modal('hide');
            this.successMessage = "Audio updated successfully.";
            $('#SuccessModal').modal('show');
          }
        }

  }


  pauseAudio() {
    this.audio;
    // If audio is not undefined and if is playing, pause it
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0; // Rewind track to beginning (is you need this)
    }
  }
  SelectThumbs(event: any) {
    this.thumbfile = event.target.files[0];
    }
  playAudio(src: any) {
    this.pauseAudio();             // Pause any currently playing
    this.audio = new Audio();      // Save a reference
    this.audio.src = src;
    this.audio.play();
  }
}
