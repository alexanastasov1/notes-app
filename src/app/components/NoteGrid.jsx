import { useState, useRef, useEffect } from 'react';
import { convertNewlinesToBr } from '../utils/convertNewlinesToBr';

const NoteGrid = ({ userId, notes, updateNote, deleteNote }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editNote, setEditNote] = useState({ title: '', content: '' });
  const contentRefs = useRef([]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditNote({
      title: notes[index].title,
      content: notes[index].content,
    });
  };

  useEffect(() => {
    if (editIndex !== null && contentRefs.current[editIndex]) {
      const textarea = contentRefs.current[editIndex];
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editIndex, editNote.content]);

  const handleSave = (index) => {
    updateNote(index, editNote);
    setEditIndex(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {notes.map((note, index) => (
        <div key={note._id} className="bg-white p-4 rounded-lg shadow-md relative">
          {editIndex === index ? (
            <>
              <input
                type="text"
                value={editNote.title}
                onChange={(e) =>
                  setEditNote({
                    ...editNote,
                    title: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <textarea
                ref={(el) => (contentRefs.current[index] = el)}
                value={editNote.content}
                onChange={(e) =>
                  setEditNote({
                    ...editNote,
                    content: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-300 rounded resize-none"
                rows={4}
              />
              <button onClick={() => handleSave(index)} className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600">
                Save
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">{note.title}</h2>
              <p>{convertNewlinesToBr(note.content)}</p>
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 hover:opacity-100">
                <button onClick={() => handleEdit(index)} className="bg-white-500 text-white py-1 px-2 rounded hover:bg-gray-200">
                ✏️
                </button>
                <button onClick={() => deleteNote(index)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default NoteGrid;
