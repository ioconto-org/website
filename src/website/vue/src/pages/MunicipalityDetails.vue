<template>
  <b-container class="p-4" fluid v-if="feature">
    <b-row>
      <b-col md="5" lg="5" cols="12" class="details-column pb-4">
        <b-card>
          <b-row class="pt-2 pb-2" no-gutters align-v="center">
            <b-col cols="auto" class="mr-1">
              <i class="material-icons">insert_chart_outlined</i>
            </b-col>
            <b-col>
              <h4 class="font-weight-bold">{{ feature.properties.name }}</h4>
            </b-col>
          </b-row>

          <b-row class="p-2">
            <b-col>
              Decessi Marzo 2020:
              {{ feature.properties.deaths }}
              ({{feature.properties.ratio * 100}}%)
            </b-col>
          </b-row>

          <b-row class="p-2">
            <b-col>Decessi Marzo 2015-19: {{ feature.properties.avgDeaths }}</b-col>
          </b-row>

          <b-row class="p-2">
            <b-col>Differenza: {{feature.properties.delta }}</b-col>
          </b-row>

          <b-row class="p-2">
            <b-col>Popolazione: {{ feature.properties.population }}</b-col>
          </b-row>

          <b-row class="p-2">
            <b-col>Pecentuale decessi su popolazione: {{ feature.properties.mortality }}</b-col>
          </b-row>
        </b-card>
      </b-col>

      <b-col md="5" cols="12" class="map-colum">
        <Map
          :width="'80%'"
          :height="'60%'"
          :legend="false"
          :center="[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]"
          :zoom="12"
        ></Map>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Map from "../components/Map";

export default {
  components: {
    Map
  },
  data() {
    return {
      feature: null,
      geoJson: {},
      coordinates: []
    };
  },

  async created() {
    const istatId = this.$route.params.istatId;

    const response = await fetch(
      "https://raw.githubusercontent.com/ioconto/covid19/master/opendata/current/it-total-deaths.json"
    );
    this.geoJson = await response.json();
    this.feature = this.geoJson.features.find(
      feature => feature.properties.istatId === istatId
    );

    this.coordinates = this.feature.geometry.coordinates;
  },

  watch: {
    async $route() {
      const istatId = this.$route.params.istatId;
      const response = await fetch(
        "https://raw.githubusercontent.com/ioconto/covid19/master/opendata/current/it-total-deaths.json"
      );
      const geoJson = await response.json();
      this.feature = geoJson.features.find(
        feature => feature.properties.istatId === istatId
      );
    }
  }
};
</script>