import { AdvancedImage, lazyload, responsive } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

const CloudinaryImage = ({ publicId, objectFit }: any) => {
  const cld = new Cloudinary({ cloud: { cloudName: "road4u" } });
  const img = cld.image(publicId).format("auto").quality("auto");

  return (
    <AdvancedImage
      cldImg={img}
      plugins={[lazyload(), responsive()]}
      style={{ width: "100%", height: "100%", objectFit: objectFit ?? "cover" }}
    />
  );
};

export default CloudinaryImage;
