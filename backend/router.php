<?php
// Router deprecated. Project no longer uses PHP backend; use Node.js server at server.js
http_response_code(410);
header('Content-Type: application/json');
echo json_encode(['error' => 'PHP router removed. Use Node backend (server.js).']);
exit;
