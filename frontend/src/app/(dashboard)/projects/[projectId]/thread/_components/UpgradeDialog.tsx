import React from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Clock, Crown, Sparkles, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: () => void;
}

export function UpgradeDialog({ open, onOpenChange, onDismiss }: UpgradeDialogProps) {
  const router = useRouter();

  const handleUpgradeClick = () => {
    router.push('/settings/billing');
    onOpenChange(false);
    localStorage.setItem('yari_upgrade_dialog_displayed', 'true');
  };

  const handleDismiss = () => {
    localStorage.setItem('yari_upgrade_dialog_displayed', 'true');
    onDismiss();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()} className="sm:max-w-md bg-base-100 border-base-300">
        <DialogHeader>
          <DialogTitle className="flex items-center text-base-content">
            <Crown className="h-5 w-5 mr-2 text-primary" />
            Unlock the Full Yari Experience
          </DialogTitle>
          <DialogDescription className="text-base-content/70 leading-relaxed">
            You're currently using Yari's free tier with limited capabilities.
            Upgrade to unlock unlimited tool usage, advanced AI models, and priority support.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-sm font-medium text-base-content/60 mb-3 uppercase tracking-wide">Pro Benefits</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 flex-shrink-0 mt-0.5 border border-primary/20">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-base-content">Advanced AI Models</h4>
                <p className="text-xs text-base-content/60 leading-relaxed">Get access to advanced models suited for complex tasks</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary/10 p-2 flex-shrink-0 mt-0.5 border border-secondary/20">
                <Zap className="h-4 w-4 text-secondary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-base-content">Faster Responses</h4>
                <p className="text-xs text-base-content/60 leading-relaxed">Get access to faster models that breeze through your tasks</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-accent/10 p-2 flex-shrink-0 mt-0.5 border border-accent/20">
                <Clock className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-base-content">Higher Usage Limits</h4>
                <p className="text-xs text-base-content/60 leading-relaxed">Enjoy more conversations and longer run durations</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleDismiss} className="border-base-300 text-base-content hover:bg-base-200">
            Maybe Later
          </Button>
          <Button onClick={handleUpgradeClick} className="bg-primary hover:bg-primary/90 text-primary-content">
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 