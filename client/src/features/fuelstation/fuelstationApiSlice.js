import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

const fuelstationAdapter = createEntityAdapter();

const initialState = fuelstationAdapter.getInitialState({});

export const fuelstationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addFuelstation: builder.mutation({
      query: (body) => ({
        url: "/fuelstation/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Fuelstations", id: "LIST" }],
    }),
    getFuelstations: builder.query({
      query: () => ({
        url: "/fuelstations/",
      }),
      providesTags: ["Fuelstations"],
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (response) => {
        return fuelstationAdapter.setAll(initialState, response);
      },
      providesTags: (error, result, args) => {
        if (result?.ids) {
          return result[
            {
              type: "Fuelstations",
              id: "LIST",
              ...result.ids.map((id) => ({ type: "Fuelstations", id })),
            }
          ];
        } else {
          return [{ type: "Fuelstations", id: "LIST" }];
        }
      },
      
    }),
    
  }),
  
  });

export const { useAddFuelstationMutation, 
  useGetFuelstationsQuery , 
  
} = fuelstationApiSlice;
