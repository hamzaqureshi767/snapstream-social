import { useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SearchInput from "@/components/search/SearchInput";
import UserSearchResult from "@/components/search/UserSearchResult";
import { users, posts } from "@/data/mockData";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerQuery) ||
        user.fullName.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return (
    <MainLayout showHeader={false}>
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="sticky top-0 z-40 bg-background p-4 md:pt-8">
          <h1 className="hidden md:block text-xl font-semibold mb-6">Search</h1>
          <SearchInput value={query} onChange={setQuery} />
        </div>

        {/* Results */}
        {query ? (
          <div className="px-4 pb-4">
            {filteredUsers.length > 0 ? (
              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <UserSearchResult key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
          </div>
        ) : (
          /* Explore Grid */
          <div className="grid grid-cols-3 gap-0.5">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="relative aspect-square group"
              >
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Search;
