import { AuthService } from "@/services/api/auth-service";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAsyncThunk(
    "authReducer/session/fetchCurrentAdmin",
    async () => {
        const service = new AuthService();
        const response = await service.isUserActive();
        return response;
    }
);

type InitialState = {
    isAuth: boolean;
    session: null | any;
    isLoading: boolean;
    userId: string | null; // Add userId field to the initial state
};

const initialState: InitialState = {
    isAuth: false,
    session: null,
    isLoading: false,
    userId: null, // Initialize userId as null
};

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logUser: (state, { payload }: PayloadAction<any>) => {
      
            state.isAuth = true;
            state.session = payload;
            state.userId = payload.user.id; // Assume the payload contains userId
        },
        logout: (state) => {
            state.isAuth = false;
            state.session = null;
            state.userId = null; // Reset userId on logout
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
           
                if (action.payload !== null) {
                    state.isAuth = true;
                    state.session = action.payload;
                    state.userId = action.payload.user.id; // Assume the payload contains userId
                } else {
                    state.isAuth = false;
                    state.session = null;
                    state.userId = null; // Reset userId when the response is null
                }
                state.isLoading = false;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { logUser, logout } = auth.actions;
interface AuthReducerState {
    userId: string; // Adjust the type as needed
  }
  
  interface RootState {
    authReducer: AuthReducerState;
  }
  
// Selector function to get the userId
export const selectUserId = (state: RootState) => state.authReducer

export default auth.reducer;
