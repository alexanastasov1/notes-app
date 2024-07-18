'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import NoteForm from './components/NoteForm';
import NoteGrid from './components/NoteGrid';
import SearchBar from './components/SearchBar';
import Login from './components/Login';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = Cookies.get('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    setIsLoading(false); // Set loading to false after checking for the saved user
  }, []);

  useEffect(() => {
    async function fetchNotes() {
      if (!currentUser) return;

      const res = await fetch(`/api/notes?userId=${currentUser.id}`);
      const data = await res.json();
      setNotes(data);
      setFilteredNotes(data);
    }

    fetchNotes();

    const interval = setInterval(fetchNotes, 10000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const addNote = async (note) => {
    const res = await fetch(`/api/notes?userId=${currentUser.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    const newNote = await res.json();
    setNotes([newNote, ...notes]);
    setFilteredNotes([newNote, ...notes]);
  };

  const updateNote = async (index, updatedNote) => {
    const noteToUpdate = filteredNotes[index];
    await fetch(`/api/notes/${noteToUpdate._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNote),
    });
    const newNotes = notes.map((note) =>
      note._id === noteToUpdate._id ? { ...note, ...updatedNote } : note
    );
    setNotes(newNotes);
    setFilteredNotes(newNotes);
  };

  const deleteNote = async (index) => {
    const noteToDelete = filteredNotes[index];
    await fetch(`/api/notes/${noteToDelete._id}`, {
      method: 'DELETE',
    });
    const newNotes = notes.filter((note) => note._id !== noteToDelete._id);
    setNotes(newNotes);
    setFilteredNotes(newNotes);
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredNotes(notes);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerCaseQuery) ||
        note.content.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredNotes(filtered);
  };

  const handleLogin = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      Cookies.set('currentUser', JSON.stringify(user));
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    Cookies.remove('currentUser');
  };

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading state
  }

  if (!isLoggedIn) {
    return <Login handleLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen flex bg-gray-50">
      <aside className="w-full md:w-1/3 p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Note-Taking App</h1>
        <SearchBar onSearch={handleSearch} />
        <NoteForm addNote={addNote} />
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg mt-1 hover:bg-red-600"
        >
          Log Out
        </button>
      </aside>
      <section className="w-full md:w-2/3 p-4">
        <NoteGrid
          notes={filteredNotes}
          updateNote={updateNote}
          deleteNote={deleteNote}
        />
      </section>
    </main>
  );
}
