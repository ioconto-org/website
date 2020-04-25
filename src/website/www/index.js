// getCurrentPosition();



// Function linked to the click of the marker to display a popup
function onEachFeature(feature, layer) {
	// Check if the properties to be displayed are defined
	if (feature.properties && feature.properties.name) {
		c = '<a href="http://chart.ioconto.org/IoContoCompChart/drawCityChart.htm?city=' + feature.properties.istatId + '" target="_blank"><strong>' + feature.properties.name + '</strong></a><br />';
		c += 'Decessi Marzo 2020: ' + feature.properties.deaths + "<br />";
		c += 'Decessi Marzo 2015-19: ' + feature.properties.avgDeaths + " (+" + feature.properties.ratio*100 + "%)<br />";
		c += 'Differenza: ' + feature.properties.delta + "<br />";
		c += 'Popolazione: ' + feature.properties.population + "<br />";
		c += 'Pecentuale decessi su popolazione: ' + feature.properties.mortality + "<br />";


         
    //    Dati Istat. I decessi degli anni precedenti si riferiscono alla media misurata dal 2015 al 2019
		//c += "<br/>" + feature.properties.description.replace("\n", "<br/>");
		layer.bindPopup(c);

		/*
		name: "Agliè"
description: "Decessi 1-28 Marzo 2020: 7↵        Decessi 1-28 Marzo anni precedenti: 2.4↵        Differenza: 4.6↵        Popolazione: 2644↵        Pecentuale decessi su popolazione: 0.2%↵         ↵        Dati Istat. I decessi degli anni precedenti si riferiscono alla media misurata dal 2015 al 2019"
population: 2644
deaths: 7
delta: 4.6
ratio: 1.9166666666666665
avgDeaths: 2.4
*/
		/* "properties":{"_umap_options":{"color":"Red","iconClass":"Circle"},
													"name":"Agliè",
													"description":"Decessi 1-21 Marzo 2020: 7\n        Decessi 1-21 Marzo anni precedenti: 2.2\n        Differenza: 4.8\n        Popolazione: 2644\n        Pecentuale decessi su popolazione: 0.2%\n         \n        Dati Istat. I decessi degli anni precedenti si riferiscono alla media misurata dal 2015 al 2019","population":2644,"deaths":7,"delta":4.8,"ratio":2.1818181818181817,"avgDeaths":2.2}}
					*/
	}
}

// Function used to define the style of the marker
function customCircleMarker(properties) {
	var circleMarkerOptions = {
		radius: 7,
		color: "#fff", // stroke color
		weight: 1, // stroke width
		opacity: 1, // stroke opacity
		fillOpacity: 0.8, // marker fill opacity
		fillColor: properties._umap_options.color, // marker fill color
	};
	return circleMarkerOptions;
}

// Coordinates to center the Map to a specific location (careful, inverse order)
var IoContoMap = L.map("mapIoConto").fitBounds(
	[[45.75151263, 9.90631523],
	[45.75151263, 9.90631523]],
	{
		maxZoom: 8
	}
);


// Add OSM tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(IoContoMap);

const CenterControl = L.Control.extend({
	options: {
		position: 'topleft'
	},
	onAdd: (map) => {
		const container = L.DomUtil.create('div', 'center-control leaflet-bar');
		container.title = 'Centra la mappa sulla tua posizione'
		container.innerHTML = `<a href="#"><i class="material-icons">gps_not_fixed</i></a>`;
		const a = container.getElementsByTagName('a')[0];
		a.addEventListener('click', function () {

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					IoContoMap.flyTo({
						lat: position.coords.latitude,
						lng: position.coords.longitude
					}, 12);
					this.children[0].innerHTML = 'gps_fixed';
				});

			}
		});
		return container;
	}
});

const StorageControl = L.Control.extend({
	options: {
		position: 'topleft'
	},
	onAdd: (map) => {
		const container = L.DomUtil.create('div', 'storage-control leaflet-bar');
		container.title = "Dati";
		container.innerHTML = `<a href="https://github.com/ioconto/covid19" target="_blank"><i class="material-icons">storage</i></a>`;
		const a = container.getElementsByTagName('a')[0];
		return container;
	}
});

const LegendControl = L.Control.extend({
	options: {
		position: 'bottomleft'
	},
	onAdd: (map) => {
		const container = L.DomUtil.create('div', 'legend card');
		container.title = 'Legenda';
		container.style.height = '100px';
		container.style.visibility = 'visible';
		container.innerHTML = `
			<div class="card-body px-2">
				<div class="card-text">
					<div class="container">
						<div class="row align-items-center">
							<div class="col col-auto pr-0">
								<div class="circle circle-red"></div>
							</div>
							<div class="col">
								<div>Decessi più del doppio degli anni precedenti</div>
							</div>	
						</div>
						<div class="row align-items-center">
							<div class="col col-auto pr-0">
								<div class="circle circle-yellow"></div>
							</div>
							<div class="col">
								<div>Incremento significativo rispetto agli anni precedenti</div>
							</div>	
						</div>
						<div class="row align-items-center">
							<div class="col col-auto pr-0">
								<div class="circle circle-green"></div>
							</div>
							<div class="col">
								<div>Incremento minore del 25% rispetto agli anni precedenti</div>
							</div>	
						</div>
					</div>
				</div>
			</div>
		`
		return container;
	}
});


