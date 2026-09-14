const lessons=[
 {id:1,icon:'👋',title:'التحية والتعارف',desc:'Hello, name, how are you?',xp:40,steps:[['Hello!','مرحبًا!'],['My name is Raed.','اسمي رائد.'],['What is your name?','ما اسمك؟'],['Nice to meet you.','سعيد بلقائك.']]},
 {id:2,icon:'🙋',title:'الضمائر الأساسية',desc:'I, you, he, she, we, they',xp:45,steps:[['I am happy.','أنا سعيد.'],['You are here.','أنت هنا.'],['He is my friend.','هو صديقي.'],['She is a teacher.','هي معلمة.']]},
 {id:3,icon:'🔢',title:'الأرقام والوقت',desc:'الأرقام من 1 إلى 20 والوقت',xp:50,steps:[['One, two, three.','واحد، اثنان، ثلاثة.'],['It is five o’clock.','الساعة الخامسة.'],['I have ten riyals.','لدي عشرة ريالات.']]},
 {id:4,icon:'☕',title:'في المطعم',desc:'طلب الطعام والشراب ببساطة',xp:55,steps:[['I would like coffee.','أرغب في قهوة.'],['Can I have water?','هل يمكنني الحصول على ماء؟'],['The food is good.','الطعام جيد.']]},
 {id:5,icon:'🏢',title:'في العمل',desc:'جمل يومية بسيطة في مكان العمل',xp:60,steps:[['How can I help you?','كيف أستطيع مساعدتك؟'],['Please wait a moment.','فضلاً انتظر لحظة.'],['Your request is ready.','طلبك جاهز.']]},
 {id:6,icon:'🧭',title:'الاتجاهات والأماكن',desc:'يمين، يسار، قريب، بعيد',xp:60,steps:[['Turn right.','اتجه يمينًا.'],['Go straight.','اذهب مباشرة.'],['It is near here.','إنه قريب من هنا.']]}
];

const words=[
 {en:'Hello',ar:'مرحبًا',ph:'/həˈləʊ/',cat:'أساسيات',ex:'Hello, how are you?',exAr:'مرحبًا، كيف حالك؟'},
 {en:'Name',ar:'اسم',ph:'/neɪm/',cat:'أساسيات',ex:'What is your name?',exAr:'ما اسمك؟'},
 {en:'Friend',ar:'صديق',ph:'/frend/',cat:'أشخاص',ex:'He is my friend.',exAr:'هو صديقي.'},
 {en:'Today',ar:'اليوم',ph:'/təˈdeɪ/',cat:'الوقت',ex:'I am busy today.',exAr:'أنا مشغول اليوم.'},
 {en:'Water',ar:'ماء',ph:'/ˈwɔː.tər/',cat:'مطعم',ex:'Can I have water?',exAr:'هل يمكنني الحصول على ماء؟'},
 {en:'Help',ar:'مساعدة',ph:'/help/',cat:'يومي',ex:'How can I help you?',exAr:'كيف أستطيع مساعدتك؟'},
 {en:'Ready',ar:'جاهز',ph:'/ˈred.i/',cat:'يومي',ex:'I am ready.',exAr:'أنا جاهز.'},
 {en:'Please',ar:'من فضلك',ph:'/pliːz/',cat:'تهذيب',ex:'Please wait here.',exAr:'من فضلك انتظر هنا.'},
 {en:'Thank you',ar:'شكرًا لك',ph:'/ˈθæŋk juː/',cat:'تهذيب',ex:'Thank you for your help.',exAr:'شكرًا لك على مساعدتك.'},
 {en:'Confident',ar:'واثق',ph:'/ˈkɒn.fɪ.dənt/',cat:'مشاعر',ex:'I feel confident today.',exAr:'أشعر بالثقة اليوم.'},
 {en:'Work',ar:'عمل',ph:'/wɜːk/',cat:'العمل',ex:'I am at work.',exAr:'أنا في العمل.'},
 {en:'Home',ar:'منزل',ph:'/həʊm/',cat:'أماكن',ex:'I am going home.',exAr:'أنا ذاهب إلى المنزل.'}
];

