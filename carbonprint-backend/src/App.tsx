import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import Index from '@/pages/Index';

function App() {
  return (
    <AuthProvider>
      <Index />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
