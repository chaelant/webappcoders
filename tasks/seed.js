const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const businesses = data.businesses;
const users = data.users;
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

const baseUsers = [
    {
        //mypassword
        hashedPassword: '$2b$16$73Snm9EmrAX39uetoJsXE.9DmTBzBDiHxli22FsOKsE.JeAHvBQDK',
        username: 'mramos',
        name: 'Michael'
    },
    {
        //mypassword1
        hashedPassword: '$2b$16$W3g.FoxxLaEIbOs1HSO3K.LeKbaDeeFsMkusG8HOpJ3GKm6GwPsyS',
        username: 'jglazier',
        name: 'Justin'
    },
    {
        //mypassword2
        hashedPassword: '$2b$16$zTX34MMGiiYEcpxWW1yy/OiWIZld.o/4BNg1pyztuWmOidJrW/bee',
        username: 'alobo',
        name: 'Alan'
    },
    {
        //mypassword3
        hashedPassword: '$2b$16$dO8dve7YXRsK1ayepwzJYu6YXLc4mUl1uJuuK8/B3fljff6CuDi7G',
        username: 'gpatel',
        name: 'Gaurang'
    },
    {
        //mypassword4
        hashedPassword: '$2b$16$omA2vwtky5dCRSUqBO/VK.LD5VK0hLd7SKLgHma1z0MD47s6kQiWy',
        username: 'dsevilla',
        name: 'David'
    }

];

//this seeds businesses
//i can't seed reviews because i can't seed users since you can't get that
//through the yelp api
async function main() {

    const db = await dbConnection();
    await db.dropDatabase();

    for (let b in baseUsers) {
        await users.addUser(baseUsers[b].hashedPassword, baseUsers[b].username, baseUsers[b].name);
        console.log('Added', baseUsers[b])
    }

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