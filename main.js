// ===== FILE: main.js =====
let currentSessionId = null;
let currentQuestion = null;
let timer = null;
let answeredCount = 0;        // 🧠 Tracks how many questions user answered
const MAX_QUESTIONS = 0;      // ✅ Change this number if you want more/less
let usedHints = {}; // Tracks per question
let askedQuestions = []; // 🔁 store question IDs already used


function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

function updateConfidence(val) {
  document.getElementById('confVal').innerText = val;
}

async function login() {
  const email = document.getElementById('login_email').value;
  const password = document.getElementById('login_password').value;

  const res = await fetch('api/login.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log(data); // Debug if needed

  if (data.success) {
    currentSessionId = data.session_id;
    alert(`Welcome, ${data.name}!`);
    document.querySelector('.auth').style.display = 'none';

    if (data.role === 'admin') {
      document.getElementById('adminPanel').style.display = 'block';
    } else {
      startQuiz();
    }
  } else {
    alert(data.message);
  }
}


async function register() {
  const name = document.getElementById('reg_name').value;
  const email = document.getElementById('reg_email').value;
  const password = document.getElementById('reg_password').value;
  const res = await fetch('api/register.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  alert(data.message);
}

async function startQuiz() {
  answeredCount = 0;
  document.getElementById('quizContainer').style.display = 'block';
  document.getElementById('quizPanel').style.display = 'block';
  document.getElementById('resultsPanel').style.display = 'none';

  // ✅ Get total question count from backend
  const res = await fetch("api/question_count.php");
  const data = await res.json();
  totalQuestions = data.total || 0;

  loadQuestion();
}



async function loadQuestion() {
  const res = await fetch("api/get_question.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exclude: askedQuestions }) // 🟡 send used IDs
  });

  const q = await res.json();

  if (q.end) {
    showResults();
    return;
  }

  currentQuestion = q;
  askedQuestions.push(q.id); // 🟢 remember this one

  document.getElementById("questionBox").innerHTML =
    `<p>${q.text}</p>` + Object.entries(q.options).map(([k, v]) =>
      `<label><input type="radio" name="option" value="${k}"> ${k}: ${v}</label><br>`
    ).join('');

  startTimer(30);
}


function startTimer(sec) {
  let t = sec;
  document.getElementById('timeLeft').innerText = t;
  timer = setInterval(() => {
    t--;
    document.getElementById('timeLeft').innerText = t;
    if (t <= 0) {
      clearInterval(timer);
      submitAnswer();
    }
  }, 1000);
}

function useHint() {
  const qid = currentQuestion.id;

  if (usedHints[qid]) {
    alert("Hint already used for this question:\n\n" + currentQuestion.hint);
    return;
  }

  alert("Hint: " + currentQuestion.hint + " (-10 pts)");
  usedHints[qid] = true;
}



async function submitAnswer() {
  clearInterval(timer);

  const opt = document.querySelector('input[name="option"]:checked');
  if (!opt) return alert("Please select an option.");

  const confidence = document.getElementById('confidence').value;

  const res = await fetch('api/submit_answer.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question_id: currentQuestion.id,
    chosen_option: opt.value,
    confidence: confidence,
    hint_used: usedHints[currentQuestion.id] || false
  })
});

const data = await res.json();
document.getElementById('feedback').innerText = data.message;

if (data.next) {
  loadQuestion();
} else {
  showResults();
}

}


async function showResults() {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";

  const res = await fetch("api/results.php");
  const data = await res.json();

  // ✅ Show total score
  document.getElementById("totalScoreText").innerText = `Total Score: ${data.total}`;

  // ✅ Render bar chart
  new Chart(document.getElementById("performanceChart"), {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Score by Question',
        data: data.scores,
        backgroundColor: '#64b5f6'
      }]
    }
  });
}


async function tryAgain() {
  askedQuestions = [];
  answeredCount = 0;

  document.getElementById("resultsPanel").style.display = "none";
  document.getElementById("quizPanel").style.display = "block";
  document.getElementById("quizContainer").style.display = "block";
  document.getElementById("feedback").innerText = "";
  document.getElementById("confidence").value = 50;
  document.getElementById("confVal").innerText = "50";

  loadQuestion(); // 🎯 starts fresh
}



async function addQuestion() {
  const payload = {
    text: document.getElementById('question_text').value,
    options_json: document.getElementById('options_json').value,
    correct_option: document.getElementById('correct_option').value,
    topic: document.getElementById('topic').value,
    difficulty: document.getElementById('difficulty').value
  };
  const res = await fetch('api/add_question.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  alert(data.message);
}

function showSection(section) {
  document.getElementById("addQuestionSection").style.display = (section === 'add') ? 'block' : 'none';
  document.getElementById("resultsSection").style.display = (section === 'results') ? 'block' : 'none';
}

async function fetchResults() {
  const res = await fetch("api/results.php");
  const data = await res.text(); // assuming plain text or formatted HTML
  document.getElementById("resultsOutput").innerText = data;
}

function downloadMyResults() {
  fetch("api/download_my_results.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: currentSessionId })
  })
  .then(res => res.blob())
  .then(blob => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "my_results.csv";
    link.click();
  });
}

