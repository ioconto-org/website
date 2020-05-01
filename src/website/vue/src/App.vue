<template>
  <div>
    <b-navbar variant="light" type="light" class="d-flex">
      <b-navbar-brand href="#">
        <img src="./assets/logo-ioconto-64.png" />
      </b-navbar-brand>

      <VueBootstrapTypeahead
        @hit="select()"
        style="z-index: 1000"
        v-model="selection"
        :data="locations"
        :serializer="d => d.name"
        placeholder="Ricerca per comune"
        class="flex-grow-1"
        size="lg"
      ></VueBootstrapTypeahead>

      <b-modal title="Nessun Dato" ok-only id="anpr">
        <p>
          Il comune di {{ displayName }}, pur facendo parte dell'Anagrafe Nazionale (<a href="https://www.anpr.interno.it/portale/" target="_blank">ANPR</a>), <b>non è stato incluso dall'Istat</b> nell'elenco che ha <a href="https://www.istat.it/it/archivio/240401" target="_blank">pubblicato</a>. In teoria potrebbe essere una buona notizia, ma nella realtà i dati del tuo comune potrebbero essere negativi: aiutaci, cercando chi li detiene e segnalali con
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe_gJ1vM_2WXYkCNoyGwWRjLJcSlvEf9DwZAfpwR3IXLqbwSw/viewform" target="_blank"
          >questa form</a>
        </p>
      </b-modal>

      <b-modal title="Nessun Dato" ok-only id="no-anpr">
        <p>
          Il comune di {{ displayName }} <b>non aderisce all'Anagrafe Nazionale (<a href="https://www.anpr.interno.it/portale/" target="_blank">ANPR</a>)</b> e di conseguenza l'Istat non può <a href="https://www.istat.it/it/archivio/240401" target="_blank">pubblicare</a> i suoi dati. Aiutaci, cercando chi li detiene per il tuo comune e segnalali con
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe_gJ1vM_2WXYkCNoyGwWRjLJcSlvEf9DwZAfpwR3IXLqbwSw/viewform" target="_blank"
          >questa form</a>
        </p>
      </b-modal>

      <b-navbar-nav pills class="ml-auto">
        <b-nav-item v-b-modal.info-modal>Chi siamo</b-nav-item>

        <b-modal title="Chi siamo" id="info-modal">
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

    <Map :names="names" :flyTo="loc.coordinates"></Map>
  </div>
</template>

<script>
import Map from "./components/Map";
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";

export default {
  name: "App",
  metaInfo: {
    title: "ioConto",
    titleTemplate: "%s | #uniticelafaremo",
    meta: [
      { property: "og:url", content: "https://www.ioconto.org" },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "ioConto" },
      { property: "og:description", content: "Open Data per covid9" },
      {
        property: "og:image",
        content: "https://www.ioconto.org/assets/mappa.jpg"
      },
      { property: "og:type", content: "https://www.ioconto.org" },
      { name: "description", content: "ioConto - Open Data per Covid19" }
    ]
  },
  components: {
    Map,
    VueBootstrapTypeahead
  },
  data() {
    return {
      geoJson: {},
      locations: [],
      selection: "",
      names: [],
      loc: {},
      displayName: ""
    };
  },
  async beforeCreate() {
    const response = await fetch(
      "https://raw.githubusercontent.com/ioconto/covid19/master/opendata/current/it-municipalities.json"
    );
    this.geoJson = await response.json();
    this.locations = this.geoJson.map(city => ({
      name: city.name,
      coordinates: city.coordinates,
      data: city.data,
      anpr: city.anpr
    }));
  },

  methods: {
    select() {
      const loc = this.locations.find(loc => loc.name === this.selection);
      if (loc.data) {
        this.loc = loc;
      } else if (loc.anpr) {
        //display anpr message
        this.displayName = loc.name;
        this.$bvModal.show("anpr");
      } else {
        //display no anpr message
        this.displayName = loc.name;
        this.$bvModal.show("no-anpr");
      }
    }
  }
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
