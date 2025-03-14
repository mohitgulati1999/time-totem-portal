
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Clock, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getTodayDate } from '@/lib/data';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  userAvatar?: string;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false,
  userAvatar,
  userName
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const today = getTodayDate();

  const handleBack = () => {
    if (location.pathname === '/admin' || location.pathname === '/member') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="rounded-full hover:bg-secondary transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>{today}</span>
          </div>
        </div>
      </div>
      
      {userAvatar && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-muted">
              <AvatarImage src={userAvatar} alt={userName || 'User'} />
              <AvatarFallback>
                <UserCircle className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            {userName && <span className="text-sm font-medium hidden md:inline-block">{userName}</span>}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
