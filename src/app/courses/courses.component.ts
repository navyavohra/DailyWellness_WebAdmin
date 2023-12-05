import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  allUsers: any;
  resultdata: any;
  UpdateForm: FormGroup;
  AddForm: FormGroup;
  GetForm: FormGroup;
  AddQuestionForm: FormGroup;
  UpdateQuestionsForm: FormGroup;
  QuestionsArray: any[] = [];
  AddSuggestionForm: FormGroup;
  UpdateSuggestionsForm: FormGroup;
  SuggestionsArray: any[] = [];
  deleteId: any;
  updateId: any;
  singledata: any;
  thumbfile: any;
  progress!: Observable<any>;
  thumbfileurl: any;
  info: any;
  information: any;
  UpdateQuestions: any[] = [];
  deleteUrl: any;
  countdata: any;
  successMessage: any;

  constructor(private service: ServiceService, public router: Router, private storage: AngularFireStorage, private fb: FormBuilder) {
    this.UpdateForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      courseImage: [''],
    });
    this.AddForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      courseImage: ['', Validators.required],
    });
    this.GetForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      courseImage: ['', Validators.required],
    });
    this.AddQuestionForm = this.fb.group({
      question: ['', Validators.required],
      option1: ['', Validators.required],
      score1: ['', Validators.required],
      option2: ['', Validators.required],
      score2: ['', Validators.required],
    });
    this.AddSuggestionForm = this.fb.group({
      suggestion: ['', Validators.required],
      score: ['', Validators.required],
    });
    this.UpdateQuestionsForm = this.fb.group({

      UpdatequestionsArray: this.fb.array([]),

    });
    this.UpdateSuggestionsForm = this.fb.group({

      UpdateSuggestionsArray: this.fb.array([]),
    });
  }

  get UpdatequestionsArray(): FormArray {
    return <FormArray>this.UpdateQuestionsForm.get('UpdatequestionsArray');
  }
  get UpdateSuggestionsArray(): FormArray {
    return <FormArray>this.UpdateSuggestionsForm.get('UpdateSuggestionsArray');
  }

  addquestions(UpdatequestionsArray: any) {
    this.UpdatequestionsArray.push(this.createQuestionsGroup(UpdatequestionsArray));
  }
  addquestionsmt() {
    this.UpdatequestionsArray.push(this.createQuestionsGroupmt());
  }
  addSuggestions(UpdateSuggestionsArray: any) {
    this.UpdateSuggestionsArray.push(this.createSuggestionsGroup(UpdateSuggestionsArray));
  }
  addSuggestionsmt() {
    this.UpdateSuggestionsArray.push(this.createSuggestionsGroupmt());
  }

  createQuestionsGroup(UpdatequestionsArray: any): FormGroup {
    return this.fb.group({
      question: [UpdatequestionsArray.question, [Validators.required]],
      option1: [UpdatequestionsArray.options[0].text, [Validators.required]],
      score1: [UpdatequestionsArray.options[0].score, [Validators.required]],
      option2: [UpdatequestionsArray.options[1].text, [Validators.required]],
      score2: [UpdatequestionsArray.options[1].score, [Validators.required]]
    })
  }
  createQuestionsGroupmt(): FormGroup {
    return this.fb.group({
      question: ["", [Validators.required]],
      option1: ["", [Validators.required]],
      score1: ["", [Validators.required]],
      option2: ["", [Validators.required]],
      score2: ["", [Validators.required]]
    })
  }
  createSuggestionsGroup(UpdateSuggestionsArray: any): FormGroup {
    return this.fb.group({
      suggestion: [UpdateSuggestionsArray.suggestion, [Validators.required]],
      score: [UpdateSuggestionsArray.score, [Validators.required]],
    })
  }
  createSuggestionsGroupmt(): FormGroup {
    return this.fb.group({
      suggestion: ['', [Validators.required]],
      score: ['', [Validators.required]],
    })
  }

  

  get fvaladd() {
    return this.AddForm.controls;
  }

  get fvalupdate() {
    return this.UpdateForm.controls;
  }

  ngOnInit(): void {
    this.getCourses();
  }

  async getCourses() {
    this.allUsers = await this.service.getAllCourses();
    this.resultdata = this.allUsers;

  }

  getSingleCourse(id: any) {

    this.updateId = id;
    this.service.getSingleCourses(id).subscribe(
      (data: any) => {
        this.singledata = data;

        this.GetForm.controls['courseName'].setValue(this.singledata.courseName);
        this.GetForm.controls['courseDescription'].setValue(this.singledata.courseDescription);

      });
  }

  deleteCourse(id: any) {
    this.deleteId = id;

  }

  Reload() {
    location.reload();
  }

  ConfirmDelete() {
    this.service.getSingleCourses(this.deleteId).subscribe(
      (data: any) => {
        this.deleteUrl = data.courseImage;
        let fileRef = this.storage.refFromURL(this.deleteUrl);
        fileRef.delete();
      });
    this.service.deleteCourses(this.deleteId);
    this.deleteId = undefined;
    $('#DeleteModal').modal('hide');
    this.successMessage = "Course deleted successfully.";
    $('#SuccessModal').modal('show');
  }

  CancelDelete() {
    this.deleteId = undefined;
    location.reload();
  }

  SaveQuestions() {
    this.QuestionsArray.push({
      'question': this.AddQuestionForm.controls['question'].value,
      'options': [{
        'text': this.AddQuestionForm.controls['option1'].value,
        'score': this.AddQuestionForm.controls['score1'].value,
      }, {
        'text': this.AddQuestionForm.controls['option2'].value,
        'score': this.AddQuestionForm.controls['score2'].value
      }]
    });

    this.AddQuestionForm.reset();
  }

  getCoursebyId(id: any) {
    this.updateId = id;

    this.service.getSingleCourses(id).subscribe(
      (data: any) => {
        this.thumbfileurl = data.courseImage;
        this.UpdatequestionsArray.clear();
        this.singledata = data.questions;
        this.info = this.singledata;
        this.info.forEach((contact: any) => {
          this.addquestions(contact)
        });
        this.UpdateSuggestionsArray.clear();
        this.singledata = data.suggestions;
        this.info = this.singledata;
        this.info.forEach((contact: any) => {
          this.addSuggestions(contact)
        });
        this.UpdateForm.controls['courseName'].setValue(data.courseName);
        this.UpdateForm.controls['courseDescription'].setValue(data.courseDescription);
      });
  }

  AddCourse() {

    const thumbfilePath = this.thumbfile.name;
    const thumbstorageRef = this.storage.ref("CourseImage/" + thumbfilePath);
    const thumbuploadTask = this.storage.upload("CourseImage/" + thumbfilePath, this.thumbfile);
    this.progress = thumbuploadTask.percentageChanges();
    thumbuploadTask.snapshotChanges().pipe(finalize(() => {
      thumbstorageRef.getDownloadURL().subscribe(downloadURL => {
        this.thumbfileurl = downloadURL;
        this.service.AddCourses(
          this.AddForm.controls['courseName'].value,
          this.AddForm.controls['courseDescription'].value,
          this.thumbfileurl,
          this.QuestionsArray,
          this.SuggestionsArray
        );
        $('#AddSuggestionsModal').modal('hide');
      this.successMessage = "Course added successfully.";
      $('#SuccessModal').modal('show');
      });
    })
    ).subscribe();
  }

  async UpdateCourse() {
    this.UpdatequestionsArray.value.forEach((element: any) => {
      this.UpdateQuestions.push({
        'question': element.question,
        'options': [{
          'text': element.option1,
          'score': element.score1,
        }, {
          'text': element.option2,
          'score': element.score2
        }]
      })
    });
    if (this.thumbfile) {
      this.countdata = await this.service.count('CourseImage');
      this.service.updateCount(this.countdata[0].id, this.countdata[0].type, this.countdata[0].count + 1);
      const thumbfilePath = this.thumbfile.name;
      const thumbstorageRef = this.storage.ref("CourseImage/" + this.countdata[0].count + "-" + thumbfilePath);
      const thumbuploadTask = this.storage.upload("CourseImage/" + this.countdata[0].count + "-" + thumbfilePath, this.thumbfile);
      this.progress = thumbuploadTask.percentageChanges();
      thumbuploadTask.snapshotChanges().pipe(finalize(() => {
        thumbstorageRef.getDownloadURL().subscribe(downloadURL => {
          this.thumbfileurl = downloadURL;
          this.service.UpdateCourses(
            this.updateId,
            this.UpdateForm.controls['courseName'].value,
            this.UpdateForm.controls['courseDescription'].value,
            this.thumbfileurl,
            this.UpdateQuestions,
            this.UpdateSuggestionsArray.value
          );
          $('#UpdateSuggestionsModal').modal('hide');
          this.successMessage = "Course updated successfully.";
          $('#SuccessModal').modal('show');
        });
      })
      ).subscribe();
    }
    else {
      this.service.UpdateCourses(
        this.updateId,
        this.UpdateForm.controls['courseName'].value,
        this.UpdateForm.controls['courseDescription'].value,
        this.thumbfileurl,
        this.UpdateQuestions,
        this.UpdateSuggestionsArray.value
      );
      $('#UpdateSuggestionsModal').modal('hide');
      this.successMessage = "Course updated successfully.";
      $('#SuccessModal').modal('show');
    }

  }

  SaveSuggestions() {
    this.SuggestionsArray.push({
      'suggestion': this.AddSuggestionForm.controls['suggestion'].value,
      'score': this.AddSuggestionForm.controls['score'].value,
    });

    this.AddSuggestionForm.reset();
  }

  SelectThumbs(event: any) {
    this.thumbfile = event.target.files[0];
  }
}
