<?php
// ===== FILE: api/add_question.php =====
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli("sql102.infinityfree.com", "if0_39580483", "RuDr2004", "if0_39580483_omniquiz");



$text = $conn->real_escape_string($data['text']);
$options_json = $conn->real_escape_string($data['options_json']);
$correct = $data['correct_option'];
$topic = $conn->real_escape_string($data['topic']);
$diff = intval($data['difficulty']);

$conn->query("INSERT INTO questions (text, options_json, correct_option, topic_id, difficulty) VALUES ('$text', '$options_json', '$correct', '$topic', $diff)");
echo json_encode(["success" => true, "message" => "Question added."]);
?>
