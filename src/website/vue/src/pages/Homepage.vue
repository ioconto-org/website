<template>
  <div>
    <div class="nav-buttons">
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSe_gJ1vM_2WXYkCNoyGwWRjLJcSlvEf9DwZAfpwR3IXLqbwSw/viewform"
      >
        <button class="btn btn-primary m-2">Segnala Dati Comunali</button>
      </a>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfbs90muj6Fe30pb2fi12kZDznBrvYhPSnB8nmSWjWP58jKuA/viewform"
      >
        <button class="btn btn-primary m-2">Segnala Dati Ospedalieri</button>
      </a>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSd6_80C6IPNAyyMrIM5Z6MoUMtmTiEi56Ex9H_4rFvkgp9CvQ/viewform"
      >
        <button class="btn btn-primary m-2">Voglio Partecipare</button>
      </a>
    </div>

    <Map></Map>
  </div>
</template>

<script>
import Map from "../components/Map";

export default {
  name: "App",
  components: {
    Map
  },
  data() {
    return {
      geoJson: {},
      locations: [],
      selection: "",
      names: [],
      loc: {}
    };
  },
  async beforeCreate() {
    const response = await fetch(
      "https://raw.githubusercontent.com/ioconto/covid19/master/opendata/current/it-total-deaths.json"
    );
    this.geoJson = await response.json();
    this.locations = this.geoJson.features.map(feature => ({
      name: feature.properties.name,
      coordinates: feature.geometry.coordinates
    }));
  },

  methods: {}
};
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

.nav-buttons {
  position: absolute;
  right: 0;
  max-width: 50%;
  z-index: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}
</style>
