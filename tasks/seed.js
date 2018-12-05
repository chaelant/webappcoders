const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const businesses = data.businesses;
const yelp = require('yelp-fusion');
const apiKey = 'xdxekdQFNmWtSJak4pjq30yjNyydowXC-KaJ4FUw1H4MqdYU7RDaQpb5Oj3mfkMzuYq9AUa2-f794VztEYhFt9uwsGZQoqLmStfyutlyLAfwJhAyAiI1F5jPp6kEXHYx';
const client = yelp.client(apiKey);
const searchRequest = [
    {
        location: 'hoboken, nj'
    },
    {
        location: 'new york, ny'
    },
    {
        location: 'jersey city, nj'
    },
    {
        location: 'union city, nj'
    }
]; //this is the list of locations that we can seed into a database. if we want location specific businesses, we need the location from the client side


//this seeds businesses
//i can't seed reviews because i can't seed users since you can't get that
//through the yelp api
async function main() {

    const db = await dbConnection();
    await db.dropDatabase();

    //may be able to use Promise.all() here for many location requests
    for (let s in searchRequest) {
        const p = await client.search(searchRequest[s]); //get the list of businesses
        const list = p.jsonBody.businesses;

        for (let l in list) {
            await businesses.addBusiness(list[l]);
            //console.log('added', list[l]);
        }
    }

    console.log('database seeded');
    db.close()
}

main().catch((error) => {
    console.log(error)
});