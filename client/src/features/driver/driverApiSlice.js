import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

const driverAdapter = createEntityAdapter();

const initialState = driverAdapter.getInitialState({});

export const driverApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addDriver: builder.mutation({
      query: (body) => ({
        url: "/driver/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Drivers", id: "LIST" }],
    }),
    getDrivers: builder.query({
      query: () => ({
        url: "/drivers/",
      }),
      providesTags: ["Drivers"],
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (response) => {
        return driverAdapter.setAll(initialState, response);
      },
      providesTags: (error, result, args) => {
        if (result?.ids) {
          return result[
            {
              type: "Drivers",
              id: "LIST",
              ...result.ids.map((id) => ({ type: "Drivers", id })),
            }
          ];
        } else {
          return [{ type: "Drivers", id: "LIST" }];
        }
      },
      
    }),
    editDriver: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/driver/edit/${id}`, // Assuming this is the correct endpoint for updating a driver
        method: "PUT", // Use PUT method for updating existing resource
        body,
      }),
      invalidatesTags: ["Drivers"], // Invalidate cache for the updated driver
    }),
    getDriverById: builder.query({
      query: (id) => `/driver/${id}`, // Assuming this is the correct endpoint for fetching a single driver by ID
      providesTags: (result, error, id) => [{ type: "Driver", id }], // Tags for caching
    }),
    importDrivers: builder.mutation({
      query: (body) => ({
        url: "/import/driver/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Drivers"],
    }),
    deleteDriver: builder.mutation({
      query: (id) => ({
       url: `/driver/${id}`,
       method: "DELETE",
     }),
     invalidatesTags: (result, error, arg) => [
       { type: "Drivers", id: arg },
     ],
     })
  
  }),
  
  });

export const { useAddDriverMutation, 
  useGetDriversQuery , 
  useEditDriverMutation,
  useGetDriverByIdQuery,
  useDeleteDriverMutation,
  useImportDriversMutation,
} = driverApiSlice;
