import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const SubscriptionSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          Manage your subscription plan and billing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-neutral-light/20 p-4 rounded-md mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Current Plan</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold">Premium</h4>
              <p className="text-sm text-neutral-medium">
                $19.99/month, billed monthly
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change Plan
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Plan Features</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Unlimited content generation
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Access to all AI models
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Priority support
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Advanced export options
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Billing Information</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Next billing date</span>
            <span className="text-sm font-medium">April 21, 2025</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">Payment method</span>
            <span className="text-sm font-medium">Visa ending in 4242</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Update Payment Method
            </Button>
            <Button variant="outline" size="sm">
              Billing History
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button variant="danger">Cancel Subscription</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSettings;
