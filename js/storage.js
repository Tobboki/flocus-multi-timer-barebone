// LocalStorage helpers with safe JSON handling
(function(){
  const STORAGE_KEYS = {
    timers: 'flocus_timers_v1',
    background: 'flocus_background_v1',
    ambient: 'flocus_ambient_v1',
    darkMode: 'flocus_dark_mode_v1'
  };

  function readJson(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(err){
      console.warn('Storage read error for', key, err);
      return fallback;
    }
  }

  function writeJson(key, value){
    try{
      localStorage.setItem(key, JSON.stringify(value));
    }catch(err){
      console.warn('Storage write error for', key, err);
    }
  }

  window.AppStorage = {
    STORAGE_KEYS,
    readJson,
    writeJson
  };
})();