const quizBank=[
 {q:'ما معنى كلمة “Hello”؟',a:['وداعًا','مرحبًا','شكرًا','من فضلك'],c:1},
 {q:'اختر الجملة الصحيحة لمعنى «اسمي رائد»',a:['I am Raed name','My name is Raed','Your name Raed','Me name Raed'],c:1},
 {q:'ما معنى “How can I help you?”',a:['أين أنت؟','كيف حالك؟','كيف أستطيع مساعدتك؟','هل تريد ماء؟'],c:2},
 {q:'اختر الضمير المناسب: ___ am happy.',a:['He','I','They','She'],c:1},
 {q:'ما معنى “Please wait a moment.”',a:['تفضل بالدخول','فضلاً انتظر لحظة','ارفع الطلب','اذهب إلى المنزل'],c:1},
 {q:'كلمة “Water” تعني:',a:['طعام','قهوة','ماء','وقت'],c:2},
 {q:'ما الجملة المناسبة لطلب ماء؟',a:['Can I have water?','I am water','Water is me','You water now'],c:0},
 {q:'“Nice to meet you” تعني:',a:['أراك غدًا','سعيد بلقائك','أنا متعب','شكرًا'],c:1},
 {q:'ما معنى “Turn right”؟',a:['اتجه يسارًا','قف هنا','اتجه يمينًا','ارجع للخلف'],c:2},
 {q:'اختر ترجمة «أنا جاهز»',a:['I am ready','I ready is','You are ready','I am today'],c:0},
 {q:'ما معنى “Friend”؟',a:['موظف','صديق','مدير','معلم'],c:1},
 {q:'الجملة الصحيحة لمعنى «هو صديقي»',a:['He is my friend','She is my friend','He my are friend','I am friend'],c:0},
 {q:'ما معنى “Today”؟',a:['غدًا','أمس','اليوم','الآن فقط'],c:2},
 {q:'“Thank you” تستخدم لـ:',a:['الاعتذار','الشكر','السؤال عن الاسم','طلب الاتجاهات'],c:1}
];

const dialogues=[
 {bot:'Hello! What is your name?',botAr:'مرحبًا! ما اسمك؟',you:'My name is Raed.',youAr:'اسمي رائد.'},
 {bot:'Nice to meet you, Raed.',botAr:'سعيد بلقائك يا رائد.',you:'Nice to meet you too.',youAr:'وأنا سعيد بلقائك.'},
 {bot:'How are you today?',botAr:'كيف حالك اليوم؟',you:'I am good, thank you.',youAr:'أنا بخير، شكرًا لك.'},
 {bot:'Where are you from?',botAr:'من أين أنت؟',you:'I am from Saudi Arabia.',youAr:'أنا من السعودية.'}
];

