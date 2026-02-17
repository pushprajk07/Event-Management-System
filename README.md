# Event-Management-System
Event Management System - Walkthrough The Event Management System has been successfully set up and configured.  Prerequisites Node.js installed MongoDB installed and running locally on port 27017

Starting the Application
Open a terminal in the project directory: c:\Users\91950\OneDrive\Desktop\AAP.... so on

Run the server:

bash
npm start
(or node server.js if npm start is not defined in package.json - I used nodemon in installation so npx nodemon server.js is also good).

Note: I installed nodemon so you can use npx nodemon server.js for development.

The server should start at http://localhost:3000.

Testing the Application
1. Login
Admin Account:
Username: admin
Password: adminpassword
User Account:
Username: user
Password: userpassword


3. Dashboard & Access Control
Log in as Admin: You will see the "Maintenance" button/link.
Log in as User: You will NOT see the "Maintenance" button/link.
Chart Link: Visible in the header on all pages (opens external link).
4. Maintenance (Admin Only)
Navigate to Maintenance.
Add Membership:

Fill in details. Select Duration (6 months/1 year/2 years).
Submit.
Update Membership:
Search for the Membership Number you just added.
Modify details (Name).
Select "Extend" option or "Cancel".
Update.

6. Reports & Transactions
Accessible via the Dashboard or Header links for both User and Admin.
Project Structure
server.js: Main backend logic.
models/: Database schemas (User, Membership).
views/: EJS templates for frontend.
public/: Static files (CSS).
