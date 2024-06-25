import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

const maintenanceAdapter = createEntityAdapter();

const initialState = maintenanceAdapter.getInitialState({});

export const maintenanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addMaintenance: builder.mutation({
      query: (body) => ({
        url: "/maintenance/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Maintenance", id: "LIST" }],
    }),
    getMaintenance: builder.query({
      query: () => ({
        url: "/maintenances/",
      }),
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (response) => {
        return maintenanceAdapter.setAll(initialState, response);
      },
      providesTags: (error, result, args) => {
        if (result?.ids) {
          return result[
            {
              type: "Maintenance",
              id: "LIST",
              ...result.ids.map((id) => ({ type: "Maintenance", id })),
            }
          ];
        } else {
          return [{ type: "Maintenance", id: "LIST" }];
        }
      },
    }),
    getMaintenanceById: builder.query({
      query: (id) => `/maintenance/${id}`, // Assuming this is the correct endpoint for fetching a single driver by ID
      providesTags: (result, error, id) => [{ type: "Maintenance", id }], // Tags for caching
    }),
    editMaintenance: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/maintenance/edit/${id}`, // Assuming this is the correct endpoint for updating a driver
        method: "PUT", // Use PUT method for updating existing resource
        body,
      }),
      invalidatesTags: ["Maintenance"], // Invalidate cache for the updated driver
    }),
    deleteMaintenance: builder.mutation({
      query: (id) => ({
        url: `/maintenance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Maintenance", id: arg },
      ],
    }),
    ongoingRepair: builder.mutation({
      query: (id) => ({
        url: `/maintenance/${id}/`,
        method: "PATCH",
        body: { status: "Ongoing" }, // Send the updated status
      }),
      invalidatesTags: ["Maintenance"],
    }),
    approveRepair: builder.mutation({
      query: (id) => ({
        url: `/maintenance/${id}/`,
        method: "PATCH",
        body: { status: "Approved" }, // Send the updated status
      }),
      invalidatesTags: ["Maintenance"],
    }),

    doneRepair: builder.mutation({
      query: (id) => ({
        url: `/maintenance/${id}/`,
        method: "PATCH",
        body: { status: "Done" }, // Send the updated status
      }),
      invalidatesTags: ["Maintenance"],
    }),

    completedRepair: builder.mutation({
      query: (id) => ({
        url: `/maintenance/${id}/`,
        method: "PATCH",
        body: { status: "Completed" }, // Send the updated status
      }),
      invalidatesTags: ["Maintenance"],
    }),
    assignRepair: builder.mutation({
      query: ({ id, engineerId }) => ({
        url: `/maintenance/${id}/assign-engineer/`,
        method: "PATCH",
        body: { assigned_engineer_id: engineerId, status: 'Assigned' },
      }),
      invalidatesTags: ["Maintenance"],
    })
  }),
});

export const {
  useAddMaintenanceMutation,
  useGetMaintenanceQuery,
  useEditMaintenanceMutation,
  useGetMaintenanceByIdQuery,
  useDeleteMaintenanceMutation,
  useApproveRepairMutation,
  useOngoingRepairMutation,
  useDoneRepairMutation,
  useCompletedRepairMutation,
  useAssignRepairMutation,
} = maintenanceApiSlice;