const state=JSON.parse(localStorage.getItem('ejState')||'null')||{completed:[],learned:[],xp:0,streak:1,lastVisit:null,quizzes:0};
function save(){localStorage.setItem('ejState',JSON.stringify(state));updateStats()}
function initVisit(){const today=new Date().toDateString();if(state.lastVisit&&state.lastVisit!==today){const diff=(new Date(today)-new Date(state.lastVisit))/86400000;if(diff===1)state.streak++;else if(diff>1)state.streak=1}state.lastVisit=today;save()}
function speak(text,rate=.86){if(!('speechSynthesis'in window))return toast('النطق الصوتي غير مدعوم في هذا المتصفح');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=rate;const voices=speechSynthesis.getVoices();const v=voices.find(x=>x.lang.startsWith('en-US'))||voices.find(x=>x.lang.startsWith('en'));if(v)u.voice=v;speechSynthesis.speak(u)}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2200)}
function go(id){document.querySelectorAll('.page-section').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.section===id));document.getElementById('sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>go(b.dataset.section));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));document.getElementById('menuBtn').onclick=()=>document.getElementById('sidebar').classList.toggle('open');

document.getElementById('playIntro').onclick=()=>speak('Hello! My name is Raed. Nice to meet you.');
function renderHomeLessons(){const box=document.getElementById('homeLessonList');box.innerHTML=lessons.slice(0,4).map(l=>`<div class="path-item ${state.completed.includes(l.id)?'done':''}"><div class="path-num">${state.completed.includes(l.id)?'✓':l.id}</div><div><b>${l.title}</b><small>${state.completed.includes(l.id)?'مكتمل':'جاهز للبدء'}</small></div></div>`).join('')}
function renderLessons(){document.getElementById('lessonGrid').innerHTML=lessons.map(l=>`<article class="lesson-card ${state.completed.includes(l.id)?'done':''}"><div class="lesson-icon">${l.icon}</div><h3>${l.title}</h3><p>${l.desc}</p><footer><span class="status">${l.steps.length} خطوات • ${l.xp} XP</span><button class="secondary-btn" onclick="openLesson(${l.id})">${state.completed.includes(l.id)?'مراجعة':'ابدأ'}</button></footer></article>`).join('')}
window.openLesson=function(id){const l=lessons.find(x=>x.id===id);const content=document.getElementById('lessonContent');content.innerHTML=`<span class="badge" style="color:#5c4ccc;background:#efecff">الدرس ${l.id}</span><h2>${l.icon} ${l.title}</h2><p style="color:#748097">اقرأ الجملة، اسمع النطق، ثم كررها بصوتك.</p>${l.steps.map((s,i)=>`<div class="lesson-step"><small>الخطوة ${i+1}</small><strong>${s[0]}</strong><span>${s[1]}</span><button class="round-btn" style="margin-top:12px" onclick='speak(${JSON.stringify(s[0])})'>🔊</button></div>`).join('')}<div class="lesson-controls"><button class="success-btn" onclick="completeLesson(${l.id})">✓ أنهيت الدرس</button><button class="ghost-btn" onclick="document.getElementById('lessonModal').classList.remove('open')">إغلاق</button></div>`;document.getElementById('lessonModal').classList.add('open')}
window.speak=speak;window.completeLesson=function(id){if(!state.completed.includes(id)){state.completed.push(id);const l=lessons.find(x=>x.id===id);state.xp+=l.xp;save();toast(`أحسنت! +${l.xp} XP 🎉`)}document.getElementById('lessonModal').classList.remove('open');renderLessons();renderHomeLessons()}
document.getElementById('closeLesson').onclick=()=>document.getElementById('lessonModal').classList.remove('open');

let wordIndex=0;const flash=document.getElementById('flashcard');function renderWord(){const w=words[wordIndex];flash.classList.remove('flipped');document.getElementById('wordCounter').textContent=wordIndex+1;document.getElementById('wordTotal').textContent=words.length;document.getElementById('wordEn').textContent=w.en;document.getElementById('wordAr').textContent=w.ar;document.getElementById('wordPhonetic').textContent=w.ph;document.getElementById('wordCategory').textContent=w.cat;document.getElementById('wordExample').textContent=w.ex;document.getElementById('wordExampleAr').textContent=w.exAr}
flash.onclick=(e)=>{if(e.target.closest('button'))return;flash.classList.toggle('flipped')};flash.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flash.classList.toggle('flipped')}};document.getElementById('nextWord').onclick=()=>{wordIndex=(wordIndex+1)%words.length;renderWord()};document.getElementById('prevWord').onclick=()=>{wordIndex=(wordIndex-1+words.length)%words.length;renderWord()};document.getElementById('speakWord').onclick=()=>speak(words[wordIndex].en,.78);document.getElementById('knowWord').onclick=()=>{const w=words[wordIndex];if(!state.learned.includes(w.en)){state.learned.push(w.en);state.xp+=5;save();toast('ممتاز! الكلمة انضافت لإنجازك +5 XP')}document.getElementById('nextWord').click()};document.getElementById('reviewWord').onclick=()=>{toast('تمام، بنخليها للمراجعة 👍');document.getElementById('nextWord').click()};

let dialogueIndex=0;function renderDialogue(){const d=dialogues[dialogueIndex];document.getElementById('chatBox').innerHTML=`<div class="message bot"><b>${d.bot}</b><small>${d.botAr}</small><button class="round-btn" style="margin-top:8px" onclick='speak(${JSON.stringify(d.bot)})'>🔊</button></div><div class="message user"><b>${d.you}</b><small>${d.youAr}</small><button class="round-btn" style="margin-top:8px" onclick='speak(${JSON.stringify(d.you)})'>🔊</button></div>`;document.getElementById('practiceSentence').textContent=d.you;document.getElementById('practiceMeaning').textContent=d.youAr}
document.getElementById('nextDialogue').onclick=()=>{dialogueIndex=(dialogueIndex+1)%dialogues.length;renderDialogue()};document.getElementById('listenPractice').onclick=()=>speak(document.getElementById('practiceSentence').textContent,.75);
document.getElementById('startListening').onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('متصفحك لا يدعم التعرف على الصوت. جرّبه في Chrome.');return}const r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=1;const orb=document.getElementById('micOrb');const result=document.getElementById('speechResult');orb.classList.add('listening');result.textContent='أسمعك الآن... تكلم بالإنجليزية 🎙️';r.onresult=e=>{const heard=e.results[0][0].transcript;const target=document.getElementById('practiceSentence').textContent.toLowerCase().replace(/[.?!]/g,'').trim();const got=heard.toLowerCase().replace(/[.?!]/g,'').trim();const ok=got===target||similarity(got,target)>.72;result.innerHTML=`سمعت: <b dir="ltr">${heard}</b><br>${ok?'✅ ممتاز! قريب جدًا من الجملة.':'🔁 جيد، حاول مرة ثانية ببطء.'}`;if(ok){state.xp+=3;save()}};r.onerror=()=>result.textContent='ما قدرت ألتقط الصوت. تأكد من إذن الميكروفون وحاول مرة ثانية.';r.onend=()=>orb.classList.remove('listening');r.start()}
function similarity(a,b){const A=new Set(a.split(' ')),B=new Set(b.split(' '));let hit=0;A.forEach(x=>B.has(x)&&hit++);return hit/Math.max(A.size,B.size,1)}

