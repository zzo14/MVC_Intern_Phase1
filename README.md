# MVC_Intern_Phase1 - Onboarding task
 
## Introduction
This project is the MVC Studio Onboarding task. This application allows users to create, edit, and delete customer, product, and store records alongside managing their sales data.

## Live Demo
Check out our live application here: [Sales Management Console](https://salesmanagementappclient.z8.web.core.windows.net/)

## Features
- **Create**: Add new data records with all necessary details.
- **Edit**: Update existing data information.
- **Delete**: Remove data records from the system.
- **Sales Tracking**: Monitor and record sales transactions.
 
## Technology Stack
- **Frontend**: React.js for building dynamic user interface, using ES6 classes and JSX, Semantic-UI-React for UI components, and AJAX for API calls.
- **Backend**: ASP.NET Core with MVC architecture for handling CRUD operations, utilizing Data Annotations for model validation and defining the database schema through Entity Framework Code-First approach.

## Project Structure
- `sales_management_app.client`: Contains the front-end React application.
- `sales_management_app.Server`: Contains the backend .NET Core Web API.

## Installation
  1. Open terminal.
  2. Navigate into the client directory:  
     `cd sales_management_app.client`.
  3. Install Dependencies: Inside the project directory, install the necessary dependencies using npm:  
     `npm install`.
  4. Go back to the project root directory and Navigate to the Server Project Directory:  
     `cd sales_management_app.Server`.
  5. Build the Project: Use the .NET Core CLI to build the project:  
     `dotnet build`
  6. Run the Application: Finally, run the application:  
     `dotnet run`.

## Snapshots

### Sales Page
![Sales Page Main View](/show_pics/main.png)
Here is the main view of the Sales page, displaying all sales records.

### Create a New Sale
![Create Sale Modal](/show_pics/create.png)
This modal pops up when creating a new sale entry.

### Edit an Existing Sale
![Edit Sale Modal](/show_pics/edit.png)
Here you can see the edit modal prefilled with the sale's existing details.

### Delete a Sale
![Delete Sale Confirmation](/show_pics/delete.png)
This is the confirmation dialogue that appears when you attempt to delete a sale.

