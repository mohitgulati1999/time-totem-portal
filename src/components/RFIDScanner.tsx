
import React, { useState, useEffect } from 'react';
import { ScanLine, CheckCircle2, XCircle } from 'lucide-react';
import { User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { fetchUserByRfid, toggleAttendance } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface RFIDScannerProps {
  onUserScanned: (user: User, isCheckIn: boolean) => void;
}

const RFIDScanner: React.FC<RFIDScannerProps> = ({ onUserScanned }) => {
  const [rfidInput, setRfidInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    user?: User;
    isCheckedIn?: boolean;
  } | null>(null);

  // Reset the scan result after 3 seconds
  useEffect(() => {
    if (scanResult) {
      const timer = setTimeout(() => {
        setScanResult(null);
        setRfidInput('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [scanResult]);

  const handleScan = async () => {
    setScanning(true);
    
    try {
      if (!rfidInput.trim()) {
        toast.error('Please enter an RFID tag ID');
        setScanning(false);
        return;
      }
      
      // Simulate scan delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch user by RFID tag
      const response = await fetchUserByRfid(rfidInput.trim());
      
      if (response.user) {
        // Toggle attendance (check in or out)
        const attendanceResponse = await toggleAttendance(response.user.id);
        
        setScanResult({
          success: true,
          user: response.user,
          isCheckedIn: attendanceResponse.isCheckIn
        });
        
        // Call the callback
        onUserScanned(response.user, attendanceResponse.isCheckIn);
        
        toast.success(
          attendanceResponse.isCheckIn 
            ? `${response.user.name} has been checked in` 
            : `${response.user.name} has been checked out`
        );
      }
    } catch (error) {
      console.error('Scan error:', error);
      setScanResult({
        success: false
      });
      toast.error('Unknown RFID tag or server error');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl transition-all duration-300 hover:shadow-md">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium mb-2">RFID Scanner</h3>
        <p className="text-sm text-muted-foreground">Scan a member's RFID tag to check them in or out</p>
      </div>
      
      <div className={`h-40 mb-4 flex items-center justify-center rounded-lg border-2 border-dashed transition-all duration-300 ${scanning ? 'border-primary' : 'border-muted'}`}>
        <div className="text-center">
          {scanResult ? (
            <div className="animate-fade-in">
              {scanResult.success ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                  <p className="font-medium">{scanResult.user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {scanResult.isCheckedIn ? 'Checked In' : 'Checked Out'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <XCircle className="h-12 w-12 text-red-500 mb-2" />
                  <p className="font-medium">Unknown Tag</p>
                  <p className="text-sm text-muted-foreground">Please try again</p>
                </div>
              )}
            </div>
          ) : (
            <div className={`flex flex-col items-center ${scanning ? 'animate-pulse-soft' : ''}`}>
              <ScanLine className={`h-12 w-12 mb-2 ${scanning ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm">
                {scanning ? 'Scanning...' : 'Ready to scan'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter RFID Tag ID"
          value={rfidInput}
          onChange={(e) => setRfidInput(e.target.value)}
          className="flex-1"
          disabled={scanning}
        />
        <Button 
          onClick={handleScan} 
          disabled={scanning}
          className="btn-primary"
        >
          Scan
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-center text-muted-foreground">
        <p>For demo, use: A1B2C3D4, E5F6G7H8, I9J0K1L2, M3N4O5P6, Q7R8S9T0</p>
      </div>
    </div>
  );
};

export default RFIDScanner;
