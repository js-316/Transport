import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

const jobcardAdapter = createEntityAdapter();

const initialState = jobcardAdapter.getInitialState({});

export const jobcardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addJobcard: builder.mutation({
      query: (body) => ({
        url: "/jobcard/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Jobcard", id: "LIST" }],
    }),
    getJobcard: builder.query({
      query: () => ({
        url: "/jobcards/",
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (response) => {
        return jobcardAdapter.setAll(initialState, response);
      },
      providesTags: (error, result, args) => {
        if (result?.ids) {
          return result[
            {
              type: "Jobcard",
              id: "LIST",
              ...result.ids.map((id) => ({ type: "Jobcard", id })),
            }
          ];
        } else {
          return [{ type: "Jobcard", id: "LIST" }];
        }
      },
    }),
    getJobcardById: builder.query({
      query: (id) => `/jobcard/${id}`, // Assuming this is the correct endpoint for fetching a single driver by ID
      providesTags: (result, error, id) => [{ type: "Jobcard", id }], // Tags for caching
    }),
    editJobcard: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/jobcard/edit/${id}`, // Assuming this is the correct endpoint for updating a driver
        method: "PUT", // Use PUT method for updating existing resource
        body,
      }),
      invalidatesTags: ["Jobcard"], // Invalidate cache for the updated driver
    }),
    deleteJobcard: builder.mutation({
      query: (id) => ({
        url: `/jobcard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Jobcard", id: arg },
      ],
      }),
      approveJobcard: builder.mutation({
        query: (id) => ({
          url: `/jobcard/${id}/`,
          method: "PATCH",
          body: { status: "Approved" }, // Send the updated status
        }),
        invalidatesTags: ["Jobcard"],
      }),
      
      rejectJobcard: builder.mutation({
        query: (id) => ({
          url: `/jobcard/${id}/`,
          method: "PATCH",
          body: { status: "Rejected" }, // Send the updated status
        }),
        invalidatesTags: ["Jobcard"],
      }),
   
  }),
});

export const { 
  useAddJobcardMutation, 
  useGetJobcardQuery, 
  useEditJobcardMutation, 
  useGetJobcardByIdQuery, 
  useDeleteJobcardMutation,
  useApproveJobcardMutation,
  useRejectJobcardMutation,
} =
  jobcardApiSlice;
