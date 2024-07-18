document.addEventListener('DOMContentLoaded', () => {
    const createNoteButton = document.getElementById('create-note');
    const saveNoteButton = document.getElementById('save-note');
    const noteForm = document.getElementById('note-form');
    const notesContainer = document.getElementById('notes-container');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const loginSubmitButton = document.getElementById('login-submit');
    const registerSubmitButton = document.getElementById('register-submit');
    const logoutButton = document.getElementById('logout-button');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authForms = document.getElementById('auth-forms');
    const authNav = document.getElementById('auth-nav');
    const userNav = document.getElementById('user-nav');
    let selectedColor = '#ffffff';
  
    const API_BASE_URL = 'http://localhost:3000'; // Ensure this matches your backend server's URL
  
    loginButton.addEventListener('click', () => {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
    });
  
    registerButton.addEventListener('click', () => {
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
    });
  
    loginSubmitButton.addEventListener('click', async () => {
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
  
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        authForms.style.display = 'none';
        authNav.style.display = 'none';
        userNav.style.display = 'flex';
        fetchNotes();
      } else {
        alert('Login failed');
      }
    });
  
    registerSubmitButton.addEventListener('click', async () => {
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
  
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        authForms.style.display = 'none';
        authNav.style.display = 'none';
        userNav.style.display = 'flex';
        fetchNotes();
      } else {
        alert('Registration failed');
      }
    });
  
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      authNav.style.display = 'flex';
      userNav.style.display = 'none';
      notesContainer.innerHTML = '';
      authForms.style.display = 'block';
    });
  
    createNoteButton.addEventListener('click', () => {
      noteForm.style.display = 'block';
    });
  
    saveNoteButton.addEventListener('click', async () => {
      const title = document.getElementById('note-title').value;
      const content = document.getElementById('note-content').value;
      const tags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim());
      const reminder = document.getElementById('note-reminder').value;
      
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, content, tags, reminder, color: selectedColor })
      });
  
      if (response.ok) {
        const note = await response.json();
        renderNote(note);
        noteForm.style.display = 'none';
      } else {
        alert('Failed to save note');
      }
    });
  
    document.querySelectorAll('.color-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        selectedColor = event.target.getAttribute('data-color');
      });
    });
  
    async function fetchNotes() {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const notes = await response.json();
      notes.forEach(note => renderNote(note));
    }
  
    function renderNote(note) {
      const noteElement = document.createElement('div');
      noteElement.className = 'note';
      noteElement.style.backgroundColor = note.color;
      noteElement.innerHTML = `
        <div class="note-header">
          <h2>${note.title}</h2>
          <div class="note-tags">${note.tags.join(', ')}</div>
        </div>
        <p>${note.content}</p>
        ${note.reminder ? `<p>Reminder: ${new Date(note.reminder).toLocaleString()}</p>` : ''}
      `;
      notesContainer.appendChild(noteElement);
    }
  
    async function fetchReminders() {
      notesContainer.innerHTML = '';
      const response = await fetch(`${API_BASE_URL}/notes/reminders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const notes = await response.json();
      notes.forEach(note => renderNote(note));
    }
  
    document.getElementById('view-reminders').addEventListener('click', fetchReminders);
  
    fetchNotes();
  });
  