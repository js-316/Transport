import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

const vehicleAdapter = createEntityAdapter();

const initialState = vehicleAdapter.getInitialState({});

export const vehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addVehicle: builder.mutation({
      query: (body) => ({
        url: "/vehichle/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vehichles", id: "LIST" }],
    }),
    getVehichles: builder.query({
      query: () => ({
        url: "/vehichles/",
      }),
      
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (response) => {
        return vehicleAdapter.setAll(initialState, response);
      },
      providesTags: (error, result, args) => {
        if (result?.ids) {
          return result[
            {
              type: "Vehichles",
              id: "LIST",
              ...result.ids.map((id) => ({ type: "Vehichles", id })),
            }
          ];
        } else {
          return [{ type: "Vehichles", id: "LIST" }];
        }
      },
    }),
    searchVehichles: builder.query({
      query: (search) => ({
        url: `/search/vehichle/${search}`,
      }),
      invalidatesTags: ["Vehichles"],
    }),
    editVehichle: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/vehichle/edit/${id}`, // Assuming this is the correct endpoint for updating a driver
        method: "PUT", // Use PUT method for updating existing resource
        body,
      }),
      invalidatesTags: ["Vehichles"], // Invalidate cache for the updated driver
    }),
    getVehichleById: builder.query({
      query: (id) => `/vehichle/${id}`, // Assuming this is the correct endpoint for fetching a single driver by ID
      providesTags: (result, error, id) => [{ type: "Vehichle", id }], // Tags for caching
    }),
    importVehichles: builder.mutation({
      query: (body) => ({
        url: "/import/vehichle/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vehichles", id: "LIST" }],
    }),
    deleteVehichle: builder.mutation({
      query: (id) => ({
        url: `/vehichle/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result,error,arg) => [
        {type: "Vehichles" ,id: arg}
      ]
    })
  }),
});

export const {
  useAddVehicleMutation,
  useGetVehichlesQuery,
  useSearchVehichlesQuery,
  useImportVehichlesMutation,
  useEditVehichleMutation,
  useGetVehichleByIdQuery,
  useDeleteVehichleMutation,

} = vehicleApiSlice;
