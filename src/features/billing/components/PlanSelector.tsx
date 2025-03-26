// src/features/billing/components/PlanSelector.tsx
import React, { useState, useEffect } from 'react';
import { getAvailablePlans, manageSubscription } from '../../../services/billing'; // Placeholder imports
import { DashboardCard } from '../../../components/dashboard'; // Use the card component

// Define expected plan structure (matching service file)
interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export const PlanSelector: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const availablePlans = await getAvailablePlans();
        setPlans(availablePlans);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
        setError('Could not load subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (planId: string) => {
    setProcessingPlanId(planId);
    setError(null);
    try {
        const result = await manageSubscription(planId);
        if (result.checkoutUrl) {
            // Redirect to Stripe Checkout (or handle payment flow)
            console.log('Redirecting to checkout:', result.checkoutUrl);
            window.location.href = result.checkoutUrl;
        } else if (result.message) {
            // Handle success message (e.g., for free plan switch)
            alert(result.message);
            // Potentially refetch current subscription status here
        }
    } catch (err) {
        console.error('Failed to manage subscription:', err);
        setError('An error occurred while selecting the plan. Please try again.');
    } finally {
        setProcessingPlanId(null);
    }
  };

  const formatPrice = (price: number, currency: string, interval: string) => {
    const amount = price / 100; // Assuming price is in cents
    return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount)} / ${interval}`;
  };

  if (loading) {
    return <p className="text-neutral-medium">Loading plans...</p>;
  }

  if (error) {
    return <p className="text-error">{error}</p>;
  }

  return (
    <div className="plan-selector">
      <h2 className="text-xl font-heading text-secondary mb-4">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <DashboardCard key={plan.id} title={plan.name} className="flex flex-col">
            <div className="flex-grow">
              <p className="text-2xl font-semibold text-secondary mb-2">
                {formatPrice(plan.price, plan.currency, plan.interval)}
              </p>
              <ul className="space-y-1 text-sm text-neutral-medium list-disc list-inside mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={processingPlanId === plan.id}
              className="w-full mt-auto py-2 px-4 bg-primary text-neutral-white font-semibold rounded-md shadow-button hover:bg-primary-hover active:bg-primary-active focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingPlanId === plan.id ? 'Processing...' : 'Select Plan'}
            </button>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
};

export default PlanSelector;