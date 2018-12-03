'use strict'

const mongo = require('../mongo');
const yelp = require('yelp-fusion');
const apiKey = 'xdxekdQFNmWtSJak4pjq30yjNyydowXC-KaJ4FUw1H4MqdYU7RDaQpb5Oj3mfkMzuYq9AUa2-f794VztEYhFt9uwsGZQoqLmStfyutlyLAfwJhAyAiI1F5jPp6kEXHYx';

async function main() {

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
    ];

    for (let s in searchRequest) {
        client.search(searchRequest[s]).then(response => {
            const allBiz = response.jsonBody.businesses;
            for (let b in allBiz) {
                mongo.addBusiness(allBiz[b]);
                console.log('Added', allBiz[b].name, 'to database');
            }
        }).catch(e => {
            console.log(e);
        });
    }




}

main().catch(error => {
    console.log(error)
});
