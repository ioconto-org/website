<template>
  <b-container fluid v-if="feature">
    <b-row no-gutters align-v="center">
      <b-col cols="auto" class="mr-1">
        <i class="material-icons">insert_chart_outlined</i>
      </b-col>
      <b-col>
        <span class="font-weight-bold">{{ feature.properties.name }}</span>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        Decessi Marzo 2020: {{ feature.properties.deaths }}
        ({{feature.properties.ratio * 100}}%)
      </b-col>
    </b-row>

    <b-row>
      <b-col>Decessi Marzo 2015-19: {{ feature.properties.avgDeaths }}</b-col>
    </b-row>

    <b-row>
      <b-col>Differenza: {{feature.properties.delta }}</b-col>
    </b-row>

    <b-row>
      <b-col>Popolazione: {{ feature.properties.population }}</b-col>
    </b-row>

    <b-row>
      <b-col>Pecentuale decessi su popolazione: {{ feature.properties.mortality }}</b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      feature: null
    };
  },

  async created() {
    const istatId = this.$route.params.istatId;
    const response = await fetch(
      "https://raw.githubusercontent.com/ioconto/covid19/master/opendata/current/it-total-deaths.json"
    );
    const geoJson = await response.json();
    this.feature = geoJson.features.find(
      feature => feature.properties.istatId === istatId
    );
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