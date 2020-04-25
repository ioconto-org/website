//simply creates a local .env from boilerplate .env-template
const fs = require('fs')

if (fs.existsSync('./.env')) {
  //file exists, do nothing
} else {
  fs.copyFileSync('./.env-template', './.env');
  console.log('\x1b[31mPlease modify .env file with your own desired setup\x1b[0m');
}