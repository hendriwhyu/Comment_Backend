# Backend Project Documentation

## Table of Contents
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Documentation Swagger](#documentation-swagger)

## Installation

1. **Clone the repository:**
    ```sh
    git clone git@github.com:CapstoneSIB-Comment/Backend.git
    cd yourproject/backend
    ```

2. **Install the dependencies:**
    ```sh
    npm install
    ```

## Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```env
DATABASE_URL=postgresql://postgres:xxxx@localhost:5432/(databasename)
JWT_SECRET=xxxxx
```

## Database Setup
3. **Install Prisma CLI**

```
npm install -g prisma
```
4. **Generate Prisma Client**
```
npx prisma generate
```
5. **Run Database Migrations**
```
npx prisma migrate dev --name init

```
6. **Seed the Database (optional)**

```
npx prisma db seed

``` 

## Running the Application

7. **Start the development server**
```
npm run dev
```

## API Endpoints

### Result
```
"status": "success",
    "msg": "Trends, posts, and users fetched",
    "data": {
        "posts": [
            {
                "id": "613f658c-1de4-4321-94d3-34c92f13a56c",
                "title": "Sample Event",
                "description": "Post Event telah diperbarui",
                "category": "Event",
                "image": null,
                "createdAt": "2024-06-16T14:39:10.344Z",
                "updatedAt": "2024-06-18T11:16:45.917Z",
                "maxParticipants": 100,
                "owner": {
                    "username": "Hendri1",
                    "id": "a0cedcfe-f096-4e07-af14-6e5b41594bbf",
                    "role": "company",
                    "profile": {
                        "photo": "Hendri.jpg",
                        "name": " Hendri Wahyu perdana ",
                        "headTitle": "Volunteer",
                        "phone": "081221224553"
                    }
                },
                "participants": [
                    {
                        "userId": "e728e857-80f7-4677-bda2-df1dd41710af",
                        "eventId": "613f658c-1de4-4321-94d3-34c92f13a56c",
                        "joinDate": "2024-06-18T10:08:35.577Z",
                        "isActive": true
                    }
                ]
            },
        ]
    };
```
## Error Handling
### Result
```
{
  "status": "error",
  "message": "Error message",
  "data": null
}
```

## Documentation Swagger

8. **Swagger**
```
https://capstonesib-comment.github.io/Dokumentasi-Backend
```