let quiz=[],qIndex=0,score=0,answered=false;function shuffle(a){return [...a].sort(()=>Math.random()-.5)}function startQuiz(){quiz=shuffle(quizBank).slice(0,10);qIndex=0;score=0;answered=false;renderQuestion()}function renderQuestion(){answered=false;const q=quiz[qIndex];document.getElementById('quizCurrent').textContent=qIndex+1;document.getElementById('quizScore').textContent=score;document.getElementById('quizProgress').style.width=`${(qIndex/10)*100}%`;document.getElementById('quizQuestion').textContent=q.q;document.getElementById('quizAnswers').innerHTML=q.a.map((x,i)=>`<button class="answer" data-i="${i}">${x}</button>`).join('');document.getElementById('quizFeedback').textContent='';document.getElementById('nextQuestion').disabled=true;document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>answerQuestion(+b.dataset.i))}function answerQuestion(i){if(answered)return;answered=true;const q=quiz[qIndex],buttons=[...document.querySelectorAll('.answer')];buttons[q.c].classList.add('correct');if(i===q.c){score++;document.getElementById('quizFeedback').textContent='✅ إجابة صحيحة، ممتاز!'}else{buttons[i].classList.add('wrong');document.getElementById('quizFeedback').textContent=`الإجابة الصحيحة: ${q.a[q.c]}`}document.getElementById('quizScore').textContent=score;document.getElementById('nextQuestion').disabled=false}document.getElementById('nextQuestion').onclick=()=>{if(qIndex<9){qIndex++;renderQuestion()}else{document.getElementById('quizProgress').style.width='100%';document.getElementById('quizQuestion').textContent=`انتهى الاختبار 🎉 نتيجتك ${score} من 10`;document.getElementById('quizAnswers').innerHTML='';document.getElementById('quizFeedback').textContent=score>=8?'رائع جدًا! مستواك ممتاز في هذا الجزء.':score>=5?'جيد! راجع الكلمات والجمل اللي أخطأت فيها.':'بداية طيبة. ارجع للدروس وخذها بهدوء.';document.getElementById('nextQuestion').disabled=true;state.quizzes++;state.xp+=score*2;save()}};document.getElementById('restartQuiz').onclick=startQuiz;

function updateStats(){const pct=Math.min(100,Math.round(((state.completed.length/lessons.length)*65)+((state.learned.length/words.length)*25)+Math.min(state.quizzes,1)*10));['streakSide','streakTop','streakStat'].forEach(id=>document.getElementById(id).textContent=state.streak);document.getElementById('completedLessons').textContent=state.completed.length;document.getElementById('learnedWords').textContent=state.learned.length;document.getElementById('xpStat').textContent=`${state.xp} XP`;document.getElementById('homeProgressBar').style.width=`${(state.completed.length/lessons.length)*100}%`;document.getElementById('progressPercent').textContent=`${pct}%`;document.getElementById('progressRing').style.background=`conic-gradient(#6c5ce7 ${pct*3.6}deg,#e8eaf1 0deg)`;renderAchievements();renderHomeLessons()}
function renderAchievements(){const a=[['🌱','أول خطوة','أكمل أول درس',state.completed.length>=1],['🔥','استمرار','تعلّم يومين متتاليين',state.streak>=2],['🧠','جامع الكلمات','تعلّم 5 كلمات',state.learned.length>=5],['🏆','متحدّي','أكمل اختبارًا',state.quizzes>=1]];document.getElementById('achievements').innerHTML=a.map(x=>`<div class="achievement ${x[3]?'':'locked'}"><div class="achievement-icon">${x[0]}</div><div><b>${x[1]}</b><small>${x[2]}</small></div></div>`).join('')}

document.getElementById('dailySpeak').onclick=()=>speak('Confident');
initVisit();renderLessons();renderWord();renderDialogue();startQuiz();updateStats();
