import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Collection from "@/pages/Collection";
import Collections from "@/pages/Collections";
import ProductDetail from "@/pages/ProductDetail";
import Search from "@/pages/Search";
import About from "@/pages/About";
import Community from "@/pages/Community";
import Ambassador from "@/pages/Ambassador";
import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/collections" component={Collections} />
      <Route path="/collections/:handle" component={Collection} />
      <Route path="/products/:handle" component={ProductDetail} />
      <Route path="/search" component={Search} />
      <Route path="/about" component={About} />
      <Route path="/community" component={Community} />
      <Route path="/ambassador" component={Ambassador} />
      <Route path="/contact" component={Contact} />
      <Route path="/affiliate-disclosure" component={About} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
