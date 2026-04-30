import React from "react";
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  MoreVertical,
  MessageCircle,
} from "lucide-react";

const posts = [
  {
    id: 1,
    author: "Li Wei",
    role: "Senior Reservoir Engineer",
    avatar: "https://picsum.photos/seed/li/100/100",
    title:
      "Strategies for handling complex fault modeling in Petrel structural grids",
    content:
      "In my recent project in the Tarim Basin, we encountered significant issues with pillar gridding in highly faulted zones. Here is how we resolved it...",
    tags: ["Petrel", "Modeling"],
    likes: 124,
    comments: 42,
    time: "2 hours ago",
  },
  {
    id: 2,
    author: "Sarah Jenkins",
    role: "Data Scientist",
    avatar: "https://picsum.photos/seed/sarah/100/100",
    title:
      "Python scripting for automated log analysis using the DLISIO library",
    content:
      "Has anyone experimented with the latest dlisio update for handling proprietary vendor formats? I noticed some inconsistencies in well header parsing.",
    tags: ["Python", "Petrophysics"],
    likes: 89,
    comments: 15,
    time: "5 hours ago",
  },
  {
    id: 3,
    author: "Ahmed Hassan",
    role: "Drilling Manager",
    avatar: "https://picsum.photos/seed/ahmed/100/100",
    title: "Real-time torque and drag optimization in extended-reach wells",
    content:
      "The use of Landmark Landmark Compass for torque monitoring has been crucial. We are seeing a 15% reduction in pipe-stuck incidents.",
    tags: ["Drilling", "Landmark"],
    likes: 210,
    comments: 67,
    time: "1 day ago",
  },
];

const CommunityPlaza: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Community Plaza</h1>
        <button className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
          Create Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-orange-200 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full border-2 border-slate-100"
                />
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                    {post.author}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {post.role} • {post.time}
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-700">
              {post.title}
            </h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
              {post.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-slate-500 text-sm font-medium">
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                {post.likes} Likes
              </button>
              <button className="flex items-center gap-2 hover:text-green-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                {post.comments} Comments
              </button>
              <button className="flex items-center gap-2 hover:text-orange-600 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPlaza;
