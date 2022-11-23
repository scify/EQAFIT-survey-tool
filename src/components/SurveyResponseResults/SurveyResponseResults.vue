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
    <div class="container mb-6" ref="results">
      <div class="row mb-4">
        <div class="col-12">
          <h1>{{ $t("results") }}</h1>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <h4 class="results-label">{{ $t("overall") }}</h4>
        </div>
      </div>
      <div class="row mb-5">
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
          <div class="accordion" :id="'accordion_' + index">
            <div class="accordion-item">
              <h2 class="accordion-header" :id="'heading_' + index">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#collapse_' + index"
                  aria-expanded="true"
                  :aria-controls="'collapse_' + index"
                >
                  {{ section }}
                </button>
              </h2>
              <div
                :id="'collapse_' + index"
                class="accordion-collapse collapse show"
                :class="{ show: !index }"
                :aria-labelledby="'heading_' + index"
                :data-bs-parent="'accordion_' + index"
              >
                <div class="accordion-body">
                  {{ survey.section_descriptions[index].description
                  }}<br /><br /><a class="mt-3" href="#">{{
                    $t("read_how_to_improve")
                  }}</a>
                </div>
              </div>
            </div>
          </div>
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
    consentMode: {
      type: Boolean,
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
    this.scrollTo("results");
    this.loading = true;
    this.survey = this.surveyProvider.getSurvey(this.surveyId);
    if (Object.keys(this.userScores).length < 3) this.chartType = "bar";
    const surveySectionIds = Object.keys(this.userScores);
    for (let i = 0; i < surveySectionIds.length; i++) {
      this.userResponsesLabels.push(
        this.survey.survey.pages[surveySectionIds[i] - 1].name
      );
    }
    this.userResponsesValues = Object.values(this.userScores);
    if (this.consentMode) {
      this.getResponsesFromServerAndInitializeData();
    } else {
      this.createCharts();
    }
  },
  methods: {
    createChart(elId) {
      const ctx = document.getElementById(elId);
      const chartConfig = {
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
      };
      if (this.consentMode) {
        chartConfig.data.datasets.push({
          label: "Average respondent results",
          data: this.averageResponsesValues,
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(54, 162, 235)",
        });
      }
      new Chart(ctx, chartConfig);
    },
    getResponsesFromServerAndInitializeData() {
      let instance = this;
      this.surveyProvider
        .getSurveyResponsesFromServer()
        .then((data) => {
          instance.createAverageScoresObject(data);
          for (let i = 0; i < instance.userResponsesLabels.length; i++) {
            instance.averageResponsesValues.push(
              instance.averageScores[instance.userResponsesLabels[i]]
            );
          }
          instance.createCharts();
        })
        .catch((error) => {
          instance.loading = false;
          instance.error = error;
        });
    },
    createCharts() {
      let instance = this;
      this.createChart("overallChart");
      for (let i = 0; i < this.userResponsesLabels.length; i++) {
        setTimeout(function () {
          instance.createChart(
            instance.userResponsesLabels[i].replace(" ", "_") + "_Chart"
          );
        }, 500);
      }
      this.loading = false;
    },
    createAverageScoresObject(averageScoresFromServer) {
      let averageScoresCounter = 0;
      for (let i = 0; i < averageScoresFromServer.length; i++) {
        if (
          !averageScoresFromServer[i].acf ||
          !averageScoresFromServer[i].acf.response_scores ||
          !averageScoresFromServer[i].acf.survey_id ||
          parseInt(averageScoresFromServer[i].acf.survey_id) !== this.surveyId
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
        this.averageScores[key] = Math.round(this.averageScores[key]);
      }
    },
    addScoreToSection(section, score) {
      if (!Object.prototype.hasOwnProperty.call(this.averageScores, section))
        this.averageScores[section] = 0;
      this.averageScores[section] += parseInt(score);
    },
    scrollTo(refName) {
      const element = this.$refs[refName];
      const top = element.offsetTop;
      setTimeout(function () {
        window.scrollTo(0, top);
      }, 300);
    },
  },
};
</script>

<style lang="scss">
@import "SurveyResponseResults";
</style>
