const STORAGE_KEY = 'meedan_bina_v1';

const AIDS = {
  double:{label:'×2 نقاط',icon:'⚡',hint:'ضاعف نقاط السؤال القادم'},
  pit:{label:'الحفرة',icon:'🕳️',hint:'إذا جاوبت صح تُخصم نفس النقاط من الخصم'},
  time:{label:'+15 ثانية',icon:'⏱️',hint:'أضف 15 ثانية أثناء السؤال'},
  two:{label:'جوابين',icon:'✌️',hint:'يسمح لكم بذكر إجابتين في السؤال القادم'},
  rest:{label:'استريح',icon:'🛋️',hint:'مرّر الدور مباشرة للفريق الآخر'}
};

const QUESTION_BANK = [
  {id:'bina',name:'اعرف جمعيتك',icon:'🏠',desc:'خدمات جمعية بناء وتنمية مساكن وأعمالها',questions:[
    {v:200,q:'في أي منطقة تعمل جمعية بناء وتنمية مساكن؟',a:'منطقة جازان'},
    {v:200,q:'اذكر خدمة واحدة من خدمات الجمعية السكنية.',a:'السكن التنموي أو الترميم أو البناء أو استكمال البناء'},
    {v:400,q:'اذكر قطاعين من القطاعات التي تخدمها الجمعية.',a:'أبو عريش والعارضة والحرث والريث (يكفي قطاعان)'},
    {v:400,q:'ما الهدف من تقليل المعاملات الورقية في خدمة المستفيدين؟',a:'تسريع الخدمة ورفع الكفاءة وتحسين تجربة المستفيد'},
    {v:600,q:'ما المستند الفني المطلوب للتأكد من إمكانية تنفيذ خدمة الترميم؟',a:'تقرير فني يثبت قابلية المسكن للترميم'},
    {v:600,q:'رتّب هذه المراحل: دراسة الطلب، استقبال المستفيد، تنفيذ الخدمة، التحقق من المستندات.',a:'استقبال المستفيد، التحقق من المستندات، دراسة الطلب، تنفيذ الخدمة'}]},
  {id:'teamwork',name:'روح الفريق',icon:'🤝',desc:'مواقف عملية وتواصل وتعاون داخل بيئة العمل',questions:[
    {v:200,q:'اذكر تصرفاً واحداً يساعد على نجاح العمل الجماعي.',a:'التواصل الواضح أو التعاون أو توزيع المهام أو احترام الآخرين'},
    {v:200,q:'عند اختلاف رأيين داخل الفريق، ما الخطوة الأفضل أولاً؟',a:'الاستماع للطرفين ومناقشة الحل بهدوء'},
    {v:400,q:'موظف لديه ضغط كبير وزميله أنهى مهامه، ما التصرف الذي يقوي روح الفريق؟',a:'عرض المساعدة وتقاسم المهام بعد التنسيق'},
    {v:400,q:'ما الفرق بين النقد البنّاء والانتقاد الشخصي؟',a:'النقد البنّاء يركز على العمل والحل، والشخصي يهاجم الشخص'},
    {v:600,q:'اذكر ثلاثة عناصر لاجتماع عمل قصير وفعّال.',a:'هدف واضح، وقت محدد، مهام ومسؤوليات واضحة'},
    {v:600,q:'كيف تتصرف إذا اكتشفت خطأ قد يؤثر على مستفيد؟',a:'إبلاغ المسؤول فوراً وتصحيح الخطأ وتوثيق الإجراء'}]},
  {id:'speed',name:'تحدي السرعة',icon:'⚡',desc:'أسئلة خاطفة تحتاج إجابة مباشرة',questions:[
    {v:200,q:'كم شهراً في السنة يحتوي على 28 يوماً؟',a:'جميع الأشهر'},
    {v:200,q:'أكمل خلال خمس ثوانٍ: يد واحدة لا...؟',a:'تصفق'},
    {v:400,q:'اذكر ثلاثة ألوان تبدأ بحرف الألف.',a:'أحمر، أخضر، أزرق'},
    {v:400,q:'ما العدد التالي: 2، 4، 8، 16؟',a:'32'},
    {v:600,q:'اذكر أربع محافظات أو مدن من منطقة جازان خلال عشر ثوانٍ.',a:'أي أربع إجابات صحيحة'},
    {v:600,q:'رتّب سريعاً من الأصغر إلى الأكبر: سنة، يوم، شهر، أسبوع.',a:'يوم، أسبوع، شهر، سنة'}]},
  {id:'saudi',name:'السعودية',icon:'🇸🇦',desc:'مدن، معالم، تاريخ وثقافة المملكة',questions:[
    {v:200,q:'ما عاصمة المملكة العربية السعودية؟',a:'الرياض'},
    {v:200,q:'ما البحر الذي يحد المملكة من جهة الغرب؟',a:'البحر الأحمر'},
    {v:400,q:'كم عدد المناطق الإدارية في المملكة؟',a:'13 منطقة'},
    {v:400,q:'في أي مدينة يقع حي الطريف التاريخي؟',a:'الدرعية'},
    {v:600,q:'ما اسم أول جامعة تأسست في المملكة العربية السعودية؟',a:'جامعة الملك سعود'},
    {v:600,q:'ما أكبر صحراء رملية متصلة تقع في جنوب شرق المملكة؟',a:'الربع الخالي'}]},
  {id:'jazan',name:'جازان',icon:'🌴',desc:'منطقة جازان، جزرها وتراثها وطبيعتها',questions:[
    {v:200,q:'على أي بحر تقع منطقة جازان؟',a:'البحر الأحمر'},
    {v:200,q:'ما اسم الأرخبيل الشهير التابع لمنطقة جازان؟',a:'جزر فرسان'},
    {v:400,q:'ما المحصول الذي تشتهر به جبال جازان ويستخدم في القهوة السعودية؟',a:'البن الخولاني'},
    {v:400,q:'ما اسم المحافظة الجبلية الشهيرة بزراعة البن في جازان؟',a:'الداير بني مالك'},
    {v:600,q:'ما اسم المحمية التي تضم جزر فرسان؟',a:'محمية جزر فرسان'},
    {v:600,q:'ما اسم الوادي الشهير الذي يجري قرب محافظة بيش؟',a:'وادي بيش'}]},
  {id:'football',name:'كرة القدم',icon:'⚽',desc:'قوانين وبطولات ونجوم اللعبة',questions:[
    {v:200,q:'كم لاعباً يبدأ المباراة مع كل فريق داخل الملعب؟',a:'11 لاعباً'},
    {v:200,q:'كم دقيقة مدة المباراة الأصلية دون الوقت بدل الضائع؟',a:'90 دقيقة'},
    {v:400,q:'ما اسم البطاقة التي تعني طرد اللاعب؟',a:'البطاقة الحمراء'},
    {v:400,q:'كم تبلغ المسافة بين نقطة الجزاء وخط المرمى تقريباً؟',a:'11 متراً'},
    {v:600,q:'أي منتخب فاز بأول نسخة من كأس العالم سنة 1930؟',a:'الأوروغواي'},
    {v:600,q:'ما النادي الذي يُعرف بلقب السيدة العجوز في إيطاليا؟',a:'يوفنتوس'}]},
  {id:'puzzles',name:'ألغاز',icon:'🧠',desc:'أسئلة تحتاج تركيز وسرعة بديهة',questions:[
    {v:200,q:'شيء له أسنان ولا يعض، ما هو؟',a:'المشط'},
    {v:200,q:'ما الشيء الذي كلما أخذت منه كبر؟',a:'الحفرة'},
    {v:400,q:'له وجه بلا عينين ويدين بلا أصابع، ما هو؟',a:'الساعة'},
    {v:400,q:'شيء إذا وضعته في الثلاجة لا يبرد، ما هو؟',a:'الفلفل الحار'},
    {v:600,q:'أين يوجد البحر الذي لا ماء فيه؟',a:'على الخريطة'},
    {v:600,q:'ما الذي يسمع بلا أذن ويتكلم بلا لسان؟',a:'الصدى'}]},
  {id:'tech',name:'تقنية',icon:'💻',desc:'إنترنت، أجهزة وبرمجيات',questions:[
    {v:200,q:'أي شركة تطور نظام أندرويد؟',a:'Google'},
    {v:200,q:'ما اسم الجزء الذي يُسمى عقل الحاسب؟',a:'المعالج CPU'},
    {v:400,q:'ما البروتوكول الآمن الشائع لتصفح المواقع؟',a:'HTTPS'},
    {v:400,q:'ما نظام إدارة الإصدارات الشهير المستخدم مع GitHub؟',a:'Git'},
    {v:600,q:'ما معنى اختصار RAM في الحاسب؟',a:'ذاكرة الوصول العشوائي'},
    {v:600,q:'ما اسم التقنية التي تسمح بتشغيل أنظمة افتراضية متعددة على جهاز واحد؟',a:'المحاكاة الافتراضية Virtualization'}]},
  {id:'geo',name:'جغرافيا',icon:'🌍',desc:'دول، عواصم، بحار وقارات',questions:[
    {v:200,q:'ما أكبر قارة في العالم من حيث المساحة؟',a:'آسيا'},
    {v:200,q:'ما عاصمة اليابان؟',a:'طوكيو'},
    {v:400,q:'ما أطول نهر في أمريكا الجنوبية؟',a:'نهر الأمازون'},
    {v:400,q:'ما الدولة التي تشتهر بشكلها المشابه للحذاء على الخريطة؟',a:'إيطاليا'},
    {v:600,q:'ما المضيق الذي يفصل آسيا عن أمريكا الشمالية؟',a:'مضيق بيرينغ'},
    {v:600,q:'ما أكبر جزيرة في العالم ليست قارة؟',a:'غرينلاند'}]},
  {id:'science',name:'علوم',icon:'🔬',desc:'فضاء، جسم الإنسان وطبيعة',questions:[
    {v:200,q:'ما الكوكب المعروف بالكوكب الأحمر؟',a:'المريخ'},
    {v:200,q:'ما الغاز الذي يحتاجه الإنسان للتنفس؟',a:'الأكسجين'},
    {v:400,q:'كم عدد عظام جسم الإنسان البالغ تقريباً؟',a:'206 عظمة'},
    {v:400,q:'ما العضو الذي يضخ الدم في جسم الإنسان؟',a:'القلب'},
    {v:600,q:'ما العنصر الكيميائي الذي رمزه Au؟',a:'الذهب'},
    {v:600,q:'ما اسم أقرب نجم إلى الأرض بعد الشمس؟',a:'بروكسيما قنطورس'}]},
  {id:'history',name:'تاريخ',icon:'🏺',desc:'حضارات وأحداث وشخصيات تاريخية',questions:[
    {v:200,q:'في أي دولة توجد أهرامات الجيزة؟',a:'مصر'},
    {v:200,q:'ما الحضارة التي بنت مدينة البتراء؟',a:'الأنباط'},
    {v:400,q:'من القائد المسلم الذي حرر القدس بعد معركة حطين؟',a:'صلاح الدين الأيوبي'},
    {v:400,q:'ما اسم المدينة الرومانية التي دفنها بركان فيزوف؟',a:'بومبي'},
    {v:600,q:'في أي عام ميلادي سقطت الأندلس بسقوط غرناطة؟',a:'1492'},
    {v:600,q:'ما اسم الطريق التجاري القديم الذي ربط الصين بالغرب؟',a:'طريق الحرير'}]},
  {id:'games',name:'ألعاب',icon:'🎮',desc:'ألعاب فيديو وأجهزة وشخصيات',questions:[
    {v:200,q:'ما اسم سباك نينتندو الشهير صاحب القبعة الحمراء؟',a:'ماريو'},
    {v:200,q:'ما الشركة التي تصنع جهاز PlayStation؟',a:'Sony'},
    {v:400,q:'في لعبة Minecraft، ما الأداة المناسبة لكسر حجر الألماس الخام؟',a:'معول حديدي أو أقوى'},
    {v:400,q:'ما اسم المدينة الرئيسية في لعبة GTA V؟',a:'لوس سانتوس'},
    {v:600,q:'ما اسم بطل سلسلة God of War؟',a:'كريتوس'},
    {v:600,q:'ما اسم العالم الخيالي الرئيسي في سلسلة The Legend of Zelda؟',a:'هايرول'}]},
  {id:'arabic',name:'لغة وكلمات',icon:'✍️',desc:'لغة عربية، مفردات وأمثال',questions:[
    {v:200,q:'ما جمع كلمة كتاب؟',a:'كتب'},
    {v:200,q:'ما ضد كلمة شجاع؟',a:'جبان'},
    {v:400,q:'أكمل المثل: من جد وجد ومن زرع ...؟',a:'حصد'},
    {v:400,q:'ما نوع كلمة «يكتب» من أقسام الكلام؟',a:'فعل'},
    {v:600,q:'ما الاسم الذي يطلق على الكلمات المتشابهة في اللفظ والمختلفة في المعنى؟',a:'الجناس'},
    {v:600,q:'ما جمع كلمة قاضٍ؟',a:'قضاة'}]},
  {id:'animals',name:'عالم الحيوان',icon:'🦁',desc:'حيوانات، طيور ومعلومات طبيعية',questions:[
    {v:200,q:'ما الحيوان الملقب بسفينة الصحراء؟',a:'الجمل'},
    {v:200,q:'ما أسرع حيوان بري؟',a:'الفهد'},
    {v:400,q:'ما أكبر حيوان على وجه الأرض؟',a:'الحوت الأزرق'},
    {v:400,q:'ما الطائر المعروف بقدرته على تقليد كلام الإنسان؟',a:'الببغاء'},
    {v:600,q:'ما الحيوان الذي يمتلك ثلاثة قلوب؟',a:'الأخطبوط'},
    {v:600,q:'ما الثديي الوحيد القادر على الطيران الحقيقي؟',a:'الخفاش'}]},
  {id:'mix',name:'منوعات',icon:'🎯',desc:'أسئلة متنوعة من كل مكان',questions:[
    {v:200,q:'كم يوماً في الأسبوع؟',a:'7 أيام'},
    {v:200,q:'ما اللون الناتج من خلط الأزرق والأصفر؟',a:'الأخضر'},
    {v:400,q:'كم ضلعاً للشكل السداسي؟',a:'6 أضلاع'},
    {v:400,q:'ما العملة الرسمية في اليابان؟',a:'الين'},
    {v:600,q:'ما أصغر عدد أولي؟',a:'2'},
    {v:600,q:'ما الآلة الموسيقية التي تحتوي عادة على 88 مفتاحاً؟',a:'البيانو'}]}
];

