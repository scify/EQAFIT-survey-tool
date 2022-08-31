<template>
  <div class="SurveyResponseResults">
    <div class="container mb-5">
      <div class="row mb-4">
        <div class="col-12">
          <h1>Results</h1>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <h4 class="results-label">Overall</h4>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 col-md-9 mx-auto">
          <canvas id="overallChart"></canvas>
        </div>
      </div>
    </div>
    <div class="container section-results">
      <div class="row align-items-center">
        <div class="col-6">
          <h4 class="results-label mb-2">Section A</h4>
          <p class="section-explanation">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <a class="mt-3" href="#">Read how to improve</a>
        </div>
        <div class="col-5 offset-1">
          <canvas id="sectionAChart"></canvas>
        </div>
      </div>
    </div>
    <div class="container section-results">
      <div class="row align-items-center">
        <div class="col-6">
          <h4 class="results-label mb-2">Section B</h4>
          <p class="section-explanation">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <a class="mt-3" href="#">Read how to improve</a>
        </div>
        <div class="col-5 offset-1">
          <canvas id="sectionBChart"></canvas>
        </div>
      </div>
    </div>
    <div class="container section-results">
      <div class="row align-items-center">
        <div class="col-6">
          <h4 class="results-label mb-2">Section C</h4>
          <p class="section-explanation">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <a class="mt-3" href="#">Read how to improve</a>
        </div>
        <div class="col-5 offset-1">
          <canvas id="sectionCChart"></canvas>
        </div>
      </div>
    </div>
    <div class="container section-results">
      <div class="row align-items-center">
        <div class="col-6">
          <h4 class="results-label mb-2">Section D</h4>
          <p class="section-explanation">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <a class="mt-3" href="#">Read how to improve</a>
        </div>
        <div class="col-5 offset-1">
          <canvas id="sectionDChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "SurveyResponseResults",
  data: function () {
    return {};
  },

  mounted() {
    this.createChart("overallChart");
    this.createChart("sectionAChart");
    this.createChart("sectionBChart");
    this.createChart("sectionCChart");
    this.createChart("sectionDChart");
  },
  methods: {
    createChart(elId) {
      const ctx = document.getElementById(elId);
      // eslint-disable-next-line no-unused-vars
      const myChart = new Chart(ctx, {
        type: "radar",
        data: {
          labels: ["Section A", "Section B", "Section C", "Section D"],
          datasets: [
            {
              label: "Your results",
              data: [65, 59, 74, 81],
              fill: true,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgb(255, 99, 132)",
              pointBackgroundColor: "rgb(255, 99, 132)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(255, 99, 132)",
            },
            {
              label: "Average respondent results",
              data: [54, 52, 67, 76],
              fill: true,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgb(54, 162, 235)",
              pointBackgroundColor: "rgb(54, 162, 235)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(54, 162, 235)",
            },
          ],
        },
        options: {
          elements: {
            line: {
              borderWidth: 3,
            },
          },
          scale: {
            ticks: {
              beginAtZero: false,
              max: 100,
              min: 0,
              stepSize: 20,
            },
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import "SurveyResponseResults";
</style>
