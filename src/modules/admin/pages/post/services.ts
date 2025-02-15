import postService from "@/services/postService";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getPostDetail = createAsyncThunk('post/getPostDetail', async (id: string) => {
  const response = await postService.getById(id);
  if (response.status === 200) {
    return response.data;
  } else throw new Error();
})

export default getPostDetail;