const TIE_BREAKERS = [
  {q:'كم عدد الكواكب في المجموعة الشمسية؟',a:'8 كواكب'},
  {q:'ما عاصمة أستراليا؟',a:'كانبيرا'},
  {q:'كم ثانية في خمس دقائق؟',a:'300 ثانية'},
  {q:'ما اسم أكبر محيط في العالم؟',a:'المحيط الهادئ'}
];

const $ = id => document.getElementById(id);
const deepCopy = obj => JSON.parse(JSON.stringify(obj));

function freshState(){
  return {
    stage:'home',
    teams:[
      {name:'فريق الموظفين',score:0,aids:['double','pit','time'],usedAids:[]},
      {name:'فريق الموظفات',score:0,aids:['double','pit','time'],usedAids:[]}
    ],
    timer:20,
    selected:[],
    pickerTurn:0,
    pickerCounts:[0,0],
    turn:0,
    usedQuestions:[],
    played:0,
    armed:{double:false,pit:false,two:false},
    settings:{sound:true,steal:true},
    startedAt:null
  };
}

let state = freshState();
let currentQuestion = null;
let activeQuestionTeam = 0;
let questionAids = {};
let timerHandle = null;
let timeLeft = 0;
let timerTotal = 0;
let timerPaused = false;
let modalMode = 'primary';
let answerRevealed = false;
let audioCtx = null;

