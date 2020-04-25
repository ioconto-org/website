<template>
  <div style="height: 85vh; width: 100%; position:relative;">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 100%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-control
        title="Center map on your location"
        class="leaflet-bar leaflet-control"
        disableClickPropagation
        position="topleft"
      >
        <a @click="goToCurrentLocation()" class="map-control location-control">
          <i class="material-icons">{{ locationIcon }}</i>
        </a>
      </l-control>

      <l-control
        title="Data"
        class="leaflet-bar leaflet-control"
        disableClickPropagation
        position="topleft"
      >
        <a href="https://github.com/ioconto/covid19" class="map-control data-control">
          <i class="material-icons">storage</i>
        </a>
      </l-control>

      <transition name="slide">
        <l-control
          v-show="showLegend"
          title="Legenda"
          class="leaflet-bar leaflet-control"
          disableClickPropagation
          position="bottomleft"
        >
          <a class="legend-container">
            <map-legend></map-legend>
          </a>
        </l-control>
      </transition>

      <l-control
        :class="showLegend ? 'rotate-0' : 'rotate-180'"
        title="Legenda"
        class="leaflet-bar leaflet-control"
        disableClickPropagation
        position="bottomleft"
      >
        <a @click="toggleLegend()" class="map-control data-control">
          <i class="material-icons">keyboard_arrow_down</i>
        </a>
      </l-control>
    </l-map>
  </div>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LControl } from "vue2-leaflet";

import MapLegend from "./MapLegend";

export default {
  props: {
    flyTo: {
      type: Array,
      default: () => []
    }
  },
  components: {
    LMap,
    LTileLayer,
    LControl,
    MapLegend
  },
  data() {
    return {
      geoJson: null,
      zoom: 7,
      center: [45.75151263, 9.90631523],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      showLegend: true,
      locationIcon: "gps_not_fixed"
    };
  },
  async created() {
    const response = await fetch(
      "https://raw.githubusercontent.com/ioconto/covid19/master/opendata/current/it-total-deaths.json"
    );
    this.geoJson = await response.json();

    this.addGeoJson();
  },
  watch: {
    flyTo() {
      if (this.flyTo.length !== 0) {
        this.$refs.map.mapObject.flyTo(
          {
            lat: this.flyTo[1],
            lng: this.flyTo[0]
          },
          12
        );
      }
    }
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },

    addGeoJson() {
      L.geoJSON(this.geoJson, {
        pointToLayer: (feature, latlng) =>
          L.circleMarker(latlng, this.customCircleMarker(feature.properties)),
        onEachFeature: this.onEachFeature
      }).addTo(this.$refs.map.mapObject);
    },

    onEachFeature(feature, layer) {
      // Check if the properties to be displayed are defined
      if (feature.properties && feature.properties.name) {
        let c =
          '<a href="http://chart.ioconto.org/IoContoCompChart/drawCityChart.htm?city=' +
          feature.properties.istatId +
          '" target="_blank"><strong>' +
          feature.properties.name +
          "</strong></a><br />";
        c += "Decessi Marzo 2020: " + feature.properties.deaths + " (+" +
          feature.properties.ratio * 100 +
          "%)<br />";
        c +=
          "Decessi Marzo 2015-19: " +
          feature.properties.avgDeaths +
          "<br />";
        c += "Differenza: " + feature.properties.delta + "<br />";
        c += "Popolazione: " + feature.properties.population + "<br />";
        c +=
          "Pecentuale decessi su popolazione: " +
          feature.properties.mortality +
          "%<br />";
        layer.bindPopup(c);
      }
    },
    customCircleMarker(properties) {
      var circleMarkerOptions = {
        radius: 7,
        color: "#fff", // stroke color
        weight: 1, // stroke width
        opacity: 1, // stroke opacity
        fillOpacity: 0.8, // marker fill opacity
        fillColor: properties._umap_options.color // marker fill color
      };
      return circleMarkerOptions;
    },

    goToCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.$refs.map.mapObject.flyTo(
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            12
          );
        });
      }
      this.locationIcon = "gps_fixed";
    },

    toggleLegend() {
      this.showLegend = !this.showLegend;
      //console.log("legend");
    }
  }
};
</script>

<style scoped>
.map-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  -webkit-user-select: none;
}

.map-control:hover {
  display: flex;
  cursor: pointer;
}

.legend-container {
  z-index: 10000;
  width: auto;
  height: auto;
  pointer-events: none;
}

.material-icons {
  font-size: 20px !important;
}

ul {
  cursor: pointer;
}

.rotate-0 {
  transition: all 0.4s;
  transform: rotate(0);
}

.rotate-180 {
  transition: all 0.4s;
  transform: rotate(180deg);
}

.slide-enter-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.slide-leave-active {
  -moz-transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s;
  -o-transition-duration: 0.2s;
  transition-duration: 0.2s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.slide-enter-to,
.slide-leave {
  max-height: 150px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>