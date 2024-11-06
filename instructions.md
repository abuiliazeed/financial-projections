# **Structured Prompt Sequence for Building a Small Business Financial Projections Web App**

---

### **Prompt 1: Project Initialization**

- **Task**: Initialize a new Next.js project with TypeScript support.
- **Instructions**:
  - Use `create-next-app` with the TypeScript template:

    ```bash
    npx create-next-app@latest --typescript
    ```
  - Ensure the project follows best practices in structure and organization.
- **Official Documentation Reference**:
  - [Next.js: Getting Started](https://nextjs.org/docs/getting-started)
- **Expected Output**:
  - A new Next.js project set up with TypeScript.

---

### **Prompt 2: Install and Configure Dependencies**

- **Task**: Install necessary dependencies: SQLite, shadcn UI components, bcrypt.
- **Instructions**:
  - Install SQLite driver for Node.js:

    ```bash
    npm install sqlite3
    ```
  - Install shadcn UI components:

    ```bash
    npm install @shadcn/ui
    ```
  - Install bcrypt for password hashing:

    ```bash
    npm install bcrypt
    ```
  - Update `package.json` with these dependencies.
- **Official Documentation References**:
  - [Node SQLite3 Guide](https://github.com/TryGhost/node-sqlite3/wiki)
  - [shadcn/UI Documentation](https://ui.shadcn.com/docs)
  - [bcrypt on npm](https://www.npmjs.com/package/bcrypt)
- **Expected Output**:
  - Dependencies installed and listed in `package.json`.

---

### **Prompt 3: Set Up User Authentication**

- **Task**: Implement user authentication with username and password.
- **Instructions**:
  - Create a `users` table in SQLite with fields: `id`, `username`, `passwordHash`.
  - Use bcrypt to hash passwords before storing them.
    - Hash passwords with a suitable number of salt rounds (e.g., 10).
  - Implement API routes for user signup and login using Next.js API routes.
    - POST `/api/signup`: to register new users.
    - POST `/api/login`: to authenticate users.
  - Use sessions or JSON Web Tokens (JWT) to manage user sessions.
- **Official Documentation References**:
  - [bcrypt Usage](https://www.npmjs.com/package/bcrypt#a-note-on-rounds)
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - [Managing Authentication](https://nextjs.org/docs/authentication)
- **Expected Output**:
  - Secure user authentication system.
  - API routes for signup and login.

---

### **Prompt 4: Create Database Schema**

- **Task**: Define the database schema for expense and revenue management.
- **Instructions**:
  - Create the following tables in SQLite:
    - **ExpenseTypes**:
      - `id` INTEGER PRIMARY KEY AUTOINCREMENT
      - `userId` INTEGER
      - `name` TEXT
    - **RevenueTypes**:
      - `id` INTEGER PRIMARY KEY AUTOINCREMENT
      - `userId` INTEGER
      - `name` TEXT
    - **Expenses**:
      - `id` INTEGER PRIMARY KEY AUTOINCREMENT
      - `userId` INTEGER
      - `year` INTEGER
      - `month` INTEGER
      - `expenseTypeId` INTEGER
      - `amount` REAL
    - **Revenues**:
      - `id` INTEGER PRIMARY KEY AUTOINCREMENT
      - `userId` INTEGER
      - `year` INTEGER
      - `month` INTEGER
      - `revenueTypeId` INTEGER
      - `amount` REAL
  - Ensure foreign keys are properly set up to maintain data integrity.
- **Expected Output**:
  - SQL scripts or code that creates these tables.
  - Database initialized with the schema.

---

### **Prompt 5: Implement CRUD Operations**

- **Task**: Develop API routes for managing expense and revenue types and entries.
- **Instructions**:
  - **Expense Types**:
    - GET `/api/expense-types`: Fetch all expense types for the authenticated user.
    - POST `/api/expense-types`: Add a new expense type.
    - PUT `/api/expense-types/:id`: Update an existing expense type.
    - DELETE `/api/expense-types/:id`: Delete an expense type.
  - **Revenue Types**:
    - Similar endpoints as expense types.
  - **Expenses and Revenues**:
    - GET `/api/expenses`: Fetch expenses based on filters (e.g., year, month).
    - POST `/api/expenses`: Add a new expense entry.
    - PUT `/api/expenses/:id`: Update an expense entry.
    - DELETE `/api/expenses/:id`: Delete an expense entry.
    - Repeat for revenues.
  - Ensure all routes are protected and require authentication.
- **Expected Output**:
  - Fully functional API routes with appropriate HTTP methods.
  - Input validation and error handling.

---

### **Prompt 6: Build the User Interface**

- **Task**: Create the frontend pages using shadcn UI components.
- **Instructions**:
  - **Authentication Pages**:
    - Login page (`/login`) with a form for username and password.
    - Signup page (`/signup`) with a form to create a new account.
  - **Dashboard Page**:
    - Main page (`/dashboard`) where users can select a year.
    - Display a table showing monthly financial projections for the selected year.
  - **Expense and Revenue Type Management**:
    - Pages to add, edit, and delete expense and revenue types.
  - **Expense and Revenue Entry Forms**:
    - Forms to add expenses and revenues by selecting year, month, type, and amount.
  - Use shadcn UI components for all UI elements to ensure a consistent look and feel.
- **Official Documentation Reference**:
  - [shadcn/UI Components](https://ui.shadcn.com/docs/components)
- **Expected Output**:
  - User-friendly frontend interface.
  - Seamless integration between frontend and backend.

---

### **Prompt 7: Implement Financial Projections Dashboard**

- **Task**: Develop a dashboard to display financial projections.
- **Instructions**:
  - Allow users to select a year from a dropdown or date picker.
  - Fetch and calculate total revenues and expenses for each month.
  - Display the results in a table format with columns for:
    - Month
    - Total Revenue
    - Total Expenses
    - Net Profit (Revenue - Expenses)
  - Optionally, include graphs or charts for visual representation.
- **Expected Output**:
  - A dynamic dashboard that updates based on user input.
  - Accurate financial calculations displayed clearly.

---

### **Note to the Coding LLM**

- **Technology Stack**:
  - Use **Next.js** with **TypeScript** for the frontend and backend.
  - Use **SQLite** without an ORM; interact with the database using raw SQL queries.
  - Use **shadcn UI components** for consistent styling.
  - Use **bcrypt** for password hashing.
- **Best Practices**:
  - Follow best practices for code structure, readability, and performance.
  - Include comments in the code where necessary for clarity.
  - Ensure code is modular and reusable.
- **Functionality**:
  - The application should be fully functional, meeting all specified requirements.
  - Ensure that all user interactions are smooth and intuitive.
- **Security**:
  - Prioritize security in authentication and data handling.
  - Protect against common vulnerabilities.
- **Testing**:
  - Write comprehensive tests to validate functionality.
  - Ensure the application is robust and handles errors gracefully.