function init(){
  hydrateHomeAidButtons();
  updateResumeCard();
  bindStaticEvents();
  renderHomeNames();
}

document.addEventListener('DOMContentLoaded',init);

function bindStaticEvents(){
  $('startBtn').addEventListener('click',beginCategoryPick);
  $('resumeBtn').addEventListener('click',resumeSavedGame);
  $('discardSaveBtn').addEventListener('click',discardSavedGame);
  $('randomCatsBtn').addEventListener('click',randomizeCategories);
  $('clearCatsBtn').addEventListener('click',clearCategories);
  $('startMatchBtn').addEventListener('click',startMatch);
  $('categorySearch').addEventListener('input',e=>renderCategoryPicker(e.target.value));
  $('fullscreenBtn').addEventListener('click',toggleFullscreen);
  $('soundBtn').addEventListener('click',toggleSound);
  $('settingsBtn').addEventListener('click',openSettings);
  $('closeSettingsBtn').addEventListener('click',closeSettings);
  $('toggleSteal').addEventListener('click',toggleSteal);
  $('settingsResetBtn').addEventListener('click',resetEverything);
  $('switchTurnBtn').addEventListener('click',manualSwitchTurn);
  $('finishNowBtn').addEventListener('click',finishEarly);
  $('newGameBtn').addEventListener('click',resetEverything);
  $('tieBreakBtn').addEventListener('click',startTieBreaker);
  $('pauseTimerBtn').addEventListener('click',togglePause);
  $('showAnswerBtn').addEventListener('click',showAnswer);
  $('correctBtn').addEventListener('click',()=>judgePrimary(true));
  $('wrongBtn').addEventListener('click',()=>judgePrimary(false));
  $('stealCorrectBtn').addEventListener('click',()=>finishSteal(true));
  $('stealWrongBtn').addEventListener('click',()=>finishSteal(false));
  $('endAfterRevealBtn').addEventListener('click',()=>finalizeQuestion(null,0));
  $('tieTeam1Btn').addEventListener('click',()=>declareTieWinner(0));
  $('tieTeam2Btn').addEventListener('click',()=>declareTieWinner(1));
  document.addEventListener('keydown',e=>{
    if(e.code==='Space' && !$('questionModal').classList.contains('hidden')){e.preventDefault();togglePause();}
    if(e.key==='Escape' && !$('settingsModal').classList.contains('hidden')) closeSettings();
  });
}

