<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    die("Unauthorized");
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo_list_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    if ($action === 'add') {
        $user_id = $_SESSION['user_id'];
        $title = $_POST['title'];
        $category = $_POST['category'];
        $due_date = $_POST['due_date'];
        $sql = "INSERT INTO tasks (user_id, title, category, due_date) VALUES ('$user_id', '$title', '$category', '$due_date')";
        if ($conn->query($sql) === TRUE) {
            echo "Task added successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif ($action === 'fetch') {
        $user_id = $_SESSION['user_id'];
        $sql = "SELECT * FROM tasks WHERE user_id='$user_id'";
        $result = $conn->query($sql);
        $tasks = array();
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        echo json_encode($tasks);
    } elseif ($action === 'complete') {
        $task_id = $_POST['task_id'];
        $sql = "UPDATE tasks SET completed=1 WHERE id='$task_id'";
        if ($conn->query($sql) === TRUE) {
            echo "Task completed";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif ($action === 'edit') {
        $task_id = $_POST['task_id'];
        $title = $_POST['title'];
        $category = $_POST['category'];
        $due_date = $_POST['due_date'];
        $sql = "UPDATE tasks SET title='$title', category='$category', due_date='$due_date' WHERE id='$task_id'";
        if ($conn->query($sql) === TRUE) {
            echo "Task updated";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif ($action === 'delete') {
        $task_id = $_POST['task_id'];
        $sql = "DELETE FROM tasks WHERE id='$task_id'";
        if ($conn->query($sql) === TRUE) {
            echo "Task deleted";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

$conn->close();
?>
