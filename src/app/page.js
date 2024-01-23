"use client";
import { useState, useRef, useEffect } from "react";
import { X } from 'lucide-react';
// import SharexSDK from '../../node_modules/sharex-sdk/src/SharexSDK';
import SharexSDK from 'sharex-sdk';
import NoteCard from "./components/note_card";

import Navbar from "./components/navbar";

var sdk = null;
var note_db = null;

export default function Home() {

  const [editorMode, setEditorMode] = useState(false);
  const [noteBodyContent, setNoteBodyContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [notes, setNotes] = useState([]);

  const [note, setNote] = useState({});

  const noteTitleRef = useRef(null);
  const noteBodyRef = useRef(null);

  useEffect(() => {
    if(sdk == null && typeof SharexSDK !== undefined) {
      sdk = new SharexSDK({
        debug: {
          host: '192.168.0.105',
          port: 6060,
        }
      });
      sdk.init((event, data)=>{
        if(event == 'open') {
          init_db();
        }
      });
    }
  }, []);

  const init_db = () => {
    note_db = sdk.createDBInstance("notes_db", (action, data) => {
      fetchAllNotes();
    });
  };

  const fetchAllNotes = () => {
    note_db.find("notes",(resp)=>{
      setNotes(resp.data);
    });
  }

  const handleNoteBodyResize = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    const maxHeight = window.innerHeight - 100;
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  };

  const handleNoteDelete = (uuid) => {
    note_db.deleteById('notes', uuid, (data)=>{
      fetchAllNotes();
    })
  }

  const handleNoteOpen = (index) => {
    setNote(notes[index]);
    note_modal.showModal();
  }

  const handleNoteBlur = () => {
    if(noteBodyRef.current != null && noteTitleRef.current != null) {
      setTimeout(() => {
        if(!(noteBodyRef.current === document.activeElement || noteTitleRef.current === document.activeElement)) {
          if(noteBodyContent.length > 0 || noteTitle.length > 0) {
            note_db.insert("notes",{
              title: noteTitle,
              body: noteBodyContent,
            }, {uuid: true},()=>{
              fetchAllNotes();
            });
            setNoteBodyContent('');
            setNoteTitle('');
            setEditorMode(false);
          }else{
            setEditorMode(false);
          }
        }
      },100);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-between p-10">
        <div className="card w-full sm:w-full md:w-[80%] lg:w-[80%] xl:w-1/2 bg-base-100 shadow-xl">
          {!editorMode ? (
            <div className="card-body p-5 cursor-text" onClick={()=>{setEditorMode(true)}}>
              Type here...
            </div>
          ) : (
            <div className="card-body p-1 cursor-text">
              <div className="flex items-center justify-around">
                <input 
                  type="text" 
                  placeholder="Title" 
                  className="input input-ghost w-full focus:outline-none focus:border-none font-bold" 
                  autoFocus={true}
                  value={noteTitle}
                  onChange={(event)=>{setNoteTitle(event.target.value)}}
                  onBlur={handleNoteBlur}
                  ref={noteTitleRef}
                />
                <button className="btn btn-ghost btn-circle" onClick={()=>{setEditorMode(false)}}>
                  <X />
                </button>
              </div>
              <textarea 
                className="textarea textarea-ghost focus:outline-none focus:border-none resize-none h-full" placeholder="Take a note..." 
                autoFocus={true}
                value={noteBodyContent}
                onChange={(event)=>{setNoteBodyContent(event.target.value)}}
                onInput={handleNoteBodyResize}
                onBlur={handleNoteBlur}
                ref={noteBodyRef}
              ></textarea>
            </div>
          )}
        </div>
      </div>
      {
          notes.length == 0 && (
            <div className="flex items-center justify-center h-96">
              <div className="card shadow-xl">
                <div className="card-body p-5">
                  <h2 className="card-title">No Notes</h2>
                  <p className="text-center">Create new notes to show here...</p>
                </div>
              </div>
            </div>
          )
        }
      <div className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {
          notes.map((note, index) => {
            return <NoteCard key={index} title={note.title} body={note.body} uuid={note._uuid} index={index} onDelete={handleNoteDelete} onOpen={handleNoteOpen} />;
          })
        }
      </div>
      {note && (
      <dialog id="note_modal" className="modal">
        <div className="modal-box w-11/12 max-w-3xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <X />
            </button>
          </form>
          <h3 className="font-bold text-lg">
            {note.title}
          </h3>
          <p className="py-4">{note.body}</p>
        </div>
      </dialog>
      )}
    </main>
  );
}
