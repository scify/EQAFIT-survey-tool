<template>
  <div class="SurveyResponseResults w-100">
    <div class="container mb-5">
      <div class="row mb-4" v-if="loading">
        <div class="col mx-auto text-center">
          <div class="spinner-border" role="status" id="survey-loader">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div class="row mb-5" v-if="error">
        <div class="col mx-auto text-center">
          <p class="text-danger error">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
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
    <div
      class="container section-results"
      v-for="(section, index) in userResponsesLabels"
      :key="'section_results_' + index"
    >
      <div class="row align-items-center">
        <div class="col-6">
          <h4 class="results-label mb-2">{{ section }}</h4>
          <p class="section-explanation">
            <span v-if="survey">
              {{ survey.section_descriptions[section] }}
            </span>
          </p>
          <a class="mt-3" href="#">Read how to improve</a>
        </div>
        <div class="col-5 offset-1">
          <canvas :id="section.replace(' ', '_') + '_Chart'"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import SurveyProvider from "@/services/SurveyProvider";

Chart.register(...registerables);

export default {
  name: "SurveyResponseResults",
  props: {
    userScores: {
      type: Object,
      required: true,
    },
    surveyId: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      error: null,
      averageScores: {},
      loading: false,
      surveyProvider: null,
      chartType: "radar",
      userResponsesLabels: [],
      userResponsesValues: [],
      averageResponsesValues: [],
      survey: {},
    };
  },
  created() {
    this.surveyProvider = SurveyProvider.getInstance();
  },
  mounted() {
    this.loading = true;
    this.survey = this.surveyProvider.getSurvey(this.surveyId);
    if (Object.keys(this.userScores).length < 3) this.chartType = "bar";
    this.getResponsesFromServerAndInitializeData();
  },
  methods: {
    createChart(elId) {
      const ctx = document.getElementById(elId);
      new Chart(ctx, {
        type: this.chartType,
        data: {
          labels: this.userResponsesLabels,
          datasets: [
            {
              label: "Your results",
              data: this.userResponsesValues,
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
              data: this.averageResponsesValues,
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
    getResponsesFromServerAndInitializeData() {
      let instance = this;
      this.surveyProvider
        .getSurveyResponsesFromServer()
        .then((data) => {
          instance.createAverageScoresObject(data);
          instance.userResponsesLabels = Object.keys(this.userScores);
          instance.userResponsesValues = Object.values(this.userScores);
          for (let i = 0; i < instance.userResponsesLabels.length; i++)
            instance.averageResponsesValues.push(
              instance.averageScores[instance.userResponsesLabels[i]]
            );
          instance.createChart("overallChart");
          for (let i = 0; i < instance.userResponsesLabels.length; i++) {
            setTimeout(function () {
              instance.createChart(
                instance.userResponsesLabels[i].replace(" ", "_") + "_Chart"
              );
            }, 500);
          }
          instance.loading = false;
        })
        .catch((error) => {
          instance.loading = false;
          instance.error = error;
        });
    },
    createAverageScoresObject(averageScoresFromServer) {
      let averageScoresCounter = 0;
      for (let i = 0; i < averageScoresFromServer.length; i++) {
        if (
          !averageScoresFromServer[i].acf ||
          !averageScoresFromServer[i].acf.response_scores
        )
          continue;
        averageScoresCounter += 1;
        const scoresObjectForResponse =
          averageScoresFromServer[i].acf.response_scores;
        for (const [key, value] of Object.entries(scoresObjectForResponse)) {
          this.addScoreToSection(key, value);
        }
      }
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(this.averageScores)) {
        this.averageScores[key] /= averageScoresCounter;
      }
    },
    addScoreToSection(section, score) {
      if (!Object.prototype.hasOwnProperty.call(this.averageScores, section))
        this.averageScores[section] = 0;
      this.averageScores[section] += parseInt(score);
    },
  },
};
</script>

<style lang="scss">
@import "SurveyResponseResults";
</style>
