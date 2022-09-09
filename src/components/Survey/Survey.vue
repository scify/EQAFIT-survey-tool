<template>
  <div class="Survey w-100">
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
import SurveyProvider from "@/services/SurveyProvider";
// eslint-disable-next-line no-undef
Survey.StylesManager.applyTheme("modern");

export default {
  name: "SurveyComponent",
  emits: ["surveyCompleted"],
  props: {
    survey: {
      type: Object,
      required: true,
    },
    consentMode: {
      type: Boolean,
      required: true,
    },
  },
  data: function () {
    return {
      surveyModel: null,
      sectionScores: {},
      loading: false,
      error: null,
      surveyProvider: null,
    };
  },
  created() {
    this.surveyProvider = SurveyProvider.getInstance();
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.surveyModel = new Survey.Model(this.survey.survey);
    // this.surveyModel.data = {
    //   question1: "item2",
    //   question2: "item2",
    //   question3: "2022-09-07T21:00:00.000Z",
    //   question4: "2022-09-08T21:00:00.000Z",
    //   question5: "item3",
    //   question6: "item2",
    //   question7: ["item7"],
    //   question42: "item4",
    //   question9: "item2",
    //   question10: "item2",
    //   question8: "item2",
    //   question11: "item10",
    //   question13: { Row2: "4", Row3: "4", Row4: "4", Row5: "4", Row6: "4" },
    //   question15: {
    //     Row1: "4",
    //     Row2: "4",
    //     Row3: "4",
    //     Row4: "4",
    //     Row5: "4",
    //     Row6: "4",
    //   },
    //   question14: {
    //     Row1: "5",
    //     Row2: "5",
    //     Row4: "5",
    //     Row3: "5",
    //     Row5: "5",
    //     Row6: "5",
    //     Row7: "5",
    //     Row8: "5",
    //     Row9: "5",
    //     Row10: "5",
    //     Row11: "5",
    //     Row12: "5",
    //     Row13: "5",
    //     Row14: "5",
    //   },
    //   question16: "item2",
    // };
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
        const section = this.getQuestionSectionByQuestionName(key);
        if (
          !Object.prototype.hasOwnProperty.call(
            this.survey.section_max_scores,
            section
          )
        ) {
          continue;
        }
        if (value instanceof Object) {
          // eslint-disable-next-line no-unused-vars,no-empty
          for (const [objKey, objValue] of Object.entries(value)) {
            if (objKey.startsWith("Row") || parseInt(objValue))
              this.addScoreToSection(section, objValue);
          }
        } else if (parseInt(this.parseValue(value))) {
          const newValue = parseInt(this.parseValue(value));
          this.addScoreToSection(section, newValue);
        } else if (parseInt(value)) {
          this.addScoreToSection(section, value);
        }
      }
      for (const [key, value] of Object.entries(this.sectionScores)) {
        this.sectionScores[key] = this.percentage(
          value,
          this.survey.section_max_scores[key]
        );
      }
      if (this.consentMode) {
        this.postDataToServer(sender.data);
      } else {
        this.loading = false;
        this.$emit("surveyCompleted", this.sectionScores);
      }
    },
    parseValue(str) {
      return str.substring(str.indexOf("_") + 1);
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
          survey_id: this.survey.id,
          response_json: response,
          response_scores: this.sectionScores,
        },
        status: "publish",
      };
      console.log(data);
      let instance = this;
      this.error = null;
      this.surveyProvider
        .sendSurveyResponseToServer(data)
        .then(() => {
          instance.loading = false;
          instance.$emit("surveyCompleted", instance.sectionScores);
        })
        .catch((error) => {
          instance.loading = false;
          instance.error = error;
        });
    },
    percentage(partialValue, totalValue) {
      return Math.round((100 * partialValue) / totalValue);
    },
  },
};
</script>

<style lang="scss">
@import "Survey";
</style>
