<template>
  <main>
    <div class="container">
      <div class="row my-4">
        <div class="col-lg-2 col-md-3 col-sm-9">
          <div class="locale-changer form-group">
            <select
              v-model="$i18n.locale"
              @change="setLang"
              class="form-control"
            >
              <option
                v-for="(lang, i) in languages"
                :key="`Lang${i}`"
                :value="lang.code"
              >
                {{ lang.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid mb-4" v-if="shouldShowBackButton()">
      <div class="row">
        <div class="col text-start">
          <button class="btn btn-light btn-sm" @click="goBack">
            {{ $t("back") }}
          </button>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <SelectSurvey
        v-if="appInSelectSurveyState()"
        @survey-selected="surveySelected"
      ></SelectSurvey>
      <SelectSurveySections
        v-if="appInSelectSurveySectionsState()"
        :survey-id="surveyId"
        @survey-sections-selected="surveySectionsSelected"
      ></SelectSurveySections>
      <SurveyComponent
        v-if="appInSurveyResponseInProgressState()"
        :survey-data="survey"
        :consent-mode="consentMode"
        :app-state="appState"
        @survey-completed="surveyCompleted"
      ></SurveyComponent>
      <SurveyResponseResults
        v-if="appInSurveyResponseResultsState()"
        :user-scores="userScores"
        :consent-mode="consentMode"
        :survey-data="survey"
      ></SurveyResponseResults>
    </div>
  </main>
</template>

<script>
import SelectSurvey from "@/components/SelectSurvey/SelectSurvey.vue";
import SelectSurveySections from "@/components/SelectSurveySections/SelectSurveySections.vue";
import SurveyComponent from "@/components/Survey/Survey.vue";
import SurveyProvider from "@/services/SurveyProvider";
import SurveyResponseResults from "@/components/SurveyResponseResults/SurveyResponseResults.vue";
import { languagesMap } from "@/i18n";

const State = Object.freeze({
  select_survey: 0,
  select_survey_sections: 1,
  survey_response_in_progress: 2,
  survey_response_results: 3,
});

export default {
  name: "App",
  components: {
    SurveyResponseResults,
    SurveyComponent,
    SelectSurveySections,
    SelectSurvey,
  },
  mounted() {
    this.appState = State.select_survey;
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("lang")) {
      this.$i18n.locale = urlParams.get("lang");
    }
    // this.appState = State.select_survey_sections;
    // this.surveyId = 1;
    // const survey = this.surveyProvider.getSurvey(1);
    // this.survey = survey;
    // // const ids = [1, 2, 3];
    // // let pagesToKeep = [];
    // // for (let i = 0; i < ids.length; i++) {
    // //   pagesToKeep.push(survey.survey.pages[i]);
    // // }
    // // survey.survey.pages = pagesToKeep;
    // // this.survey = survey;
  },
  data: function () {
    return {
      surveyId: null,
      appState: null,
      survey: null,
      surveyProvider: null,
      userScores: null,
      consentMode: true,
      languages: languagesMap,
    };
  },
  created() {
    SurveyProvider.translator = this.$t;
    this.surveyProvider = SurveyProvider.getInstance();
  },
  methods: {
    appInSelectSurveyState() {
      return this.appState === State.select_survey;
    },
    appInSelectSurveySectionsState() {
      return this.appState === State.select_survey_sections;
    },
    appInSurveyResponseInProgressState() {
      return this.appState === State.survey_response_in_progress;
    },
    appInSurveyResponseResultsState() {
      return this.appState === State.survey_response_results;
    },
    shouldShowBackButton() {
      return this.appState;
    },
    goBack() {
      this.appState -= 1;
    },
    surveySelected(surveyId) {
      this.surveyId = surveyId;
      this.appState = State.select_survey_sections;
    },
    surveySectionsSelected(data) {
      this.survey = data.survey;
      this.consentMode = data.consentMode;
      this.appState = State.survey_response_in_progress;
    },
    surveyCompleted(userScores) {
      this.userScores = userScores;
      this.appState = State.survey_response_results;
    },
    setLang(event) {
      // const url = new URL(window.location);
      // url.searchParams.set("lang", event.target.value);
      // window.history.pushState({}, "", url);
      // window.location.reload();
      const url = new URL(window.location);
      url.searchParams.set("lang", event.target.value);
      window.history.pushState({}, "", url);
      const lang = event.target.value;
      this.$i18n.locale = lang;
      this.globalEventBus.emit("lang_changed", lang);
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/app";
</style>
