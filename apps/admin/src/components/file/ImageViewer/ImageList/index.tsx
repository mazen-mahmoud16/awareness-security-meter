import { Image } from "../../../../api/content";
import { formatBytes } from "../../../../utils/parse";

const ImageList: React.FC<{
  images: Image[];
  onSelect(id: string | null): void;
  selected: string | null;
}> = ({ images, onSelect, selected }) => {
  return (
    <div className="w-1/2 border-r border-r-gray-400 border-opacity-20">
      <table className="w-full border-collapse">
        <thead>
          <tr className="p-4">
            <th className="w-1/3 font-light py-2 border-b border-b-gray-500 border-opacity-30 text-left">
              Name
            </th>
            <th className="w-1/3 font-light py-2 border-b border-b-gray-500 border-opacity-30 text-left">
              Size
            </th>
            <th className="w-1/3 font-light py-2 border-b border-b-gray-500 border-opacity-30 text-left">
              Dimensions
            </th>
          </tr>
        </thead>
        <tbody>
          {images.map((image) => (
            <tr
              onClick={() => {
                onSelect(image.id);
              }}
              key={image.id}
              className={`border-b border-b-gray-400 border-opacity-30 hover:bg-neutral-900 hover:bg-opacity-20 bg-opacity-20 cursor-pointer ${
                selected === image.id ? "bg-neutral-900" : ""
              }`}
            >
              <td className="py-1.5 px-2">{image.name}</td>
              <td>{image.size ? formatBytes(image.size) : "unknown"}</td>
              <td>
                {image.width &&
                  image.height &&
                  `${image.width}x${image.height}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImageList;
