# covid19-website
ioConto website about the Covid19 outbreak

It's a simple one page application that should display in a beautiful way data coming from a public json.

The goal is to become similar to: https://who.sprinklr.com/region/euro/country/it

## Installation

Run `npm install` and then `npm run serve`. 

### Release entire system

Modify local .env file generated for you during `npm install` and then run `docker-compose up -d`

## Docker
If you just want to play locally with the ioConto website, you can pull the latest image from the docker hub repository with:

    docker pull ioconto/covid19-website
    docker run -p 8080:80 ioconto/covid19-website

