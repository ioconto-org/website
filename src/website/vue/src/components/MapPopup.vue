<template>
  <div>
    <b-row>
      <b-col>
        <router-link :to="'/istat/' + feature.properties.istatId">
          <i class="material-icons">insert_chart_outlined</i>
          {{ feature.properties.name }}
        </router-link>
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
  </div>
</template>

<script>
export default {
  props: ["feature"],

  methods: {
    onClick() {
      console.log("CLICKED");
    }
  }
};
</script>

