import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, ExternalLink } from 'lucide-react';
import { YariProcessModal } from '@/components/sidebar/yari-enterprise-modal';

export default function CTA() {
  return (
    <div className="rounded-2xl bg-base-200 border border-base-300 shadow-lg">
      <div className="p-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-base-content">
            Upgrade to Pro
          </h3>
          <p className="text-xs text-base-content/70">
            Get unlimited access to premium features and enhanced performance.
          </p>
        </div>
        <button className="mt-3 w-full btn btn-primary btn-sm">
          Learn More
        </button>
      </div>
    </div>
  );
}
