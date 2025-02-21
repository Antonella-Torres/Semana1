import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCheckboxModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() addTask = new EventEmitter<Omit<Task, 'id'>>();
  @Output() updateTask = new EventEmitter<Task>();
  @Output() cancelEdit = new EventEmitter<void>();

  taskForm: FormGroup;
  editMode = false;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.setFormValues();
  }

  ngOnChanges(): void {
    this.setFormValues();
  }

  setFormValues(): void {
    if (this.taskToEdit) {
      this.editMode = true;
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description,
        completed: this.taskToEdit.completed
      });
    } else {
      this.editMode = false;
      this.taskForm.reset({
        title: '',
        description: '',
        completed: false
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value;
    
    if (this.editMode && this.taskToEdit) {
      this.updateTask.emit({
        ...formValue,
        id: this.taskToEdit.id
      });
    } else {
      this.addTask.emit(formValue);
    }

    if (!this.editMode) {
      this.taskForm.reset({
        title: '',
        description: '',
        completed: false
      });
    }
  }

  onCancel(): void {
    this.cancelEdit.emit();
    this.taskForm.reset({
      title: '',
      description: '',
      completed: false
    });
  }

  get title() { return this.taskForm.get('title'); }
}