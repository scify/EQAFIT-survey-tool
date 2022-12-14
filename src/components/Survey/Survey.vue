<template>
  <div class="Survey w-100">
    <div v-if="survey && survey.survey">
      <div class="container">
        <div class="row mb-5">
          <div class="col">
            <h2>{{ $t("survey_quiz_questions_title") }} {{ survey.name }}</h2>
          </div>
        </div>
        <div class="row mb-5 survey-container">
          <div class="col-12 mb-4">
            <button
              @click="skipCurrentSection()"
              class="btn btn-primary"
              :disabled="!allowUserToSkipSection"
            >
              {{ $t("skip_current_section") }}
            </button>
          </div>
          <div class="col-12">
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
import AnalyticsLogger from "@/services/AnalyticsLogger";
// eslint-disable-next-line no-undef
Survey.StylesManager.applyTheme("modern");

export default {
  name: "SurveyComponent",
  emits: ["surveyCompleted"],
  props: {
    surveyData: {
      type: Object,
      required: true,
    },
    consentMode: {
      type: Boolean,
      required: true,
    },
    appState: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      survey: null,
      surveyModel: null,
      sectionScores: {},
      loading: false,
      error: null,
      surveyProvider: null,
      analyticsLogger: null,
      t0: null,
      surveyLocalStorageKey: "",
      allowUserToSkipSection: false,
    };
  },
  created() {
    const instance = this;
    this.surveyProvider = SurveyProvider.getInstance();
    this.analyticsLogger = AnalyticsLogger.getInstance();
    // eslint-disable-next-line no-unused-vars
    this.globalEventBus.on("lang_changed", function (lang) {
      if (instance.appState === 2) window.location.reload();
    });
  },
  mounted() {
    let instance = this;
    this.survey = this.surveyData;
    let sectionIds = this.survey.survey.pages.flatMap((i) => i.id);
    this.surveyLocalStorageKey =
      "eqafit_survey_" +
      this.survey.id +
      "_" +
      sectionIds.join("_") +
      "_response";
    // eslint-disable-next-line no-undef
    this.surveyModel = new Survey.Model(this.survey.survey);
    this.surveyModel.locale = this.$i18n.locale;
    const responseJSON = window.localStorage.getItem(
      this.surveyLocalStorageKey
    );
    if (responseJSON && JSON.parse(responseJSON))
      this.surveyModel.data = JSON.parse(responseJSON);
    this.surveyModel.onValueChanged.add(this.saveSurveyResponseProgress);
    this.surveyModel.onComplete.add(this.saveSurveyResponse);
    // eslint-disable-next-line no-unused-vars
    this.surveyModel.onCurrentPageChanged.add(function (editor, options) {
      instance.allowUserToSkipSection =
        !instance.surveyModel.currentPage.name.includes("Section A");
    });
    setTimeout(function () {
      instance.surveyModel.render("survey");
    }, 500);
  },
  methods: {
    setUpSurvey() {},
    skipCurrentSection() {
      this.surveyModel.removePage(this.surveyModel.currentPage);
    },
    // eslint-disable-next-line no-unused-vars
    saveSurveyResponseProgress(sender, options) {
      const responseJSON = window.localStorage.getItem(
        this.surveyLocalStorageKey
      );
      if (!responseJSON || !JSON.parse(responseJSON))
        this.analyticsLogger.logEvent("survey_respond_begin", {
          name: this.survey.name,
        });
      window.localStorage.setItem(
        this.surveyLocalStorageKey,
        JSON.stringify(sender.data)
      );
      if (!this.t0) this.t0 = performance.now();
    },
    saveSurveyResponse(sender) {
      this.loading = true;
      this.error = null;
      const data = this.clearSurveyAnswersFromSkippedQuestions(sender.data);
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(data)) {
        const sectionId = this.getSectionIndexByQuestionName(key);
        if (
          !Object.prototype.hasOwnProperty.call(
            this.survey.section_max_scores,
            sectionId
          )
        ) {
          continue;
        }
        if (value instanceof Object) {
          // eslint-disable-next-line no-unused-vars,no-empty
          for (const [objKey, objValue] of Object.entries(value)) {
            if (objKey.startsWith("Row") || parseInt(objValue))
              this.addScoreToSection(sectionId, objValue);
          }
        } else if (parseInt(this.parseValue(value))) {
          const newValue = parseInt(this.parseValue(value));
          this.addScoreToSection(sectionId, newValue);
        } else if (parseInt(value)) {
          this.addScoreToSection(sectionId, value);
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
    clearSurveyAnswersFromSkippedQuestions(data) {
      let filtered = {};
      for (const [key, value] of Object.entries(data)) {
        const page = this.surveyModel.getPageByQuestion(
          this.surveyModel.getQuestionByName(key)
        );
        if (page) filtered[key] = value;
      }
      return filtered;
    },
    parseValue(str) {
      return str.substring(str.indexOf("_") + 1);
    },
    getSectionIndexByQuestionName(questionName) {
      const page = this.surveyModel.getPageByQuestion(
        this.surveyModel.getQuestionByName(questionName)
      );
      for (let i = 0; i < this.surveyModel.pages.length; i++) {
        if (this.surveyModel.pages[i].name === page.name) return i + 1;
      }
      return null;
    },
    addScoreToSection(sectionId, score) {
      if (!Object.prototype.hasOwnProperty.call(this.sectionScores, sectionId))
        this.sectionScores[sectionId] = 0;
      this.sectionScores[sectionId] += parseInt(score);
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
      let instance = this;
      this.error = null;
      this.surveyProvider
        .sendSurveyResponseToServer(data)
        .then(() => {
          instance.loading = false;
          instance.$emit("surveyCompleted", instance.sectionScores);
          const time = performance.now() - instance.t0;
          const name = instance.survey.name;
          instance.analyticsLogger.logEvent("survey_respond_complete", {
            name: name,
            time_to_complete: time,
          });
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
