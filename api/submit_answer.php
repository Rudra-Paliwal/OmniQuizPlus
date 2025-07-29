<?php
// ===== FILE: api/submit_answer.php =====
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$conn = new mysqli("sql102.infinityfree.com", "if0_39580483", "RuDr2004", "if0_39580483_omniquiz");

$qid = $data['question_id'];
$opt = $data['chosen_option'];
$conf = intval($data['confidence']);
$hintCost = isset($data['hint_used']) && $data['hint_used'] ? 10 : 0;

$question = $conn->query("SELECT * FROM questions WHERE id=$qid")->fetch_assoc();

if (!$question) {
  echo json_encode([
    "message" => "❌ Question not found.",
    "next" => false
  ]);
  exit;
}

if ($opt === $question['correct_option']) {
  $score = $conf - $hintCost;
} else {
  $score = -$conf - $hintCost;
}

$conn->query("INSERT INTO responses (session_id, question_id, chosen_option, confidence, time_taken, hint_cost, score)
              VALUES (1, $qid, '$opt', $conf, 10, $hintCost, $score)");

echo json_encode([
  "message" => "Session 1 | Q$qid | Opt: $opt | Conf: $conf | Score: $score",
  "score" => $score,
  "next" => true
]);
?>
