'use strict';
class Todo {
   constructor(form, input, todoList, todoCompleted, todoContainer) {
      this.form = document.querySelector(form);
      this.input = document.querySelector(input);
      this.todoList = document.querySelector(todoList);
      this.todoCompleted = document.querySelector(todoCompleted);
      this.todoContainer = document.querySelector(todoContainer);
      this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
   }

   addToStorage() {
      localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
   }

   render() {
      this.todoList.textContent = '';
      this.todoCompleted.textContent = '';
      this.todoData.forEach(this.createItem, this);
      this.addToStorage();

   }
   createItem(todo) {
      const li = document.createElement('li');
      li.classList.add('todo-item');
      li.key = todo.key;

      li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
            <button class="todo-edit"></button>
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
      `);
      if (todo.completed) {
         this.todoCompleted.append(li);
      } else {
         this.todoList.append(li);
      }

   }

   addTodo(e) {
      e.preventDefault();
      if (this.input.value.trim()) {
         const newTodo = {
            value: this.input.value,
            completed: false,
            key: this.generateKey(),
         };
         this.todoData.set(newTodo.key, newTodo);
         this.render();
         this.input.value = '';
      } else {
         alert('Пустое дело добавить нельзя!');
      }
   }
   generateKey() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
   }
   deleteItem(parent) {
      let deleteInterval,
         animate = false,
         count = 0;

      const deleteAnimate = () => {
         const width = document.documentElement.clientWidth; //получаем ширину страницы
         deleteInterval = requestAnimationFrame(deleteAnimate);
         count += 5;
         if (count < 100 && width >= 768) {
            parent.style.left = `${count}%`;
         } else {
            cancelAnimationFrame(deleteInterval);
            this.todoData.delete(parent.key);
            this.render();
         }
      };
      if (!animate) {
         deleteInterval = requestAnimationFrame(deleteAnimate);
         animate = true;
      } else {
         cancelAnimationFrame(deleteInterval);
         animate = false;
         count = 0;
      }

   }

   completedItem(parent) {
      let completedInterval,
         animate = false,
         count = 0;
      const completedAnimate = () => {
         completedInterval = requestAnimationFrame(completedAnimate);
         if (count < 60 && parent.parentElement.id === 'todo') {
            count += 5;
            parent.style.top = `${count}px`;
         } else if (count < 60 && parent.parentElement.id === 'completed') {
            count += 5;
            parent.style.bottom = `${count}px`;
         } else {
            this.todoData.forEach(item => {
               if (parent.key === item.key) {
                  item.completed = !item.completed;
               }
               cancelAnimationFrame(completedInterval);
               this.render();
            });
         }
      };
      if (!animate) {
         completedInterval = requestAnimationFrame(completedAnimate);
         animate = true;
      } else {
         cancelAnimationFrame(completedInterval);
         animate = false;
         count = 0;
      }
   }

   editItem(parent) {
      const span = parent.querySelector('.text-todo');

      if (span.contentEditable === 'true') {
         span.contentEditable = 'false';
         span.blur();
         this.todoData.forEach(item => {
            if (parent.key === item.key) {
               item.value = span.textContent;
            }
         });
         this.render();
      } else {
         span.contentEditable = 'true';
         span.style.outline = 'none';
         span.focus();
      }
   }
   handler() {
      this.todoContainer.addEventListener('click', event => {
         event.preventDefault();
         const target = event.target;
         const parent = target.closest('.todo-item');

         if (target.classList.contains('todo-remove')) {
            this.deleteItem(parent);
         } else if (target.classList.contains('todo-complete')) {
            this.completedItem(parent);
         } else if (target.classList.contains('todo-edit')) {
            this.editItem(parent);
         }
      });
   }

   init() {
      this.form.addEventListener('submit', this.addTodo.bind(this));
      this.render();
      this.handler();
   }

}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();

