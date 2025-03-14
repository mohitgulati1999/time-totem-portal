
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<'admin' | 'member' | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">RFID Attendance System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Simplified time tracking and membership management for your daycare facility
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
          variants={itemVariants}
        >
          <motion.div
            className={`glass-card rounded-xl p-8 flex flex-col items-center transition-all duration-300 hover:shadow-lg cursor-pointer ${
              hoveredRole === 'admin' ? 'border-primary' : 'border'
            }`}
            whileHover={{ y: -8, scale: 1.02 }}
            onHoverStart={() => setHoveredRole('admin')}
            onHoverEnd={() => setHoveredRole(null)}
            onClick={() => navigate('/admin')}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
              hoveredRole === 'admin' ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <UserCog className={`h-10 w-10 ${
                hoveredRole === 'admin' ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Administrator</h2>
            <p className="text-muted-foreground text-center mb-6">
              Manage users, track attendance, and view facility usage analytics
            </p>
            <Button 
              className={`mt-auto ${hoveredRole === 'admin' ? 'btn-primary' : 'btn-outline'}`} 
              onClick={() => navigate('/admin')}
            >
              Enter as Admin
            </Button>
          </motion.div>
          
          <motion.div
            className={`glass-card rounded-xl p-8 flex flex-col items-center transition-all duration-300 hover:shadow-lg cursor-pointer ${
              hoveredRole === 'member' ? 'border-primary' : 'border'
            }`}
            whileHover={{ y: -8, scale: 1.02 }}
            onHoverStart={() => setHoveredRole('member')}
            onHoverEnd={() => setHoveredRole(null)}
            onClick={() => navigate('/member')}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
              hoveredRole === 'member' ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <Users className={`h-10 w-10 ${
                hoveredRole === 'member' ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Member</h2>
            <p className="text-muted-foreground text-center mb-6">
              View your profile, track your attendance and manage your membership
            </p>
            <Button 
              className={`mt-auto ${hoveredRole === 'member' ? 'btn-primary' : 'btn-outline'}`} 
              onClick={() => navigate('/member')}
            >
              Enter as Member
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} RFID Attendance System | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Index;