IoContoMap.addControl(new CenterControl());
IoContoMap.addControl(new StorageControl());

const legendControl = new LegendControl();
IoContoMap.addControl(legendControl);

const LegendToggleControl = L.Control.extend({
	options: {
		position: 'bottomleft'
	},
	onAdd: (map) => {
		const container = L.DomUtil.create('div', 'leaflet-bar legend-toggle');
		container.title = "Legenda";
		container.innerHTML = `<a href="#"><i class="material-icons" style="transform: rotate(180deg);">keyboard_arrow_up </i></a>`;
		const a = container.getElementsByTagName('a')[0];
		a.addEventListener("click", function () {
			if (legendControl.getContainer().style.height === '0px') {
				this.children[0].style.transform = 'rotate(180deg)';
				legendControl.getContainer().style.height = '100px';
				legendControl.getContainer().style.visibility = "visible";

			} else {
				this.children[0].style.transform = 'rotate(0)';
				legendControl.getContainer().style.height = '0px';
				legendControl.getContainer().style.visibility = "hidden";
			}

		});
		return container;
	}
})

IoContoMap.addControl(new LegendToggleControl());




let locations;
let coordinates;

// Fetch the geoJSON
let xhr = new XMLHttpRequest();
xhr.open(
	"GET",
	"https://raw.githubusercontent.com/ioconto/covid19/master/opendata/current/it-total-deaths.json"
);

//xhr.setRequestHeader('Content-Type', 'application/json');
xhr.responseType = "json";
xhr.onload = function () {
	if (xhr.status !== 200) return;

	// Get locations from API
	locations = xhr.response.features
		.map(feature => {
			return feature.properties.name;
		});
	coordinates = xhr.response.features
		.map(feature => {
			return feature.geometry.coordinates
		});

	autocomplete(document.getElementById('searchInput'), locations);

	L.geoJSON(xhr.response, {
		pointToLayer: (feature, latlng) => L.circleMarker(latlng, customCircleMarker(feature.properties)),
		onEachFeature: onEachFeature,
	}).addTo(IoContoMap);
	//L.geoJSON(xhr.response).addTo(IoContoMap);
};
xhr.send();



function autocomplete(input, array) {

	var currentFocus;

	input.addEventListener("input", function (e) {

		let autocompleteList, listItem, i, val = this.value;
		closeAllLists();

		if (!val) return false;

		currentFocus = -1;
		autocompleteList = document.createElement("DIV");
		autocompleteList.setAttribute("id", this.id + "autocomplete-list");
		autocompleteList.setAttribute("class", "autocomplete-items");

		this.parentNode.appendChild(autocompleteList);


		array.forEach((el, index) => {
			if (el.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				listItem = document.createElement("DIV");
				listItem.innerHTML = `<strong>${el.substr(0, val.length)}</strong>`;
				listItem.innerHTML += el.substr(val.length);
				listItem.innerHTML += `<input type='hidden' value="${el}"/>`;
				listItem.addEventListener("click", function (e) {
					input.value = this.getElementsByTagName("input")[0].value;
					onListClickItem(index);
					closeAllLists();
				});
				autocompleteList.appendChild(listItem);
			}
		});
	});

	input.addEventListener("keydown", function (e) {
		var list = document.getElementById(this.id + "autocomplete-list");
		if (list) list = list.getElementsByTagName("div");
		if (e.keyCode == 40) {
			currentFocus++;
			addActive(list);
		} else if (e.keyCode == 38) {
			currentFocus--;
			addActive(list);
		} else if (e.keyCode == 13) {
			e.preventDefault();
			const value = e.target.value;
			const index = array.findIndex(el => el === value);
			if (value && index > -1) {
				if (list) list[0].click();
			}
			else if (currentFocus > -1) {
				if (list) list[currentFocus].click();
			}
		}
	});

	function addActive(list) {
		if (!list) return false;
		removeActive(list);
		if (currentFocus >= list.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = list.length - 1;
		list[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(list) {
		for (var i = 0; i < list.length; i++) {
			list[i].classList.remove("autocomplete-active");
		}
	}

	function closeAllLists(elmnt) {
		var list = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < list.length; i++) {
			if (elmnt != list[i] && elmnt != input) {
				list[i].parentNode.removeChild(list[i]);
			}
		}


	}

	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}

function onListClickItem(index) {
	IoContoMap.flyTo([coordinates[index][1], coordinates[index][0]], 12, {
		animate: true
	});
	console.log(coordinates[index]);
}

