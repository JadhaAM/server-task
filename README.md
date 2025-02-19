# Server Generator

Generates a Node.js/Express server from JSON configuration.

## Setup

1. Clone the repository
```bash
git clone https://github.com/JadhaAM/server-project.git
cd server-generator
```

2. Install dependencies
```bash
npm install
```

3. Configure the server
Update `server-config.json` with your route configuration.

4. Generate and run the server
```bash
npm start        # Starts the server
```


## Testing

### Postman API Tests

#### Setup Environment Variables
1. Create a new environment in Postman
2. Add these variables:
   - `baseUrl`: http://localhost:3000
   - `authToken`: (This will be automatically set after login)
   - `adminToken`: (This will be automatically set after admin login)

#### Test Cases

##### 1. Signup Flow
**Request:**
- Method: POST
- URL: {{baseUrl}}/signup
- Headers: 
  - Content-Type: application/json
- Body:
```json
{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
}
```
**Expected Response:**
```json
{
    "message": "Signup successful"
}
```

##### 2. Regular User Login
**Request:**
- Method: POST
- URL: {{baseUrl}}/login
- Headers:
  - Content-Type: application/json
- Body:
```json
{
    "email": "test@example.com",
    "password": "password123",
    "isAdmin": false
}
```
**Expected Response:**
```json
{
    "token": "eyJhbG...",
    "message": "Login successful"
}
```
**Test Script:**
```javascript
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.environment.set("authToken", jsonData.token);
});
```

##### 3. Admin Login
**Request:**
- Method: POST
- URL: {{baseUrl}}/login
- Headers:
  - Content-Type: application/json
- Body:
```json
{
    "email": "admin@example.com",
    "password": "admin123",
    "isAdmin": true
}
```
**Expected Response:**
```json
{
    "token": "eyJhbG...",
    "message": "Login successful"
}
```
**Test Script:**
```javascript
pm.test("Admin login successful", function () {
    var jsonData = pm.response.json();
    pm.environment.set("adminToken", jsonData.token);
});
```

##### 4. Get User Data (Protected Route)
**Request:**
- Method: GET
- URL: {{baseUrl}}/user
- Headers:
  - Authorization: Bearer {{authToken}}

**Expected Response:**
```json
{
    "message": "User data",
    "userId": 1
}
```

##### 5. Access Admin Route (Admin Protected)
**Request:**
- Method: GET
- URL: {{baseUrl}}/admin
- Headers:
  - Authorization: Bearer {{adminToken}}

**Expected Response:**
```json
{
    "message": "Admin data"
}
```

##### 6. Public Routes

###### Home Page
**Request:**
- Method: GET
- URL: {{baseUrl}}/home

**Expected Response:**
```json
{
    "message": "Welcome to Home Page"
}
```

###### About Page
**Request:**
- Method: GET
- URL: {{baseUrl}}/about

**Expected Response:**
```json
{
    "message": "About us"
}
```

###### News Page
**Request:**
- Method: GET
- URL: {{baseUrl}}/news

**Expected Response:**
```json
{
    "message": "Latest news"
}
```

###### Blogs Page
**Request:**
- Method: GET
- URL: {{baseUrl}}/blogs

**Expected Response:**
```json
{
    "message": "Blogs list"
}
```

#### Error Test Cases

##### 1. Invalid Token
**Request:**
- Method: GET
- URL: {{baseUrl}}/user
- Headers:
  - Authorization: Bearer invalid_token

**Expected Response:**
```json
{
    "message": "Invalid token"
}
```

##### 2. No Token Provided
**Request:**
- Method: GET
- URL: {{baseUrl}}/user

**Expected Response:**
```json
{
    "message": "No token provided"
}
```

##### 3. Regular User Accessing Admin Route
**Request:**
- Method: GET
- URL: {{baseUrl}}/admin
- Headers:
  - Authorization: Bearer {{authToken}}

**Expected Response:**
```json
{
    "message": "Admin access required"
}
```

## API Documentation

### Public Routes
- GET `/home` - Home page
- GET `/about` - About page
- GET `/news` - News page
- GET `/blogs` - Blogs page

### Authentication Routes
- POST `/login` - Login user
- POST `/signup` - Register new user
- POST `/signout` - Sign out user

### Protected Routes
- GET `/user` - Get user data (requires authentication)
- GET `/admin` - Get admin data (requires admin authentication)

## License

MIT