function renderHomeNames(){
  $('team1Input').value = state.teams[0].name;
  $('team2Input').value = state.teams[1].name;
  $('timerSelect').value = String(state.timer);
}

function hydrateHomeAidButtons(){
  document.querySelectorAll('.aid-option').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const team = Number(btn.dataset.team);
      const aid = btn.dataset.aid;
      const chosen = state.teams[team].aids;
      const exists = chosen.includes(aid);
      if(exists){
        if(chosen.length<=1) return;
        state.teams[team].aids = chosen.filter(x=>x!==aid);
      }else{
        if(chosen.length>=3){toast('اختر 3 وسائل فقط لكل فريق');return;}
        state.teams[team].aids.push(aid);
      }
      syncAidButtons();
    });
  });
  syncAidButtons();
}

function syncAidButtons(){
  document.querySelectorAll('.aid-option').forEach(btn=>{
    const team=Number(btn.dataset.team), aid=btn.dataset.aid;
    btn.classList.toggle('selected',state.teams[team].aids.includes(aid));
  });
  [0,1].forEach(i=>{
    const count=$(`aidCount${i+1}`);
    if(count) count.textContent=`${state.teams[i].aids.length}/3`;
  });
}

function beginCategoryPick(){
  const n1=$('team1Input').value.trim()||'الفريق الأول';
  const n2=$('team2Input').value.trim()||'الفريق الثاني';
  if(state.teams[0].aids.length!==3||state.teams[1].aids.length!==3){toast('لازم كل فريق يختار 3 وسائل مساعدة');return;}
  state.teams[0].name=n1;state.teams[1].name=n2;
  state.timer=Number($('timerSelect').value)||20;
  state.stage='picker';state.selected=[];state.pickerCounts=[0,0];state.pickerTurn=0;
  state.teams.forEach(t=>{t.score=0;t.usedAids=[]});
  state.usedQuestions=[];state.played=0;state.turn=0;state.armed={double:false,pit:false,two:false};
  showStage('picker');renderCategoryPicker();saveGame();beep('start');
}

