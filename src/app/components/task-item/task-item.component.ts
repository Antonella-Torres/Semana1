import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, MatButtonModule, MatIconModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() deleteTask = new EventEmitter<number>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() toggleComplete = new EventEmitter<Task>();

  onDelete(): void {
    this.deleteTask.emit(this.task.id);
  }

  onEdit(): void {
    this.editTask.emit(this.task);
  }

  onToggleComplete(): void {
    this.toggleComplete.emit({
      ...this.task,
      completed: !this.task.completed
    });
  }
}
