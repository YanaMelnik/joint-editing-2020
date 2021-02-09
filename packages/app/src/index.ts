window.onload = () => {
  const uiBuffer: SharedArrayBuffer = new SharedArrayBuffer(1000000);
  const uiUint: Uint32Array = new Uint32Array(uiBuffer);

  const worker: Worker = new Worker('worker.js');
  worker.postMessage({ action: 'connect', value: `ws://${window.location.host}/ws` });

  let textUpdated: boolean = false;
  const textArea: HTMLTextAreaElement = document.getElementById('sourceArea') as HTMLTextAreaElement;
  textArea.addEventListener('keyup', () => {
    textUpdated = true;
  });

  setInterval(() => {
    if (!textUpdated) {
      return;
    }

    const text: string = textArea.value;

    for (let i = 0; i < uiBuffer.byteLength / 4; i += 1) {
      const charCode = text.length > i ? text.charCodeAt(i) : 0;

      Atomics.store(uiUint, i, charCode);
    }
    worker.postMessage({ action: 'update' });
    textUpdated = false;
  }, 2000);

  worker.postMessage(uiBuffer);

  worker.onmessage = () => {
    const charArray = [];

    for (let i = 0; i < uiUint.byteLength / 4; i += 1) {
      const charCode = Atomics.load(uiUint, i);

      if (charCode === 0) break;

      charArray.push(charCode);
    }

    textArea.value = String.fromCharCode(...charArray);
  };
};
