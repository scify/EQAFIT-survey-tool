<template>
  <div class="Survey">
    <div v-if="survey.survey">
      <div class="container">
        <div class="row mb-5">
          <div class="col">
            <h2>Quiz Questions: {{ survey.name }}</h2>
          </div>
        </div>
        <div class="row mb-5 survey-container">
          <div class="col">
            <div id="survey"></div>
          </div>
        </div>
        <div class="row mb-5" v-if="loading">
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
    </div>
  </div>
</template>
<script>
import axios from "axios";
// eslint-disable-next-line no-undef
Survey.StylesManager.applyTheme("modern");

const axiosConfig = {
  headers: {
    "content-Type": "multipart/form-data",
    Accept: "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    Authorization: "",
  },
};

export default {
  name: "SurveyComponent",
  emits: ["surveyCompleted"],
  props: {
    survey: {
      type: Object,
      required: false,
    },
  },
  data: function () {
    return {
      surveyModel: null,
      sectionScores: {},
      loading: false,
      error: null,
    };
  },
  created() {},
  mounted() {
    axiosConfig.headers.Authorization =
      "Basic " + import.meta.env.VITE_REST_API_AUTH_TOKEN;
    // eslint-disable-next-line no-undef
    this.surveyModel = new Survey.Model(this.survey.survey);
    this.surveyModel.data = {
      question1: "item2",
      question2: "item2",
      question3: "2022-09-07T21:00:00.000Z",
      question4: "2022-09-08T21:00:00.000Z",
      question5: "item3",
      question6: "item2",
      question7: ["item7"],
      question42: "item4",
      question9: "item2",
      question10: "item2",
      question8: "item2",
      question11: "item10",
      question13: { Row2: "3", Row3: "3", Row4: "2", Row5: "2", Row6: "3" },
      question15: {
        Row1: "3",
        Row2: "2",
        Row3: "3",
        Row4: "3",
        Row5: "3",
        Row6: "3",
      },
      question14: {
        Row1: "5",
        Row2: "4",
        Row4: "4",
        Row3: "4",
        Row5: "5",
        Row6: "4",
        Row7: "4",
        Row8: "4",
        Row9: "4",
        Row10: "4",
        Row11: "4",
        Row12: "4",
        Row13: "4",
        Row14: "4",
      },
      question16: "item2",
    };
    this.surveyModel.onComplete.add(this.saveSurveyResponse);
    let instance = this;
    setTimeout(function () {
      instance.surveyModel.render("survey");
    }, 500);
  },
  methods: {
    saveSurveyResponse(sender) {
      this.loading = true;
      this.error = null;
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(sender.data)) {
        if (sender.data[key] instanceof Object) {
          const section = this.getQuestionSectionByQuestionName(key);
          // eslint-disable-next-line no-unused-vars,no-empty
          for (const [objKey, objValue] of Object.entries(sender.data[key])) {
            if (objKey.startsWith("Row") || parseInt(objValue))
              this.addScoreToSection(section, objValue);
          }
        }
      }
      this.postDataToServer(sender.data);
    },
    getQuestionSectionByQuestionName(questionName) {
      const page = this.surveyModel.getPageByQuestion(
        this.surveyModel.getQuestionByName(questionName)
      );
      // we need to extract section name from the whole title
      const positionOfSecondSpace = page.name.split(" ", 2).join(" ").length;
      return page.name.substring(0, positionOfSecondSpace);
    },
    addScoreToSection(section, score) {
      if (!Object.prototype.hasOwnProperty.call(this.sectionScores, section))
        this.sectionScores[section] = 0;
      this.sectionScores[section] += parseInt(score);
    },
    postDataToServer(response) {
      const data = {
        fields: {
          survey_id: this.surveyModel.name,
          response_json: response,
          response_scores: this.sectionScores,
        },
      };
      let instance = this;
      axios
        .post(
          "https://www.eqafit.org/wp-json/wp/v2/survey_responses/",
          data,
          axiosConfig
        )
        // eslint-disable-next-line no-unused-vars
        .then(function (response) {
          console.log(response);
          instance.$emit("surveyCompleted", instance.sectionScores);
          instance.loading = false;
        })
        // eslint-disable-next-line no-unused-vars
        .catch(function (error) {
          instance.loading = false;
          instance.error = error;
        });
    },
  },
};
</script>

<style lang="scss">
@import "Survey";
</style>
