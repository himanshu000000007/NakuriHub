import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  jobApplications: [],
  loading: false,
  error: null
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setApplications: (state, action) => {
      state.applications = action.payload;
      state.loading = false;
    },
    setJobApplications: (state, action) => {
      state.jobApplications = action.payload;
      state.loading = false;
    },
    addApplication: (state, action) => {
      state.applications.unshift(action.payload);
    },
    updateApplication: (state, action) => {
      const index = state.jobApplications.findIndex(app => app._id === action.payload._id);
      if (index !== -1) {
        state.jobApplications[index] = action.payload;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setLoading, 
  setApplications, 
  setJobApplications, 
  addApplication, 
  updateApplication, 
  setError, 
  clearError 
} = applicationSlice.actions;

export default applicationSlice.reducer;