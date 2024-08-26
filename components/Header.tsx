'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Header = ({ children, className }: HeaderProps) => {
  const handleInitializeAndAddTest = async () => {
    try {
      const response = await fetch('/api/initializeAndAddTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Item',
          value: 42
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);
      alert('Database initialized and record added successfully');
    } catch (error) {
      console.error('Error calling API:', error);
      alert('Error initializing database and adding record');
    }
  };

  return (
    <div className={cn("header", className)}>
      <Link href='/' className="md:flex-1">
        <Image 
          src="/assets/icons/logo.svg"
          alt="Logo with name"
          width={120}
          height={32}
          className="hidden md:block"
        />
        <Image 
          src="/assets/icons/logo-icon.svg"
          alt="Logo"
          width={32}
          height={32}
          className="mr-2 md:hidden"
        />
      </Link>
      <Button onClick={handleInitializeAndAddTest} className="mr-4">
        Initialize DB & Add Test
      </Button>
      {children}
    </div>
  )
}

export default Header