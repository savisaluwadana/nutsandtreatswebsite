import React, { useState } from 'react';
import { Building2, Users, Package, Award, Mail, Phone, MapPin, Star, CheckCircle } from 'lucide-react';

interface CorporatePageProps {
  onNavigate: (page: 'home' | 'cart' | 'checkout') => void;
}

const CorporatePage: React.FC<CorporatePageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    budget: '',
    deliveryDate: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Corporate enquiry submitted:', formData);
    alert('Thank you for your enquiry! We will contact you within 24 hours.');
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      productType: '',
      quantity: '',
      budget: '',
      deliveryDate: '',
      message: ''
    });
  };

  const benefits = [
    {
      icon: Package,
      title: 'Bulk Pricing',
      description: 'Special wholesale rates for large orders with significant savings'
    },
    {
      icon: Users,
      title: 'Account Management',
      description: 'Dedicated account manager for personalized service and support'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Consistently high-quality products with quality assurance'
    },
    {
      icon: Building2,
      title: 'Custom Packaging',
      description: 'Branded packaging options and custom gift sets available'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      company: 'TechCorp Solutions',
      role: 'Procurement Manager',
      content: 'Nuts N Treats has been our go-to supplier for employee gifts. Their quality and service are exceptional.',
      rating: 5
    },
    {
      name: 'Priya Fernando',
      company: 'Ceylon Hotels',
      role: 'Events Coordinator',
      content: 'Perfect for our corporate events. Fast delivery and beautiful presentation.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      company: 'Global Foods Ltd',
      role: 'Operations Director',
      content: 'Reliable supplier with consistent quality. Highly recommend for bulk orders.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-orange-200 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-300 rounded-full"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <Building2 className="h-20 w-20 mx-auto mb-6 text-amber-600 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Corporate & Bulk Orders
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Premium nuts and dry fruits for your business needs. 
              Special pricing, custom packaging, and dedicated support for enterprises.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <span className="text-amber-600 font-semibold">✓ Wholesale Pricing</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <span className="text-amber-600 font-semibold">✓ Custom Branding</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <span className="text-amber-600 font-semibold">✓ Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us for Corporate Orders?
            </h2>
            <p className="text-lg text-gray-600">
              We understand the unique needs of businesses and corporate clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-4 hover:bg-amber-200 transition-colors">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Corporate Clients Say
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by businesses across Sri Lanka for quality and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-amber-600">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services & Use Cases */}
      <div className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Employee Gifts & Rewards
              </h3>
              <p className="text-gray-600">
                Show appreciation to your team with healthy, premium gift hampers for festivals, achievements, or wellness programs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Client Appreciation
              </h3>
              <p className="text-gray-600">
                Strengthen business relationships with elegant gift sets that leave a lasting impression on your valued clients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Office Pantry Supply
              </h3>
              <p className="text-gray-600">
                Stock your office pantry with healthy snacks that keep your employees energized and productive throughout the day.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Event Catering
              </h3>
              <p className="text-gray-600">
                Premium nuts and dry fruits for corporate events, meetings, conferences, and special occasions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Retail Partnership
              </h3>
              <p className="text-gray-600">
                Wholesale supply for retail stores, cafes, restaurants, and hospitality businesses across Sri Lanka.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Custom Requirements
              </h3>
              <p className="text-gray-600">
                Special packaging, private labeling, and custom product mixes tailored to your specific business needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Form */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get a Custom Quote
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and our team will get back to you with a personalized quote within 24 hours
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type
                      </label>
                      <select
                        name="productType"
                        value={formData.productType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Select product type</option>
                        <option value="nuts">Nuts</option>
                        <option value="dry-fruits">Dry Fruits</option>
                        <option value="seeds">Seeds</option>
                        <option value="herbs">Herbs & Spices</option>
                        <option value="mixed">Mixed Assortment</option>
                        <option value="hampers">Gift Hampers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Quantity
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="e.g., 100 kg, 500 units"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-50k">Under Rs. 50,000</option>
                        <option value="50k-100k">Rs. 50,000 - 100,000</option>
                        <option value="100k-500k">Rs. 100,000 - 500,000</option>
                        <option value="500k-1m">Rs. 500,000 - 1,000,000</option>
                        <option value="over-1m">Over Rs. 1,000,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Required Delivery Date
                      </label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Requirements
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us about your specific requirements, custom packaging needs, branding, or any other details..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                  >
                    Submit Enquiry
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Direct Contact
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Prefer to speak directly? Our corporate sales team is ready to assist you with personalized quotes and solutions.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-amber-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Corporate Sales</p>
                        <p className="text-gray-600">+94 11 234 5678 (Ext. 101)</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-amber-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">corporate@nutsntreatslk.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-amber-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Office</p>
                        <p className="text-gray-600">Colombo 03, Sri Lanka</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      We'll review your requirements within 24 hours
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      Our team will prepare a customized quote
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      Schedule a call to discuss your needs in detail
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      Finalize terms and place your order
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <button 
                    onClick={() => onNavigate('home')}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    ← Browse Our Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporatePage;