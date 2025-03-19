const express = require('express');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const app = express();
const PORT = 8080
const STORAGE_PATH = "../dataTest";

app.use(express.json());


app.post('/', async (req,res) => {
    const {file, product} = req.body;
    const filePath = path.join(STORAGE_PATH, file);

    try{
        const rl = readline.createInterface(
            {
                input: fs.createReadStream(filePath),
                crlfDelay: Infinity
            }
        );

        let sum = 0;
        let CSV = false;
        
        for await(const l of rl){
            if (l.trim() === '') {
                continue;
            }
            else if(!CSV){
                if(l.trim() !== 'product,amount'){
                    return res.json(
                        {
                            "file": file,
                            "error": "Input file not in CSV format.",
                            "status": 400
                        }
                    )
                    
                }
                
                CSV = true;
                continue;
            }
          
            const [name, amount] = l.split(',');
            
            if(name === product){
                sum += parseInt(amount, 10);
            }
        }

        return res.json(
            {
                "file": file,
                "sum": sum
            }
        )

    }catch(e){
        console.log(e);
        return res.json(
            {
                "file": file,
                "error": "Issue with reading the CSV file, try again",
                "status": 500
            }
        )
    }
})

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));