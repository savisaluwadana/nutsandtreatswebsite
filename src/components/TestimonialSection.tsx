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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied customers across Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-amber-200" />
              
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-700 italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-sm">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-amber-600">4.8</span>
              <div className="flex ml-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </div>
            <span className="text-gray-600">
              Based on 500+ Google Reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;