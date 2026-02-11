# 441-Group-Project


## **User Story & Implementation Table**

| Priority | User | Description | Technical Implementation |
| :---- | :---- | :---- | :---- |
| **P0** | Seller | I want to create an account so I can manage my personal listings. | Use **Node.js** with **Passport.js** or **JWT** to handle user authentication and store encrypted credentials in **MongoDB**. |
| **P0** | Seller | I want to upload an item with a title, description, and price. | Implement a POST route in **Node.js** that validates input and saves the item details as a document in a **MongoDB** "listings" collection. |
| **P0** | Buyer | I want to view a list of all available items on a home page. | Create a GET endpoint that fetches all documents from the **MongoDB** listings collection and renders them via the front-end. |
| **P0** | Buyer | I want to search for items by keyword so I can find exactly what I need. | Implement **MongoDB** text indexing on the "title" and "description" fields to allow for efficient keyword-based queries via a RESTful API. |
| **P1** | Seller | I want to upload images of my items to attract more buyers. | Integrate image hosting, storing the resulting image URLs within the specific item document in **MongoDB**. |
| **P1** | Buyer | I want to filter items by category (e.g., Electronics, Furniture). | Add a category field to the schema and use **Node.js** to pass specific query parameters to the **MongoDB** .find() method. |
| **P1** | User | I want to view a specific item's details on a dedicated page. | Create a dynamic route (e.g., /items/:id) that uses the unique **MongoDB** ObjectId to fetch and display detailed information for a single listing. |
| **P1** | Seller | I want to edit or delete my existing listings. | Implement PUT and DELETE request handlers in **Node.js** that verify the user's ID matches the seller's ID before modifying the **MongoDB** entry. |
| **P2** | Buyer | I want to see a seller's average rating before I buy from them. | Use **MongoDB** aggregation pipelines to calculate the average of all "rating" values associated with a specific user ID in the reviews collection. |
| **P2** | Buyer | I want to leave a review and a star rating for a seller after a transaction. | Create a dedicated "Reviews" collection in **MongoDB** that links the reviewer ID, the seller ID, and the specific transaction ID. |
| **P2** | User | I want to update my profile information, such as my location or bio. | Use a PATCH route in **Node.js** to update specific fields in the user's document within the **MongoDB** "users" collection. |
| **P3** | User | I want to receive real-time messages from other users about an item. | Implement **Socket.io** to enable bi-directional, real-time communication between the client and the **Node.js** server without page refreshes. |
| **P3** | Buyer | I want to save items to a "Watchlist" or "Favorites" list. | Add an "array" field to the User schema in **MongoDB** that stores the ObjectIds of the items the user has favorited. |
| **P4** | User | I want to join a community forum to discuss specific item categories. | Develop a separate "Posts" collection in **MongoDB** and use **RESTful APIs** to handle threading, replies, and category tagging. |
| **P4** | User | I want to receive a notification when an item on my watchlist drops in price. | Set up a "Change Stream" in **MongoDB** or a middleware function in **Node.js** that triggers an email or alert when the price field is updated. |


## **Database Schemas**

**Users:**  
User\_id (PK) (String)  
Balance (Number)  
Orders (FK) (Array of Strings)  
Type (String)  
Phone (String)  
Email (String)

**Order:**  
Order\_id (PK) (String)  
Created\_date (String)  
Buyer\_id (FK) (String)  
Seller\_id (FK) (String)  
Item\_id (FK) (Array of Strings)  
Quantity (Number)  
Transaction\_total (Number)  
Status (String)

**Item:**  
Item\_id (PK)   
Name (String)  
Price (Number)  
Quantity\_in\_stock (Number)  
Description (String)  
Num\_likes (Number)  
Num\_dislikes (Number)  
Quantity\_sold (Number)  
Seller\_id (FK) (String)
