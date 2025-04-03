import React from 'react';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import ApiOverview from '@/components/api-docs/ApiOverview';
import ApiAuthentication from '@/components/api-docs/ApiAuthentication';
import ApiBaseUrl from '@/components/api-docs/ApiBaseUrl';
import ApiRequestFormat from '@/components/api-docs/ApiRequestFormat';
import ApiResponseFormat from '@/components/api-docs/ApiResponseFormat';
import ApiEndpoints from '@/components/api-docs/ApiEndpoints';
import ApiErrorCodes from '@/components/api-docs/ApiErrorCodes';
import ApiWebhooks from '@/components/api-docs/ApiWebhooks';
import ApiSdks from '@/components/api-docs/ApiSdks';
import ApiSupport from '@/components/api-docs/ApiSupport';
import '@/styles/api-docs.css'; // Import CSS for API docs styling

const ApiDocs: React.FC = () => {
  return (
    <div className="bg-neutral-white min-h-screen flex flex-col">
      <LandingNav />
      {/* Adjusted padding for different screen sizes */}
      <main className="flex-grow pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-7xl mx-auto w-full">
        {/* Adjusted padding for the content container */}
        <div className="mb-8 bg-neutral-white rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-neutral-light/40 shadow-md">
          {/* Adjusted heading size for mobile */}
          {/* Adjusted heading size for mobile */}
          <h1 className="text-3xl sm:text-4xl font-heading text-primary mb-6 sm:mb-8 border-b border-neutral-light pb-3 sm:pb-4">MagicMuse API Documentation</h1>

          {/* All API sections should be within this single container */}
          <ApiOverview />
          <ApiAuthentication />
          <ApiBaseUrl />
          <ApiRequestFormat />
          <ApiResponseFormat />
          <ApiEndpoints />
          <ApiErrorCodes />
          <ApiWebhooks />
          <ApiSdks />
          <ApiSupport />

        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default ApiDocs;
