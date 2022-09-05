<template>
  <main>
    <div class="container-fluid mb-4" v-if="shouldShowBackButton()">
      <div class="row">
        <div class="col text-start">
          <button class="btn btn-light btn-sm" @click="goBack">
            <i class="bi bi-caret-left-fill mr-2"></i>Back
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
        :survey="survey"
      ></SurveyComponent>
    </div>
  </main>
</template>

<script>
import SelectSurvey from "@/components/SelectSurvey/SelectSurvey.vue";
import SelectSurveySections from "@/components/SelectSurveySections/SelectSurveySections.vue";
import SurveyComponent from "@/components/Survey/Survey.vue";
import SurveyProvider from "@/services/SurveyProvider";

const State = Object.freeze({
  select_survey: 0,
  select_survey_sections: 1,
  survey_response_in_progress: 2,
  survey_response_results: 3,
});

export default {
  name: "App",
  components: { SurveyComponent, SelectSurveySections, SelectSurvey },
  mounted() {
    this.surveyId = 1;
    this.appState = State.survey_response_in_progress;
    const survey = this.surveyProvider.getSurvey(1);
    const ids = [1, 2];
    let pagesToKeep = [];
    for (let i = 0; i < ids.length; i++) {
      pagesToKeep.push(survey.survey.pages[i]);
    }
    survey.survey.pages = pagesToKeep;
    this.survey = survey;
  },
  data: function () {
    return {
      surveyId: null,
      appState: null,
      survey: null,
      surveyProvider: null,
    };
  },
  created() {
    this.surveyProvider = new SurveyProvider();
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
    surveySectionsSelected(survey) {
      this.survey = survey;
      this.appState = State.survey_response_in_progress;
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/app";
</style>
