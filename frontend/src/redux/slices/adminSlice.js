import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  pendingRecruiters: [],
  analytics: null,
  loading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    setPendingRecruiters: (state, action) => {
      state.pendingRecruiters = action.payload;
      state.loading = false;
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
      state.loading = false;
    },
    updateRecruiterStatus: (state, action) => {
      state.pendingRecruiters = state.pendingRecruiters.filter(
        r => r._id !== action.payload
      );
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user._id !== action.payload);
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
  setUsers, 
  setPendingRecruiters, 
  setAnalytics, 
  updateRecruiterStatus, 
  removeUser, 
  setError, 
  clearError 
} = adminSlice.actions;

export default adminSlice.reducer;