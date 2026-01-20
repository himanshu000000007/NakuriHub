import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  currentJob: null,
  myJobs: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload.jobs;
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.currentPage || 1;
      state.loading = false;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
      state.loading = false;
    },
    setMyJobs: (state, action) => {
      state.myJobs = action.payload;
      state.loading = false;
    },
    addJob: (state, action) => {
      state.myJobs.unshift(action.payload);
    },
    updateJobInList: (state, action) => {
      const index = state.myJobs.findIndex(job => job._id === action.payload._id);
      if (index !== -1) {
        state.myJobs[index] = action.payload;
      }
    },
    removeJob: (state, action) => {
      state.myJobs = state.myJobs.filter(job => job._id !== action.payload);
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
  setJobs, 
  setCurrentJob, 
  setMyJobs, 
  addJob, 
  updateJobInList, 
  removeJob, 
  setError, 
  clearError 
} = jobSlice.actions;

export default jobSlice.reducer;