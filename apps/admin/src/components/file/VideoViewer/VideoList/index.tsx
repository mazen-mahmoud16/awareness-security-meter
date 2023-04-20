import { Image, Video } from "../../../../api/content";
import { formatBytes, seconds2time } from "../../../../utils/parse";

const VideoList: React.FC<{
  videos: Video[];
  onSelect(id?: string): void;
  selected?: string;
}> = ({ videos, onSelect, selected }) => {
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
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr
              onClick={() => {
                onSelect(video.id);
              }}
              key={video.id}
              className={`border-b border-b-gray-400 border-opacity-30 hover:bg-neutral-900 hover:bg-opacity-20 bg-opacity-20 cursor-pointer ${
                selected === video.id ? "bg-neutral-900" : ""
              }`}
            >
              <td className="py-1.5 px-2">{video.name}</td>
              <td>{video.size ? formatBytes(video.size) : "unknown"}</td>
              <td>{seconds2time(Math.round(video.duration || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoList;
