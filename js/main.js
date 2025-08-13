(function(){
  const { readJson, writeJson, STORAGE_KEYS } = window.AppStorage;

  function createTimerCard(timer){
    const card = document.createElement('article');
    card.className = 'timer-card';
    card.dataset.timerId = timer.id;

    const header = document.createElement('div');
    header.className = 'timer-header';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'timer-title';

    const titleInput = document.createElement('input');
    titleInput.value = timer.name;
    titleInput.placeholder = 'Timer name';
    titleInput.addEventListener('change', ()=>{
      window.TimerManager.rename(timer.id, titleInput.value.trim());
    });
    titleWrap.appendChild(titleInput);

    const durationInput = document.createElement('input');
    durationInput.className = 'timer-input'
    durationInput.type = 'number';
    durationInput.min = '1';
    durationInput.title = 'Minutes';
    durationInput.value = Math.max(1, Math.round(timer.durationSec/60));
    durationInput.style.width = '82px';
    durationInput.addEventListener('change', ()=>{
      const minutes = Number(durationInput.value);
      window.TimerManager.setDurationMinutes(timer.id, minutes);
    });

    header.appendChild(titleWrap);
    header.appendChild(durationInput);

    const time = document.createElement('div');
    time.className = 'time-display';
    time.textContent = window.TimerManager.formatTime(timer.remainingSec);

    const controls = document.createElement('div');
    controls.className = 'timer-controls';

    const startBtn = document.createElement('button');
    startBtn.className = 'primary-btn';
    startBtn.textContent = timer.isRunning ? 'Pause' : 'Start';
    startBtn.addEventListener('click', ()=>{
      if(timer.isRunning){ window.TimerManager.pause(timer.id); }
      else{ window.TimerManager.start(timer.id); }
    });

    const resetBtn = document.createElement('button');
    resetBtn.className = 'secondary-btn';
    resetBtn.textContent = 'Reset';
    resetBtn.addEventListener('click', ()=> window.TimerManager.reset(timer.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'secondary-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', ()=> window.TimerManager.deleteTimer(timer.id));

    controls.appendChild(startBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(deleteBtn);

    card.appendChild(header);
    card.appendChild(time);
    card.appendChild(controls);

    card.update = (t)=>{
      titleInput.value = t.name;
      durationInput.value = Math.max(1, Math.round(t.durationSec/60));
      time.textContent = window.TimerManager.formatTime(t.remainingSec);
      startBtn.textContent = t.isRunning ? 'Pause' : 'Start';
    };
    return card;
  }

  function renderTimers(){
    const grid = document.getElementById('timersGrid');
    const timers = window.TimerManager.getTimers();
    const idToCard = new Map(Array.from(grid.children).map(c=>[c.dataset.timerId, c]));

    // remove missing
    Array.from(grid.children).forEach(child=>{
      if(!timers.find(t=>t.id===child.dataset.timerId)){
        grid.removeChild(child);
      }
    });
    // add/update
    timers.forEach(t=>{
      let card = idToCard.get(t.id);
      if(!card){
        card = createTimerCard(t);
        grid.appendChild(card);
      }
      card.update(t);
    });
  }

  function initSettingsPanel(){
    const panel = document.getElementById('settingsPanel');
    const toggleBtn = document.getElementById('settingsToggle');
    const closeBtn = document.getElementById('closeSettings');
    toggleBtn.addEventListener('click', ()=>{
      panel.classList.toggle('open');
      panel.setAttribute('aria-hidden', String(!panel.classList.contains('open')));
    });
    closeBtn.addEventListener('click', ()=>{
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
    });
  }

  function initDarkMode(){
    const checkbox = document.getElementById('darkModeToggle');
    const saved = readJson(STORAGE_KEYS.darkMode, { enabled:false });
    if(saved && saved.enabled){
      document.documentElement.classList.add('dark');
      checkbox.checked = true;
    }
    checkbox.addEventListener('change', ()=>{
      const enabled = checkbox.checked;
      document.documentElement.classList.toggle('dark', enabled);
      writeJson(STORAGE_KEYS.darkMode, { enabled });
    });
  }

  function initAmbient(){
    window.Sounds.applyState();
  }

  function initEvents(){
    document.getElementById('addTimerBtn').addEventListener('click', ()=>{
      window.TimerManager.createTimer({ name: 'Timer', minutes: 25 });
    });
    window.TimerManager.onChange(renderTimers);
  }

  function bootstrap(){
    initSettingsPanel();
    window.Backgrounds.initBackgroundUI();
    window.Sounds.initSoundsUI();
    initAmbient();
    initDarkMode();
    initEvents();
    renderTimers();

    // If no timers, create a starter
    if(window.TimerManager.getTimers().length === 0){
      window.TimerManager.createTimer({ name: 'Focus', minutes: 25 });
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bootstrap);
  }else{
    bootstrap();
  }
})();


