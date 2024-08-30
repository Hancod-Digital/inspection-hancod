import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Main Layout Component
export default function LoginPage({ children }) {
  return (
    <div className="flex h-screen">
      <div className="flex w-1/2 flex-col justify-center p-32">
        <div className="mb-8 flex items-center">
          <img src="/images/logo.svg" alt="" />
        </div>
        <h1 className="mb-6 text-3xl font-bold">Welcome Back!</h1>
        <p className="mb-6 text-gray-600">
          Access your personalized dashboard by entering your credentials below.
          We{"'"} re excited to have you back with us!
        </p>
        {children}
      </div>
      <div className="relative w-1/2">
        <img
          alt="Construction workers reviewing plans"
          className="object-cover h-full w-full"
          src="/images/login/hero.svg"
        />
      </div>
    </div>
  );
}

// Separate Form Component


