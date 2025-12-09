import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Fernando',
      location: 'Colombo',
      rating: 5,
      text: 'Amazing quality cashews! They arrived vacuum-packed and so fresh. Will definitely order again.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    {
      name: 'Rajesh Kumar',
      location: 'Kandy',
      rating: 5,
      text: 'Best dry fruits I\'ve found in Sri Lanka. Fast delivery and excellent customer service.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    {
      name: 'Priya Jayasinghe',
      location: 'Galle',
      rating: 5,
      text: 'Love their organic turmeric powder. Pure quality and great packaging. Highly recommended!',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers across Sri Lanka enjoying premium quality products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-gray-100 hover:border-amber-200 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Quote icon with animation */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
              <Quote className="absolute top-6 right-6 h-12 w-12 text-amber-300 group-hover:text-amber-400 transition-colors duration-300" />
              
              {/* User info */}
              <div className="flex items-center mb-6 relative z-10">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    📍 {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Star rating */}
              <div className="flex items-center mb-4 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-gray-700 leading-relaxed relative z-10 text-lg">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Rating badge with modern design */}
        <div className="mt-16 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative bg-white rounded-2xl px-10 py-6 shadow-2xl border border-amber-200">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    4.8
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-semibold">
                      Based on 500+ Reviews
                    </span>
                  </div>
                </div>
                <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-gray-900">10,000+</div>
                  <div className="text-sm text-gray-600">Verified Purchases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;