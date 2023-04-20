import axios from "axios";
import { PaginatedResponse, Response } from ".";

export interface Image {
  id: string;
  path: string;
  name: string;
  alt?: string;
  size?: number;
  height?: number;
  width?: number;
  thumbnail?: boolean;
}

export interface Video {
  id: string;
  path: string;
  name: string;
  thumbnail: Image;
  duration?: number;
  size?: number;
}

export type ImagesResponse = PaginatedResponse<Image[]>;
export type ImageResponse = Response<Image>;
export type VideoResponse = Response<Video>;
export type VideosResponse = PaginatedResponse<Video[]>;

export const images = async (
  skip: number,
  take: number,
  search: string
): Promise<ImagesResponse> => {
  return (
    await axios.get(
      `/admin/content/images?skip=${skip}&take=${take}&search=${search}`
    )
  ).data;
};

export const videos = async (
  skip: number,
  take: number,
  search: string
): Promise<VideosResponse> => {
  return (
    await axios.get(
      `/admin/content/videos?skip=${skip}&take=${take}&search=${search}`
    )
  ).data;
};

export const image = async (id: string): Promise<ImageResponse> => {
  return (await axios.get(`/admin/content/images/${id}/details`)).data;
};

export const video = async (id: string): Promise<VideoResponse> => {
  return (await axios.get(`/admin/content/videos/${id}/details`)).data;
};

export const imagesQuery = (
  skip: number = 0,
  take: number = 10,
  search: string = ""
) => ({
  queryKey: ["images", skip, take, search],
  queryFn: async () => await images(skip, take, search),
  keepPreviousData: true,
});

export const videosQuery = (
  skip: number = 0,
  take: number = 10,
  search: string = ""
) => ({
  queryKey: ["videos", skip, take, search],
  queryFn: async () => await videos(skip, take, search),
  keepPreviousData: true,
});

export const imageQuery = (id: string, enabled = true) => ({
  queryKey: ["image", id],
  queryFn: async () => await image(id),
  enabled,
});

export const videoQuery = (id: string, enabled = true) => ({
  queryKey: ["video", id],
  queryFn: async () => await video(id),
  enabled,
});

export const deleteImage = async (id: string): Promise<Response> => {
  return (await axios.delete(`/admin/content/images/${id}`)).data;
};

export const deleteVideo = async (id: string): Promise<Response> => {
  return (await axios.delete(`/admin/content/videos/${id}`)).data;
};
