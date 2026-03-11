@dduyanhhoang ➜ /workspaces/expressBookReviews (main) $ curl -X POST http://localhost:5000/customer/login \                                   curl -X POST http://localhost:5000/customer/login \
     -H "Content-Type: application/json" \
     -c cookies.txt \
     -d '{"username": "testuser", "password": "testpassword"}'
User successfully logged in