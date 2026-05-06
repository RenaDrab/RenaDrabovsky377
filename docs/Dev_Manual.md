# How to install your application and all dependencies
Requirements before running the project, install:
- Node.js (includes npm)
- A Vercel account (for deployment)
- Supabase project (for database)

Then open your terminal in the project folder and run:
- npm install express axios cors @supabase/supabase-js dotenv

# How to run your application on a server
To start the backend server, run this in the terminal: 
- node server.js 

Vercel structure requirement:
- /public
-   index.html
-   finalabout.html
-   finalfunction.html
-   finaljsrena.js
-   finalcssrena.css
- /images
-   all the image pngs
- /api
-   fetch-and-save.js
-   products.js
-   question.js
     
# How to run any tests you have written for your software
test locally

in terminal enter:
- node index.js

Expected output:
- SERVER FILE LOADED
- Server running on http://localhost:3000
- TOKEN RECEIVED 

To test product fetch in a web browser type:
- http://localhost:3000/products

It should give you a list of products if it's working and an error code if it's not. 

To test Kroger API and Supabase in a web browser type:
- http://localhost:3000/fetch-and-save?zipcode=20852&item=bread&category=Organic 

It should give you a list of products if it's working and an error code if it's not.

To test questions AP, in a web browser type:
- http://localhost:3000/question 

It should give you a list of questions and answers if it's working and an error code if it's not.

# The API for your server application - all GET, POST, PATCH, etc endpoints, and what they each do
The server currently uses GET endpoints to retrieve and process data. There are no POST or PATCH endpoints implemented. Data from the Kroger API is fetched and stored in Supabase through a GET route (/fetch-and-save), while /products and /question are used to retrieve stored data. Future development could have POST and PATCH routes to allow users to submit and update ratings.

# A clear set of expectations around known bugs and a road-map for future development.
Known bugs/issues: 
- Kroger API sometimes returns 401 errors if the token expires or rate limit is hit - what I have done multiple times is to delete the terminal window and load node server.js again. Most of the time this fixed my 401 issues. 
- Some products show N/A for nutrition data (missing API fields) - This is not my fault but it would be nice if Kroger would have all the information for all fields about all products. 
- Swiper image sliders require you to download the images and store them in images, if they are downloaded in another place/folder the images will not pop up in the slider.
- I also want to add more info for small things like an error for misspelled words or a nonvalid zipcode - right now the website just will not work if you do this but it wont display a message, the only way you will know is in the terminal. 

Future ideas:
- User login system (save favorites per user)
- “Save this product” button (wishlist feature)
- Improved nutrition scoring algorithm
- More categories like vegan or vegetarian or even allergens like peanut free
- Recommendation system (“healthiest option for you”)
- Map integration for store locations
- Addresses for store locations
- Mobile app version
- Allow filtering for protein, sugar, fat comparisons
