import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({});

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getUsers: builder.query({
      query: () => ({
        url: "/users/",
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (response) => {
        return userAdapter.setAll(initialState, response);
      },
      providesTags: (error, result, args) => {
        if (result?.ids) {
          return result[
            {
              type: "User",
              id: "LIST",
              ...result.ids.map((id) => ({ type: "User", id })),
            }
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
    
    
    
  }),
});

export const {
  useGetUsersQuery,
} = userApiSlice;
