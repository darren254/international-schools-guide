export type ReaderPulseModuleId = "parent_snapshot" | "micro_polls";

export type OptionOrderingRule = "fixed" | "shuffle" | "shuffle_except_last";

export interface ReaderPulseOption {
  id: string;
  label: string;
}

export interface ReaderPulseQuestion {
  id: string;
  text: string;
  optionOrdering: OptionOrderingRule;
  options: ReaderPulseOption[];
}

export interface ReaderPulseModule {
  id: ReaderPulseModuleId;
  title: string;
  subtitle: string;
  questions: ReaderPulseQuestion[];
}

export const READER_PULSE_MODULES: Record<ReaderPulseModuleId, ReaderPulseModule> = {
  parent_snapshot: {
    id: "parent_snapshot",
    title: "Parent Snapshot",
    subtitle: "Help other parents with a quick pulse check.",
    questions: [
      {
        id: "ps_living_jakarta",
        text: "Are you already living in Jakarta?",
        optionOrdering: "fixed",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
        ],
      },
      {
        id: "ps_enrolment_stage",
        text: "What enrolment stage are you planning for?",
        optionOrdering: "fixed",
        options: [
          { id: "early_years", label: "Early Years" },
          { id: "primary", label: "Primary" },
          { id: "middle", label: "Middle" },
          { id: "senior", label: "Senior" },
        ],
      },
      {
        id: "ps_location_importance",
        text: "How important is school-run travel time?",
        optionOrdering: "fixed",
        options: [
          { id: "under_20", label: "<20 mins" },
          { id: "under_40", label: "<40 mins" },
          { id: "flexible", label: "Flexible" },
          { id: "would_relocate", label: "Would relocate" },
        ],
      },
      {
        id: "ps_top_priority",
        text: "What is your top priority right now?",
        optionOrdering: "shuffle",
        options: [
          { id: "campus_facilities", label: "Campus & facilities" },
          { id: "teacher_quality", label: "Teacher quality" },
          { id: "pastoral", label: "Individual attention & pastoral care" },
        ],
      },
      {
        id: "ps_biggest_concern",
        text: "What is your biggest concern?",
        optionOrdering: "shuffle",
        options: [
          { id: "availability", label: "Admissions availability" },
          { id: "fees", label: "Fees" },
          { id: "pressure", label: "Academic pressure" },
          { id: "social_fit", label: "Social fit" },
        ],
      },
    ],
  },
  micro_polls: {
    id: "micro_polls",
    title: "Micro Polls",
    subtitle: "A 30-second pulse from families like you.",
    questions: [
      {
        id: "mp_shortlist_size",
        text: "How many schools are currently on your shortlist?",
        optionOrdering: "fixed",
        options: [
          { id: "one_two", label: "1–2" },
          { id: "three_four", label: "3–4" },
          { id: "five_plus", label: "5+" },
        ],
      },
      {
        id: "mp_enrolment_timing",
        text: "When are you planning to enrol?",
        optionOrdering: "fixed",
        options: [
          { id: "this_term", label: "This term" },
          { id: "next_year", label: "Next academic year" },
          { id: "one_two_years", label: "1–2 years away" },
          { id: "exploring", label: "Exploring" },
        ],
      },
      {
        id: "mp_employer_funding",
        text: "Will your employer fund school fees?",
        optionOrdering: "shuffle",
        options: [
          { id: "fully", label: "Fully" },
          { id: "partially", label: "Partially" },
          { id: "no", label: "No" },
          { id: "unsure", label: "Unsure" },
        ],
      },
      {
        id: "mp_deal_breaker",
        text: "What is a deal-breaker for you?",
        optionOrdering: "shuffle",
        options: [
          { id: "waitlist", label: "Long waitlist" },
          { id: "fees", label: "Fees" },
          { id: "weak_results", label: "Weak results" },
          { id: "poor_facilities", label: "Poor facilities" },
        ],
      },
      {
        id: "mp_preferred_curriculum",
        text: "What curriculum do you prefer?",
        optionOrdering: "shuffle_except_last",
        options: [
          { id: "british", label: "British" },
          { id: "ib", label: "IB" },
          { id: "american", label: "American" },
          { id: "australian_other", label: "Australian-Other" },
          { id: "not_sure", label: "Not sure" },
        ],
      },
    ],
  },
};

