import React, { useState, useEffect } from 'react';
 
const Loader = ({ onLoadingComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
 
  const steps = [
    "Scanning credentials...",
    "Validating access...",
    "Otp is being Generated...",
    "Almost there..."
  ];
 
  useEffect(() => {
    // Progress through steps
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setFadeOut(true);
        clearInterval(stepInterval);
       
       
        setTimeout(() => {
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        }, 1000);
      }
    }, 1200);
 
    return () => clearInterval(stepInterval);
  }, [currentStep, onLoadingComplete]);
 
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-[#97247E] to-[#E01950] transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative w-64 h-64">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-8 border-white/30 rounded-full">
          <div className="absolute top-0 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>
       
        {/* Inner spinning circles */}
        <div className="absolute inset-4 border-4 border-white/40 rounded-full animate-spin">
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
       
        {/* Center pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
        </div>
 
        {/* Animated text below */}
        <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-64 text-center">
          <div className="h-6">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`absolute w-full text-white font-medium transition-all duration-500 transform
                  ${index === currentStep ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
              >
                {step}
              </div>
            ))}
          </div>
         
          {/* Progress bar */}
          <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
 
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-float"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 30}deg) translateY(-32px)`,
                animation: `float 3s infinite ${i * 0.25}s`
              }}
            />
          ))}
        </div>
      </div>
 
      {/* Company tagline */}
      <div className="absolute bottom-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Talent Acquisition Platform</h2>
        <p className="text-white/80">Creating path ways for the right talent to shine.</p>
      </div>
    </div>
  );
};
 
// Add required keyframes for the animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: rotate(var(--rotation)) translateY(-32px) scale(1);
      opacity: 0.5;
    }
    50% {
      transform: rotate(var(--rotation)) translateY(-48px) scale(1.2);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
 
export default Loader;