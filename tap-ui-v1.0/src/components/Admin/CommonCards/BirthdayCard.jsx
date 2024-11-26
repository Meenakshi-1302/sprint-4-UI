import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Gift, Cake, Heart, Send } from 'lucide-react';

const BirthdayCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Static birthday data
  const birthdays = [
    {
      name: "Sarah Johnson",
      role: "Product Designer",
      avatar: "https://randomuser.me/api/portraits/men/73.jpg"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      avatar: "https://randomuser.me/api/portraits/men/38.jpg"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    {
      name: "David Kim",
      role: "Data Analyst",
      avatar: "https://randomuser.me/api/portraits/men/17.jpg"
    },
    {
      name: "Lisa Patel",
      role: "UX Researcher",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg"
    }
  ];

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % birthdays.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const navigate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % birthdays.length;
      }
      return (prev - 1 + birthdays.length) % birthdays.length;
    });
  };

  const getCurrentBirthday = () => birthdays[currentIndex];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-lg shadow-md p-4 justify-center">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full transform -translate-x-16 translate-y-16" />
      
      <div className="flex items-center mb-6 space-y-2">
        <Cake className="w-6 h-6 text-white animate-bounce" />
        <h2 className="text-xl font-bold ml-3 text-white">Today's Birthdays</h2>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Previous"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="flex flex-col items-center space-y-4 mr-22 text-center">
          <div className="relative">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md transform -translate-y-1" />
              <img
                src={getCurrentBirthday().avatar}
                alt={`${getCurrentBirthday().name}'s avatar`}
                className="w-32 h-32 rounded-full border-4 border-white mr-22 shadow-xl object-cover relative z-10"
              />
              <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2 z-20">
                <Gift className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="text-white">
            <h3 className="text-xl font-bold">{getCurrentBirthday().name}</h3>
            <p className="text-white/80">{getCurrentBirthday().role}</p>
          </div>

          <button className="px-6 py-2 bg-white rounded-full hover:bg-white/30 transition-colors flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Send Wishes</span>
            <Heart className="w-4 h-4 text-red-300 animate-pulse" />
          </button>
        </div>
        
        <button
          onClick={() => navigate(1)}
          className="p-2 hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Next"
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        
      </div>
    </div>
  );
};

export default BirthdayCard;