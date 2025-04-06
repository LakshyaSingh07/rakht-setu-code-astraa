import React, { useState } from 'react';

const FAQ = () => {
  // FAQ data with questions and answers about blood donation
  const faqData = [
    {
      question: 'Who can donate blood?',
      answer: 'Most healthy adults who are at least 17 years old, weigh at least 110 pounds, and are in good health can donate blood. Eligibility requirements may vary based on local regulations.'
    },
    {
      question: 'How often can I donate blood?',
      answer: 'You can donate whole blood every 56 days (8 weeks). Plasma can be donated more frequently, as often as twice a week, while platelets can be donated every 7 days up to 24 times a year.'
    },
    {
      question: 'Is blood donation safe?',
      answer: 'Yes, blood donation is very safe. All equipment used for blood donation is sterile and used only once. There is no risk of contracting any disease by donating blood.'
    },
    {
      question: 'How long does a blood donation take?',
      answer: 'The actual blood donation takes about 8-10 minutes. However, the entire process, including registration, mini-physical, and refreshments after donation, takes about 45 minutes to an hour.'
    },
    {
      question: 'What should I do before donating blood?',
      answer: 'Before donating blood, make sure to eat a healthy meal, drink plenty of fluids, get a good night\'s sleep, and bring a valid ID. Avoid fatty foods and alcohol before donation.'
    },
    {
      question: 'What blood types are most needed?',
      answer: 'All blood types are needed, but O negative blood is in high demand as it\'s the universal donor type that can be given to anyone in an emergency. AB positive individuals are universal recipients.'
    }
  ];

  // State to track which FAQ item is currently expanded
  const [activeIndex, setActiveIndex] = useState(null);

  // Toggle function to expand/collapse FAQ items
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-500">
            Common questions about blood donation and how you can help save lives.
          </p>
        </div>

        <div className="mt-10">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <span className="ml-6">
                  <svg
                    className={`h-6 w-6 transform ${activeIndex === index ? 'rotate-180' : 'rotate-0'} text-red-600 transition-transform duration-200 ease-in-out`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-96 pb-4' : 'max-h-0'}`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600">Still have questions?</p>
          <a href="/contact" className="mt-2 inline-block text-red-600 hover:text-red-800 font-medium">
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;