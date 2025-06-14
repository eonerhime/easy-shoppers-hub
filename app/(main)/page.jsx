"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 ">
          <div className="relative overflow-hidden rounded-lg shadow-lg ">
            <div className="w-full h-[400px] relative">
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 bg-clip-text text-transparent z-3">
                  Welcome to our Store!
                </h2>
                <p className="text-xl mb-8 text-gray-700 z-4">
                  Discover the latest trends and exclusive deals on your
                  favorite products. Shop now and enjoy a seamless shopping
                  experience!
                </p>
                <Image
                  width={675}
                  height={380}
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Hero Image"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 z-1"
                />
                <Button className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white z-2 cursor-pointer">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900"></div>
          </div>
        )}
      </main>
    </div>
  );
}
