<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    
    header('Content-Type: application/json'); 

    $host = 'localhost'; // Host name
    $dbname = 'booksdb'; // Database name
    $username = 'root'; // Username for database
    $password = 'Admin@123'; // Password for database

    // Connect to the database
    $conn = new mysqli($host, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $search = isset($_GET['query']) ? $_GET['query'] : ''; // Ensure the search term is set

    // Check for empty search term
    if (empty($search)) {
        http_response_code(400); // Bad request
        echo json_encode(["error" => "Search term is required"]);
        exit;
    }

    // SQL query to fetch books matching the search term in book_name only
    $sql = "SELECT id, book_name, author_name FROM books WHERE book_name LIKE ?";
    $stmt = $conn->prepare($sql);

    // Check if statement preparation was successful
    if (!$stmt) {
        http_response_code(500); // Internal server error
        echo json_encode(["error" => "SQL prepare failed: " . $conn->error]);
        exit;
    }

    $searchTerm = '%' . $search . '%';
    $stmt->bind_param("s", $searchTerm);

    // Execute the statement and check for errors
    if (!$stmt->execute()) {
        http_response_code(500); // Internal server error
        echo json_encode(["error" => "SQL execute failed: " . $stmt->error]);
        exit;
    }

    $result = $stmt->get_result();

    $books = [];
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }

    // Close connection
    $stmt->close();
    $conn->close();

    echo json_encode($books);
    exit;
?>
