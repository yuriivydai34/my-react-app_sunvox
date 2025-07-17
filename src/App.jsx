import { useEffect, useRef, useState } from 'react'
import './App.css'

function useOnceCall(cb, condition = true) {
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (condition && !isCalledRef.current) {
      isCalledRef.current = true;
      cb();
    }
  }, [cb, condition]);
}

let mod;
let fileSize = 0;

function App() {
  const [status, setStatus] = useState('initial');

  function updateStatus(s) { setStatus(s); console.log(s); }

  useOnceCall(() => {
    svlib.then(function (Module) {
      svlib = Module;
      updateStatus("SunVoxLib loading is complete");

      var ver = sv_init(0, 44100, 2, 0);
      if (ver >= 0) {
        updateStatus("init ok");

      }
      else {
        updateStatus("init error");
        return;
      }
      sv_open_slot(0);
      // The SunVox is initialized.
      // Slot 0 is open and ready for use.
      // Then you can load and play some files in this slot.

      //
      // Try to load some module (instrument):
      //
      updateStatus("loading test song...");
      var req = new XMLHttpRequest();
      req.open("GET", "music/flute.xi", true);
      req.responseType = "arraybuffer";
      req.onload = function (e) {
        if (this.status != 200) {
          updateStatus("file not found");
          return;
        }
        var arrayBuffer = this.response;
        if (arrayBuffer) {
          var byteArray = new Uint8Array(arrayBuffer);
          sv_lock_slot(0);
          mod = sv_new_module(0, "Sampler", "Sampler", 0, 0, 0);
          sv_unlock_slot(0);
          if (mod > 0) {
            fileSize = byteArray.byteLength;
            updateStatus("module (instrument) created, size: " + fileSize + " bytes");
            sv_lock_slot(0);
            sv_connect_module(0, mod, 0);
            sv_unlock_slot(0);
            sv_sampler_load_from_memory(0, mod, byteArray, -1);
            // updateStatus("module (instrument) loaded");
          }
          else {
            updateStatus("module load error");
          }
        }
      };
      req.send(null);
    });
  })

  function playNote() {
    console.log("playNote");
    sv_send_event(0, 0, 64, 128, mod + 1, 0, 0);
  }

  function stopNote() {
    console.log("stopNote");
    sv_send_event(0, 0, NOTECMD_NOTE_OFF, 0, 0, 0, 0);
  }

  return (
    <>
      <div>
        <h1>SunVoxLib Demo</h1>
        Status: <font id="status">{status}</font>
        <form action="">
          <button type="button" onClick={playNote}><big>Play note</big></button>
          <button type="button" onClick={stopNote}><big>Stop note</big></button>
        </form>
      </div>
    </>
  )
}

export default App
