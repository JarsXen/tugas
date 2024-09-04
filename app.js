document.addEventListener("DOMContentLoaded", () => {
    const dayName = document.getElementById('day-name');
    const scheduleList = document.getElementById('schedule-list');
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');
    const taskForm = document.getElementById('task-form');
    const greeting = document.getElementById('greeting');
    const successPopup = document.getElementById('success-popup');
    const successMessage = document.getElementById('success-message');
    const popupText = document.getElementById('popup-text');
    const popupClose = document.getElementById('popup-close');
  
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    const schedule = {
        'Monday': ['Matematika', 'Bahasa Indonesia', 'IPA'],
        'Tuesday': ['IPS', 'Bahasa Inggris', 'Seni Budaya'],
        'Wednesday': ['Pendidikan Jasmani', 'Matematika', 'IPA'],
        'Thursday': ['Bahasa Indonesia', 'Prakarya', 'Agama'],
        'Friday': ['Bahasa Inggris', 'IPS', 'Pendidikan Jasmani']
    };
  
    function showGreeting() {
        const today = new Date();
        const hour = today.getHours();
        let greetingMessage = "";
  
        if (hour < 12) {
            greetingMessage = "Selamat Pagi, Fajar";
        } else if (hour < 18) {
            greetingMessage = "Selamat Siang, Fajar";
        } else {
            greetingMessage = "Selamat Malam, Fajar";
        }
  
        greeting.textContent = greetingMessage;
    }
  
    function showCurrentDaySchedule() {
        const today = new Date();
        const day = today.toLocaleDateString('en-US', { weekday: 'long' });
        dayName.textContent = day;
  
        scheduleList.innerHTML = schedule[day]
            ? schedule[day].map(subject => `<li>${subject}</li>`).join('')
            : '<li>Tidak ada jadwal</li>';
    }
  
    function displayTasks() {
        taskList.innerHTML = tasks.length > 0 
            ? tasks.map((task, index) => {
                const deadlineDate = new Date(task.deadline);
                const today = new Date();
                const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
                let deadlineMessage = '';
                if (daysLeft <= 2 && !task.completed) {
                    deadlineMessage = `<span class="deadline-warning">Deadline mendekat! (${daysLeft} hari lagi)</span>`;
                }
                if (daysLeft < 0) {
                    deleteTask(index); // Remove task if past deadline
                }
                return `<li class="${task.completed ? 'completed' : ''}">
                  <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                  ${task.name} (Deadline: ${task.deadline})
                  ${deadlineMessage}
                  <button class="delete-btn" onclick="deleteTask(${index})">Hapus</button>
                </li>`;
            }).join('')
            : '<li>Tidak ada tugas</li>';
    }
  
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
        if (tasks[index].completed) {
            showSuccessMessage('Tugas telah selesai!');
        }
    }
  
    function deleteTask(index) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
  
    function showSuccessMessage(message) {
        popupText.textContent = message;
        successPopup.style.display = 'flex';
        setTimeout(() => {
            successPopup.style.opacity = '0';
        }, 3000); // Hide success message after 3 seconds
  
        setTimeout(() => {
            successPopup.style.display = 'none';
            successPopup.style.opacity = '1';
        }, 3500); // Reset opacity and display for the next message
    }
  
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDeadline = document.getElementById('task-deadline').value;
  
        tasks.push({ name: taskName, deadline: taskDeadline, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
  
        displayTasks();
        showSuccessMessage('Tugas berhasil ditambahkan!');
  
        modal.style.display = 'none';
    });
  
    addTaskBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
  
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
  
    popupClose.addEventListener('click', () => {
        successPopup.style.display = 'none';
    });
  
    showGreeting();
    showCurrentDaySchedule();
    displayTasks();
});
