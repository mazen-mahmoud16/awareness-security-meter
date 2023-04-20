import React, { ImgHTMLAttributes, useEffect, useState } from "react";
import { BASE_API_URL } from "../../../utils/constants";

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string;
}

const AuthenticatedImage: React.FC<Props> = ({ src, ...props }) => {
  return <img {...props} src={`${BASE_API_URL}${src}`} />;
};

export default AuthenticatedImage;