function showStage(stage){
  ['homeScreen','categoryScreen','gameScreen','winnerScreen'].forEach(id=>$(id).classList.add('hidden'));
  if(stage==='home') $('homeScreen').classList.remove('hidden');
  if(stage==='picker') $('categoryScreen').classList.remove('hidden');
  if(stage==='game') $('gameScreen').classList.remove('hidden');
  if(stage==='winner') $('winnerScreen').classList.remove('hidden');
  state.stage=stage;
}

function renderCategoryPicker(filter=''){
  const grid=$('categoryPicker');grid.innerHTML='';
  const normalized=filter.trim().toLowerCase();
  QUESTION_BANK.filter(c=>!normalized||c.name.toLowerCase().includes(normalized)||c.desc.toLowerCase().includes(normalized)).forEach(cat=>{
    const selected=state.selected.find(x=>x.id===cat.id);
    const card=document.createElement('button');
    card.className='pick-card'+(selected?' selected':'');
    card.innerHTML=`<div class="check"></div><div class="pick-icon">${cat.icon}</div><div class="pick-name">${escapeHtml(cat.name)}</div><div class="pick-desc">${escapeHtml(cat.desc)}</div>${selected?`<div class="pick-owner">اختيار ${escapeHtml(state.teams[selected.owner].name)}</div>`:''}`;
    card.disabled=!!selected||state.selected.length>=6;
    card.addEventListener('click',()=>pickCategory(cat.id));
    grid.appendChild(card);
  });
  updatePickerStatus();
}

function pickCategory(id){
  if(state.selected.some(x=>x.id===id)||state.selected.length>=6) return;
  let team=state.pickerTurn;
  if(state.pickerCounts[team]>=3) team=1-team;
  state.selected.push({id,owner:team});
  state.pickerCounts[team]++;
  if(state.selected.length<6){
    const other=1-team;
    state.pickerTurn=state.pickerCounts[other]<3?other:team;
  }
  renderCategoryPicker($('categorySearch').value);saveGame();beep('pick');
}

function updatePickerStatus(){
  const done=state.selected.length===6;
  $('pickStatus').textContent=done?'جاهزين للعب 🔥':`الدور على ${state.teams[state.pickerTurn].name} — ${state.pickerCounts[state.pickerTurn]}/3`;
  $('pickCounter').textContent=`${state.selected.length}/6 فئات`;
  $('startMatchBtn').disabled=!done;
}

function randomizeCategories(){
  const shuffled=[...QUESTION_BANK].sort(()=>Math.random()-.5).slice(0,6);
  state.selected=shuffled.map((c,i)=>({id:c.id,owner:i<3?0:1}));
  state.pickerCounts=[3,3];state.pickerTurn=0;
  renderCategoryPicker($('categorySearch').value);saveGame();beep('pick');
}

function clearCategories(){
  state.selected=[];state.pickerCounts=[0,0];state.pickerTurn=0;renderCategoryPicker($('categorySearch').value);saveGame();
}

function startMatch(){
  if(state.selected.length!==6){toast('اختر 6 فئات أولاً');return;}
  state.stage='game';state.startedAt=Date.now();state.turn=0;showStage('game');renderGame();saveGame();beep('start');
}

