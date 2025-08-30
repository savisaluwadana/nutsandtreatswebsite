import React from 'react';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const blogPosts = [
    {
      id: 1,
      title: "The Health Benefits of Almonds: Nature's Perfect Snack",
      excerpt: "Discover why almonds are considered one of the healthiest nuts, packed with essential nutrients and antioxidants that support heart health and brain function.",
      author: "Dr. Sarah Johnson",
      date: "August 25, 2025",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/1446318/pexels-photo-1446318.jpeg",
      category: "Health & Nutrition"
    },
    {
      id: 2,
      title: "From Farm to Table: Our Journey with Premium Cashews",
      excerpt: "Learn about our sustainable farming practices and the journey our cashews take from the lush farms of Kerala to your doorstep.",
      author: "Michael Chen",
      date: "August 20, 2025",
      readTime: "7 min read",
      image: "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg",
      category: "Our Story"
    },
    {
      id: 3,
      title: "Creative Ways to Use Dried Fruits in Your Cooking",
      excerpt: "Explore delicious recipes and creative ideas for incorporating dried fruits into your meals, from breakfast bowls to gourmet desserts.",
      author: "Emma Rodriguez",
      date: "August 15, 2025",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg",
      category: "Recipes"
    },
    {
      id: 4,
      title: "The Rise of Superfoods: Why Seeds Are Essential",
      excerpt: "Understanding the nutritional powerhouse that seeds provide and how they can enhance your daily diet with omega-3s and essential minerals.",
      author: "Dr. James Wilson",
      date: "August 10, 2025",
      readTime: "4 min read",
      image: "https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg",
      category: "Health & Nutrition"
    },
    {
      id: 5,
      title: "Sustainable Packaging: Our Commitment to the Environment",
      excerpt: "How we're revolutionizing nut packaging with eco-friendly materials and reducing our carbon footprint one package at a time.",
      author: "Lisa Park",
      date: "August 5, 2025",
      readTime: "8 min read",
      image: "https://images.pexels.com/photos/1024240/pexels-photo-1024240.jpeg",
      category: "Sustainability"
    },
    {
      id: 6,
      title: "Seasonal Gift Hampers: Perfect for Every Occasion",
      excerpt: "Discover our curated selection of seasonal hampers, perfect for holidays, birthdays, or just to show someone you care.",
      author: "Rachel Thompson",
      date: "July 30, 2025",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/1327374/pexels-photo-1327374.jpeg",
      category: "Gift Ideas"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('home')} 
              className="text-gray-600 hover:text-amber-600 mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Our Blog</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Nuts & Treats Insights</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover the world of healthy snacking, sustainable practices, and delicious recipes from our experts.
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
                <button className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-amber-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for the latest health tips, recipes, and exclusive offers.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;