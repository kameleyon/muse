import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showAPI, setShowAPI] = useState(false);

  const subscriptionPlans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Basic access for personal projects',
      features: [
        '5,000 words per month',
        'Basic templates',
        'Standard AI model',
        'Email support',
        '1 user'
      ],
      cta: 'Sign Up Free',
      highlighted: false
    },
    {
      name: 'Professional',
      monthlyPrice: 29,
      annualPrice: 290, // ~20% savings
      description: 'Ideal for freelancers and content creators',
      features: [
        '50,000 words per month',
        'All templates',
        'Advanced AI models',
        'Priority support',
        '1 user',
        'Analytics dashboard',
        'Content library'
      ],
      cta: 'Start Pro Plan',
      highlighted: true
    },
    {
      name: 'Team',
      monthlyPrice: 79,
      annualPrice: 790, // ~20% savings
      description: 'Perfect for teams and businesses',
      features: [
        'Unlimited words',
        'All templates',
        'Premium AI models',
        '24/7 support',
        'Up to 5 users',
        'Advanced analytics',
        'Content library',
        'Team collaboration',
        'Custom branding'
      ],
      cta: 'Start Team Plan',
      highlighted: false
    }
  ];

  const apiPlans = [
    {
      name: 'API Starter',
      monthlyPrice: 49,
      annualPrice: 490,
      description: 'For developers building applications',
      features: [
        '100,000 API calls/month',
        'Standard rate limiting',
        'REST API access',
        'Developer support',
        'API documentation',
        'Sandbox environment'
      ],
      cta: 'Get API Access',
      highlighted: false
    },
    {
      name: 'API Business',
      monthlyPrice: 199,
      annualPrice: 1990,
      description: 'For growing businesses and applications',
      features: [
        '500,000 API calls/month',
        'Higher rate limits',
        'REST & GraphQL API access',
        'Priority developer support',
        'Advanced analytics',
        'Multiple API keys',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      highlighted: true
    },
    {
      name: 'API Enterprise',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      description: 'For large-scale implementations',
      features: [
        'Custom API call volume',
        'Customized rate limits',
        'All API endpoints',
        '24/7 premium support',
        'SLA guarantees',
        'On-premise deployment options',
        'Custom integration support'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  const plans = showAPI ? apiPlans : subscriptionPlans;

  return (
    <section id="prices" className="py-20 bg-neutral-white dark:bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-heading font-light text-secondary dark:text-primary mb-4"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-neutral-medium max-w-2xl mx-auto mb-8"
          >
            Select the perfect plan for your content needs
          </motion.p>
          
          {/* Plan type toggle */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 mb-8">
            <div className="flex justify-center bg-neutral-light/20 dark:bg-secondary-hover border dark:border-neutral-medium/30 p-1 rounded-xl">
              <button
                onClick={() => setShowAPI(false)}
                className={`py-2 px-4 rounded-xl transition-colors ${
                  !showAPI 
                    ? 'bg-white dark:bg-secondary  text-secondary dark:text-primary' 
                    : 'text-neutral-medium hover:text-secondary dark:hover:text-primary'
                }`}
              >
                Subscription Plans
              </button>
              <button
                onClick={() => setShowAPI(true)}
                className={`py-2 px-4 rounded-xl transition-colors ${
                  showAPI 
                    ? 'bg-white dark:bg-secondary text-secondary dark:text-primary' 
                    : 'text-neutral-medium hover:text-secondary dark:hover:text-primary'
                }`}
              >
                API Plans
              </button>
            </div>
          </div>
          
          {/* Billing toggle */}
          <div className="flex justify-center items-center space-x-4 mb-12">
            <span className={`text-md ${!isAnnual ? 'text-secondary dark:text-primary font-medium' : 'text-neutral-medium'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-neutral-light/50 dark:bg-black/80 border dark:border-neutral-medium/30"
            >
              <span className="sr-only">Toggle billing period</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-md ${isAnnual ? 'text-secondary dark:text-primary font-medium' : 'text-neutral-medium'}`}>
              Annual <span className="text-sm text-success">Save 20%</span>
            </span>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`
                rounded-xl shadow-sm shadow-black/30 overflow-hidden relative 
                ${plan.highlighted 
                  ? 'bg-[#bcb7af]/40 text-[#3d3d3a] border-2 border-neutral-medium/10 transform -translate-y-4 md:scale-105' 
                  : 'bg-white dark:bg-secondary-hover text-secondary  border border-neutral-medium/30'
                }
              `}
            >
              {plan.highlighted && (
                <div className="bg-white text-secondary shadow-sm text-sm font-bold py-1 px-4 absolute top-0 right-0 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              <div className="p-6">
                <h3 className={`text-2xl font-heading font-light mb-2 ${plan.highlighted ? 'text-primary' : 'text-secondary dark:text-primary'}`}>
                  {plan.name}
                </h3>
                <p className="text-neutral-medium text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-heading ${plan.highlighted ? 'text-primary' : 'text-secondary dark:text-primary'}`}>
                    {typeof plan.monthlyPrice === 'number' 
                      ? `$${isAnnual ? plan.annualPrice : plan.monthlyPrice}` 
                      : plan.monthlyPrice}
                  </span>
                  {typeof plan.monthlyPrice === 'number' && (
                    <span className="text-neutral-medium text-sm">
                      {isAnnual ? '/year' : '/month'}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <Check size={18} className="text-success flex-shrink-0 mt-0.5 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth/register">
                  <Button 
                    fullWidth 
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className={plan.highlighted ? 'bg-primary/90 text-white/80 font-regular rounded-xl' : 'border-primary font-regular text-primary rounded-xl'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;