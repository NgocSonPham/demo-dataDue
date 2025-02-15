import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostInterface } from "./interfaces";
import getPostDetail from "./services";
import { POST_STATUS } from "./constant";

export const VERSION_OPTIONS = [
  {
    label: 'Free Plan',
    value: 'Free Plan'
  },
  {
    label: 'Pro Plan',
    value: 'Pro Plan',
    disabled: true
  },
]

const initialState: PostInterface = {
  id: '',
  thumbnail: '',
  title: '',
  shortDescription: '',
  mainCategoryId: null,
  subCategoryId: null,
  topics: [],
  content: '',
  status: POST_STATUS.DRAFT,
  createdAt: '',
  updatedAt: '',
  publishedAt: '',
  version: VERSION_OPTIONS[0].value,
  isHighlight: false,
  isActive: false,
  link: 'https://datadude.vn/--/--/ ..',
}

export const postDetailSlice = createSlice({
  name: 'postDetail',
  initialState,
  reducers: {
    setPostDetail: (state, action: PayloadAction<Partial<PostInterface>>) => {
      const { payload } = action;
      Object.assign(state, payload);
    },
    resetPostDetail: (state) => {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPostDetail.fulfilled, (state, action) => {
      Object.assign(state, action.payload.data);
    })
  }
})

export const { setPostDetail, resetPostDetail } = postDetailSlice.actions;
export default postDetailSlice.reducer;
