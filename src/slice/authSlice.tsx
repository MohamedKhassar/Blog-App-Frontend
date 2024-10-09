import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginUserType, RegisterUserType, UserTypeBase } from "types";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const initialState: { user: UserTypeBase, isLoading: boolean, error: string | null } = {
    user: cookies.get("user") || null,
    isLoading: false,
    error: null,
}

export const registerUser = createAsyncThunk(
    "users/register",
    async (payload: RegisterUserType, { rejectWithValue }) => {
        try {
            if (payload.name && payload.email && payload.password) {
                const emailRGX = new RegExp('^[A-Za-z0-9._-]+@([A-Za-z]+)\\.[A-Za-z]{2,4}$', 'g')
                const nameRGX = new RegExp('^[A-Za-z]{3,25}$', 'g')
                const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$');
                if (emailRGX.test(payload.email)) {
                    if (nameRGX.test(payload.name)) {
                        if (passwordRegex.test(payload.password!)) {
                            const response = await axios.post("http://192.168.1.8:8080/api/register", payload)
                            return response.data
                        } else {
                            return rejectWithValue("Password must have 8+ characters: one uppercase, one lowercase, one digit, and one special character.")
                        }
                    } else {
                        return rejectWithValue("Name must be at least 3 characters.")
                    }
                } else {
                    return rejectWithValue("Invalid email address.")
                }
            } else {
                return rejectWithValue("All fields are required")
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
)

export const loginUser = createAsyncThunk(
    "users/login",
    async (payload: LoginUserType, { rejectWithValue }) => {
        try {
            if (payload.email && payload.password) {
                const emailRGX = new RegExp('^[A-Za-z0-9._-]+@([A-Za-z]+)\\.[A-Za-z]{2,4}$', 'g')
                const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$');
                if (emailRGX.test(payload.email)) {
                    if (passwordRegex.test(payload.password!)) {
                        const response = await axios.post("http://192.168.1.8:8080/api/login", payload)
                        return response.data.user
                    } else {
                        return rejectWithValue("Password must have 8+ characters: one uppercase, one lowercase, one digit, and one special character.")
                    }
                } else {
                    return rejectWithValue("Invalid email address.")
                }
            } else {
                return rejectWithValue("All fields are required")
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    })

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetState: (state) => state = { ...state, error: null, isLoading: false }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string || "Something went wrong"
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserTypeBase>) => {
                state.user = action.payload
                state.isLoading = false
                state.error = null
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string || "Something went wrong"
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserTypeBase>) => {
                state.user = action.payload
                cookies.set("user", action.payload, { path: "/" })
                state.isLoading = false
                state.error = null
            })
    }
})
export const { resetState } = userSlice.actions;
export default userSlice.reducer