<template>
  <b-card>
    <b-row align-v="center">
      <b-col cols="auto">
        <div class="circle red"></div>
      </b-col>
      <b-col>
        <div class="text">Decessi più del doppio degli anni precedenti</div>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col cols="auto">
        <div class="circle yellow"></div>
      </b-col>
      <b-col>
        <div class="text">Incremento significativo rispetto agli anni precedenti</div>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col cols="auto">
        <div class="circle green"></div>
      </b-col>
      <b-col>
        <div class="text">Incremento minore del 25% rispetto agli anni precedenti</div>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {};
</script>

<style scoped>
.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.red {
  background-color: red;
}

.yellow {
  background-color: yellow;
}

.green {
  background-color: green;
}

.text {
  text-align: start;
  font-size: 1.1em;
}
</style>