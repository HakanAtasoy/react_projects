import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5165/api/',
        prepareHeaders: (headers) => {
            // Add Content-Type header for all requests
            headers.set('Content-Type', 'application/json');
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('token', token);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'user/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        checkLogin: builder.mutation({
            query: () => ({
                url: 'user/check-login',
                method: 'POST',
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'user/logout',
                method: 'POST',
            }),
        }),
        getCountries: builder.query({
            query: () => 'countries',
        }),
        getMessages: builder.query({
            query: () => 'messages',
            providesTags: ['Messages'], // To enable refetchign messages in case of deletion and addition
        }),
        getMessageById: builder.query({
            query: (id) => `message/${id}`,
        }),
        addMessage: builder.mutation({
            query: (messageData) => ({
                url: 'message/add',
                method: 'POST',
                body: messageData,
            }),
            invalidatesTags: [{ type: 'Messages' }], // So that messages are fetched again (updated) after adding a message 
        }),
        markMessageAsRead: builder.mutation({
            query: (id) => ({
                url: `message/read/${id}`,
                method: 'POST',
            }),
        }),
        deleteMessage: builder.mutation({
            query: (id) => ({
                url: `message/delete/${id}`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'Messages' }], // So that messages are fetched again (updated) after deleting a message 
        }),
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['Users'],
        }),
        getUserById: builder.query({
            query: (id) => `/user/${id}`,
            providesTags: ['User'],
        }),
        addUser: builder.mutation({
            query: (user) => ({
                url: '/user/add-reader',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...user }) => ({
                url: `/user/update/${id}`,
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const { useLoginMutation, useCheckLoginMutation, useLogoutMutation, useGetCountriesQuery, 
    useGetMessagesQuery, useGetMessageByIdQuery, useAddMessageMutation, useMarkMessageAsReadMutation, 
    useDeleteMessageMutation, useGetUsersQuery, useGetUserByIdQuery, useAddUserMutation, useUpdateUserMutation } = apiSlice;

