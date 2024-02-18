import express from 'express';
import mysql from 'mysql';


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'quiet'
});

function listHasDuplicates(list: number[]): boolean {
  return new Set(list).size !== list.length;
}

// console.log(listHasDuplicates([1, 2, 3, 4, 5, 4, 7, 4, 9, 10]) === true);
// console.log(listHasDuplicates([1, 2, 3, 4]) === false);


// server

// assuming the list already has de-duped numbers
const cachedListOfNumbers = [1, 2, 3, 4, 5, 4, 7, 4, 9, 10];

// imagine its size is 1TB
const cachedListOfNumbersSet = new Set(cachedListOfNumbers);

// client sends [1, 2] => server return true
// client sends [11] => server return false

function itemsAlreadyInCache(list: number[]): boolean {
    // replace with sql call
    return list.some((item) => cachedListOfNumbersSet.has(item));
}


export function handleRequest(req: any, res: any) {
  const hasDuplicates = itemsAlreadyInCache(req.body.list);
  res.send({ hasDuplicates });
}

const app = express()
const port = 3000

app.post('/has-duplicates', (req: any, res: any) => {
    var bodyStr = '';
    req.on("data",function(chunk: any){
        bodyStr += chunk.toString();
    });
    req.on("end",function(){
  console.log('what is req.body', bodyStr);
  const parsedBody = JSON.parse(bodyStr);
  const hasDuplicates = itemsAlreadyInCache(parsedBody.list);
  res.send({ hasDuplicates });
    });
})

// connection.connect();

connection.query('SELECT 1', function (error, results, fields) {
  console.log('error', error);
  // if (error) throw error;
  // console.log('The tables are: ', results);
});

// connection.end();

app.listen(port, () => {
  console.log(`Quiet Inteview listening on port ${port}`)
})

// handleRequest({ body: { list: [1, 2] } }, { send: console.log });
// handleRequest({ body: { list: [11] } }, { send: console.log });

// curl -X POST -H "Content-Type: application/json" -d '{"list": [1, 2]}' http://localhost:3000/has-duplicates
