const request = require('request');
const fs = require('fs');
const readline = require('readline');
const args = (process.argv).slice(2);
const url = args[0];
const localPath = args[1];

request(url, (error, response, body) => {

  //check if there's no error from the server, and the status codes are in the 200s.

  if (!error && (response.statusCode >= 200 && response.statusCode <= 299)) {
    fs.access(localPath, fs.F_OK, (accessError) => {

      //function to write to file.
      const writeToFile = () => {
        fs.writeFile(localPath, body, (error) => {
          if (error) {
            console.log('Error!: ', error);
          } else {
            let bodyBytes = Buffer.byteLength(body, 'utf8');
            console.log(`Downloaded and saved ${bodyBytes} bytes to ${localPath}.`);
          }
        });
      };

      //check if the file exists and if it doesn't, write to file. Else, prompt the user if they'd like the file overwritten.
      if (accessError) {
        writeToFile();
      } else {
        console.log(localPath, 'already exists.');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        rl.question('To overwrite the file, enter "Y"  or leave blank to exit: ', (answer) => {
          if (answer === "Y") {
            writeToFile();
          }
        
          rl.close();
        });
      }
    })

  } else {
    if (error) {
      console.log('There was an error. Here it is: ', error);
    } else {
      console.log('We got a non-200 request code: ', response.statusCode);
    }
  }
});