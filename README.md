# AtoZeeVisas CRM Backend

## Overview

AtoZeeVisas CRM Backend is a Node.js and Express-based backend for a Customer Relationship Management (CRM) system. It provides authentication and database management using Sequelize ORM with MySQL or SQLite.

## Features

- User authentication with JWT
- Social authentication via Facebook, LinkedIn, and Twitter using Passport.js
- Secure password hashing with bcrypt
- Environment variable management with dotenv
- Sequelize ORM for database interactions
- SQLite and MySQL database support

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- [MySQL](https://www.mysql.com/) (if using MySQL as the database)

### Steps

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd atozeevisas-crm-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and configure necessary variables.
4. Start the development server:
   ```sh
   npm run dev
   ```
   or
   ```sh
   nodemon index.js
   ```

## Dependencies

- **bcrypt** & **bcryptjs**: Secure password hashing
- **dotenv**: Manage environment variables
- **express**: Web framework
- **jsonwebtoken**: JWT authentication
- **mysql2**: MySQL database driver
- **passport**: Authentication middleware
- **passport-facebook**, **passport-linkedin-oauth2**, **passport-twitter**: Social authentication strategies
- **sequelize**: ORM for database management

## Dev Dependencies

- **nodemon**: Auto-restart server on file changes

## Running Tests

Currently, no tests are specified.

## License

This project is licensed under the ISC License.

## Author

AtoZeeVisas Team
