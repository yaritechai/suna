'use client';

import React from 'react';
import { ThemeSelector } from '@/components/ui/theme-selector';

export default function ThemesPage() {
  return (
    <div className="container mx-auto px-6 py-8 bg-base-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-base-content">Themes</h1>
              <p className="text-base-content/70 mt-2">
                Choose from 38+ beautiful DaisyUI themes to customize your experience
              </p>
            </div>
            <ThemeSelector variant="button" size="default" />
          </div>
        </div>

        {/* Theme Demo Components */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Buttons Card */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content">Buttons</h2>
              <p className="text-base-content/70 text-sm mb-4">
                Various button styles with theme colors
              </p>
              <div className="card-actions flex-col space-y-3">
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary">Primary</button>
                  <button className="btn btn-secondary">Secondary</button>
                  <button className="btn btn-accent">Accent</button>
                </div>
              <div className="flex flex-wrap gap-2">
                  <button className="btn btn-outline btn-primary btn-sm">Outline</button>
                  <button className="btn btn-ghost btn-sm">Ghost</button>
                  <button className="btn btn-soft btn-primary btn-sm">Soft</button>
              </div>
              <div className="flex flex-wrap gap-2">
                  <button className="btn btn-success btn-sm">Success</button>
                  <button className="btn btn-warning btn-sm">Warning</button>
                  <button className="btn btn-error btn-sm">Error</button>
                </div>
              </div>
            </div>
          </div>

          {/* Cards & Surfaces */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content">Cards & Surfaces</h2>
              <p className="text-base-content/70 text-sm mb-4">
                Content containers with theme backgrounds
              </p>
              <div className="space-y-3">
              <div className="bg-base-100 p-3 rounded-lg border border-base-300">
                <h4 className="font-medium text-base-content">Base-100</h4>
                <p className="text-sm text-base-content/70">Main background</p>
              </div>
              <div className="bg-base-300 p-3 rounded-lg">
                <h4 className="font-medium text-base-content">Base-300</h4>
                <p className="text-sm text-base-content/70">Elevated surface</p>
              </div>
              </div>
            </div>
          </div>

          {/* Badges & Status */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content">Badges & Status</h2>
              <p className="text-base-content/70 text-sm mb-4">
                Status indicators and labels
              </p>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-primary">Primary</span>
                  <span className="badge badge-secondary">Secondary</span>
                  <span className="badge badge-accent">Accent</span>
                </div>
              <div className="flex flex-wrap gap-2">
                  <span className="badge badge-success">Success</span>
                  <span className="badge badge-warning">Warning</span>
                  <span className="badge badge-error">Error</span>
              </div>
              <div className="flex flex-wrap gap-2">
                  <span className="badge badge-outline">Outline</span>
                  <span className="badge badge-soft badge-primary">Soft</span>
                  <span className="badge badge-ghost">Ghost</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Elements */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content">Form Elements</h2>
              <p className="text-base-content/70 text-sm mb-4">
                Inputs and form controls
              </p>
              <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Primary input" 
                className="input input-bordered input-primary w-full" 
              />
              <input 
                type="text" 
                placeholder="Secondary input" 
                className="input input-bordered input-secondary w-full" 
              />
              <select className="select select-bordered w-full">
                <option disabled selected>Theme selector</option>
                <option>Light Theme</option>
                <option>Dark Theme</option>
                <option>Custom Theme</option>
              </select>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="checkbox checkbox-primary" />
                    <span className="text-sm text-base-content">Primary checkbox</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="demo-radio" className="radio radio-secondary" />
                    <span className="text-sm text-base-content">Radio option</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Progress & Loading */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content">Progress & Loading</h2>
              <p className="text-base-content/70 text-sm mb-4">
                Progress indicators and states
              </p>
              <div className="space-y-3">
              <progress className="progress progress-primary w-full" value="70" max="100"></progress>
              <progress className="progress progress-secondary w-full" value="45" max="100"></progress>
              <progress className="progress progress-accent w-full" value="25" max="100"></progress>
                <div className="flex justify-center gap-4">
                <span className="loading loading-spinner loading-primary loading-md"></span>
                  <span className="loading loading-dots loading-secondary loading-md"></span>
                  <span className="loading loading-ring loading-accent loading-md"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Components */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content">Chat Components</h2>
              <p className="text-base-content/70 text-sm mb-4">
                Messaging and conversation UI
              </p>
              <div className="space-y-3">
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-primary">
                  Hello! How can I help you today?
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble chat-bubble-secondary">
                  I'd like to try different themes!
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Navigation & Menu */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content">Navigation & Menu</h2>
              <p className="text-base-content/70 text-sm mb-4">
                Menu and navigation components
              </p>
              <ul className="menu bg-base-100 rounded-box w-full">
                <li><a className="menu-active">Active Item</a></li>
                <li><a>Menu Item</a></li>
                <li><a>Another Item</a></li>
                <li><a className="menu-disabled">Disabled Item</a></li>
              </ul>
            </div>
          </div>

          {/* Alerts & Messages */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content">Alerts & Messages</h2>
              <p className="text-base-content/70 text-sm mb-4">
                Status messages and notifications
              </p>
              <div className="space-y-2">
                <div role="alert" className="alert alert-success">
                  <span className="text-sm">Success! Your changes have been saved.</span>
                </div>
                <div role="alert" className="alert alert-warning">
                  <span className="text-sm">Warning! Please check your input.</span>
                </div>
                <div role="alert" className="alert alert-error">
                  <span className="text-sm">Error! Something went wrong.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-base-content">Tables</h2>
              <p className="text-base-content/70 text-sm mb-4">
                Data display in tabular format
              </p>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Primary</td>
                      <td><span className="badge badge-primary badge-sm">Active</span></td>
                      <td>100%</td>
                    </tr>
                    <tr>
                      <td>Secondary</td>
                      <td><span className="badge badge-secondary badge-sm">Active</span></td>
                      <td>85%</td>
                    </tr>
                    <tr>
                      <td>Accent</td>
                      <td><span className="badge badge-accent badge-sm">Active</span></td>
                      <td>92%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Information */}
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-base-content">About DaisyUI Themes</h2>
            <p className="text-base-content/70 mb-6">
              Understanding the semantic color system
            </p>
            <div>
              <h3 className="font-semibold text-base-content mb-2">Semantic Color System</h3>
              <p className="text-base-content/70 text-sm mb-4">
                DaisyUI uses semantic color names that automatically adapt to any theme:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-6">
                <div className="bg-primary text-primary-content p-2 rounded">primary</div>
                <div className="bg-secondary text-secondary-content p-2 rounded">secondary</div>
                <div className="bg-accent text-accent-content p-2 rounded">accent</div>
                <div className="bg-neutral text-neutral-content p-2 rounded">neutral</div>
                <div className="bg-base-100 text-base-content p-2 rounded border border-base-300">base-100</div>
                <div className="bg-base-200 text-base-content p-2 rounded">base-200</div>
                <div className="bg-base-300 text-base-content p-2 rounded">base-300</div>
                <div className="bg-info text-info-content p-2 rounded">info</div>
                <div className="bg-success text-success-content p-2 rounded">success</div>
                <div className="bg-warning text-warning-content p-2 rounded">warning</div>
                <div className="bg-error text-error-content p-2 rounded">error</div>
              </div>
              
              <h3 className="font-semibold text-base-content mb-2">Theme Benefits</h3>
              <ul className="list-disc list-inside text-base-content/70 text-sm space-y-1">
                <li>Automatic color adaptation across all themes</li>
                <li>Consistent contrast ratios for accessibility</li>
                <li>No need for dark mode variants - just works</li>
                <li>Semantic naming makes code more maintainable</li>
                <li>38+ built-in themes available</li>
              </ul>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
} 