<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("sql102.infinityfree.com", "if0_39580483", "RuDr2004", "if0_39580483_omniquiz");

$res = $conn->query("SELECT * FROM responses ORDER BY session_id DESC");

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = [
        "user" => "User " . $row['session_id'],
        "qid" => $row['question_id'],
        "opt" => $row['chosen_option'],
        "conf" => $row['confidence'],
        "hint" => $row['hint_cost'] > 0 ? "Yes" : "No",
        "time" => $row['time_taken'],
        "score" => $row['score']
    ];
}

echo json_encode($data);
?>
