import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

import UserType from "../types/User";

export type AuthState = {
  user: UserType;
  token: string | null;
};

const initialState: AuthState = {
  user: {},
  token: null,
};

/** Ducks 패턴 */
const { actions, reducer: authReducer } = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredential: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearCredential: (state) => {
      state.user = {};
      state.token = null;
    },
  },
  extraReducers: {},
});

export const { setCredential, clearCredential } = actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;

export default authReducer;
