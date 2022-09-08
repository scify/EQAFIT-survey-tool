import _ from "lodash";
import axios from "axios";

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "",
  },
};

export default class SurveyProvider {
  instance = null;

  constructor() {
    this.getAndSaveAuthToken();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SurveyProvider();
    }
    return this.instance;
  }

  surveys = [
    {
      id: 1,
      name: "Survey of Graduates",
      dropdown_name: "Student",
      section_descriptions: {
        "Section A":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Section B":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Section C":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Section D":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      },
      section_max_scores: {
        "Section B": 118,
        "Section C": 12,
        "Section D": 80,
      },
      survey: {
        title: "Survey of Graduates",
        description:
          "As part of our continuous efforts to provide high-quality VET programs to our current and prospective students, we kindly request your participation in a survey focused on our institution’s graduates.",
        logo: "data:image/png;base64,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",
        logoFit: "none",
        logoPosition: "right",
        pages: [
          {
            name: "Section A – Graduate Profile",
            elements: [
              {
                type: "radiogroup",
                name: "question1",
                title: "Gender:",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Female",
                  },
                  {
                    value: "item2",
                    text: "Male",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question2",
                title: "Age:",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "18-24",
                  },
                  {
                    value: "item2",
                    text: "25-34",
                  },
                  {
                    value: "item3",
                    text: "35-44",
                  },
                  {
                    value: "item4",
                    text: "45-54",
                  },
                  {
                    value: "item5",
                    text: "55+",
                  },
                ],
              },
              {
                name: "question3",
                title: "Date of admission:",
                type: "datepicker",
                inputType: "date",
                dateFormat: "mm/dd/yy",
                isRequired: true,
              },
              {
                name: "question4",
                title: "Date of graduation",
                type: "datepicker",
                inputType: "date",
                dateFormat: "mm/dd/yy",
                isRequired: true,
              },
              {
                type: "radiogroup",
                name: "question5",
                title:
                  "What level of training did you complete at the VET institution?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Bachelor's degree",
                  },
                  {
                    value: "item2",
                    text: "Diploma",
                  },
                  {
                    value: "item3",
                    text: "Certificate",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question6",
                title: "What is your area of specialization?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Construction trades, craft, trade and industrial",
                  },
                  {
                    value: "item2",
                    text: "Financial sector",
                  },
                  {
                    value: "item3",
                    text: "Commercial, clerical business, public administration",
                  },
                  {
                    value: "item4",
                    text: "Agriculture, forestry and fisheries",
                  },
                  {
                    value: "item5",
                    text: "Health and health related",
                  },
                  {
                    value: "item6",
                    text: "ICT",
                  },
                  {
                    value: "item7",
                    text: "Hospitality and tourism",
                  },
                ],
              },
              {
                type: "checkbox",
                name: "question7",
                title:
                  "What parameters were important for your decision to study at the particular VET institution?",
                isRequired: true,
                choices: [
                  {
                    value: "item2",
                    text: "Proximity to home",
                  },
                  {
                    value: "item3",
                    text: "Availability of scholarship",
                  },
                  {
                    value: "item4",
                    text: "Attractiveness of town/state/region",
                  },
                  {
                    value: "item5",
                    text: "Reputation of the institution",
                  },
                  {
                    value: "item6",
                    text: "Attractiveness of the study programme /areas of specialization provided",
                  },
                  {
                    value: "item7",
                    text: "Recommendation from friends/acquaintances",
                  },
                  {
                    value: "item8",
                    text: "Advice from parents/relatives",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question42",
                title:
                  "On average, how many hours per week did you spend studying outside of classes?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Less than 5 hours",
                  },
                  {
                    value: "item2",
                    text: "5 to 10 hours",
                  },
                  {
                    value: "item3",
                    text: "10 to 15 hours",
                  },
                  {
                    value: "item4",
                    text: "15 to 20 hours",
                  },
                  {
                    value: "item5",
                    text: "More than 20 hours",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question9",
                title:
                  "Did you do any internships (at workplace environments) during your study at the institution?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Yes",
                  },
                  {
                    value: "item2",
                    text: "No",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question10",
                title: "Were you employed during your study?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Yes, full-time",
                  },
                  {
                    value: "item2",
                    text: "Yes, part-time",
                  },
                  {
                    value: "item3",
                    text: "No",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question8",
                title:
                  "What kind of connection/contact do you have with the institution post-graduation?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Newsletter/email",
                  },
                  {
                    value: "item2",
                    text: "Social media",
                  },
                  {
                    value: "item3",
                    text: "Graduate meetings",
                  },
                  {
                    value: "item4",
                    text: "Graduates’ association/forum",
                  },
                  {
                    value: "item5",
                    text: "Professional and social support/guidance",
                  },
                  {
                    value: "item6",
                    text: "I have not contacts with the VET institution",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question11",
                title: "What is your current situation?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "I have a permanent full-time job",
                  },
                  {
                    value: "item2",
                    text: "I have a temporary full-time job",
                  },
                  {
                    value: "item3",
                    text: "I am self-employed/freelancer",
                  },
                  {
                    value: "item4",
                    text: "I have an occasional job (just to earn some money)",
                  },
                  {
                    value: "item5",
                    text: "I am doing an internship",
                  },
                  {
                    value: "item6",
                    text: "I am continuing in academic education (higher education)",
                  },
                  {
                    value: "item7",
                    text: "I have undertaken further vocational training",
                  },
                  {
                    value: "item8",
                    text: "I am a housewife/househusband, family carer",
                  },
                  {
                    value: "item9",
                    text: "I am not employed, but searching for a job",
                  },
                  {
                    value: "item10",
                    text: "I am in the middle of military or civil service",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
            ],
            title: "Section A – Graduate Profile",
          },
          {
            name: "Section B – Evaluation of the VET institution’s quality",
            elements: [
              {
                type: "matrix",
                name: "question13",
                title:
                  "How would you rate your satisfaction with the training conditions you experienced at the VET institution?",
                isRequired: true,
                columns: [
                  {
                    value: "1",
                    text: "Very dissatisfied",
                  },
                  {
                    value: "2",
                    text: "Dissatisfied",
                  },
                  {
                    value: "3",
                    text: "Satisfied",
                  },
                  {
                    value: "4",
                    text: "Very satisfied",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "Quality of building/premises, technical equipment (e.g. lab equipment, computer, etc)",
                  },
                  {
                    value: "Row2",
                    text: "Supply and quality of learning materials (e.g. books, internet access)",
                  },
                  {
                    value: "Row3",
                    text: "Teaching and pedagogical quality of trainers",
                  },
                  {
                    value: "Row4",
                    text: "Support and enhancement of learner’s motivation",
                  },
                  {
                    value: "Row5",
                    text: "Opportunities for consultation with trainers",
                  },
                  {
                    value: "Row6",
                    text: "Classroom atmosphere/ interaction with classmates",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question15",
                title:
                  "How would you rate your satisfaction with the provisions related to employment and internships during your study course?",
                isRequired: true,
                columns: [
                  {
                    value: "1",
                    text: "Very dissatisfied",
                  },
                  {
                    value: "2",
                    text: "Dissatisfied",
                  },
                  {
                    value: "3",
                    text: "Satisfied",
                  },
                  {
                    value: "4",
                    text: "Very satisfied",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "Opportunities for internships",
                  },
                  {
                    value: "Row2",
                    text: "Support of internship search",
                  },
                  {
                    value: "Row3",
                    text: "Relationship between theory and practice",
                  },
                  {
                    value: "Row4",
                    text: "Preparation for actual work environment",
                  },
                  {
                    value: "Row5",
                    text: "Updates of teaching content according to developments in workplace requirements",
                  },
                  {
                    value: "Row6",
                    text: "Support of employment/job search",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question14",
                title:
                  "To what extent do you feel that you have acquired the following skills/competencies upon graduation?",
                isRequired: true,
                columns: [
                  {
                    value: "1",
                    text: "Not at all",
                  },
                  {
                    value: "2",
                    text: "To a small extent",
                  },
                  {
                    value: "3",
                    text: "To some extent",
                  },
                  {
                    value: "4",
                    text: "To a high extent",
                  },
                  {
                    value: "5",
                    text: "To a great extent",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "Deep expertise in my field",
                  },
                  {
                    value: "Row2",
                    text: "Verbal and/or written communication",
                  },
                  {
                    value: "Row3",
                    text: "Ability to develop new ideas and solutions",
                  },
                  {
                    value: "Row4",
                    text: "Ability to adapt to changing conditions",
                  },
                  {
                    value: "Row5",
                    text: "Ability to solve problems",
                  },
                  {
                    value: "Row6",
                    text: "Ability to prioritize tasks",
                  },
                  {
                    value: "Row7",
                    text: "Ability to meet deadlines",
                  },
                  {
                    value: "Row8",
                    text: "Ability to make fast decisions",
                  },
                  {
                    value: "Row9",
                    text: "Ability to plan and commit to goals",
                  },
                  {
                    value: "Row10",
                    text: "Ability to perform well under pressure",
                  },
                  {
                    value: "Row11",
                    text: "Ability to monitor and assess the quality of own work",
                  },
                  {
                    value: "Row12",
                    text: "Ability to monitor and assess the quality of others’ work",
                  },
                  {
                    value: "Row13",
                    text: "Ability to work productively within a team",
                  },
                  {
                    value: "Row14",
                    text: "Ability to assert my authority",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question16",
                title:
                  "During the course of your study, did you ever consider canceling your participation?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Yes",
                  },
                  {
                    value: "item2",
                    text: "No",
                  },
                ],
              },
              {
                type: "checkbox",
                name: "question17",
                visibleIf: "{question16} = 'item1'",
                title: "If yes, please specify why:",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Financial reasons",
                  },
                  {
                    value: "item2",
                    text: "Full-time or part-time employment",
                  },
                  {
                    value: "item3",
                    text: "Study programme did not meet expectations",
                  },
                  {
                    value: "item4",
                    text: "Family reasons (e.g. family member in need of constant care/supervision, unplanned parenthood, etc)",
                  },
                  {
                    value: "item5",
                    text: "I don’t want to provide the reason",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
                selectAllText: "Financial reasons",
              },
            ],
            title: "Section B – Evaluation of the VET institution’s quality",
          },
          {
            name: "Section C – Graduate employment path post-graduation",
            elements: [
              {
                type: "checkbox",
                name: "question18",
                title:
                  "What was your status in the first six months after graduating? (Multiple answers possible)",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Employment – full time",
                  },
                  {
                    value: "item2",
                    text: "Employment – part time",
                  },
                  {
                    value: "item3",
                    text: "Self-employed/freelance work",
                  },
                  {
                    value: "item4",
                    text: "Occasional jobs (just to earn money)",
                  },
                  {
                    value: "item5",
                    text: "Internship",
                  },
                  {
                    value: "item6",
                    text: "Further academic education (higher education)",
                  },
                  {
                    value: "item7",
                    text: "Further vocational education/training",
                  },
                  {
                    value: "item8",
                    text: "Housewife, househusband, family work",
                  },
                  {
                    value: "item9",
                    text: "Not employed, but searching for a job",
                  },
                  {
                    value: "item10",
                    text: "Military or civil service",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question19",
                title: "When did you start your first job after graduation?",
                isRequired: true,
                choices: [
                  {
                    value: "1count_4",
                    text: "At the time of graduation",
                  },
                  {
                    value: "2count_4",
                    text: "Less than 1 month after graduation",
                  },
                  {
                    value: "3count_4",
                    text: "1 to less than 3 months after graduation",
                  },
                  {
                    value: "4count_4",
                    text: "3 to less than 6 months after graduation",
                  },
                  {
                    value: "1count_2",
                    text: "6 to less than 9 months after graduation",
                  },
                  {
                    value: "2count_2",
                    text: "9 to less than 12 months after graduation",
                  },
                  {
                    value: "1",
                    text: "More than one year after graduation",
                  },
                  {
                    value: "0",
                    text: "I have not been employed since graduation",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question41",
                title: "When did you start your first job after graduation?",
                isRequired: true,
                choicesFromQuestion: "question19",
                choices: [
                  {
                    value: "1count_4",
                    text: "At the time of graduation",
                  },
                  {
                    value: "2count_4",
                    text: "Less than 1 month after graduation",
                  },
                  {
                    value: "3count_4",
                    text: "1 to less than 3 months after graduation",
                  },
                  {
                    value: "4count_4",
                    text: "3 to less than 6 months after graduation",
                  },
                  {
                    value: "1count_2",
                    text: "6 to less than 9 months after graduation",
                  },
                  {
                    value: "2count_2",
                    text: "9 to less than 12 months after graduation",
                  },
                  {
                    value: "1",
                    text: "More than one year after graduation",
                  },
                  {
                    value: "0",
                    text: "I have not been employed since graduation",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question20",
                title: "When did you start searching for a job?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Prior to graduation",
                  },
                  {
                    value: "item2",
                    text: "Around the time of graduation",
                  },
                  {
                    value: "item3",
                    text: "After graduation",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question21",
                title: "How long have you searched for your job?",
                isRequired: true,
                choices: [
                  {
                    value: "1count_4",
                    text: "Less than 1 month",
                  },
                  {
                    value: "2count_4",
                    text: "1 to less than 3 months",
                  },
                  {
                    value: "3",
                    text: "3 to less than 6 months",
                  },
                  {
                    value: "2",
                    text: "6 to less than 9 months",
                  },
                  {
                    value: "1count_1",
                    text: "9 to less than 12 months",
                  },
                  {
                    value: "2count_1",
                    text: "More than one year",
                  },
                ],
              },
              {
                type: "checkbox",
                name: "question22",
                title:
                  "How did you search for your first job after graduation? (Multiple answers possible)",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Following job ads/announcements on the internet, newspapers and other media",
                  },
                  {
                    value: "item2",
                    text: "With the help of family contacts of parents, relatives",
                  },
                  {
                    value: "item3",
                    text: "With the help of personal contacts of friends, fellow students etc.",
                  },
                  {
                    value: "item4",
                    text: "Independent contact directly with employers",
                  },
                  {
                    value: "item5",
                    text: "Through internships during my course of studies",
                  },
                  {
                    value: "item6",
                    text: "Through internships after graduation",
                  },
                  {
                    value: "item7",
                    text: "I was contacted by an employer",
                  },
                  {
                    value: "item8",
                    text: "Attending job fairs",
                  },
                  {
                    value: "item9",
                    text: "Through public employment services",
                  },
                  {
                    value: "item10",
                    text: "Through private job agencies",
                  },
                  {
                    value: "item11",
                    text: "Through social networks (e.g. LinkedIn, Facebook)",
                  },
                  {
                    value: "item12",
                    text: "Through the career center of the VET institution",
                  },
                  {
                    value: "item13",
                    text: "Through the support of teaching staff at the VET institution",
                  },
                  {
                    value: "item14",
                    text: "Not applicable, I have not searched for employment",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question23",
                title:
                  "Which was the most successful method for finding your first job? (Choose only one answer)",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Following job ads/announcements on the internet, newspapers and other media",
                  },
                  {
                    value: "item2",
                    text: "With the help of family contacts of parents, relatives",
                  },
                  {
                    value: "item3",
                    text: "With the help of personal contacts of friends, fellow students etc.",
                  },
                  {
                    value: "item4",
                    text: "Independent contact directly with employers",
                  },
                  {
                    value: "item5",
                    text: "Through internships during my course of studies",
                  },
                  {
                    value: "item6",
                    text: "Through internships after graduation",
                  },
                  {
                    value: "item7",
                    text: "I was contacted by an employer",
                  },
                  {
                    value: "item8",
                    text: "Attending job fairs",
                  },
                  {
                    value: "item9",
                    text: "Through public employment services",
                  },
                  {
                    value: "item10",
                    text: "Through private job agencies",
                  },
                  {
                    value: "item11",
                    text: "Through social networks (e.g. LinkedIn, Facebook)",
                  },
                  {
                    value: "item12",
                    text: "Through the career center of the VET institution",
                  },
                  {
                    value: "item13",
                    text: "Through the support of teaching staff at the VET institution",
                  },
                  {
                    value: "item14",
                    text: "Not applicable, I have not found a job yet",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question24",
                title:
                  "How many employers have you managed to approach after the completion of your study programme?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "I have not approached an employer",
                  },
                  {
                    value: "item2",
                    text: "1 employer",
                  },
                  {
                    value: "item3",
                    text: "2 to 4 employers",
                  },
                  {
                    value: "item4",
                    text: "5 to 10 employers",
                  },
                  {
                    value: "item5",
                    text: "More than 10 employers",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question25",
                title:
                  "From how many employers did you receive calls for interviews?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "I have not been called to an interview yet",
                  },
                  {
                    value: "item2",
                    text: "From 1 employer",
                  },
                  {
                    value: "item3",
                    text: "From 2 to 4 employers",
                  },
                  {
                    value: "item4",
                    text: "From 5 to 10 employers",
                  },
                  {
                    value: "item5",
                    text: "From more than 10 employers",
                  },
                ],
              },
              {
                type: "checkbox",
                name: "question26",
                title:
                  "What are the difficulties you encountered in looking for a job?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Lack of responses/limited responsiveness from employers",
                  },
                  {
                    value: "item2",
                    text: "Employers not interested in my level of qualifications",
                  },
                  {
                    value: "item3",
                    text: "Employers not interested in my area of specialization",
                  },
                  {
                    value: "item4",
                    text: "Lack of work experience",
                  },
                  {
                    value: "item5",
                    text: "Limited employment opportunities in my area",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question27",
                title:
                  "How many jobs (including your current one) have you had altogether since graduation?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "None, I have never been employed since graduation",
                  },
                  {
                    value: "item2",
                    text: "One job",
                  },
                  {
                    value: "item3",
                    text: "Two jobs",
                  },
                  {
                    value: "item4",
                    text: "Three jobs",
                  },
                  {
                    value: "item5",
                    text: "More than three jobs",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question28",
                title: "Are you currently employed?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Yes",
                  },
                  {
                    value: "item2",
                    text: "No",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question29",
                visibleIf: "{question28} = 'item1'",
                title: "How long have you been working in your current job?",
                isRequired: true,
                requiredIf: "{question28} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "Less than 1 month",
                  },
                  {
                    value: "item2",
                    text: "1 to less than 3 months",
                  },
                  {
                    value: "item3",
                    text: "3 to less than 6 months",
                  },
                  {
                    value: "item4",
                    text: "6 to less than 12 months",
                  },
                  {
                    value: "item5",
                    text: "More than 1 year",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question30",
                visibleIf: "{question28} = 'item1'",
                title: "Which economic sector are you currently employed in?",
                isRequired: true,
                requiredIf: "{question28} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "Construction trades, craft, trade and industrial",
                  },
                  {
                    value: "item2",
                    text: "Financial sector",
                  },
                  {
                    value: "item3",
                    text: "Commercial, clerical business, public administration",
                  },
                  {
                    value: "item4",
                    text: "Agriculture, forestry and fisheries",
                  },
                  {
                    value: "item5",
                    text: "Health and health related",
                  },
                  {
                    value: "item6",
                    text: "ICT",
                  },
                  {
                    value: "item7",
                    text: "Hospitality and tourism",
                  },
                ],
                hasOther: true,
                otherText: "Other (pelase specify)",
              },
              {
                type: "dropdown",
                name: "question31",
                visibleIf: "{question28} = 'item1'",
                title: "What type of employer do you work for?",
                isRequired: true,
                requiredIf: "{question28} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "Public/Government",
                  },
                  {
                    value: "item2",
                    text: "Private",
                  },
                  {
                    value: "item3",
                    text: "Not applicable/Self-employed",
                  },
                  {
                    value: "item4",
                    text: "Non-governmental organisation (NGO)",
                  },
                  {
                    value: "item5",
                    text: "International or diplomatic",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question32",
                visibleIf: "{question28} = 'item1'",
                title: "What is your current net monthly income?",
                isRequired: true,
                requiredIf: "{question28} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "Less than 600 EUR",
                  },
                  {
                    value: "item2",
                    text: "600 – 799 EUR",
                  },
                  {
                    value: "item3",
                    text: "800 – 999 EUR",
                  },
                  {
                    value: "item4",
                    text: "1000 – 1499 EUR",
                  },
                  {
                    value: "item5",
                    text: "1500 – 1999 EUR",
                  },
                  {
                    value: "item6",
                    text: "2000 – 2499 EUR",
                  },
                  {
                    value: "item7",
                    text: "2500 – 3000 EUR",
                  },
                  {
                    value: "item8",
                    text: "More than 3000 EUR",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question33",
                visibleIf: "{question28} = 'item1'",
                title:
                  "What is the size of the company you are currently employed at?",
                isRequired: true,
                requiredIf: "{question28} = 'item1'",
                choices: [
                  {
                    value: "item1",
                    text: "1 to 9 employees",
                  },
                  {
                    value: "item2",
                    text: "10 to 49 employees",
                  },
                  {
                    value: "item3",
                    text: "50 to 99 employees",
                  },
                  {
                    value: "item4",
                    text: "100 to 249 employees",
                  },
                  {
                    value: "item5",
                    text: "250 to 999 employees",
                  },
                  {
                    value: "item6",
                    text: "1000 or more employees",
                  },
                ],
              },
            ],
            title: "Section C – Graduate employment path post-graduation",
          },
          {
            name: "Section D – Evaluation of the study against work requirements",
            elements: [
              {
                type: "matrix",
                name: "question34",
                title:
                  "To what extent are the following skills/competences required in your current employment?",
                isRequired: true,
                columns: [
                  {
                    value: "1",
                    text: "Not at all",
                  },
                  {
                    value: "2",
                    text: "To a small extent",
                  },
                  {
                    value: "3",
                    text: "To some extent",
                  },
                  {
                    value: "4",
                    text: "To a high extent",
                  },
                  {
                    value: "5",
                    text: "To a great extent",
                  },
                ],
                rows: [
                  {
                    value: "Row 1",
                    text: "Deep expertise in my field",
                  },
                  {
                    value: "Row 2",
                    text: "Verbal and/or written communication",
                  },
                  {
                    value: "Row 3",
                    text: "Ability to develop new ideas and solutions",
                  },
                  {
                    value: "Row 4",
                    text: "Ability to adapt to changing conditions",
                  },
                  {
                    value: "Row 5",
                    text: "Analytical thinking",
                  },
                  {
                    value: "Row 6",
                    text: "Ability to solve problems",
                  },
                  {
                    value: "Row 7",
                    text: "Ability to prioritize tasks",
                  },
                  {
                    value: "Row 8",
                    text: "Ability to meet deadlines",
                  },
                  {
                    value: "Row 9",
                    text: "Ability to make fast decisions",
                  },
                  {
                    value: "Row 10",
                    text: "Ability to plan and commit to goals",
                  },
                  {
                    value: "Row 11",
                    text: "Ability to perform well under pressure",
                  },
                  {
                    value: "Row 12",
                    text: "Ability to monitor and assess the quality of work",
                  },
                  {
                    value: "Row 13",
                    text: "Ability to work productively within a team",
                  },
                  {
                    value: "Row 14",
                    text: "Ability to assert my authority",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question35",
                title:
                  "To what extent do you believe that the skills and knowledge you acquired during your study are utilized in your current job?",
                isRequired: true,
                columns: [
                  {
                    value: "1",
                    text: "Not at all",
                  },
                  {
                    value: "2",
                    text: "To a small extent",
                  },
                  {
                    value: "3",
                    text: "To some extent",
                  },
                  {
                    value: "4",
                    text: "To a high extent",
                  },
                  {
                    value: "5",
                    text: "To a great extent",
                  },
                ],
                rows: [
                  {
                    value: "Row 1",
                    text: "Answer",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question36",
                title:
                  "To what extent are you satisfied with your current job situation?",
                isRequired: true,
                columns: [
                  {
                    value: "1",
                    text: "Not at all",
                  },
                  {
                    value: "2",
                    text: "To a small extent",
                  },
                  {
                    value: "3",
                    text: "To some extent",
                  },
                  {
                    value: "4",
                    text: "To a high extent",
                  },
                  {
                    value: "5",
                    text: "To a great extent",
                  },
                ],
                rows: [
                  {
                    value: "Row 1",
                    text: "Answer",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question37",
                title:
                  "If your job is not closely related to your study, why did you choose this job?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Not applicable, my job is closely related to my study",
                  },
                  {
                    value: "item2",
                    text: "My current job is only temporary stepping stone, I am still searching for professional orientation",
                  },
                  {
                    value: "item3",
                    text: "I have not found an appropriate job (yet)",
                  },
                  {
                    value: "item4",
                    text: "I receive a higher salary in my current job",
                  },
                  {
                    value: "item5",
                    text: "My current job offers more security",
                  },
                  {
                    value: "item6",
                    text: "My interests have changed",
                  },
                  {
                    value: "item7",
                    text: "My current job allows a flexible time schedule",
                  },
                  {
                    value: "item8",
                    text: "My current job is close to my residence",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "dropdown",
                name: "question38",
                title:
                  "In your opinion, which degree/qualification level best matches your current job?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "A higher degree/qualification than mine",
                  },
                  {
                    value: "item2",
                    text: "My degree/qualification",
                  },
                  {
                    value: "item3",
                    text: "A lower degree/qualification than mine",
                  },
                  {
                    value: "item4",
                    text: "No degree/qualification necessary",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question39",
                title:
                  "Have you started or are you planning to start another course of studies after the study at our VET institution?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Yes, and I have completed it successfully",
                  },
                  {
                    value: "item2",
                    text: "Yes, and I am still studying",
                  },
                  {
                    value: "item3",
                    text: "Yes, I started another course of studies but stopped",
                  },
                  {
                    value: "item4",
                    text: "No, I have not started another course of studies but I am planning to",
                  },
                  {
                    value: "item5",
                    text: "No, I have not started another course of studies and I am not planning to",
                  },
                ],
              },
              {
                type: "dropdown",
                name: "question40",
                title:
                  "Why did you start/why are you planning to start another course of studies?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "To achieve a higher academic or professional degree",
                  },
                  {
                    value: "item2",
                    text: "To improve chances of finding a job (any job)",
                  },
                  {
                    value: "item3",
                    text: "To improve chances of finding a job that will satisfy me more than my current one",
                  },
                  {
                    value: "item4",
                    text: "Personal interest in a particular subject area",
                  },
                  {
                    value: "item5",
                    text: "It has been requested/demanded by my current employer",
                  },
                  {
                    value: "item6",
                    text: "I wish to improve my promotion prospects",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
            ],
            title:
              "Section D – Evaluation of the study against work requirements",
            description:
              "*In case you are not currently employed, please continue to section E",
          },
        ],
        showProgressBar: "both",
        progressBarType: "buttons",
        goNextPageAutomatic: false,
      },
    },
    {
      id: 2,
      name: "Survey of Companies",
      dropdown_name: "Company representative",
      section_descriptions: {
        "Section A":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Section B":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Section C":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Section D":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      },
      section_max_scores: {
        "Section B": 72,
        "Section C": 64,
      },
      survey: {
        title: "Survey of Companies",
        description:
          "As part of our continuous efforts to provide high-quality VET programs to our current and prospective students, we kindly request your participation in a survey focused on our institution’s graduates.",
        logo: "data:image/png;base64,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",
        logoFit: "none",
        logoPosition: "right",
        pages: [
          {
            name: "Section A – Company Profile",
            elements: [
              {
                type: "radiogroup",
                name: "question1",
                title: "Please specify the type of your organization:",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Public/Government",
                  },
                  {
                    value: "item2",
                    text: "Private",
                  },
                  {
                    value: "item3",
                    text: "Not applicable/Self-employed",
                  },
                  {
                    value: "item4",
                    text: "Non-governmental organisation (NGO)",
                  },
                  {
                    value: "item5",
                    text: "International or diplomatic",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "radiogroup",
                name: "question2",
                title: "Please specify the main sector of your company:",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Construction trades, craft, trade and industrial",
                  },
                  {
                    value: "item2",
                    text: "Financial sector",
                  },
                  {
                    value: "item3",
                    text: "Commercial, clerical business, public administration",
                  },
                  {
                    value: "item4",
                    text: "Agriculture, forestry and fisheries",
                  },
                  {
                    value: "item5",
                    text: "Health and health-related",
                  },
                  {
                    value: "item6",
                    text: "ICT",
                  },
                  {
                    value: "item7",
                    text: "Hospitality and tourism",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question3",
                title: "How many employees do you currently have?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "1 to 9 employees",
                  },
                  {
                    value: "item2",
                    text: "10 to 49 employees",
                  },
                  {
                    value: "item3",
                    text: "50 to 99 employees",
                  },
                  {
                    value: "item4",
                    text: "100 to 249 employees",
                  },
                  {
                    value: "item5",
                    text: "250 to 999 employees",
                  },
                  {
                    value: "item6",
                    text: "1000 or more employees",
                  },
                ],
              },
            ],
          },
          {
            name: "Section B – Evaluation of the employee",
            elements: [
              {
                type: "matrix",
                name: "question4",
                title:
                  "How would you rate your satisfaction with the training and knowledge of your employee?",
                isRequired: true,
                columns: [
                  {
                    value: "1",
                    text: "Very dissatisfied",
                  },
                  {
                    value: "2",
                    text: "Dissatisfied",
                  },
                  {
                    value: "3",
                    text: "Satisfied",
                  },
                  {
                    value: "4",
                    text: "Very satisfied",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "Scope of students' knowledge",
                  },
                  {
                    value: "Row2",
                    text: "Match between needed skills and learned skills",
                  },
                  {
                    value: "Row3",
                    text: "Length of program",
                  },
                  {
                    value: "Row4",
                    text: "Possibility for involvement in the VET program",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question5",
                title:
                  "To what extent do you feel that the employee has acquired the following skills/competencies after graduation?",
                isRequired: true,
                columns: [
                  {
                    value: "0",
                    text: "Not at all",
                  },
                  {
                    value: "1",
                    text: "To a small extent",
                  },
                  {
                    value: "2",
                    text: "To some extent",
                  },
                  {
                    value: "3",
                    text: "To a high extent",
                  },
                  {
                    value: "4",
                    text: "To a great extent",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "Deep expertise in the field",
                  },
                  {
                    value: "Row2",
                    text: "Verbal and/or written communication",
                  },
                  {
                    value: "Row3",
                    text: "Ability to develop new ideas and solutions",
                  },
                  {
                    value: "Row4",
                    text: "Ability to adapt to changing conditions",
                  },
                  {
                    value: "Row5",
                    text: "Ability to solve problems",
                  },
                  {
                    value: "Row6",
                    text: "Ability to prioritize tasks",
                  },
                  {
                    value: "Row7",
                    text: "Ability to meet deadlines",
                  },
                  {
                    value: "Row8",
                    text: "Ability to make fast decisions",
                  },
                  {
                    value: "Row9",
                    text: "Ability to plan and commit to goals",
                  },
                  {
                    value: "Row10",
                    text: "Ability to perform well under pressure",
                  },
                  {
                    value: "Row11",
                    text: "Ability to monitor and assess the quality of own work",
                  },
                  {
                    value: "Row12",
                    text: "Ability to monitor and assess the quality of others' work",
                  },
                  {
                    value: "Row13",
                    text: "Ability to work productively within a team",
                  },
                  {
                    value: "Row14",
                    text: "Ability to assert authority",
                  },
                ],
              },
            ],
          },
          {
            name: "Section C – Evaluation of the employee against work requirements",
            elements: [
              {
                type: "matrix",
                name: "question6",
                title:
                  "To what extent do you require the following skills/competences in your company?",
                isRequired: true,
                columns: [
                  {
                    value: "0",
                    text: "Not at all",
                  },
                  {
                    value: "1",
                    text: "To a small extent",
                  },
                  {
                    value: "2",
                    text: "To some extent",
                  },
                  {
                    value: "3",
                    text: "To a high extent",
                  },
                  {
                    value: "4",
                    text: "To a great extent",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "Deep expertise in the field",
                  },
                  {
                    value: "Row2",
                    text: "Verbal and/or written communication",
                  },
                  {
                    value: "Row3",
                    text: "Ability to develop new ideas and solutions",
                  },
                  {
                    value: "Row4",
                    text: "Ability to adapt to changing conditions",
                  },
                  {
                    value: "Row5",
                    text: "Analytical thinking",
                  },
                  {
                    value: "Row6",
                    text: "Ability to solve problems",
                  },
                  {
                    value: "Row7",
                    text: "Ability to prioritize tasks",
                  },
                  {
                    value: "Row8",
                    text: "Ability to meet deadlines",
                  },
                  {
                    value: "Row9",
                    text: "Ability to make fast decisions",
                  },
                  {
                    value: "Row10",
                    text: "Ability to plan and commit to goals",
                  },
                  {
                    value: "Row11",
                    text: "Ability to perform well under pressure",
                  },
                  {
                    value: "Row12",
                    text: "Ability to monitor and assess the quality of own work",
                  },
                  {
                    value: "Row13",
                    text: "Ability to work productively within a team",
                  },
                  {
                    value: "Row14",
                    text: "Ability to assert authority",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question7",
                title: "About Skills and Knowledge Acquisition",
                isRequired: true,
                columns: [
                  {
                    value: "0",
                    text: "Not at all",
                  },
                  {
                    value: "1",
                    text: "To a small extent",
                  },
                  {
                    value: "2",
                    text: "To some extent",
                  },
                  {
                    value: "3",
                    text: "To a high extent",
                  },
                  {
                    value: "4",
                    text: "To a great extent",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "To what extent are the skills and knowledge the employee acquired during their study are utilized in their current job?",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question8",
                title: "About Employee Satisfaction",
                isRequired: true,
                columns: [
                  {
                    value: "0",
                    text: "Not at all",
                  },
                  {
                    value: "1",
                    text: "To a small extent",
                  },
                  {
                    value: "2",
                    text: "To some extent",
                  },
                  {
                    value: "3",
                    text: "To a high extent",
                  },
                  {
                    value: "4",
                    text: "To a great extent",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "To what extent are you satisfied with your new employee?",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question9",
                title: "What kind of degree is most valid for your company?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "A higher degree/qualification than mine",
                  },
                  {
                    value: "item2",
                    text: "My degree/qualification",
                  },
                  {
                    value: "item3",
                    text: "A lower degree/qualification than mine",
                  },
                  {
                    value: "item4",
                    text: "No degree/qualification necessary",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: 3,
      name: "Survey of VET institutions",
      dropdown_name: "VET institution representative",
      section_descriptions: {
        "Section A":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Section B":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Section C":
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      },
      section_max_scores: {
        "Section A": 6,
        "Section B": 108,
        "Section C": 6,
      },
      survey: {
        title: "Survey of VET institutions",
        description:
          "As part of our continuous efforts to provide high-quality VET programs to our current and prospective students, we kindly request your participation in a survey focused on our institution’s graduates.",
        logo: "data:image/png;base64,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",
        logoFit: "none",
        logoPosition: "right",
        pages: [
          {
            name: "Section A – VET Profile",
            elements: [
              {
                type: "radiogroup",
                name: "question1",
                title:
                  "What level of training do you offer at your VET institution?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Bachelor's degree",
                  },
                  {
                    value: "item2",
                    text: "Diploma",
                  },
                  {
                    value: "item3",
                    text: "Certificate",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
              {
                type: "radiogroup",
                name: "question2",
                title: "Within what sector do you offer programs?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Construction trades, craft, trade and industrial",
                  },
                  {
                    value: "item2",
                    text: "Financial sector",
                  },
                  {
                    value: "item3",
                    text: "Commercial, clerical business, public administration",
                  },
                  {
                    value: "item4",
                    text: "Agriculture, forestry and fisheries",
                  },
                  {
                    value: "item5",
                    text: "Health and health-related",
                  },
                  {
                    value: "item6",
                    text: "ICT",
                  },
                  {
                    value: "item7",
                    text: "Hospitality and tourism",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question3",
                title: "How long are your programs on average?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Less than 1 year",
                  },
                  {
                    value: "item2",
                    text: "2 years",
                  },
                  {
                    value: "item3",
                    text: "Longer than 2 years",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question4",
                title: "Do your programs include work-based learning?",
                isRequired: true,
                choices: [
                  {
                    value: "1",
                    text: "Yes",
                  },
                  {
                    value: "0",
                    text: "No",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question5",
                title:
                  "How long do the work-based learning periods last on average?",
                isRequired: true,
                choices: [
                  {
                    value: "1count_1",
                    text: "Less than 2 weeks",
                  },
                  {
                    value: "2count_1",
                    text: "2–3 weeks",
                  },
                  {
                    value: "2",
                    text: "4-6 weeks",
                  },
                  {
                    value: "3",
                    text: "7-10 weeks",
                  },
                  {
                    value: "4",
                    text: "More than 10 weeks",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question6",
                title: "Do you have an alumni network?",
                isRequired: true,
                choices: [
                  {
                    value: "1",
                    text: "Yes",
                  },
                  {
                    value: "0",
                    text: "No",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question7",
                visibleIf: "{question6} = '1'",
                title:
                  "If Yes, how do you usually keep in touch with your alumni?",
                isRequired: true,
                choices: [
                  {
                    value: "item1",
                    text: "Newsletter/email",
                  },
                  {
                    value: "item2",
                    text: "Social media",
                  },
                  {
                    value: "item3",
                    text: "Graduate meetings",
                  },
                  {
                    value: "item4",
                    text: "Graduates’ association/forum",
                  },
                  {
                    value: "item5",
                    text: "Professional and social support/guidance",
                  },
                ],
                hasOther: true,
                otherText: "Other (please specify)",
              },
            ],
          },
          {
            name: "Section B – Evaluation of the VET institution’s quality",
            elements: [
              {
                type: "matrix",
                name: "question8",
                title:
                  "How would you rate the quality of your VET institution?",
                isRequired: true,
                columns: [
                  {
                    value: "1",
                    text: "Very dissatisfied",
                  },
                  {
                    value: "2",
                    text: "Dissatisfied",
                  },
                  {
                    value: "3",
                    text: "Satisfied",
                  },
                  {
                    value: "4",
                    text: "Very satisfied",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "Quality of building/premises",
                  },
                  {
                    value: "Row2",
                    text: "Availability and quality of technical equipment (e.g. lab equipment, computers, teaching media)",
                  },
                  {
                    value: "Row3",
                    text: "Supply and quality of learning materials (e.g. books, internet access)",
                  },
                  {
                    value: "Row4",
                    text: "Teaching and pedagogical quality of trainers",
                  },
                  {
                    value: "Row5",
                    text: "Support and enhancement of learner’s motivation",
                  },
                  {
                    value: "Row6",
                    text: "Opportunities for consultation with trainers",
                  },
                  {
                    value: "Row7",
                    text: "Classroom atmosphere/ interaction with classmates",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question9",
                title:
                  "How would you rate the provisions related to employment and internships of your VET institution? ",
                isRequired: true,
                columns: [
                  {
                    value: "1",
                    text: "Very dissatisfied",
                  },
                  {
                    value: "2",
                    text: "Dissatisfied",
                  },
                  {
                    value: "3",
                    text: "Satisfied",
                  },
                  {
                    value: "4",
                    text: "Very satisfied",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "Opportunities for internships",
                  },
                  {
                    value: "Row2",
                    text: "Support of internship search",
                  },
                  {
                    value: "Row3",
                    text: "Relationship between theory and practice",
                  },
                  {
                    value: "Row4",
                    text: "Preparation for actual work environment",
                  },
                  {
                    value: "Row5",
                    text: "Updates of teaching content according to developments in workplace requirements",
                  },
                  {
                    value: "Row6",
                    text: "Support of employment/job search",
                  },
                ],
              },
              {
                type: "matrix",
                name: "question10",
                title:
                  "To what extent do you think that students have acquired the following skills/competencies upon graduation?",
                isRequired: true,
                columns: [
                  {
                    value: "0",
                    text: "Not at all",
                  },
                  {
                    value: "1",
                    text: "To a small extent",
                  },
                  {
                    value: "2",
                    text: "To some extent",
                  },
                  {
                    value: "3",
                    text: "To a high extent",
                  },
                  {
                    value: "4",
                    text: "To a great extent",
                  },
                ],
                rows: [
                  {
                    value: "Row1",
                    text: "Deep expertise in the field",
                  },
                  {
                    value: "Row2",
                    text: "Verbal and/or written communication",
                  },
                  {
                    value: "Row3",
                    text: "Ability to develop new ideas and solutions",
                  },
                  {
                    value: "Row4",
                    text: "Ability to adapt to changing conditions",
                  },
                  {
                    value: "Row5",
                    text: "Ability to solve problems",
                  },
                  {
                    value: "Row6",
                    text: "Ability to prioritize tasks",
                  },
                  {
                    value: "Row7",
                    text: "Ability to meet deadlines",
                  },
                  {
                    value: "Row8",
                    text: "Ability to make fast decisions",
                  },
                  {
                    value: "Row9",
                    text: "Ability to plan and commit to goals",
                  },
                  {
                    value: "Row10",
                    text: "Ability to perform well under pressure",
                  },
                  {
                    value: "Row11",
                    text: "Ability to monitor and assess the quality of own work",
                  },
                  {
                    value: "Row12",
                    text: "Ability to monitor and assess the quality of others' work",
                  },
                  {
                    value: "Row13",
                    text: "Ability to work productively within a team",
                  },
                  {
                    value: "Row14",
                    text: "Ability to assert authority",
                  },
                ],
              },
            ],
          },
          {
            name: "Section C – Graduate employment path post-graduation",
            elements: [
              {
                type: "radiogroup",
                name: "question11",
                title:
                  "How long does it usually take for students from your institution to find a job?",
                isRequired: true,
                choices: [
                  {
                    value: "1count_4",
                    text: "At the time of graduation",
                  },
                  {
                    value: "2count_4",
                    text: "Less than 1 month after graduation",
                  },
                  {
                    value: "3count_4",
                    text: "1 to less than 3 months after graduation",
                  },
                  {
                    value: "1count_3",
                    text: "3 to less than 6 months after graduation",
                  },
                  {
                    value: "2count_3",
                    text: "6 to less than 9 months after graduation",
                  },
                  {
                    value: "2",
                    text: "9 to less than 12 months after graduation",
                  },
                  {
                    value: "1",
                    text: "More than one year after graduation",
                  },
                  {
                    value: "0",
                    text: "They usually don’t find a suitable job",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question12",
                title: "Do you offer support in students job search?",
                isRequired: true,
                choices: [
                  {
                    value: "1",
                    text: "Yes",
                  },
                  {
                    value: "0",
                    text: "No",
                  },
                ],
              },
              {
                type: "radiogroup",
                name: "question13",
                title:
                  "Do you follow up on students after their graduation in terms of employment?",
                isRequired: true,
                choices: [
                  {
                    value: "1",
                    text: "Yes",
                  },
                  {
                    value: "0",
                    text: "No",
                  },
                ],
              },
              {
                type: "comment",
                name: "question14",
                title: "Please explain why or why not in a few sentences:",
              },
              {
                type: "comment",
                name: "question15",
                title: "How do you collect and analyze this data?",
              },
            ],
          },
        ],
      },
    },
  ];

  getSurveys() {
    return this.surveys;
  }

  getSurvey(id) {
    return _.find(this.surveys, { id: id });
  }

  getSurveyResponsesFromServer() {
    return new Promise(function callback(resolve, reject) {
      axios
        .get(
          "https://www.eqafit.org/wp-json/wp/v2/survey_responses/",
          axiosConfig
        )
        .then(function (response) {
          if (response.status > 300) {
            reject(response);
          }
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  sendSurveyResponseToServer(data) {
    return new Promise(function callback(resolve, reject) {
      axios
        .post(
          "https://www.eqafit.org/wp-json/wp/v2/survey_responses/",
          data,
          axiosConfig
        )
        .then(function (response) {
          if (response.status > 300) {
            reject(response);
          }
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  getAndSaveAuthToken() {
    const data = {
      username: import.meta.env.VITE_REST_API_AUTH_USERNAME,
      password: import.meta.env.VITE_REST_API_AUTH_USERPASSWORD,
    };
    axios
      .post(
        "https://www.eqafit.org/wp-json/jwt-auth/v1/token",
        data,
        axiosConfig
      )
      .then(function (response) {
        axiosConfig.headers.Authorization = "Bearer " + response.data.token;
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}
