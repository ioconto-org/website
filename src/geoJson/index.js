const fs = require('fs');
const csv=require('csvtojson');

const pathOpenData = process.env.COVID19_OPENDATA || '../covid19/opendata';
const geoCsvInputFile    = pathOpenData + '/current/it-total-deaths.csv';
const geoJsonOutputFile = pathOpenData + '/current/it-total-deaths.json';
const citiesJsonOutputFile = pathOpenData + '/current/it-municipalities.json';

csv()
.fromFile(geoCsvInputFile)
.then((locations)=>{
    //console.log(locations);
    let cities = [];
    let geo = {
      type: "FeatureCollection",
      features: []
    };
    for (let i=0; i<locations.length; i++) {
      const loc = locations[i];
      //console.log(loc);
      const ecoBG = parseInt(loc.ecoBG);
      const bsToday = parseInt(loc.bsToday);
      const istat = parseInt(loc.istatMarch);
      const city = {
        istatId: loc.istatId,
        name: loc.name,
        province: loc.province,
        region: loc.region,
        anpr: (loc.ANPR) ? true : false,
        data: (istat || ecoBG || bsToday)
      }
      if (istat || ecoBG || bsToday) {  //we have data to display
        let avgDeaths, deaths, description, deltaDeaths, ratio, mortality, source, officialCovid;
        const population = parseInt(loc.population);

        //avgDeaths = parseInt(loc.mar19);
        //deaths = parseInt(loc.mar20);
        avgDeaths = (parseInt(loc.d15) + parseInt(loc.d16) + parseInt(loc.d17) + parseInt(loc.d18) + parseInt(loc.d19)) / 5;
        deaths = parseInt(loc.d20);
        deltaDeaths = (deaths - avgDeaths).toFixed(2);
        ratio = (deltaDeaths / avgDeaths).toFixed(2);
        officialCovid = parseInt(loc.officialCovid);
        mortality = (deaths/population * 100).toString().substr(0,3);


        if (parseInt(loc.ecoBG)) {
          source = 'Istat, Eco di Bergamo';
        } else if (parseInt(loc.bsToday)) {
          source = 'Istat, Brescia Today';
        } else {
          source = "Istat";
        }

        let color = "LightPink";
        if (ratio > 0.50) color = "HotPink";
        if (ratio > 0.75) color = "Red";
        if (ratio > 1) color = "DarkRed";
        if (deaths/population > 0.01) {
          color = "Purple"
        }
        let f = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(loc.lng),
              parseFloat(loc.lat)
            ]
          },
          properties: {
            _umap_options: {
              color: color,
              iconClass: "Circle", //possible values: "Circle", "Default", "Drop", "Ball"
              //iconUrl: "/uploads/pictogram/airport-24.png"
            },
            //deaths: [loc.d15,loc.d16,loc.d17,loc.d18,loc.d19,loc.d20],
            istatId: loc.istatId,
            name: loc.nameItSt,
            description: description,
            population: population,
            deaths: deaths,
            delta: deltaDeaths,
            ratio: ratio,
            mortality: mortality,
            source: source,
            avgDeaths: avgDeaths
          /*  "marker-color": "#ff0000",  //geojson.io
            "marker-size": "medium",    //geojson.io
            "marker-symbol": "triangle" //geojson.io */
          } /*,
          loc: loc */
        };
        if (officialCovid) {
          f['Covid19'] = officialCovid;
        }
        geo.features.push(f);
      }
      cities.push(city);
    }
    //console.log(JSON.stringify(geo));
    fs.writeFile(geoJsonOutputFile, JSON.stringify(geo), 'utf8', (err) => {
      if (err) return console.log(err);
      console.log(`GeoJson file successfully created in  > ${geoJsonOutputFile}`);
    });

    fs.writeFile(citiesJsonOutputFile, JSON.stringify(cities), 'utf8', (err) => {
      if (err) return console.log(err);
      console.log(`Cities file successfully created in  > ${citiesJsonOutputFile}`);
    });
})