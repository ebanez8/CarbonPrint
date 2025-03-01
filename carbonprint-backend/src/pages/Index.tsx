import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Graph from '@/components/Graph';
import SmartEcoAdvisor from '@/components/SmartEcoAdvisor';
import ScanHistory from '@/components/ScanHistory';

interface ScanHistoryType {
  // Define the properties of ScanHistoryType
}

interface UserStats {
  totalScans: number;
  totalEcoChoices: number;
  ecoPoints: number;
  carbonSaved: number;
}

const Index = () => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const [scanHistory, setScanHistory] = useState<ScanHistoryType[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalScans: 0,
    totalEcoChoices: 0,
    ecoPoints: 0,
    carbonSaved: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/scans/history', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success) {
            setScanHistory(data.data.history);
            setUserStats(data.data.stats);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <Button onClick={logout}>Logout</Button>
      </header>

      <Graph history={scanHistory} />
      
      <SmartEcoAdvisor
        history={scanHistory}
        stats={userStats}
        onSuggestAlternative={async (barcode) => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/products/alternative/${barcode}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const data = await response.json();
            return data.success ? data.data : null;
          } catch (error) {
            console.error('Error fetching alternative product:', error);
            return null;
          }
        }}
      />

      {scanHistory.length > 0 && (
        <ScanHistory
          history={scanHistory}
          stats={userStats}
        />
      )}
    </div>
  );
};

export default Index;
