<template>
  <div>
    <b-navbar variant="light" type="light" class="d-flex">
      <b-navbar-brand to="/">
        <img src="./assets/logo-ioconto-64.png" />
      </b-navbar-brand>

      <VueBootstrapTypeahead
        @hit="select()"
        style="z-index: 15000"
        v-model="selection"
        :data="locations"
        :serializer="d => d.name"
        placeholder="Ricerca per comune"
        class="flex-grow-1"
        size="lg"
      ></VueBootstrapTypeahead>

      <b-navbar-nav pills class="ml-auto">
        <b-nav-item v-b-modal.info-modal>Chi siamo</b-nav-item>

        <b-modal ok-only title="Chi siamo" id="info-modal">
          <p>
            In Italia e nel Mondo abbiamo di fronte un futuro incerto.
            Perché questo futuro possa essere indirizzato in senso positivo, è necessario che si prendano ora decisioni basate sulla analisi di dati completi, verificati e che siano stati raccolti in modo omogeneo relativamente alla diffusione delle infezioni, ospedalizzazioni e decessi causati dal virus SARS-Cov-2.
            IoConto vuole fornire, a tutti gli enti e anche a singoli individui, un sistema semplice da usare, efficiente, pubblico per raccogliere i dati, normalizzarli e distribuirli a chiunque ne abbia bisogno al fine di disegnare scenari, prendere decisioni oculate e informare.
            <a
              target="_blank"
              href="https://github.com/ioconto/covid19"
            >Uniti ce la faremo.</a>
          </p>
        </b-modal>
        <b-nav-item target="_blank" href="https://medium.com/ioconto">Blog</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <router-view></router-view>
  </div>
</template>

<script>
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import EventBus from "./event-bus";

export default {
  components: {
    VueBootstrapTypeahead
  },
  data() {
    return {
      geoJson: {},
      locations: [],
      selection: ""
    };
  },
  async created() {
    const response = await fetch(
      "https://raw.githubusercontent.com/ioconto/covid19/master/opendata/current/it-total-deaths.json"
    );
    this.geoJson = await response.json();
    this.locations = this.geoJson.features.map(feature => ({
      name: feature.properties.name,
      coordinates: feature.geometry.coordinates
    }));
  },
  methods: {
    select() {
      EventBus.$emit("update:search", this.selection);
    }
  }
};
</script>