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

    const keys = document.querySelectorAll('.piano-keys');

    keys.forEach((key) => {
      key.addEventListener('click', (e) => {
        const clickedKey = e.target.dataset.key;
        playNoteNumber(parseInt(clickedKey));
      })
    })
  })

  function stopNote() {
    console.log("stopNote");
    sv_send_event(0, 0, NOTECMD_NOTE_OFF, 0, 0, 0, 0);
  }

  function playNoteNumber(number) {
    console.log("playNote", number);
    sv_send_event(0, 0, number, 128, mod + 1, 0, 0);
  }

  return (
    <div className="container">
      <div className="intro-container">
        <h1>How to Build a Piano Using HTML, CSS, and JavaScript</h1>
        <h3>This is a 24-key piano. Click any piano key to play the sound.</h3>
      </div>
      <div className="piano-container">
        <ul className="piano-keys-list">
          <li className="piano-keys white-key" data-key="57"></li>
          <li className="piano-keys black-key" data-key="58"></li>
          <li className="piano-keys white-key" data-key="59"></li>
          <li className="piano-keys black-key" data-key="60"></li>
          <li className="piano-keys white-key" data-key="61"></li>
          <li className="piano-keys black-key" data-key="62"></li>
          <li className="piano-keys white-key" data-key="63"></li>
          <li className="piano-keys white-key" data-key="64"></li>
          <li className="piano-keys black-key" data-key="65"></li>
          <li className="piano-keys white-key" data-key="66"></li>
          <li className="piano-keys black-key" data-key="67"></li>
          <li className="piano-keys white-key" data-key="68"></li>
          <li className="piano-keys white-key" data-key="69"></li>
          <li className="piano-keys black-key" data-key="70"></li>
          <li className="piano-keys white-key" data-key="71"></li>
          <li className="piano-keys black-key" data-key="72"></li>
          <li className="piano-keys white-key" data-key="73"></li>
          <li className="piano-keys black-key" data-key="74"></li>
          <li className="piano-keys white-key" data-key="75"></li>
          <li className="piano-keys white-key" data-key="76"></li>
          <li className="piano-keys black-key" data-key="77"></li>
          <li className="piano-keys white-key" data-key="78"></li>
          <li className="piano-keys black-key" data-key="79"></li>
          <li className="piano-keys white-key" data-key="80"></li>
        </ul>
      </div>
    </div>
  )
}

export default App
