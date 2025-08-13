(function(){
  const { STORAGE_KEYS, readJson, writeJson } = window.AppStorage;

  const defaultSounds = [
    { name: 'Rain', url: 'assets/audio/ambient/rain.mp3' },
    { name: 'Forest Birds', url: 'assets/audio/ambient/forest_birds.mp3' },
    { name: 'Coffee Shop', url: 'assets/audio/ambient/coffee_shop.mp3' }
  ];

  let currentSource = null;
  let currentVolume = 0.4;
  let isPlaying = false;

  function getAudio(){
    return document.getElementById('ambientAudio');
  }

  function applyState(){
    const audio = getAudio();
    if(!audio) return;
    if(currentSource){
      if(audio.src !== currentSource){
        audio.src = currentSource;
      }
    }
    audio.volume = currentVolume;
    if(isPlaying && currentSource){
      audio.play().catch(()=>{});
    }else{
      audio.pause();
    }
  }

  function save(){
    writeJson(STORAGE_KEYS.ambient, {
      source: currentSource,
      volume: currentVolume,
      isPlaying
    });
  }

  function load(){
    const saved = readJson(STORAGE_KEYS.ambient, null);
    if(saved){
      currentSource = saved.source || null;
      currentVolume = typeof saved.volume === 'number' ? saved.volume : 0.4;
      isPlaying = !!saved.isPlaying;
    }
  }

  function fileToDataUrl(file){
    return new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function initSoundsUI(){
    const select = document.getElementById('soundSelect');
    const upload = document.getElementById('soundUpload');
    const volume = document.getElementById('volumeSlider');
    const toggle = document.getElementById('ambientToggle');

    // populate defaults
    select.innerHTML = `<option value="">None</option>` + defaultSounds
      .map(s=>`<option value="${s.url}">${s.name}</option>`)
      .join('');

    select.addEventListener('change', (e)=>{
      const url = e.target.value || null;
      currentSource = url;
      save();
      applyState();
    });

    upload.addEventListener('change', async (e)=>{
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      if(!file.type.startsWith('audio/')) return;
      const dataUrl = await fileToDataUrl(file);
      currentSource = dataUrl;
      select.value = '';
      save();
      applyState();
    });

    volume.addEventListener('input', (e)=>{
      currentVolume = Number(e.target.value);
      save();
      applyState();
    });

    toggle.addEventListener('click', ()=>{
      isPlaying = !isPlaying;
      toggle.textContent = isPlaying ? 'Pause Ambient' : 'Play Ambient';
      save();
      applyState();
    });

    // set initial UI values
    volume.value = currentVolume;
    toggle.textContent = isPlaying ? 'Pause Ambient' : 'Play Ambient';
  }

  load();
  window.Sounds = {
    initSoundsUI,
    applyState
  };
})();


