AuthBuy is a platform where a user can authenticate him/her and proceed on to purchase a product using Razorpay Payement gateway. In order to run this project smoothly on your side:-
1. Create a dotenv (.env) file in your server folder.
2. You must have a MongoDB Atlas account. There you can create a cluster and pick up the MongoDB URI and store it in the dotenv file under the name "MONGOBD_URI".
3. In the .env file create a "JWT_SECRET" for hashing the password entered by user(Here we use JSON Web Token).
4. Set up "NODE_ENV" as "development" in .env file.
5. To send the mail from your server you need to setup on "Brevo" website.Signing up on "Brevo", go to "smtp" section you will get the credentials - user and password.Store it on your .env file with names as "SMTP_USER" and "SMTP_PASS"."SENDER_MAIL" is set to the mail id with which you registered in "BREVO" website.
6. To integrate your project with payment gateway you must signup on "Razorpay" and under the "Test mode" section you will find "Key" and "Secret Key".Store it in your .env file under the names "RAZORPAY_KEY_ID" and "RAZORPAY_KEY_SECRET" respectively.
7. In server terminal run "npm i" to install the node modules.
8. In client folder terminal run "npm i" to install node modules.Install "vite" using "npm i vite".

Following all the above mentioned steps your secret credentials will come up in the .env file and your project is ready to go. To run it follow the commands-
1. In server terminal- npm run server
2. In client terminal-npm run dev

The Project will be running on your side

