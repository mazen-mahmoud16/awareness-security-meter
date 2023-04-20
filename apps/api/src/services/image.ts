import ImageModel, { Image } from "../models/content/image";

export const createImage = async (image: Partial<Image>) => {
  await ImageModel.updateOne({ path: image.path }, image, {
    upsert: true,
    new: true,
  });
  return (await ImageModel.findOne({ path: image.path }))?.id;
};

export const imageExists = async (path: string) => {
  return await ImageModel.findOne({ path });
};
