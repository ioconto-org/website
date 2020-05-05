<template>
  <b-card class="card shadow-lg">
    <b-row align-v="center">
      <b-col cols="auto">
        <div style="background-color: lightgreen" class="circle"></div>
      </b-col>
      <b-col>
        <div class="text">Decessi inferiori agli anni precedenti</div>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col cols="auto">
        <div style="background-color: lightpink" class="circle"></div>
      </b-col>
      <b-col>
        <div class="text">Decessi aumentati fino al 50%</div>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col cols="auto">
        <div style="background-color: hotpink" class="circle"></div>
      </b-col>
      <b-col>
        <div class="text">Decessi aumentati fino al 75%</div>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col cols="auto">
        <div style="background-color: magenta" class="circle"></div>
      </b-col>
      <b-col>
        <div class="text">Decessi aumentati fino al 100%</div>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col cols="auto">
        <div style="background-color: red" class="circle"></div>
      </b-col>
      <b-col>
        <div class="text">Decessi più del doppio degli anni precedenti</div>
      </b-col>
    </b-row>
    <b-row align-v="center">
      <b-col cols="auto">
        <div style="background-color: purple" class="circle"></div>
      </b-col>
      <b-col>
        <div class="text">In marzo più dell'1% della popolazione è deceduta</div>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {};
</script>

<style scoped>
.card {
  min-width: 300px;
}

.circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.text {
  text-align: start;
  font-size: 1.1em;
}
</style>