function renderGame(){
  [0,1].forEach(i=>{
    $(`team${i+1}Name`).textContent=state.teams[i].name;
    $(`score${i+1}`).textContent=state.teams[i].score;
    $(`team${i+1}Card`).classList.toggle('active',state.turn===i);
    renderAids(i);
  });
  $('turnName').textContent=state.teams[state.turn].name;
  $('remainingText').textContent=`${36-state.played} سؤال متبقي`;
  $('progressBar').style.width=`${(state.played/36)*100}%`;
  const board=$('categoriesBoard');board.innerHTML='';
  state.selected.forEach(sel=>{
    const cat=QUESTION_BANK.find(c=>c.id===sel.id);if(!cat)return;
    const col=document.createElement('div');col.className='category';
    col.innerHTML=`<div class="cat-head"><span>${cat.icon}</span><b>${escapeHtml(cat.name)}</b><small>اختيار ${escapeHtml(state.teams[sel.owner].name)}</small></div>`;
    cat.questions.forEach((q,idx)=>{
      const qid=`${cat.id}-${idx}`, used=state.usedQuestions.includes(qid);
      const btn=document.createElement('button');btn.className='qbtn'+(used?' used':'');btn.disabled=used;btn.innerHTML=used?'—':`${q.v}`;
      btn.addEventListener('click',()=>openQuestion(cat.id,idx));col.appendChild(btn);
    });
    board.appendChild(col);
  });
}

function renderAids(teamIndex){
  const wrap=$(`aids${teamIndex+1}`);wrap.innerHTML='';
  state.teams[teamIndex].aids.forEach(key=>{
    const def=AIDS[key],used=state.teams[teamIndex].usedAids.includes(key),armed=state.turn===teamIndex&&state.armed[key];
    const btn=document.createElement('button');btn.className='aid-btn'+(used?' used':'')+(armed?' armed':'');btn.textContent=`${def.icon} ${def.label}`;btn.title=def.hint;btn.disabled=used;btn.addEventListener('click',()=>useAid(teamIndex,key));wrap.appendChild(btn);
  });
}

function useAid(teamIndex,key){
  if(teamIndex!==state.turn){toast('وسيلة المساعدة تستخدم في دور فريقك فقط');return;}
  const team=state.teams[teamIndex];if(team.usedAids.includes(key))return;
  if(key==='time'){
    if($('questionModal').classList.contains('hidden')){toast('استخدم +15 ثانية بعد فتح السؤال');return;}
    team.usedAids.push(key);timeLeft+=15;timerTotal+=15;updateTimerVisual();toast('تمت إضافة 15 ثانية ⏱️');beep('pick');saveGame();renderAids(teamIndex);return;
  }
  if(key==='rest'){
    team.usedAids.push(key);state.turn=1-state.turn;state.armed={double:false,pit:false,two:false};saveGame();renderGame();toast(`الدور الآن على ${state.teams[state.turn].name}`);return;
  }
  team.usedAids.push(key);state.armed[key]=true;saveGame();renderAids(teamIndex);toast(`${AIDS[key].icon} تم تفعيل ${AIDS[key].label} للسؤال القادم`);beep('pick');
}

function openQuestion(catId,index){
  const cat=QUESTION_BANK.find(c=>c.id===catId);const q=cat?.questions[index];if(!q)return;
  const qid=`${catId}-${index}`;if(state.usedQuestions.includes(qid))return;
  currentQuestion={...q,qid,catId,catName:cat.name,catIcon:cat.icon};
  activeQuestionTeam=state.turn;questionAids={...state.armed};modalMode='primary';answerRevealed=false;
  $('qCategory').textContent=`${cat.icon} ${cat.name}`;$('qValue').textContent=`${q.v} نقطة`;$('qText').textContent=q.q;$('answerBox').textContent=`الإجابة: ${q.a}`;$('answerBox').classList.add('hidden');
  $('primaryActions').classList.remove('hidden');$('stealPanel').classList.add('hidden');$('stealActions').classList.add('hidden');$('tieActions').classList.add('hidden');$('endAfterRevealBtn').classList.add('hidden');
  renderActiveQuestionAids();$('questionModal').classList.remove('hidden');startTimer(state.timer);beep('question');
}

function renderActiveQuestionAids(){
  const wrap=$('activeAids');wrap.innerHTML='';
  Object.keys(questionAids).filter(k=>questionAids[k]).forEach(key=>{
    const chip=document.createElement('span');chip.className='active-aid';chip.textContent=`${AIDS[key]?.icon||'✨'} ${AIDS[key]?.label||key}`;wrap.appendChild(chip);
  });
  const team=state.teams[activeQuestionTeam];
  if(team.aids.includes('time')&&!team.usedAids.includes('time')){
    const btn=document.createElement('button');btn.className='active-aid';btn.style.cursor='pointer';btn.textContent='⏱️ +15 ثانية';btn.onclick=()=>useAid(activeQuestionTeam,'time');wrap.appendChild(btn);
  }
}

