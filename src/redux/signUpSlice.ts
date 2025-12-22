import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

type TData = {
    fullName: string
    phoneNumber: string
    email: string
    password: string
    confirmPassword: string
    fullAddress: string
    shortIntroduction: string
    gender: 'MALE' | 'FEMALE' | '',
    currentClass: string,
    roll: string,
    subject: string,
}

type TSignUpState = {
    data: TData,
    currentPage: number
};

const initialState: TSignUpState = {
    data: {
        fullName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullAddress: '',
        shortIntroduction: '',
        gender: '',
        currentClass: '',
        roll: '',
        subject: '',
    },
    currentPage: 1
};

const signUpSlice = createSlice({
    name: 'sign-up',
    initialState,
    reducers: {
        setData: (state, action: { payload: { data: Partial<TData>, currentPage?: number } }) => {
            const { data, currentPage } = action.payload;
            state.data = {
                ...state.data,
                ...data,
            };
            if (currentPage) {
                state.currentPage = currentPage
            }
        },
        setCurrentPage: (state, action: { payload: { currentPage: number } }) => {
            const { currentPage } = action.payload;
            state.currentPage = currentPage
        },
        resetData: (state) => {
            state.currentPage = 1
            state.data = {
                fullName: '',
                phoneNumber: '',
                email: '',
                password: '',
                confirmPassword: '',
                fullAddress: '',
                shortIntroduction: '',
                gender: 'MALE',
                currentClass: '',
                roll: '',
                subject: '',
            };
        },
    }
})
export const { setData, setCurrentPage, resetData } = signUpSlice.actions;
export default signUpSlice.reducer;


export const useCurrentSignUpData = (state: RootState) => state.signUp;