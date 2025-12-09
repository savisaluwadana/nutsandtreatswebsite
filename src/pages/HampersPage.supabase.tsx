import React, { useState, useEffect } from 'react';
import { Gift, Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductsByCategory } from '../services/productService';
import { adaptProductsToUIFormat } from '../services/productAdapter';
import { Product } from '../data/products';

interface HampersPageProps {
    onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'hampers' | 'corporate' | 'about' | 'contact', category?: string, productId?: number) => void;
}

const HampersPage: React.FC<HampersPageProps> = ({ onNavigate }) => {
    const { addToCart } = useCart();
    const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({});
    const [hampers, setHampers] = useState<Partial<Product>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHampers = async () => {
            try {
                setLoading(true);
                // Assuming 'gift-boxes' is the category ID for hampers based on schema
                const products = await getProductsByCategory('gift-boxes');
                setHampers(adaptProductsToUIFormat(products));
            } catch (error) {
                console.error('Failed to load hampers', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHampers();
    }, []);

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="relative bg-stone-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.pexels.com/photos/5499126/pexels-photo-5499126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Hampers Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent"></div>
                </div>
                <div className="container mx-auto px-4 py-24 relative z-10 text-center">
                    <Gift className="h-16 w-16 mx-auto mb-6 text-amber-500" strokeWidth={1.5} />
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                        <span className="text-amber-500">Curated</span> Gift Sets
                    </h1>
                    <p className="text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Thoughtfully crafted hampers filled with premium nuts, dried fruits,
                        and healthy treats. The perfect gift for every occasion.
                    </p>
                </div>
            </div>

            {/* Features */}
            <div className="bg-white border-b border-stone-100">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-100">
                        <div className="text-center px-4">
                            <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Gift className="h-8 w-8" />
                            </div>
                            <h3 className="font-serif font-semibold text-stone-900 mb-2">Beautiful Packaging</h3>
                            <p className="text-stone-600 font-light">Elegant gift boxes with premium presentation</p>
                        </div>
                        <div className="text-center px-4">
                            <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="h-8 w-8" />
                            </div>
                            <h3 className="font-serif font-semibold text-stone-900 mb-2">Premium Quality</h3>
                            <p className="text-stone-600 font-light">Only the finest nuts and dry fruits selected</p>
                        </div>
                        <div className="text-center px-4">
                            <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="h-8 w-8" />
                            </div>
                            <h3 className="font-serif font-semibold text-stone-900 mb-2">Custom Messages</h3>
                            <p className="text-stone-600 font-light">Personalize with your special message</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hampers Grid */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <span className="text-amber-700 font-medium tracking-wider uppercase text-sm">Gifting Made Special</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mt-3 mb-6">
                        Our Collection
                    </h2>
                    <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-2 border-stone-200 border-t-amber-700 rounded-full animate-spin"></div>
                    </div>
                ) : hampers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {hampers.map(hamper => (
                            <div key={hamper.id} className="bg-white group rounded-none border border-stone-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                <div className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onNavigate('product', undefined, hamper.id)}>
                                    <img
                                        src={hamper.image}
                                        alt={hamper.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {hamper.weights?.[0]?.originalPrice && (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                            Save {Math.round((1 - (hamper.price || 0) / hamper.weights[0].originalPrice) * 100)}%
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors cursor-pointer" onClick={() => onNavigate('product', undefined, hamper.id)}>
                                        {hamper.name}
                                    </h3>
                                    <p className="text-stone-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                                        {hamper.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-stone-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-stone-500 uppercase tracking-widest">Price</span>
                                                <span className="text-xl font-serif font-bold text-stone-900">
                                                    Rs. {(hamper.price || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex text-amber-500 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(hamper.rating || 5) ? 'fill-current' : 'text-stone-200'}`} />
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                addToCart({
                                                    id: hamper.id || 0,
                                                    name: hamper.name || 'Gift Hamper',
                                                    price: hamper.price || 0,
                                                    weight: 'Hamper',
                                                    image: hamper.image || ''
                                                });
                                                setAddedToCart(prev => ({ ...prev, [hamper.id || 0]: true }));
                                                setTimeout(() => {
                                                    setAddedToCart(prev => ({ ...prev, [hamper.id || 0]: false }));
                                                }, 2000);
                                            }}
                                            className={`w-full py-3 px-4 font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 ${addedToCart[hamper.id || 0]
                                                    ? 'bg-green-700 text-white'
                                                    : 'bg-stone-900 text-white hover:bg-amber-700'
                                                }`}
                                        >
                                            {addedToCart[hamper.id || 0] ? (
                                                <>
                                                    <Check className="h-4 w-4" /> Added
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-stone-500">No hampers found at the moment.</p>
                    </div>
                )}

                {/* Build Your Own Hamper */}
                <div className="mt-20 bg-stone-900 text-white p-12 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-amber-500">
                            Build Your Own Custom Hamper
                        </h3>
                        <p className="text-lg text-stone-300 mb-10 max-w-2xl mx-auto font-light">
                            Create a personalized gift hamper with your choice of products,
                            custom packaging, and personal message. Make it truly yours.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl mb-4 bg-stone-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-stone-700">🛍️</div>
                                <h4 className="font-bold text-white mb-2 uppercase tracking-wide text-sm">Choose Products</h4>
                                <p className="text-stone-400 text-sm">Select from our premium range</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-4 bg-stone-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-stone-700">🎁</div>
                                <h4 className="font-bold text-white mb-2 uppercase tracking-wide text-sm">Custom Packaging</h4>
                                <p className="text-stone-400 text-sm">Choose elegant boxes & ribbons</p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-4 bg-stone-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-stone-700">💌</div>
                                <h4 className="font-bold text-white mb-2 uppercase tracking-wide text-sm">Personal Message</h4>
                                <p className="text-stone-400 text-sm">Add your heartfelt note</p>
                            </div>
                        </div>

                        <button
                            onClick={() => onNavigate('category', 'all')}
                            className="bg-amber-600 text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-amber-700 transition-all hover:scale-105"
                        >
                            Start Building Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HampersPage;
