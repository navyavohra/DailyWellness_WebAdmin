import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ServiceService } from '../services/service.service';
import { FormBuilder, FormGroup , Validators } from '@angular/forms'
import { Storage, ref, uploadBytesResumable, getDownloadURL, percentage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
  allQuotes: any;
  resultdata: any;
  file: any;
  UpdateForm: FormGroup;
  selectedQuote: any;
  AddForm: FormGroup;
  title: any;
  progressbar: any;
  deleteId: any;
  updateId: any;
  downloadUrl: any;
  id: any;
  submitted: any;
  progress!: Observable<any>;
  quote: any;
  allEmojis: any;
  Emojis: any;
  mood: any;
  emotion: any;
  successMessage: any;

  constructor(private services: ServiceService,public router:Router, private storage: AngularFireStorage, private fb: FormBuilder) {

    this.UpdateForm = this.fb.group({
      mood: ['',Validators.required],
      quote: ['',Validators.required]
    });
    this.AddForm = this.fb.group({
      mood: ['',Validators.required],
      quote: ['',Validators.required]
    })
  }

  get fvaladd() {
    return this.AddForm.controls;
  } 
  get fvalupdate(){
    return this.UpdateForm.controls;
  }  

  ngOnInit(): void {
    this.getQuotes();
    this.getEmojis();
  }
  async getQuotes() {
    this.allQuotes = await this.services.getAllQuotes();
    this.resultdata = this.allQuotes;
  }
  async getEmojis() {
    this.allEmojis = await this.services.getAllEmojis();
    this.Emojis = this.allEmojis;
  }

  addQuotes() {
    this.submitted = true;
    this.title = this.AddForm.controls['mood'].value;
    this.mood = this.title.split(",")[0];
    this.emotion = this.title.split(",")[1];
    this.quote = this.AddForm.controls['quote'].value;
    this.services.addQuotes(this.mood, this.quote,this.emotion);
    $('#AddModal').modal('hide');
    this.successMessage = "Quote added successfully.";
    $('#SuccessModal').modal('show');
  }

  updateQuotes() {
    this.submitted = true;
    this.title = this.UpdateForm.controls['mood'].value;
    this.mood = this.title.split(",")[0];
    this.emotion = this.title.split(",")[1];
    this.quote = this.UpdateForm.controls['quote'].value;
    this.services.updateQuotes(this.updateId, this.mood, this.quote,this.emotion);
    $('#UpdateModal').modal('hide');
    this.successMessage = "Quote updated successfully.";
    $('#SuccessModal').modal('show');
  }
  deleteQuotes(id: any) {
    this.deleteId = id;
  }

  ConfirmDelete() {
    this.services.deleteQuotes(this.deleteId);
    this.deleteId = undefined;
    $('#DeleteModal').modal('hide');
    this.successMessage = "Quote deleted successfully.";
    $('#SuccessModal').modal('show');
    // this.id = setInterval(() => {
    //   location.reload();
    //  }, 1000);
  }

  CancelDelete() {
    this.deleteId = undefined;
    location.reload();
  }

  getQuotesbyId(id: any) {
    this.updateId = id;
    this.services.getsingleQuote(id).subscribe(
      (data: any) => {
        this.selectedQuote = data;
        this.UpdateForm.controls['mood'].setValue(data.mood + "," + data.emotion);
        this.UpdateForm.controls['quote'].setValue(data.quote);
      });
  }
  Reload(){
    location.reload()
  }
  
 
}