function startTimer(seconds){
  clearInterval(timerHandle);timeLeft=seconds;timerTotal=seconds;timerPaused=false;$('pauseTimerBtn').textContent='⏸ إيقاف';updateTimerVisual();
  timerHandle=setInterval(()=>{if(timerPaused)return;timeLeft--;if(timeLeft<=5&&timeLeft>0)beep('tick');if(timeLeft<=0){timeLeft=0;clearInterval(timerHandle);beep('timeout');toast('انتهى الوقت ⏰');}updateTimerVisual();},1000);
}

function updateTimerVisual(){
  $('timerNum').textContent=timeLeft;const deg=Math.max(0,(timeLeft/Math.max(1,timerTotal))*360);$('timerRing').style.background=`conic-gradient(var(--cyan) ${deg}deg,rgba(255,255,255,.08) 0)`;
}

function togglePause(){
  if($('questionModal').classList.contains('hidden'))return;timerPaused=!timerPaused;$('pauseTimerBtn').textContent=timerPaused?'▶ متابعة':'⏸ إيقاف';
}

function showAnswer(){
  answerRevealed=true;clearInterval(timerHandle);$('answerBox').classList.remove('hidden');beep('reveal');
  if(modalMode==='steal'){$('stealActions').classList.add('hidden');$('endAfterRevealBtn').classList.remove('hidden');}
}

function judgePrimary(correct){
  if(!currentQuestion)return;
  if(correct){
    let points=currentQuestion.v*(questionAids.double?2:1);
    state.teams[activeQuestionTeam].score+=points;
    if(questionAids.pit) state.teams[1-activeQuestionTeam].score-=points;
    beep('correct');finalizeQuestion(activeQuestionTeam,points);return;
  }
  beep('wrong');
  if(state.settings.steal&&!answerRevealed){beginSteal();}else finalizeQuestion(null,0);
}

function beginSteal(){
  modalMode='steal';clearInterval(timerHandle);$('primaryActions').classList.add('hidden');$('stealPanel').classList.remove('hidden');$('stealActions').classList.remove('hidden');
  $('stealTeamName').textContent=state.teams[1-activeQuestionTeam].name;startTimer(10);toast(`فرصة سرقة لـ ${state.teams[1-activeQuestionTeam].name}`);
}

function finishSteal(correct){
  if(correct){state.teams[1-activeQuestionTeam].score+=currentQuestion.v;beep('correct');finalizeQuestion(1-activeQuestionTeam,currentQuestion.v)}else{beep('wrong');finalizeQuestion(null,0)}
}

function finalizeQuestion(winnerTeam,points){
  clearInterval(timerHandle);if(!currentQuestion)return;
  if(!state.usedQuestions.includes(currentQuestion.qid)){state.usedQuestions.push(currentQuestion.qid);state.played++;}
  state.turn=1-activeQuestionTeam;state.armed={double:false,pit:false,two:false};
  $('questionModal').classList.add('hidden');currentQuestion=null;questionAids={};modalMode='primary';answerRevealed=false;
  saveGame();
  if(state.played>=36){finishGame();}else{renderGame();if(winnerTeam!==null)toast(`${state.teams[winnerTeam].name} حصل على ${points} نقطة`);}
}

function manualSwitchTurn(){
  state.turn=1-state.turn;state.armed={double:false,pit:false,two:false};saveGame();renderGame();toast(`الدور على ${state.teams[state.turn].name}`);
}

function adjustScore(teamIndex,delta){
  state.teams[teamIndex].score+=delta;saveGame();renderGame();
}
window.adjustScore=adjustScore;

function finishEarly(){
  if(!confirm('إنهاء اللعبة الآن وحساب الفائز حسب النقاط الحالية؟'))return;finishGame();
}

function finishGame(){
  clearInterval(timerHandle);state.stage='winner';showStage('winner');
  const [a,b]=state.teams;$('finalName1').textContent=a.name;$('finalScore1').textContent=a.score;$('finalName2').textContent=b.name;$('finalScore2').textContent=b.score;
  const tie=a.score===b.score;$('tieBreakBtn').classList.toggle('hidden',!tie);
  if(tie){$('winnerTitle').textContent='تعادل ناري!';$('winnerText').textContent='النقاط متساوية — استخدموا السؤال الحاسم لتحديد بطل الميدان.';$('winnerIcon').textContent='⚔️';}
  else{const winner=a.score>b.score?a:b;$('winnerTitle').textContent=`${winner.name} بطل الميدان!`;$('winnerText').textContent=`أنهى التحدي برصيد ${winner.score} نقطة. مباراة قوية 👑`;$('winnerIcon').textContent='🏆';confetti();beep('win');}
  saveGame();
}

