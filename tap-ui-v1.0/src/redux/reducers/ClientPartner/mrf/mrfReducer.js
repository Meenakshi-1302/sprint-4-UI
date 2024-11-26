import { ActionTypes } from "../../../actions/ClientPartner/mrf/mrfActions";

const initialState = {
  mrfData: {
    mrfDepartmentName: '',
    probableDesignation: '',
    requiredResourceCount: '',
    employmentMode: '',
    educationalQualification: '',
    yearsOfExperience: '',
  },
  submittedMRF: null,
};

export const MRFReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_MRF_DATA:
      return {
        ...state,
        mrfData: payload,
      };

    case ActionTypes.SUBMIT_MRF_FORM:
      return {
        ...state,
        submittedMRF: payload,
      };

    default:
      return state;
  }
};
