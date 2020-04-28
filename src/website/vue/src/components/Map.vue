<template>
  <b-overlay opacity="0.5" :show="loading" z-index="600" rounded="sm">
    <div style="height: 85vh; width: 100%; position:relative;">
      <l-map
        ref="map"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        :style="'height:' + height"
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

        <l-feature-group ref="features">
          <l-popup>
            <map-popup :feature="popupFeature"></map-popup>
          </l-popup>
        </l-feature-group>

        <l-circle-marker
          @click="selectMarker(f.geometry.coordinates, f)"
          :key="i"
          :radius="7"
          :opacity="1"
          :weight="1"
          :fillOpacity="0.8"
          :fillColor="f.properties._umap_options.color"
          :color="'white'"
          v-for="(f, i) in geoJson.features"
          :lat-lng="[f.geometry.coordinates[1], f.geometry.coordinates[0]]"
        ></l-circle-marker>

        <div v-if="legend">
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
        </div>
      </l-map>
    </div>
  </b-overlay>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LControl,
  LCircleMarker,
  LPopup,
  LFeatureGroup
} from "vue2-leaflet";
import MapPopup from "./MapPopup";

import MapLegend from "./MapLegend";

import EventBus from "../event-bus";

export default {
  props: {
    flyTo: {
      type: Array,
      default: () => []
    },
    legend: {
      type: Boolean,
      default: true
    },
    center: {
      type: Array,
      default: () => [45.75151263, 9.90631523]
    },
    zoom: {
      type: Number,
      default: 7
    },
    height: {
      type: String,
      default: "100%"
    }
  },
  components: {
    LMap,
    LTileLayer,
    LControl,
    LCircleMarker,
    LFeatureGroup,
    LPopup,
    MapLegend,
    MapPopup
  },
  data() {
    return {
      loading: true,
      geoJson: {},
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      showLegend: true,
      locationIcon: "gps_not_fixed",
      instance: {},
      popupFeature: {}
    };
  },
  async created() {
    const response = await fetch(
      "https://raw.githubusercontent.com/ioconto/covid19/master/opendata/current/it-total-deaths.json"
    );
    this.geoJson = await response.json();
    this.loading = false;

    EventBus.$on("update:search", text => {
      this.feature = this.geoJson.features.find(
        feature => feature.properties.name === text
      );

      if (this.$route.path.includes("/istat")) {
        this.$router.replace({
          path: "/istat/" + this.feature.properties.istatId
        });
      } else {
        this.$refs.map.mapObject.flyTo(
          {
            lat: this.feature.geometry.coordinates[1],
            lng: this.feature.geometry.coordinates[0]
          },
          10
        );
      }
    });
  },

  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
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
    },

    selectMarker(latLng, feature) {
      this.popupFeature = feature;
      console.log(this.popupFeature);
      this.$refs.features.mapObject.openPopup([latLng[1], latLng[0]]);
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