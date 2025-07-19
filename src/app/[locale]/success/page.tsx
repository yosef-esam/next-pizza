'use client'

import React from "react"

function Success(){
    return(
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
            <div className="text-center">
                {/* Animated Success Icon */}
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6 animate-bounce">
                    <svg 
                        className="h-12 w-12 text-green-600 animate-pulse" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="3" 
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Success!
                </h1>
                <p className="text-gray-600">
                    Payment completed successfully
                </p>
            </div>
        </div>
    )
}

export default Success;