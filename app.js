document.addEventListener("DOMContentLoaded", function () {
  const greeting = document.getElementById("greeting");
  const dayName = document.getElementById("day-name");
  const scheduleList = document.getElementById("schedule-list");
  const taskList = document.getElementById("task-list");
  const addTaskBtn = document.getElementById("add-task-btn");
  const modal = document.getElementById("task-modal");
  const closeModal = document.getElementById("close-btn");
  const taskForm = document.getElementById("task-form");
  const progressFill = document.getElementById("progress-fill");
  const successMessage = document.getElementById("success-message");
  const dailyQuote = document.getElementById("daily-quote");

  // Greet user based on time of day
  function setGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let greetingText = "Selamat ";

    if (hours < 12) {
      greetingText += "Pagi";
    } else if (hours < 18) {
      greetingText += "Siang";
    } else if (hours < 21) {
      greetingText += "Sore";
    } else {
      greetingText += "Malam";
    }
    greeting.textContent = `${greetingText}, Fajar!`;
  }

  // Display current day and schedule
  function displayCurrentDaySchedule() {
    const now = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const currentDay = days[now.getDay()];
    dayName.textContent = currentDay;

    // Example schedule for each day
    const schedules = {
      "Senin": ["PJOK", "Ppkn", "Pkwu", "Sejarah"],
      "Selasa": ["Informatika Lanjut", "Matematika Lanjut"],
      "Rabu": ["Bahasa Indonesia", "PAI", "Bahasa Inggris"],
      "Kamis": ["Fisika Lanjut", "Kimia Lanjut"],
      "Jumat": ["Seni Budaya", "BK", "Matematika Wajib"],
      "Sabtu": ["Hari Libur"],
      "Minggu": ["Hari Libur"]
    };

    scheduleList.innerHTML = schedules[currentDay]
      .map(subject => `<li>${subject}</li>`)
      .join("");
  }

  // Add a new task
  function addTask(taskName, taskDeadline) {
    const task = {
      name: taskName,
      deadline: taskDeadline,
      completed: false,
    };

    const tasks = getTasks();
    tasks.push(task);
    setTasks(tasks);
    displayTasks();
    updateProgress();

    // Show success message
    showSuccessMessage("Tugas Berhasil Ditambahkan!");
  }

  // Display tasks with deadline warning
  function displayTasks() {
    const tasks = getTasks();
    const now = new Date();
    const warningThreshold = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

    taskList.innerHTML = tasks
      .map((task, index) => {
        const deadlineDate = new Date(task.deadline);
        const timeDifference = deadlineDate - now;
        const isWarning = timeDifference <= warningThreshold && !task.completed;

        return `
          <li class="${task.completed ? 'completed' : ''} ${isWarning ? 'warning' : ''}">
            ${task.name} - Deadline: ${task.deadline}
            ${isWarning ? '<span class="warning-text">Peringatan: Deadline Mendekat!</span>' : ''}
            <button onclick="markTaskComplete(${index})">Selesai</button>
            <button onclick="deleteTask(${index})">Hapus</button>
          </li>`;
      })
      .join("");
  }

  // Mark task as complete
  window.markTaskComplete = function (index) {
    const tasks = getTasks();
    tasks[index].completed = true;
    setTasks(tasks);
    displayTasks();
    updateProgress();
    showSuccessMessage("Tugas Selesai!");
  };

  // Delete task
  window.deleteTask = function (index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    setTasks(tasks);
    displayTasks();
    updateProgress();
  };

  // Update task progress
  function updateProgress() {
    const tasks = getTasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressFill.style.width = `${progressPercentage}%`;
  }

  // Show success message
  function showSuccessMessage(message) {
    const successText = document.getElementById("success-text");
    successText.textContent = message;
    successMessage.style.display = "block";

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 2000);
  }

  // Get tasks from local storage
  function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  // Set tasks in local storage
  function setTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Daily motivation quote
  function setDailyQuote() {
    const quotes = [
      "Jangan menyerah pada mimpimu.",
      "Kesuksesan datang dari usaha keras.",
      "Terus belajar, terus berkembang.",
      "Hari ini adalah hari terbaik untuk memulai.",
    ];

    const randomIndex = Math.floor(Math.random() * quotes.length);
    dailyQuote.textContent = quotes[randomIndex];
  }

  // Initialize App
  function initializeApp() {
    setGreeting();
    displayCurrentDaySchedule();
    displayTasks();
    updateProgress();
    setDailyQuote();

    addTaskBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Form submission for adding task
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskName = document.getElementById("task-name").value;
      const taskDeadline = document.getElementById("task-deadline").value;
      addTask(taskName, taskDeadline);
      modal.style.display = "none";
      taskForm.reset();
    });

    // Close modal when clicking outside the content
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    // Delete tasks that have passed their deadline
    const now = new Date();
    const tasks = getTasks();
    const updatedTasks = tasks.filter(task => new Date(task.deadline) >= now || task.completed);
    setTasks(updatedTasks);
    displayTasks();
  }

  initializeApp();
});
