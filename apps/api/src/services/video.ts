import VideoModel, { Video } from "../models/content/video";

export const createVideo = async (video: Partial<Video>) => {
  await VideoModel.updateOne({ path: video.path }, video, {
    upsert: true,
    new: true,
  });
  return (await VideoModel.findOne({ path: video.path }))?.id;
};

export const videoExists = async (path: string) => {
  return await VideoModel.findOne({ path });
};
