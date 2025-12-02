import { stories, currentUser } from "@/data/mockData";
import StoryCircle from "./StoryCircle";

const StoriesBar = () => {
  return (
    <div className="bg-background border-b border-border md:border md:rounded-lg md:mb-4">
      <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide">
        {/* Own Story */}
        <StoryCircle
          isOwn
          story={{
            id: "own",
            user: currentUser,
            image: "",
            timestamp: new Date(),
            isViewed: false,
          }}
        />
        
        {/* Other Stories */}
        {stories.map((story) => (
          <StoryCircle key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;

