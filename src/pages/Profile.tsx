import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileGrid from "@/components/profile/ProfileGrid";
import { currentUser, users, posts } from "@/data/mockData";

const Profile = () => {
  const { username } = useParams();
  
  const isOwnProfile = !username || username === currentUser.username;
  const user = isOwnProfile
    ? currentUser
    : users.find((u) => u.username === username) || currentUser;

  const userPosts = posts.filter((p) => p.user.id === user.id);

  return (
    <MainLayout showHeader={false}>
      <div className="max-w-4xl mx-auto">
        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
        <ProfileGrid posts={isOwnProfile ? posts.slice(0, 3) : userPosts} />
      </div>
    </MainLayout>
  );
};

export default Profile;
