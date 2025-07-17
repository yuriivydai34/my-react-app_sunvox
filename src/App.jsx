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
  });
  })

  return (
    <>
      <div>
        <h1>SunVoxLib Demo</h1>
        Status: <font id="status">{status}</font>
      </div>
    </>
  )
}

export default App
