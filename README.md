# webappcoders
The Best application to help people lookup restaurants, dentists, hair stylists, mechanics etc.

# Core Functionality:
-	 List businesses based on certain search criteria in the web landing page.
-	Search criteria include business name, zip code, city, latitude-longitude, or more a generic search like food, restaurants, etc., by leveraging yelp search API found at https://www.yelp.com/developers/documentation/v3/business_search
-	Selecting a business would lead to a details page which would list name, address, phone number, photos, rating, price levels and hours of operation.
-	User login/sign up system to add reviews and view saved/favorite businesses.
-	Add a webpage for someone to add a business on the website. 

# Extra Functionality:
-	Map view for the business in the landing page.
-	Seed data from various back-up systems such as Yelp fusion, Google reviews, etc.
-	Add videos when adding a review.
-	Message the business.

# Database Definition
Gaurang Patel Justin Glazier David Sevilla Michael Ramos Alan Lobo
##Business
This collection will store all the business details. This data will be used during search and also for when viewing business details.
{
"id": "E8RJkjfdcwgtyoPMjQ_Olg", "rating": 4,
"price": "$",
"phone": "+14152520800",
"alias": "four-barrel-coffee-san-francisco", "is_closed": false,
"categories": [
{
"alias": "coffee",
"title": "Coffee & Tea" }
],
"review_count": 1738, "name": "Four Barrel Coffee", "coordinates": {
"latitude": 37.7670169511878,
"longitude": -122.42184275 },
"image_url": "http://s3-media2.fl.yelpcdn.com/bphoto/MmgtASP3l_t4tPCL1iAsCg/o.jpg", "location": {
"city": "San Francisco", "country": "US",
"address2": "",
"address3": "",
"state": "CA",
"address1": "375 Valencia St", "zip_code": "94103"
},
"transactions": ["pickup", "delivery"], "distance":100

}
| Name | Type | Description |
|------|------|-------------|
| id | string | A globally unique identifier to represent the user |
| rating | decimal | Rating for this business (value ranges from 1, 1.5, ... 4.5, 5). |
| price | string | Optional. Pricing levels to filter the search result |
| phone | string | Phone number of the business. |
| alias | string | Alias of a category, when searching for business in certain categories, use alias rather than the title. |
| categories | object[] | List of category title and alias pairs associated with this business. |
| review_count | int | Number of reviews for this business. |
| name | string | A bcrypted string that is a hashed version of the user's password |
| coordinates | User Profile | The user's profile |
| image_url | string | URL of photo for this business. |
| location | object | Location of this business, including address, city, state, zip code and country. |
| transactions | string[] | ransactions that the business is registered for. Current supported values are pickup, delivery |
| distance | decimal | Distance in meters from the search location.|
## Users
The user collection will store all users information inclusing profiles. Users will be able to login, update their profile, and post reviews.
```
{
"_id":"7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310", "sessionId":"b3988882-627f-4c59-8d5d-54b7a43b030e",
"hashedPassword":"$2a$08$XdvNkfdNIL8Fq7l8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O", "name":"John doe",
"image_url":"image_url" }
```
| Name | Type | Description |
|------|------|-------------|
| _id | string | A globally unique identifier to represent the user |
| hashedPassword | string | A bcrypted string that is a hashed version of the user's password | | name | String | The user name |
| imageurl | String | The user image |

## Reviews
The reviews collection will store all the reviews that are created.
{
"_id":"5a5c4461-cdc9-4144-84f9-fcb278c5c122", "userId":"c5d0fd67-7977-4fc5-9088-33d0347c932b"
"title":"Implement AmericaWorks",
"text": ""Went back again to this place since the last time i visited the bay area 5 months ago,
and nothing has changed.",
"rating":4,
"time_created": "2016-08-29 00:41:13", "business":"E8RJkjfdcwgtyoPMjQ_Olg", "imageurl":"imageurl"
} ```
| Name | Type | Description | |------|------|-------------|
| _id | string | The task ID. |
| user| the user whom has created the review. | |title| string | The review title |
|text| string | Text excerpt of this review. |
|rating| int | Rating of this review. |
|time_created| string | The time that the review was created in EST. | |business| string | The business associated with the review| |imageurl| string | optional, if user wants to upload an image |
