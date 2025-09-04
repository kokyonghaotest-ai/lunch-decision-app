import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, DollarSign, Filter, Shuffle, Navigation } from 'lucide-react';

const LunchDecisionApp = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [filters, setFilters] = useState({
    distance: 'all',
    priceLevel: 'all',
    rating: 0,
    cuisine: 'all',
    openNow: true
  });
  const [suggestion, setSuggestion] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock restaurant data (in real implementation, this would come from Google Places API)
  const mockRestaurants = [
    {
      id: '1',
      name: 'Sakura Sushi Bar',
      rating: 4.5,
      priceLevel: 3,
      cuisine: 'Japanese',
      distance: 0.8,
      openNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
      address: '123 Main St',
      cluster: null
    },
    {
      id: '2',
      name: 'Mama Mia Pizzeria',
      rating: 4.2,
      priceLevel: 2,
      cuisine: 'Italian',
      distance: 1.2,
      openNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      address: 'Westfield Shopping Mall, Level 2',
      cluster: 'Westfield Shopping Mall'
    },
    {
      id: '3',
      name: 'Green Garden Cafe',
      rating: 4.7,
      priceLevel: 2,
      cuisine: 'Healthy',
      distance: 0.3,
      openNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      address: '789 Pine Rd',
      cluster: null
    },
    {
      id: '4',
      name: 'Burger Palace',
      rating: 4.0,
      priceLevel: 2,
      cuisine: 'American',
      distance: 1.2,
      openNow: false,
      photoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      address: 'Westfield Shopping Mall, Level 1',
      cluster: 'Westfield Shopping Mall'
    },
    {
      id: '5',
      name: 'Spice Route Indian',
      rating: 4.3,
      priceLevel: 2,
      cuisine: 'Indian',
      distance: 1.8,
      openNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
      address: '654 Cedar Ln',
      cluster: null
    },
    {
      id: '6',
      name: 'Thai Lotus',
      rating: 4.6,
      priceLevel: 2,
      cuisine: 'Thai',
      distance: 1.2,
      openNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1559847844-d939cb0e4e43?w=300&h=200&fit=crop',
      address: 'Westfield Shopping Mall, Level 2',
      cluster: 'Westfield Shopping Mall'
    },
    {
      id: '7',
      name: 'Coffee Bean & Tea',
      rating: 4.1,
      priceLevel: 1,
      cuisine: 'Cafe',
      distance: 1.2,
      openNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
      address: 'Westfield Shopping Mall, Ground Floor',
      cluster: 'Westfield Shopping Mall'
    },
    {
      id: '8',
      name: 'Korean BBQ House',
      rating: 4.4,
      priceLevel: 3,
      cuisine: 'Korean',
      distance: 0.9,
      openNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1554116154-e733de92fe4b?w=300&h=200&fit=crop',
      address: 'Food Street Complex, Shop 12',
      cluster: 'Food Street Complex'
    },
    {
      id: '9',
      name: 'Ramen Ichiban',
      rating: 4.8,
      priceLevel: 2,
      cuisine: 'Japanese',
      distance: 0.9,
      openNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop',
      address: 'Food Street Complex, Shop 8',
      cluster: 'Food Street Complex'
    },
    {
      id: '10',
      name: 'Mediterranean Grill',
      rating: 4.3,
      priceLevel: 2,
      cuisine: 'Mediterranean',
      distance: 0.9,
      openNow: true,
      photoUrl: 'https://images.unsplash.com/photo-1544510808-c4d4bc0845d3?w=300&h=200&fit=crop',
      address: 'Food Street Complex, Shop 15',
      cluster: 'Food Street Complex'
    }
  ];

  useEffect(() => {
    // Simulate getting user location and fetching restaurants
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setRestaurants(mockRestaurants);
        },
        () => {
          // Fallback if geolocation fails
          setRestaurants(mockRestaurants);
        }
      );
    } else {
      setRestaurants(mockRestaurants);
    }
  }, []);

  const getDistanceRange = (distance) => {
    if (distance < 1) return '<1km';
    if (distance < 2) return '1-2km';
    if (distance < 5) return '2-5km';
    return '5km+';
  };

  const getPriceSymbols = (level) => {
    return '$'.repeat(level) + '$'.repeat(Math.max(0, 4 - level)).split('').map((s, i) => 
      i < level ? s : ''
    ).join('');
  };

  const filterRestaurants = () => {
    return restaurants.filter(restaurant => {
      if (filters.openNow && !restaurant.openNow) return false;
      if (filters.rating > 0 && restaurant.rating < filters.rating) return false;
      if (filters.priceLevel !== 'all' && restaurant.priceLevel !== parseInt(filters.priceLevel)) return false;
      if (filters.cuisine !== 'all' && restaurant.cuisine !== filters.cuisine) return false;
      
      if (filters.distance !== 'all') {
        const range = filters.distance;
        if (range === '<1km' && restaurant.distance >= 1) return false;
        if (range === '1-2km' && (restaurant.distance < 1 || restaurant.distance >= 2)) return false;
        if (range === '2-5km' && (restaurant.distance < 2 || restaurant.distance >= 5)) return false;
        if (range === '5km+' && restaurant.distance < 5) return false;
      }
      
      return true;
    });
  };

  const getRandomSuggestion = () => {
    setLoading(true);
    setTimeout(() => {
      const filtered = filterRestaurants();
      if (filtered.length > 0) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        const selectedRestaurant = filtered[randomIndex];
        
        // If restaurant is part of a cluster, suggest the whole cluster
        if (selectedRestaurant.cluster) {
          const clusterRestaurants = filtered.filter(r => r.cluster === selectedRestaurant.cluster);
          setSuggestion({
            type: 'cluster',
            cluster: selectedRestaurant.cluster,
            restaurants: clusterRestaurants,
            distance: selectedRestaurant.distance,
            address: selectedRestaurant.address.split(',')[0] // Just the mall/complex name
          });
        } else {
          setSuggestion({
            type: 'single',
            ...selectedRestaurant
          });
        }
      }
      setLoading(false);
    }, 500); // Simulate API delay
  };

  const cuisineTypes = [...new Set(restaurants.map(r => r.cuisine))];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">🍽️ Lunch Decider</h1>
        <p className="text-orange-100">Let us pick your perfect lunch spot!</p>
      </div>

      {/* Location Status */}
      <div className="p-4 bg-gray-50 flex items-center justify-center text-sm text-gray-600">
        <MapPin className="w-4 h-4 mr-2" />
        {location ? 'Using your current location' : 'Using default location'}
      </div>

      {/* Main Action Button */}
      <div className="p-6">
        <button
          onClick={getRandomSuggestion}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        >
          <Shuffle className="w-6 h-6 mr-3" />
          {loading ? 'Finding your lunch...' : 'Surprise Me!'}
        </button>
      </div>

      {/* Filters Toggle */}
      <div className="px-6 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters ({filterRestaurants().length} restaurants)
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 mx-4 rounded-lg mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <select
                value={filters.distance}
                onChange={(e) => setFilters({...filters, distance: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">Any distance</option>
                <option value="<1km">Less than 1km</option>
                <option value="1-2km">1-2km away</option>
                <option value="2-5km">2-5km away</option>
                <option value="5km+">5km+ away</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
              <select
                value={filters.cuisine}
                onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">Any cuisine</option>
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Level</label>
              <select
                value={filters.priceLevel}
                onChange={(e) => setFilters({...filters, priceLevel: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">Any price</option>
                <option value="1">$ - Inexpensive</option>
                <option value="2">$$ - Moderate</option>
                <option value="3">$$$ - Expensive</option>
                <option value="4">$$$$ - Very Expensive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="0">Any rating</option>
                <option value="4.0">4.0+ stars</option>
                <option value="4.5">4.5+ stars</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="openNow"
                checked={filters.openNow}
                onChange={(e) => setFilters({...filters, openNow: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="openNow" className="text-sm font-medium text-gray-700">
                Open now only
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Suggestion Result */}
      {suggestion && (
        <div className="mx-4 mb-6 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-200">
          {suggestion.type === 'cluster' ? (
            <>
              {/* Cluster Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{suggestion.cluster}</h3>
                    <p className="text-blue-100">{suggestion.restaurants.length} dining options</p>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{getDistanceRange(suggestion.distance)}</span>
                  </div>
                </div>
              </div>
              
              {/* Restaurant Options in Cluster */}
              <div className="p-4">
                <div className="grid gap-3">
                  {suggestion.restaurants.map((restaurant, index) => (
                    <div key={restaurant.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <img
                          src={restaurant.photoUrl}
                          alt={restaurant.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-800">{restaurant.name}</h4>
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              <span className="text-sm">{restaurant.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {restaurant.cuisine}
                            </span>
                            
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <div className="flex items-center">
                                <DollarSign className="w-3 h-3 mr-1" />
                                <span>{getPriceSymbols(restaurant.priceLevel)}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1 text-green-500" />
                                <span className={restaurant.openNow ? 'text-green-600' : 'text-red-600'}>
                                  {restaurant.openNow ? 'Open' : 'Closed'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions to {suggestion.cluster}
                </button>
              </div>
            </>
          ) : (
            <>
              <img
                src={suggestion.photoUrl}
                alt={suggestion.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{suggestion.name}</h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="text-sm font-semibold">{suggestion.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{suggestion.address}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{getDistanceRange(suggestion.distance)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{getPriceSymbols(suggestion.priceLevel)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-green-500" />
                    <span className="text-green-600 font-medium">
                      {suggestion.openNow ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {suggestion.cuisine}
                  </span>
                </div>

                <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm p-4">
        Found {filterRestaurants().length} restaurants nearby
      </div>
    </div>
  );
};

export default LunchDecisionApp;