function startTieBreaker(){
  const q=TIE_BREAKERS[Math.floor(Math.random()*TIE_BREAKERS.length)];currentQuestion={q:q.q,a:q.a,v:200,qid:'tie'};modalMode='tie';answerRevealed=false;
  $('qCategory').textContent='⚔️ السؤال الحاسم';$('qValue').textContent='الفائز يحسم المباراة';$('qText').textContent=q.q;$('answerBox').textContent=`الإجابة: ${q.a}`;$('answerBox').classList.add('hidden');$('activeAids').innerHTML='';
  $('primaryActions').classList.add('hidden');$('stealPanel').classList.add('hidden');$('stealActions').classList.add('hidden');$('tieActions').classList.remove('hidden');$('endAfterRevealBtn').classList.add('hidden');$('questionModal').classList.remove('hidden');startTimer(20);beep('question');
}

function declareTieWinner(teamIndex){
  clearInterval(timerHandle);state.teams[teamIndex].score+=200;$('questionModal').classList.add('hidden');currentQuestion=null;finishGame();
}

function saveGame(){
  if(state.stage==='home')return;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));updateResumeCard();
}

function updateResumeCard(){
  const raw=localStorage.getItem(STORAGE_KEY);const card=$('resumeCard');if(!card)return;card.classList.toggle('hidden',!raw);
  if(raw){try{const saved=JSON.parse(raw);$('resumeText').textContent=saved.stage==='game'?`لديك لعبة محفوظة: ${saved.teams[0].name} ضد ${saved.teams[1].name} — ${saved.played}/36 سؤال`:'لديك إعداد لعبة محفوظ ويمكنك استكماله.';}catch{}}
}

function resumeSavedGame(){
  try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));if(!saved)return;state=saved;syncAidButtons();renderHomeNames();showStage(state.stage==='winner'?'winner':state.stage);
    if(state.stage==='picker')renderCategoryPicker();else if(state.stage==='game')renderGame();else if(state.stage==='winner')finishGame();toast('تم استكمال اللعبة المحفوظة ✅');
  }catch{toast('تعذر استكمال الحفظ القديم');}
}

function discardSavedGame(){localStorage.removeItem(STORAGE_KEY);updateResumeCard();toast('تم حذف اللعبة المحفوظة');}

function resetEverything(){
  if(!confirm('بدء لعبة جديدة؟ سيتم حذف التقدم الحالي.'))return;
  localStorage.removeItem(STORAGE_KEY);state=freshState();syncAidButtons();renderHomeNames();showStage('home');updateResumeCard();closeSettings();
}

function toggleSound(){state.settings.sound=!state.settings.sound;$('soundBtn').textContent=state.settings.sound?'🔊':'🔇';if(state.stage!=='home')saveGame();}
function toggleSteal(){state.settings.steal=!state.settings.steal;syncSettings();if(state.stage!=='home')saveGame();}
function openSettings(){syncSettings();$('settingsModal').classList.remove('hidden');}
function closeSettings(){$('settingsModal').classList.add('hidden');}
function syncSettings(){$('toggleSteal').classList.toggle('on',state.settings.steal);$('stealSettingText').textContent=state.settings.steal?'مفعّلة':'موقوفة';$('soundSettingText').textContent=state.settings.sound?'مفعّل':'موقوف';$('soundBtn').textContent=state.settings.sound?'🔊':'🔇';}

async function toggleFullscreen(){
  try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{toast('ملء الشاشة غير مدعوم في هذا المتصفح');}
}

function beep(type){
  if(!state.settings.sound)return;
  try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);const map={start:[420,.12],pick:[620,.06],question:[520,.08],tick:[760,.035],timeout:[180,.18],correct:[880,.18],wrong:[190,.2],reveal:[550,.08],win:[980,.35]};const [freq,dur]=map[type]||[440,.06];o.frequency.value=freq;o.type=type==='wrong'?'sawtooth':'sine';g.gain.setValueAtTime(.05,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.start();o.stop(audioCtx.currentTime+dur);}catch{}
}

function confetti(){
  const colors=['#ffd166','#25d7ea','#7a5cff','#35d07f','#ff5e76','#ff9b58'];
  for(let i=0;i<70;i++){const el=document.createElement('i');el.className='confetti';el.style.left=Math.random()*100+'vw';el.style.background=colors[Math.floor(Math.random()*colors.length)];el.style.animationDuration=(2.2+Math.random()*2.5)+'s';el.style.animationDelay=(Math.random()*.8)+'s';el.style.transform=`rotate(${Math.random()*360}deg)`;document.body.appendChild(el);setTimeout(()=>el.remove(),5200);}
}

function toast(message){
  const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2400);
}

function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}
