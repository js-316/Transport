import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

const fuelAdapter = createEntityAdapter();

const initialState = fuelAdapter.getInitialState({});

export const fuelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addFuel: builder.mutation({
      query: (body) => ({
        url: "/fuel/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Fuel", id: "LIST" }],
    }),
    getFuel: builder.query({
      query: () => ({
        url: "/fuel/",
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (response) => {
        return fuelAdapter.setAll(initialState, response);
      },
      providesTags: (error, result, args) => {
        if (result?.ids) {
          return result[
            {
              type: "Fuel",
              id: "LIST",
              ...result.ids.map((id) => ({ type: "Fuel", id })),
            }
          ];
        } else {
          return [{ type: "Fuel", id: "LIST" }];
        }
      },
    }),
    getFuelById: builder.query({
      query: (id) => `/fuel/${id}`, // Assuming this is the correct endpoint for fetching a single driver by ID
      providesTags: (result, error, id) => [{ type: "Fuel", id }], // Tags for caching
    }),
    editFuel: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/fuel/edit/${id}`, // Assuming this is the correct endpoint for updating a driver
        method: "PUT", // Use PUT method for updating existing resource
        body,
      }),
      invalidatesTags: ["Fuel"], // Invalidate cache for the updated driver
    }),
    
    deleteFuel: builder.mutation({
      query: (id) => ({
        url: `/fuel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags : (result, error, arg) => [
        {type: "Fuel", id:arg},
      ]
    }),
    searchFuel: builder.query({
      query: (search) => ({
        url: `/search/fuel/${search}`,
      }),
      invalidatesTags: ["Fuel"],
    }),
    approveFuel: builder.mutation({
      query: (id) => ({
        url: `/fuel/${id}/`,
        method: "PATCH",
        body: { status: "Approved" }, // Send the updated status
      }),
      invalidatesTags: ["Fuel"],
    }),
    
    rejectFuel: builder.mutation({
      query: (id) => ({
        url: `/fuel/${id}/`,
        method: "PATCH",
        body: { status: "Rejected" }, // Send the updated status
      }),
      invalidatesTags: ["Fuel"],
    }),
    importFuel: builder.mutation({
      query: (body) => ({
        url: "/import/fuel/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Fuel", id: "LIST" }],
    }),
  }),
});

export const {
  useAddFuelMutation,
  useGetFuelQuery,
  useSearchFuelQuery,
  useImportFuelMutation,
  useEditFuelMutation,
  useGetFuelByIdQuery,
  useDeleteFuelMutation,
  useApproveFuelMutation,
  useRejectFuelMutation,
} = fuelApiSlice;
