"use client"

import { useState } from 'react'
import { Beaker, Briefcase, Users, Zap, ExternalLink } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { WaitlistPopup } from "@/components/popups/waitlist-popup"
import { HiringPopup } from "@/components/popups/hiring-popup"

export function MartyLabsNavbar() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [hiringOpen, setHiringOpen] = useState(false)

  const handleCalendlyClick = () => {
    window.open(
      'https://calendly.com/martymartincalls/discovery?utm_source=website&utm_medium=website_navbar&utm_campaign=website_book_call_marty_martin',
      '_blank'
    );
  };

  const navItems = [
    { 
      name: 'Home', 
      url: '/', 
      icon: Beaker
    },
    { 
      name: 'Commission Work', 
      url: '#commission', 
      icon: Briefcase,
      onClick: handleCalendlyClick
    },
    { 
      name: 'Hiring', 
      url: '#hiring', 
      icon: Users,
      onClick: () => setHiringOpen(true)
    },
    { 
      name: 'Beta', 
      url: '/producer-agent', 
      icon: Zap
    }
  ]

  return (
    <>
      <NavBar 
        items={navItems} 
        className="backdrop-blur-xl"
      />
      
      {/* Popups */}
      <WaitlistPopup isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      <HiringPopup isOpen={hiringOpen} onClose={() => setHiringOpen(false)} />
    </>
  )
}