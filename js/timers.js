(function(){
  const { STORAGE_KEYS, readJson, writeJson } = window.AppStorage;

  const timersById = new Map();
  const intervalById = new Map();
  let listeners = new Set();

  function notify(){
    listeners.forEach(fn=>{
      try{ fn(getTimers()); }catch(err){ console.error(err); }
    });
  }

  function save(){
    const serializable = getTimers().map(t=>({
      id: t.id,
      name: t.name,
      durationSec: t.durationSec,
      remainingSec: t.remainingSec,
      isRunning: false,
      createdAt: t.createdAt
    }));
    writeJson(STORAGE_KEYS.timers, serializable);
  }

  function load(){
    const arr = readJson(STORAGE_KEYS.timers, []);
    (arr||[]).forEach(t=>{
      timersById.set(t.id, { ...t, isRunning:false });
    });
  }

  function generateId(){
    return 't_'+Math.random().toString(36).slice(2,10)+Date.now().toString(36);
  }

  function getTimers(){
    return Array.from(timersById.values()).sort((a,b)=>a.createdAt - b.createdAt);
  }

  function createTimer({ name = 'Timer', minutes = 25 } = {}){
    const durationSec = Math.max(1, Math.round(minutes))*60;
    const timer = {
      id: generateId(),
      name,
      durationSec,
      remainingSec: durationSec,
      isRunning: false,
      createdAt: Date.now()
    };
    timersById.set(timer.id, timer);
    save();
    notify();
    return timer;
  }

  function deleteTimer(id){
    pause(id);
    timersById.delete(id);
    save();
    notify();
  }

  function start(id){
    const t = timersById.get(id);
    if(!t || t.isRunning) return;
    t.isRunning = true;
    const tick = () => {
      t.remainingSec = Math.max(0, t.remainingSec - 1);
      if(t.remainingSec === 0){
        pause(id);
      }
      notify();
    };
    intervalById.set(id, setInterval(tick, 1000));
    notify();
  }

  function pause(id){
    const t = timersById.get(id);
    if(!t) return;
    t.isRunning = false;
    const intId = intervalById.get(id);
    if(intId){
      clearInterval(intId);
      intervalById.delete(id);
    }
    save();
    notify();
  }

  function reset(id){
    const t = timersById.get(id);
    if(!t) return;
    pause(id);
    t.remainingSec = t.durationSec;
    save();
    notify();
  }

  function rename(id, name){
    const t = timersById.get(id);
    if(!t) return;
    t.name = name || 'Timer';
    save();
    notify();
  }

  function setDurationMinutes(id, minutes){
    const t = timersById.get(id);
    if(!t) return;
    const newDurationSec = Math.max(1, Math.round(minutes))*60;
    t.durationSec = newDurationSec;
    if(!t.isRunning){
      t.remainingSec = newDurationSec;
    }else if(t.remainingSec > newDurationSec){
      t.remainingSec = newDurationSec;
    }
    save();
    notify();
  }

  function formatTime(totalSeconds){
    const s = Math.max(0, Math.floor(totalSeconds));
    const mm = Math.floor(s/60).toString().padStart(2,'0');
    const ss = (s%60).toString().padStart(2,'0');
    return `${mm}:${ss}`;
  }

  function onChange(listener){
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function clearAll(){
    Array.from(timersById.keys()).forEach(id=>pause(id));
    timersById.clear();
    save();
    notify();
  }

  load();

  window.TimerManager = {
    getTimers,
    createTimer,
    deleteTimer,
    start,
    pause,
    reset,
    rename,
    setDurationMinutes,
    formatTime,
    onChange,
    clearAll
  };
})();


