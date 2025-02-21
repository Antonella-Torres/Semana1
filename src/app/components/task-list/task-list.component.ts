import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskItemComponent, MatSnackBarModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks: Task[] = [];
  selectedTask: Task | null = null;

  constructor(private snackBar: MatSnackBar) {
    // Cargar tareas almacenadas localmente si existen
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

  // Persistir tareas en localStorage
  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(taskData: Omit<Task, 'id'>): void {
    const id = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
    const newTask: Task = {
      id,
      ...taskData
    };
    
    this.tasks = [...this.tasks, newTask];
    this.saveTasks();
    this.showNotification('Tarea agregada correctamente');
  }

  updateTask(updatedTask: Task): void {
    this.tasks = this.tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    this.selectedTask = null;
    this.saveTasks();
    this.showNotification('Tarea actualizada correctamente');
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    if (this.selectedTask && this.selectedTask.id === id) {
      this.selectedTask = null;
    }
    this.saveTasks();
    this.showNotification('Tarea eliminada correctamente');
  }

  selectTaskToEdit(task: Task): void {
    this.selectedTask = task;
  }

  cancelEdit(): void {
    this.selectedTask = null;
  }

  toggleTaskCompletion(task: Task): void {
    this.updateTask(task);
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
