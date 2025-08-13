(function(){
  const { STORAGE_KEYS, readJson, writeJson } = window.AppStorage;

  const defaultBackgrounds = [
    { name: 'Default 1', path: 'assets/images/backgrounds/bg1.jpg' },
    { name: 'Default 2', path: 'assets/images/backgrounds/bg2.jpg' },
    { name: 'Default 3', path: 'assets/images/backgrounds/bg3.jpg' }
  ];

  function applyBackground(source){
    if(!source){
      document.body.style.backgroundImage = '';
      return;
    }
    document.body.style.backgroundImage = `url("${source}")`;
  }

  function setBackground(source){
    writeJson(STORAGE_KEYS.background, { source });
    applyBackground(source);
  }

  function loadBackground(){
    const saved = readJson(STORAGE_KEYS.background, null);
    if(saved && saved.source){
      applyBackground(saved.source);
    }
  }

  function initBackgroundUI(){
    const select = document.getElementById('backgroundSelect');
    const upload = document.getElementById('backgroundUpload');
    const clearBtn = document.getElementById('clearBackground');

    // Populate select
    select.innerHTML = `<option value="">None</option>` + defaultBackgrounds
      .map((bg)=>`<option value="${bg.path}">${bg.name}</option>`)
      .join('');

    select.addEventListener('change', (e)=>{
      const value = e.target.value;
      if(value){ setBackground(value); }
    });

    upload.addEventListener('change', async (e)=>{
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      if(!file.type.startsWith('image/')) return;
      const dataUrl = await fileToDataUrl(file);
      setBackground(dataUrl);
    });

    clearBtn.addEventListener('click', ()=>{
      writeJson(STORAGE_KEYS.background, null);
      applyBackground('');
      select.value = '';
      upload.value = '';
    });
  }

  function fileToDataUrl(file){
    return new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  loadBackground();

  window.Backgrounds = {
    initBackgroundUI,
    setBackground
  };
})();


