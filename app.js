(() => {
  'use strict';

  const STORAGE_KEY = 'afternoon-pump-data-v1';
  const main = document.getElementById('main');
  const toastEl = document.getElementById('toast');
  const nav = document.querySelector('.bottom-nav');
  const brand = document.getElementById('brand-home');
  const overlayRoot = document.getElementById('overlay-root');
  const headerDate = document.getElementById('header-date');
  const weekdayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date();
  headerDate.innerHTML = `${weekdayNames[today.getDay()]}<br>${today.toLocaleDateString('en-US',{month:'short',day:'numeric'})}`;

  const EX = {
    chestPress: {name:'Chest press', focus:'Chest · triceps', kind:'weight', equipment:'Machine stack (lb)', min:8,max:12, rest:'compound', tip:'Adjust the seat so handles begin around mid-chest. Press forward without shrugging; return with control.'},
    pecFly: {name:'Pec fly', focus:'Chest', kind:'weight', equipment:'Machine stack (lb)',min:10,max:15,rest:'accessory',tip:'Keep a slight elbow bend. Bring your arms together without forcing your shoulders back into a deep stretch.'},
    seatedRow: {name:'Seated row', focus:'Back · biceps',kind:'weight',equipment:'Machine stack (lb)',min:8,max:12,rest:'compound',tip:'Keep your torso still, draw your elbows back, then return slowly. Avoid leaning or jerking.'},
    triceps: {name:'Cable triceps pushdown',focus:'Triceps',kind:'weight',equipment:'Cable stack (lb)',min:10,max:15,rest:'accessory',tip:'Keep your elbows beside your ribs and extend your forearms. Avoid swinging your shoulders.'},
    curls: {name:'Dumbbell biceps curl',focus:'Biceps',kind:'weight',equipment:'Pounds per dumbbell',min:10,max:12,rest:'accessory',tip:'With elbows near your sides, curl without swinging. Lower the dumbbells slowly.'},
    latPulldown: {name:'Lat pulldown',focus:'Lats · biceps',kind:'weight',equipment:'Machine stack (lb)',min:8,max:12,rest:'compound',tip:'Pull the bar toward the top of your chest, keeping shoulders down. Return under control.'},
    hammer: {name:'Hammer curl',focus:'Biceps · brachialis',kind:'weight',equipment:'Pounds per dumbbell',min:10,max:12,rest:'accessory',tip:'Keep palms facing inward throughout. Curl with elbows close to your sides.'},
    rdl: {name:'Romanian deadlift',focus:'Glutes · hamstrings',kind:'weight',equipment:'Pounds per dumbbell',min:8,max:10,rest:'compound',tip:'Slight knee bend. Move your hips backward, keep weights close to legs, then stand tall.'},
    inclinePress: {name:'Incline dumbbell press',focus:'Upper chest · triceps',kind:'weight',equipment:'Pounds per dumbbell',min:8,max:12,rest:'compound',tip:'Set bench to a modest incline (about 15–30°). Lower to a comfortable depth and press up smoothly.'},
    rearDelt: {name:'Rear delt fly',focus:'Rear shoulders · upper back',kind:'weight',equipment:'Machine stack (lb)',min:12,max:15,rest:'accessory',tip:'Face the rear-delt machine. Move arms back and outward without shrugging or arching your back.'},
    pushups: {name:'Push-ups',focus:'Chest · triceps',kind:'bodyweight',min:6,max:10,rest:'compound',tip:'Keep a strong plank from head to heels. Stop before your form breaks down.'},
    shoulderPress: {name:'Dumbbell shoulder press',focus:'Shoulders · triceps',kind:'weight',equipment:'Pounds per dumbbell',min:8,max:12,rest:'compound',tip:'Press the weights overhead without arching your lower back. Lower with control.'},
    lateral: {name:'Dumbbell lateral raise',focus:'Side shoulders',kind:'weight',equipment:'Pounds per dumbbell',min:12,max:15,rest:'accessory',tip:'Raise arms slightly forward of your sides to about shoulder height. Keep weights light and motion controlled.'},
    squat: {name:'Goblet squat',focus:'Quads · glutes',kind:'weight',equipment:'Single dumbbell (lb)',min:8,max:10,rest:'compound',tip:'Hold one dumbbell at your chest, sit down between your legs, and stand with feet planted.'},
    deadBug: {name:'Dead bugs',focus:'Core stability',kind:'reps',min:8,max:8,suffix:'per side',rest:'mobility',tip:'Lie on your back, alternate opposite arm and leg, and keep your lower back stable.'},
    sidePlank: {name:'Side plank',focus:'Obliques',kind:'seconds',min:30,max:30,suffix:'per side',rest:'mobility',tip:'Support yourself on one forearm, with hips lifted. Hold on each side.'},
    birdDog: {name:'Bird dogs',focus:'Core · back',kind:'reps',min:8,max:8,suffix:'per side',rest:'mobility',tip:'From hands and knees, reach opposite arm and leg away without twisting your hips.'},
    pallof: {name:'Pallof press',focus:'Anti-rotation core',kind:'weight',equipment:'Cable stack (lb)',min:10,max:10,suffix:'per side',rest:'mobility',tip:'Stand sideways to cable. Press hands straight out and resist twisting; do both sides.'},
    twists: {name:'Yoga spinal twist',focus:'Thoracic spine · chest · hips',kind:'seconds',min:45,max:45,suffix:'per side',rest:'mobility',tip:'Lie on your back or side and rotate gently through your upper body; breathe slowly.'},
    chestStretch: {name:'Doorway chest opener',focus:'Chest · shoulders',kind:'seconds',min:45,max:45,rest:'mobility',tip:'Forearms on a doorway, gently step forward until you feel a comfortable chest stretch.'},
    hipFlex: {name:'Hip flexor stretch',focus:'Hip mobility',kind:'seconds',min:45,max:45,suffix:'per side',rest:'mobility',tip:'In a half-kneel, gently tuck pelvis and shift forward until you feel the front of the hip stretch.'},
    hamStretch: {name:'Hamstring stretch',focus:'Hamstring mobility',kind:'seconds',min:45,max:45,suffix:'per side',rest:'mobility',tip:'With a neutral back, hinge toward a straight but relaxed leg. Do not force range of motion.'},
    thoracic: {name:'Open-book rotations',focus:'Mid-back mobility',kind:'reps',min:8,max:8,suffix:'per side',rest:'mobility',tip:'Lie on your side, knees stacked. Open your top arm across your chest while keeping knees together.'}
  };

  const ROUTINES = [
    {id:'mon',day:1,short:'Chest',name:'Chest & triceps',kind:'Strength',minutes:43,subtitle:'Press, fly, row, and give the arms some love.',exercises:[['chestPress',3],['pecFly',2],['seatedRow',2],['triceps',3],['curls',2]]},
    {id:'tue',day:2,short:'Reset',name:'Core & mobility',kind:'Recovery',minutes:25,subtitle:'Move, loosen up, return to work refreshed.',exercises:[['deadBug',2],['sidePlank',2],['birdDog',2],['pallof',2],['thoracic',1],['chestStretch',1]]},
    {id:'wed',day:3,short:'Back',name:'Back, biceps & legs',kind:'Strength',minutes:42,subtitle:'Build your arms and back; maintain leg strength.',exercises:[['latPulldown',3],['seatedRow',2],['curls',3],['hammer',2],['rdl',2]]},
    {id:'thu',day:4,short:'Reset',name:'Yoga-inspired reset',kind:'Recovery',minutes:24,subtitle:'Spinal twists, hip mobility, and gentle core.',exercises:[['twists',2],['chestStretch',2],['hipFlex',2],['hamStretch',2],['birdDog',2]]},
    {id:'fri',day:5,short:'Pecs',name:'Pecs & arms',kind:'Strength',minutes:43,subtitle:'Upper chest and a little extra arm volume.',exercises:[['inclinePress',3],['pecFly',2],['triceps',3],['hammer',2],['rearDelt',2]]}
  ];
  const FINISHERS = ['pushups','shoulderPress','lateral','squat','pallof','rearDelt','curls','triceps'];
  const DEFAULT_SETTINGS = {compound:120, accessory:75, mobility:20};
  let tab = 'train';
  let toastTimeout;
  let lastSummary = null;
  let showTrainHome = false;
  let demoExId = null;
  let data = loadData();
  showTrainHome = !!data.active; // Let returning users resume or discard before entering a session.

  function loadData(){
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && typeof saved === 'object') return {
        history:Array.isArray(saved.history)?saved.history.slice(-300):[],
        active:validateActive(saved.active) ? saved.active : null,
        settings:{...DEFAULT_SETTINGS,...(saved.settings||{})}
      };
    }catch(e){console.warn('Saved data could not be loaded',e);}
    return {history:[],active:null,settings:{...DEFAULT_SETTINGS}};
  }
  function validateActive(a){return !!(a&&ROUTINES.some(r=>r.id===a.routineId)&&Array.isArray(a.plan)&&a.plan.every(p=>EX[p.id]&&Number.isInteger(p.sets)&&p.sets>0&&p.sets<=10)&&Array.isArray(a.logs)&&Number.isInteger(a.exIndex)&&Number.isInteger(a.setIndex));}
  function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}catch(e){toast('Storage unavailable. Back up before closing.');}}
  function esc(input){return String(input??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function workout(id){return ROUTINES.find(r=>r.id===id)||ROUTINES[0];}
  function dateKey(d){const y=d.getFullYear();return `${y}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function fmtDate(iso){const d=new Date(iso);return Number.isFinite(d.getTime())?d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'Unknown date';}
  function niceDuration(s){const min=Math.floor(Math.max(0,s)/60);return `${min}:${String(Math.floor(Math.max(0,s)%60)).padStart(2,'0')}`;}
  function elapsed(start,end){return Math.max(0,Math.round((new Date(end).getTime()-new Date(start).getTime())/60000));}
  function toast(message){toastEl.textContent=message;toastEl.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toastEl.classList.remove('show'),2600);}
  function percentDone(a){const total=a.plan.reduce((n,e)=>n+e.sets,0);const completed=a.logs.length+a.skipped.reduce((n,i)=>n+Math.max(0,a.plan[i].sets-a.logs.filter(l=>l.exIndex===i).length),0);return total?Math.min(100,Math.round(completed/total*100)):0;}
  function sessionLast(id){for(let i=data.history.length-1;i>=0;i--){const logs=data.history[i].logs||[];for(let j=logs.length-1;j>=0;j--){if(logs[j].id===id) return logs[j];}}return null;}
  function lastLogged(id){if(data.active){for(let i=data.active.logs.length-1;i>=0;i--)if(data.active.logs[i].id===id)return data.active.logs[i];}return sessionLast(id);}
  function restSeconds(id){const key=EX[id].rest;const n=Number(data.settings[key]);return Number.isFinite(n)?Math.min(600,Math.max(0,Math.round(n))):DEFAULT_SETTINGS[key];}
  function isPerSide(e){return e.suffix==='per side';}
  function targetLabel(e){const base=e.min===e.max?String(e.min):`${e.min}–${e.max}`;const unit=e.kind==='seconds'?'seconds':'reps';return isPerSide(e)?`${base} ${unit} each side · both sides = 1 set`:`${base} ${unit}`;}
  function inputLabel(e){const unit=e.kind==='seconds'?'Seconds':'Reps';return isPerSide(e)?`${unit} per side`:unit;}
  function inputNote(e,previous){if(e.kind==='bodyweight')return 'Bodyweight · good form first';if(isPerSide(e)&&e.kind==='seconds')return 'Enter one side only. Complete left and right, then log 1 set.';if(isPerSide(e)&&e.kind==='reps')return 'Enter reps for one side. One set means both sides are done.';if(e.kind==='seconds')return 'Use the timer below if you want a countdown';return 'Quality repetitions';}
  function clearExerciseTimer(a){if(a){a.exerciseTimerEnd=0;a.exerciseTimerDuration=0;}}
  function renderMiniResume(){
    if(!data.active)return '';
    const a=data.active;
    const current=a.plan[a.exIndex],ex=current?EX[current.id]:null;
    return `<section class="inset home-session"><div class="eyebrow">IN PROGRESS · ${esc(workout(a.routineId).name)}</div><h2>Pick up where you left off.</h2><div class="pillrow"><span class="pill">${percentDone(a)}% done</span><span class="pill">${a.logs.length} sets logged</span>${ex?`<span class="pill">Next: ${esc(ex.name)}</span>`:''}</div>
      <button type="button" class="btn btn-primary btn-wide space-top" data-action="resume">Resume workout →</button>
      <div class="btn-row space-top session-actions"><button type="button" class="btn btn-secondary" data-action="end-save" ${a.logs.length?'':'disabled'}>Finish & save</button><button type="button" class="btn btn-ghost" data-action="abandon-home">Discard session</button></div>
      <p class="caption" style="margin-top:10px">${a.logs.length?'Finish & save keeps the sets you logged. Discard removes this unfinished session.':'This is a test session? Discard it without creating a history entry. You need at least one logged set to save.'}</p></section>`;
  }
  function renderExerciseTimerCard(active){const a=data.active;if(!a)return '';const running=!!(a.exerciseTimerEnd&&a.exerciseTimerEnd>Date.now());const current=a.plan[a.exIndex];const e=current?EX[current.id]:null;const repsInput=document.getElementById('reps-input');const seconds = a.exerciseTimerDuration || (e?e.min:0);const label=isPerSide(e)?`${seconds} sec each side`:`${seconds} sec`;return `<div class="rest-card exercise-timer" id="exercise-timer-card" aria-live="off"><div><div class="eyebrow" id="exercise-timer-label">${running?'EXERCISE TIMER':'STRETCH / HOLD TIMER'}</div><div class="tiny muted" id="exercise-timer-caption">${running?(isPerSide(e)?'Finish this side, then repeat on the other side':'Keep breathing and hold with control'):(isPerSide(e)?'Both sides together count as 1 set. Run this timer once per side.':'Start a countdown for this hold or stretch.')}</div><div class="rest-buttons">${running?`<button class="small-btn" type="button" data-action="exercise-plus">+15 sec</button><button class="small-btn" type="button" data-action="exercise-stop">Stop</button>`:`<button class="small-btn" type="button" data-action="exercise-start">Start ${esc(label)} timer</button>`}</div></div><div class="rest-clock exercise-clock" id="exercise-clock"><span class="rest-clock-inner" id="exercise-display">${running?'…':niceDuration(seconds)}</span></div></div>`;}
  function demoType(id){if(['chestPress','inclinePress','shoulderPress','pushups'].includes(id))return 'Press';if(['pecFly','rearDelt','lateral'].includes(id))return 'Open / close';if(['seatedRow','latPulldown','triceps','pallof'].includes(id))return 'Cable path';if(['curls','hammer'].includes(id))return 'Curl';if(['rdl'].includes(id))return 'Hinge';if(['squat'].includes(id))return 'Squat';if(['deadBug','birdDog','sidePlank'].includes(id))return 'Brace / hold';if(['twists','thoracic'].includes(id))return 'Rotate';if(['chestStretch','hipFlex','hamStretch'].includes(id))return 'Stretch';return 'Move';}
  function demoSteps(id){const e=EX[id];const common=[e.tip];if(isPerSide(e))common.push('Complete both sides before counting the set as done.');common.push(e.kind==='seconds'?'Breathe steadily and stop short of pain or pinching.':'Move with control and stop before form breaks down.');return common.slice(0,3);}
  function demoSvg(id){const title=demoType(id);return `<svg viewBox="0 0 320 220" class="demo-svg" role="img" aria-label="${esc(EX[id].name)} movement diagram"><rect x="10" y="16" width="130" height="188" rx="18" fill="#15201e" stroke="#51655a"/><rect x="180" y="16" width="130" height="188" rx="18" fill="#15201e" stroke="#51655a"/><text x="75" y="38" text-anchor="middle" fill="#dbe9d1" font-size="14" font-weight="700">Start</text><text x="245" y="38" text-anchor="middle" fill="#dbe9d1" font-size="14" font-weight="700">Finish</text><path d="M149 110h22" stroke="#b7d48d" stroke-width="4" stroke-linecap="round"/><path d="M165 101l12 9-12 9" fill="none" stroke="#b7d48d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="75" cy="82" r="14" fill="#dbe9d1"/><line x1="75" y1="96" x2="75" y2="146" stroke="#dbe9d1" stroke-width="6"/><line x1="75" y1="110" x2="44" y2="122" stroke="#dbe9d1" stroke-width="6"/><line x1="75" y1="110" x2="106" y2="122" stroke="#dbe9d1" stroke-width="6"/><line x1="75" y1="146" x2="58" y2="182" stroke="#dbe9d1" stroke-width="6"/><line x1="75" y1="146" x2="92" y2="182" stroke="#dbe9d1" stroke-width="6"/><circle cx="245" cy="82" r="14" fill="#dbe9d1"/><line x1="245" y1="96" x2="245" y2="146" stroke="#dbe9d1" stroke-width="6"/><line x1="245" y1="110" x2="225" y2="96" stroke="#dbe9d1" stroke-width="6"/><line x1="245" y1="110" x2="265" y2="96" stroke="#dbe9d1" stroke-width="6"/><line x1="245" y1="146" x2="228" y2="182" stroke="#dbe9d1" stroke-width="6"/><line x1="245" y1="146" x2="262" y2="182" stroke="#dbe9d1" stroke-width="6"/><rect x="42" y="154" width="66" height="28" rx="14" fill="#24322d" stroke="#51655a"/><rect x="212" y="154" width="66" height="28" rx="14" fill="#24322d" stroke="#51655a"/><text x="75" y="172" text-anchor="middle" fill="#dbe9d1" font-size="13" font-weight="700">Setup</text><text x="245" y="172" text-anchor="middle" fill="#dbe9d1" font-size="13" font-weight="700">${title}</text></svg>`;}
  function renderOverlay(){if(!overlayRoot)return; if(!demoExId){overlayRoot.innerHTML=''; return;} const e=EX[demoExId]; if(!e){demoExId=null; overlayRoot.innerHTML=''; return;} overlayRoot.innerHTML=`<div class="modal-backdrop" data-action="close-demo"><div class="modal-card" role="dialog" aria-modal="true" aria-label="${esc(e.name)} demo"><div class="modal-head"><div><div class="eyebrow">EXERCISE DEMO</div><h3>${esc(e.name)}</h3></div><button type="button" class="modal-close" data-action="close-demo" aria-label="Close demo">✕</button></div>${demoSvg(demoExId)}<div class="demo-meta"><div class="pillrow"><span class="pill">${esc(e.focus)}</span><span class="pill">${esc(targetLabel(e))}</span></div><ol class="demo-steps">${demoSteps(demoExId).map(step=>`<li>${esc(step)}</li>`).join('')}</ol></div></div></div>`;}
  function render(){
    document.querySelectorAll('.nav-item').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('active',on);b.setAttribute('aria-current',on?'page':'false');});
    if(tab==='train'){
      if(showTrainHome)main.innerHTML=renderHome();
      else if(data.active)main.innerHTML=renderActive();
      else if(lastSummary)main.innerHTML=renderSummary();
      else main.innerHTML=renderHome();
    }
    else if(tab==='history')main.innerHTML=renderHistory();
    else main.innerHTML=renderSettings();
    renderOverlay();
    updateTimer();
  }
  function renderHome(){
    const wd=today.getDay();const routine=ROUTINES.find(r=>r.day===wd) || ROUTINES[0];
    const weekdayStart=new Date(today);weekdayStart.setHours(0,0,0,0);weekdayStart.setDate(weekdayStart.getDate()-((wd+6)%7));
    const thisWeek=data.history.filter(s=>{const d=new Date(s.startedAt);return d>=weekdayStart&&d<=new Date();}).length;
    const todayWeekend=wd===0||wd===6;
    return `${renderMiniResume()}<section class="hero"><div class="eyebrow">${todayWeekend?'Weekend · ready when you are':`${weekdayNames[wd]} · ${routine.kind} day`}</div><h1>${todayWeekend?'Your next pump<br>starts here.':esc(routine.name)+'.'}</h1><p>${esc(routine.subtitle)} Pick any routine whenever it suits your day.</p><div class="pillrow"><span class="pill">${routine.minutes} min estimate</span><span class="pill">${routine.exercises.length} exercises</span><span class="pill">${thisWeek} workout${thisWeek===1?'':'s'} this week</span></div>${data.active?`<button class="btn btn-secondary btn-wide" data-action="resume">Resume current workout →</button>`:`<button class="btn btn-primary btn-wide" data-action="start" data-routine="${routine.id}">Start guided workout <span aria-hidden="true">→</span></button>`}</section>
      <div class="section-heading"><h2>Your week</h2><span class="caption">Tap a day to begin</span></div>
      <div class="weekly">${ROUTINES.map(r=>`<button class="weekday ${r.day===wd?'today':''} ${doneThisWeek(r.day)?'done':''}" type="button" data-action="start" data-routine="${r.id}"><span class="week-day">${weekdayNames[r.day]}</span><span class="week-label">${r.short}</span></button>`).join('')}</div>
      <div class="section-heading"><h2>Choose a workout</h2><span class="caption">3 lift · 2 reset</span></div><div class="routine-list">${ROUTINES.map(r=>`<button type="button" data-action="start" data-routine="${r.id}" class="routine-card"><span><strong>${esc(r.name)}</strong><small>${weekdayNames[r.day]} · ${r.kind} · ~${r.minutes} min</small></span><span class="chevron" aria-hidden="true">›</span></button>`).join('')}</div><p class="caption space-top">Weight and rep history stays on this device. Backups are under Settings.</p>`;
  }
  function doneThisWeek(day){const d=new Date(today);d.setHours(0,0,0,0);const wd=d.getDay();d.setDate(d.getDate()-((wd+6)%7)+(day-1));return data.history.some(s=>dateKey(new Date(s.startedAt))===dateKey(d)&&workout(s.routineId).day===day);}
  function renderActive(){
    const a=data.active;const r=workout(a.routineId);
    if(a.exIndex>=a.plan.length){return `<div class="inset">Workout complete. Refresh the page if needed.</div>`;}
    const current=a.plan[a.exIndex],e=EX[current.id];
    const completed=a.logs.filter(l=>l.exIndex===a.exIndex).length;
    const isWeight=e.kind==='weight';const isBody=e.kind==='bodyweight';const isSeconds=e.kind==='seconds';
    const previous=lastLogged(current.id);
    const draftValid=a.draft&&a.draft.exIndex===a.exIndex&&a.draft.setIndex===a.setIndex;
    const wt=draftValid?a.draft.weight:(previous&&Number.isFinite(previous.weight)?previous.weight:'');
    const repDefault=draftValid?a.draft.reps:(previous&&Number.isFinite(previous.reps)?previous.reps:e.min);
    const target=targetLabel(e);
    const restActive=!!(a.restEnd&&a.restEnd>Date.now());
    return `<div class="meta-top"><span class="eyebrow" style="margin:0">${esc(r.kind)} · ${esc(r.name)}</span><span class="count-badge">${percentDone(a)}% done</span></div><div class="progress-track" role="progressbar" aria-label="Workout progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentDone(a)}"><div class="progress-fill" style="width:${percentDone(a)}%"></div></div>
      <section class="inset"><div class="meta-top"><span class="muted tiny">EXERCISE ${a.exIndex+1} OF ${a.plan.length}</span><span class="muted tiny">SET ${a.setIndex+1} OF ${current.sets}</span></div><h1 class="exercise-title">${esc(e.name)}</h1><p class="target">${esc(e.focus)} · Target: <strong>${esc(target)}</strong></p><div class="instruction">${esc(e.tip)}</div>
      <div class="btn-row compact-row"><button type="button" class="small-btn" data-action="demo">See how</button>${isSeconds?`<button type="button" class="small-btn" data-action="exercise-start">Start ${e.min}${e.max!==e.min?`–${e.max}`:''}s timer</button>`:''}</div>
      ${isPerSide(e)?`<p class="caption tiny side-note">For this exercise, complete <strong>both sides</strong> before you log the set. Enter the reps or seconds for <strong>one side</strong>.</p>`:''}
      <div class="set-dots" aria-label="Set progress">${Array.from({length:current.sets},(_,i)=>`<span class="set-dot ${i<completed?'done':i===a.setIndex?'current':''}" title="Set ${i+1}">${i<completed?'✓':i+1}</span>`).join('')}</div>
      <form id="log-set-form"><div class="input-grid ${isWeight?'':'single'}">${isWeight?`<label class="input-box"><span class="input-label">Weight · lb</span><input id="weight-input" class="big-input" type="number" step="0.5" min="0" max="1000" inputmode="decimal" placeholder="Enter weight" value="${esc(wt)}" required><span class="input-note">${esc(e.equipment)}${previous?` · Last: ${esc(previous.weight)} lb`:''}</span></label>`:''}<label class="input-box"><span class="input-label">${esc(inputLabel(e))}</span><input id="reps-input" class="big-input" type="number" step="1" min="1" max="300" inputmode="numeric" value="${esc(repDefault)}" required><span class="input-note">${esc(inputNote(e, previous))}</span></label></div><button type="submit" class="btn btn-primary btn-wide">✓ Log set ${a.setIndex+1}</button></form>
      ${isSeconds?renderExerciseTimerCard(a.exerciseTimerEnd&&a.exerciseTimerEnd>Date.now()):''}
      ${a.restEnd?renderRestCard(restActive):''}
      <div class="next-up"><span>UP NEXT</span><b>${a.setIndex+1<current.sets?`Set ${a.setIndex+2} · ${esc(e.name)}`:a.exIndex+1<a.plan.length?esc(EX[a.plan[a.exIndex+1].id].name):'Complete your workout'}</b></div></section>
      <div class="secondary-actions"><button type="button" class="link-button" data-action="undo" ${a.logs.length?'':'disabled'}>↶ Undo last set</button><button type="button" class="link-button" data-action="skip">Skip exercise →</button></div>
      <div class="inset space-top"><h3 style="margin-bottom:8px">Optional finisher</h3><p class="caption">Want one extra exercise? Add up to two at the end.</p><div class="addon-row"><select id="finisher-select" aria-label="Choose optional exercise"><option value="">Choose an exercise…</option>${FINISHERS.filter(id=>a.added.length<2&&(!a.plan.some(p=>p.id===id))).map(id=>`<option value="${id}">${esc(EX[id].name)}</option>`).join('')}</select><button type="button" class="small-btn" data-action="add" ${a.added.length>=2?'disabled':''}>Add +</button></div>${a.added.length?`<p class="caption space-top">Added: ${a.added.map(id=>esc(EX[id].name)).join(', ')}</p>`:''}</div>
      <p class="caption space-top">First exercise? Do 3–4 minutes of easy movement plus a lighter practice set. Rest starts automatically after each logged set.</p>
      <button type="button" class="link-button warn" data-action="abandon">End without saving</button>`;
  }
  function renderRestCard(active){return `<div class="rest-card" id="rest-card" aria-live="off"><div><div class="eyebrow" id="rest-label">${active?'REST TIMER':'REST COMPLETE'}</div><div class="tiny muted" id="rest-caption">${active?'Recover before your next set':'Ready when you are'}</div><div class="rest-buttons"><button class="small-btn" type="button" data-action="rest-plus" ${active?'':'disabled'}>+30 sec</button><button class="small-btn" type="button" data-action="rest-skip" ${active?'':'disabled'}>${active?'Skip rest':'Done ✓'}</button></div></div><div class="rest-clock" id="rest-clock"><span class="rest-clock-inner" id="rest-display">${active?'…':'0:00'}</span></div></div>`;}
  function renderSummary(){const s=lastSummary,r=workout(s.routineId);return `<section class="hero"><div class="eyebrow">WORKOUT SAVED ✓</div><h1>Nicely done.</h1><p>${esc(r.name)} is in the books. Consistency is the whole game.</p><div class="pillrow"><span class="pill">${s.logs.length} sets logged</span><span class="pill">${elapsed(s.startedAt,s.endedAt)} min</span><span class="pill">${new Set(s.logs.map(l=>l.id)).size} exercises</span></div><button class="btn btn-primary btn-wide" data-action="summary-done">Back to workouts →</button></section><div class="section-heading"><h2>Session recap</h2></div>${renderLogGroups(s.logs)}<button type="button" class="btn btn-secondary btn-wide space-top" data-tab="history">View all history</button>`;}
  function renderLogGroups(logs){const ids=[...new Set(logs.map(l=>l.id))];return ids.map(id=>{const e=EX[id];if(!e)return '';const matches=logs.filter(l=>l.id===id);return `<div class="log-entry" style="margin-bottom:7px"><span><strong>${esc(e.name)}</strong><br><span class="muted">${matches.length} set${matches.length===1?'':'s'}</span></span><span style="text-align:right">${matches.map(l=>e.kind==='weight'?`${l.weight} lb × ${l.reps}`:`${l.reps}${e.kind==='seconds'?' sec':' reps'}`).map(esc).join('<br>')}</span></div>`;}).join('');}
  function renderHistory(){
    const entries=data.history.slice().reverse();
    const totalSets=entries.reduce((n,s)=>n+(s.logs||[]).length,0);
    return `<div class="eyebrow">YOUR TRAINING LOG</div><h1 style="font-size:40px">Proof of progress.</h1><div class="stat-grid"><div class="stat"><strong>${entries.length}</strong><small>Saved workouts</small></div><div class="stat"><strong>${totalSets}</strong><small>Sets logged</small></div></div>
      ${entries.length?entries.map((s,i)=>`<details class="history-card"><summary><span><strong>${esc(workout(s.routineId).name)}</strong><small>${fmtDate(s.startedAt)} · ${elapsed(s.startedAt,s.endedAt)} min · ${(s.logs||[]).length} sets${s.endedEarly?' · Ended early':''}</small></span><span class="chevron" aria-hidden="true">⌄</span></summary><div class="history-detail">${renderLogGroups(s.logs||[])}<button type="button" class="history-delete" data-action="delete-workout" data-index="${data.history.length-1-i}" data-start="${esc(s.startedAt)}">Delete this workout</button></div></details>`).join(''):`<div class="empty"><span class="emoji" aria-hidden="true">🏋️</span><h3>Your first workout awaits</h3><p class="muted">Once you log a workout, it'll appear here with each set and weight.</p><button type="button" class="btn btn-primary" data-tab="train">Choose a workout</button></div>`}
      <p class="caption space-top">Open any workout to review sets or delete it. Deleting removes only that session from this iPhone. Save a backup in Settings if you'd like a copy.</p>`;
  }
  function renderSettings(){return `<div class="eyebrow">MAKE IT YOURS</div><h1 style="font-size:40px">Settings.</h1><div class="inset settings-group"><h3>Rest timer defaults</h3><p class="caption">The countdown starts after you log a set. You can skip it or add 30 seconds whenever you like.</p>${[['compound','Compound lifts'],['accessory','Arm and chest accessories'],['mobility','Mobility and core']].map(([id,label])=>`<div class="setting-row"><label for="setting-${id}">${label}<small>Seconds between sets</small></label><input id="setting-${id}" class="small-input" type="number" min="0" max="600" step="5" inputmode="numeric" value="${esc(data.settings[id])}"></div>`).join('')}<button type="button" class="btn btn-primary btn-wide space-top" data-action="save-settings">Save timer settings</button></div><div class="inset settings-group"><h3>Your data stays yours</h3><p class="caption">History is stored locally in this browser/app. It won't automatically sync to another phone, and clearing site data can erase it. Save a backup occasionally.</p><div class="btn-row"><button type="button" class="btn btn-secondary" data-action="export">↓ Export backup</button><label class="btn btn-secondary" style="cursor:pointer">↑ Import backup<input type="file" id="import-input" accept=".json,application/json" style="display:none"></label></div><hr class="separator"><button type="button" class="btn btn-danger btn-wide" data-action="clear-history">Erase all history</button></div><p class="caption">Version 1.2 · Manage unfinished workouts and delete individual history entries. No account, no tracking, no ads. iOS may pause countdown updates while your phone is locked.</p>`;}
  function startSession(id){if(data.active&&!confirm('Discard your current unfinished workout and start another?'))return;const r=workout(id);data.active={routineId:r.id,startedAt:new Date().toISOString(),plan:r.exercises.map(([exId,sets])=>({id:exId,sets})),logs:[],skipped:[],added:[],exIndex:0,setIndex:0,draft:null,restEnd:0,restDuration:0,exerciseTimerEnd:0,exerciseTimerDuration:0};lastSummary=null;tab='train';showTrainHome=false;persist();render();window.scrollTo(0,0);}
  function logSet(form){const a=data.active;if(!a)return;const item=a.plan[a.exIndex],e=EX[item.id];const repsInput=form.querySelector('#reps-input');const reps=Number(repsInput.value);if(!Number.isInteger(reps)||reps<1||reps>300){toast('Enter a valid number between 1 and 300.');repsInput.focus();return;}
    let weight=null;
    if(e.kind==='weight'){
      const weightInput=form.querySelector('#weight-input');weight=Number(weightInput.value);
      if(weightInput.value.trim()===''||!Number.isFinite(weight)||weight<0||weight>1000){toast('Enter a weight from 0 to 1000 lb.');weightInput.focus();return;}
    }
    const lastEx=item.id;
    a.logs.push({id:item.id,exIndex:a.exIndex,setIndex:a.setIndex,reps,weight,at:new Date().toISOString()});
    a.draft=null;
    clearExerciseTimer(a);
    showTrainHome=false;
    a.setIndex++;
    if(a.setIndex>=item.sets){a.setIndex=0;a.exIndex++;}
    if(a.exIndex>=a.plan.length){finishSession();return;}
    const duration=restSeconds(lastEx);
    a.restDuration=duration;
    a.restEnd=duration>0?Date.now()+duration*1000:0;
    persist();render();
  }
  function advanceSkipping(){const a=data.active;if(!a)return;const item=a.plan[a.exIndex];if(!confirm(`Skip the remaining sets of ${EX[item.id].name}?`))return;a.skipped.push(a.exIndex);a.exIndex++;a.setIndex=0;a.draft=null;a.restEnd=0;clearExerciseTimer(a);if(a.exIndex>=a.plan.length){finishSession();return;}persist();render();}
  function undo(){const a=data.active;if(!a||!a.logs.length)return;const last=a.logs.pop();a.exIndex=last.exIndex;a.setIndex=last.setIndex;a.draft={exIndex:last.exIndex,setIndex:last.setIndex,weight:last.weight,reps:last.reps};a.restEnd=0;clearExerciseTimer(a);persist();render();toast('Last set restored for editing.');}
  function finishSession(endedEarly=false){
    const a=data.active;if(!a)return;
    // Don't create fake history if someone only browsed and skipped exercises.
    if(!a.logs.length){
      data.active=null;lastSummary=null;showTrainHome=true;tab='train';persist();render();window.scrollTo(0,0);
      toast('Nothing logged — no workout saved.');
      return;
    }
    const ended={...a,endedAt:new Date().toISOString(),endedEarly:!!endedEarly};
    data.history.push(ended);
    if(data.history.length>300)data.history.shift();
    data.active=null;showTrainHome=false;lastSummary=ended;persist();tab='train';render();window.scrollTo(0,0);
  }
  function endAndSave(){
    const a=data.active;if(!a)return;
    if(!a.logs.length){toast('Log a set first, or discard this test session.');return;}
    if(!confirm(`Finish this workout early and save ${a.logs.length} logged set${a.logs.length===1?'':'s'} to History?`))return;
    finishSession(true);
  }
  function deleteWorkout(button){
    const index=Number(button.dataset.index);
    if(!Number.isInteger(index)||index<0||index>=data.history.length)return;
    const session=data.history[index];
    // Guard against deleting a different entry if the list changed.
    if(session.startedAt!==button.dataset.start){toast('History changed. Please try again.');render();return;}
    const name=workout(session.routineId).name;
    if(!confirm(`Delete ${name} from ${fmtDate(session.startedAt)} (${(session.logs||[]).length} sets)? This cannot be undone.`))return;
    data.history.splice(index,1);
    persist();render();toast('Workout deleted from History.');
  }
  function addFinisher(){const a=data.active;const select=document.getElementById('finisher-select');if(!a||!select)return;const id=select.value;if(!EX[id]){toast('Choose an exercise to add.');return;}if(a.added.length>=2){toast('Two finishers is plenty for today!');return;}if(a.plan.some(p=>p.id===id)){toast('That exercise is already on your list.');return;}a.plan.push({id,sets:2});a.added.push(id);persist();render();toast(`${EX[id].name} added at the end.`);}
  function startExerciseTimer(){const a=data.active;if(!a)return;const item=a.plan[a.exIndex],e=EX[item.id];const repsInput=document.getElementById('reps-input');const raw=repsInput?Number(repsInput.value):e.min;const seconds=Math.max(1,Math.min(600,Math.round(Number.isFinite(raw)&&raw>0?raw:e.min)));a.exerciseTimerDuration=seconds;a.exerciseTimerEnd=Date.now()+seconds*1000;persist();render();}
  function updateTimer(){const a=data.active;if(!a)return;const display=document.getElementById('rest-display');if(display&&a.restEnd){const remaining=Math.max(0,Math.ceil((a.restEnd-Date.now())/1000));display.textContent=niceDuration(remaining);const circle=document.getElementById('rest-clock');if(circle){const portion=a.restDuration?remaining/a.restDuration:0;circle.style.background=`conic-gradient(var(--accent) 0deg ${Math.max(0,portion*360)}deg, #5b7355 ${Math.max(0,portion*360)}deg 360deg)`;}
    if(remaining<=0){const label=document.getElementById('rest-label'),caption=document.getElementById('rest-caption');if(label)label.textContent='REST COMPLETE ✓';if(caption)caption.textContent='Your next set is ready';document.querySelectorAll('[data-action="rest-plus"],[data-action="rest-skip"]').forEach(b=>b.disabled=true);}}
    const exerciseDisplay=document.getElementById('exercise-display');if(exerciseDisplay&&a.exerciseTimerEnd){const remaining=Math.max(0,Math.ceil((a.exerciseTimerEnd-Date.now())/1000));exerciseDisplay.textContent=niceDuration(remaining);const circle=document.getElementById('exercise-clock');if(circle){const portion=a.exerciseTimerDuration?remaining/a.exerciseTimerDuration:0;circle.style.background=`conic-gradient(var(--accent) 0deg ${Math.max(0,portion*360)}deg, #5b7355 ${Math.max(0,portion*360)}deg 360deg)`;}
      if(remaining<=0){const label=document.getElementById('exercise-timer-label'),caption=document.getElementById('exercise-timer-caption');if(label)label.textContent='TIMER COMPLETE ✓';if(caption)caption.textContent='Repeat on the other side if needed, then log your set.';const card=document.getElementById('exercise-timer-card');if(card){const buttons=card.querySelector('.rest-buttons');if(buttons)buttons.innerHTML='<button class="small-btn" type="button" data-action="exercise-start">Run again</button><button class="small-btn" type="button" data-action="exercise-stop">Done</button>';}}}
  }
  function saveSettings(){for(const key of ['compound','accessory','mobility']){const input=document.getElementById(`setting-${key}`);const n=Number(input.value);if(!Number.isInteger(n)||n<0||n>600){toast('Rest times must be whole seconds from 0–600.');input.focus();return;}data.settings[key]=n;}persist();toast('Rest timer settings saved.');render();}
  function exportBackup(){const filename=`afternoon-pump-backup-${dateKey(new Date())}.json`;const text=JSON.stringify({app:'Afternoon Pump',version:1,exportedAt:new Date().toISOString(),...data},null,2);const blob=new Blob([text],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);toast('Backup prepared. Save it in Files.');}
  async function importBackup(file){if(!file)return;try{if(file.size>3_000_000)throw Error('Backup file is too large.');const backup=JSON.parse(await file.text());if(backup.app!=='Afternoon Pump'||!Array.isArray(backup.history)||backup.history.length>1000)throw Error('Not an Afternoon Pump backup.');const clean=[];for(const s of backup.history){if(!s||!ROUTINES.some(r=>r.id===s.routineId)||!Array.isArray(s.logs)||s.logs.length>200)throw Error('Invalid workout entries.');const logs=s.logs.map(l=>{if(!l||!EX[l.id]||!Number.isFinite(l.reps)||l.reps<1||l.reps>300||(l.weight!==null&&(!Number.isFinite(l.weight)||l.weight<0||l.weight>1000)))throw Error('Invalid set data.');return {id:l.id,reps:l.reps,weight:l.weight,exIndex:Number(l.exIndex)||0,setIndex:Number(l.setIndex)||0,at:String(l.at||'')};});clean.push({routineId:s.routineId,startedAt:String(s.startedAt||new Date().toISOString()),endedAt:String(s.endedAt||new Date().toISOString()),logs});}
      if(!confirm(`Import ${clean.length} workouts? This replaces your current workout history.`))return;
      data.history=clean.slice(-300);data.active=null;showTrainHome=false;lastSummary=null;persist();tab='history';render();toast(`Imported ${data.history.length} workouts.`);
    }catch(e){toast(e.message||'Could not import backup.');}
  }
  nav.addEventListener('click',e=>{const button=e.target.closest('[data-tab]');if(!button)return;tab=button.dataset.tab;showTrainHome=tab==='train';lastSummary=null;render();window.scrollTo(0,0);});
  brand.addEventListener('click',()=>{tab='train';showTrainHome=true;lastSummary=null;render();window.scrollTo(0,0);});
  main.addEventListener('submit',e=>{if(e.target.id==='log-set-form'){e.preventDefault();logSet(e.target);}});
  main.addEventListener('input',e=>{if((e.target.id==='weight-input'||e.target.id==='reps-input')&&data.active){const a=data.active;const wt=document.getElementById('weight-input');const rep=document.getElementById('reps-input');a.draft={exIndex:a.exIndex,setIndex:a.setIndex,weight:wt?wt.value:'',reps:rep?rep.value:''};persist();}});
  main.addEventListener('click',e=>{
    const button=e.target.closest('button[data-action],button[data-tab]');if(!button)return;
    const action=button.dataset.action;
    if(button.dataset.tab){tab=button.dataset.tab;showTrainHome=tab==='train';lastSummary=null;render();window.scrollTo(0,0);return;}
    if(action==='start')startSession(button.dataset.routine);
    else if(action==='resume'){showTrainHome=false;tab='train';render();window.scrollTo(0,0);}
    else if(action==='end-save')endAndSave();
    else if(action==='delete-workout')deleteWorkout(button);
    else if(action==='skip')advanceSkipping();
    else if(action==='undo')undo();
    else if(action==='add')addFinisher();
    else if(action==='demo'){demoExId=data.active?data.active.plan[data.active.exIndex].id:null;renderOverlay();}
    else if(action==='exercise-start')startExerciseTimer();
    else if(action==='exercise-stop'&&data.active){clearExerciseTimer(data.active);persist();render();}
    else if(action==='exercise-plus'&&data.active){if(!data.active.exerciseTimerEnd)startExerciseTimer();else{data.active.exerciseTimerEnd=Math.max(Date.now(),data.active.exerciseTimerEnd)+15000;data.active.exerciseTimerDuration+=15;persist();updateTimer();}}
    else if(action==='rest-skip'&&data.active){data.active.restEnd=0;persist();render();}
    else if(action==='rest-plus'&&data.active){data.active.restEnd=Math.max(Date.now(),data.active.restEnd)+30000;data.active.restDuration+=30;persist();updateTimer();}
    else if(action==='abandon'&&data.active&&confirm('Discard this unfinished workout? Logged sets from this session will be lost.')){data.active=null;showTrainHome=true;lastSummary=null;persist();render();}
    else if(action==='abandon-home'&&data.active&&confirm('Discard this unfinished workout? Logged sets from this session will be lost.')){data.active=null;showTrainHome=false;lastSummary=null;persist();render();}
    else if(action==='summary-done'){lastSummary=null;showTrainHome=true;render();}
    else if(action==='save-settings')saveSettings();
    else if(action==='export')exportBackup();
    else if(action==='clear-history'&&confirm('Permanently erase all completed workouts on this device? Make a backup first if you want to keep them.')){data.history=[];persist();render();toast('Workout history erased.');}
  });
  overlayRoot.addEventListener('click',e=>{const close=e.target.closest('[data-action="close-demo"]'); if(close || e.target===overlayRoot.firstElementChild){demoExId=null;renderOverlay();}});
  main.addEventListener('change',e=>{if(e.target.id==='import-input'){importBackup(e.target.files[0]);}});
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
  render();
  setInterval(updateTimer,500);
})();
