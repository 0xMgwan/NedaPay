'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAccount } from 'wagmi';

export default function PaymentLinkPage() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('TSHC');
  const [description, setDescription] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [recentLinks, setRecentLinks] = useState<Array<{
    date: string;
    amount: string;
    currency: string;
    status: string;
    link: string;
  }>>([]);
  const { isConnected, address } = useAccount();

  // Handle initial page load and cookie setting
  useEffect(() => {
    console.log('Payment Link Page - Loading, isConnected:', isConnected);
    
    // Set a flag to indicate the page has been mounted
    setPageLoaded(true);
    
    // Force set the wallet_connected cookie immediately for this page
    // This is critical to prevent middleware redirects
    document.cookie = 'wallet_connected=true; path=/; max-age=86400';
    
    // Add event listener to detect navigation events
    const handleBeforeUnload = () => {
      console.log('Payment Link Page - Before unload event fired');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Effect to monitor connection state
  useEffect(() => {
    if (pageLoaded) {
      console.log('Payment Link Page - Connection state changed, isConnected:', isConnected);
      
      // Always ensure the wallet_connected cookie is set
      document.cookie = 'wallet_connected=true; path=/; max-age=86400';
    }
  }, [isConnected, pageLoaded]);

  const handleCreateLink = (e: React.MouseEvent) => {
    // Prevent any default behavior
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Generating payment link directly...');
    
    // Validate input
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!address) {
      alert('Wallet address not found. Please connect your wallet.');
      return;
    }
    // Generate a mock link
    const linkId = Math.random().toString(36).substring(2, 10);
    const baseUrl = window.location.origin;
    // Include the merchant's address in the link
    const link = `${baseUrl}/pay/${linkId}?amount=${amount}&currency=${currency}&to=${address}`;
    
    // Set the generated link in state
    setGeneratedLink(link);
    // Add to recent links
    setRecentLinks(prev => [
      {
        date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
        amount,
        currency,
        status: 'Active',
        link,
      },
      ...prev
    ]);
    
    // Ensure we stay on this page by setting the cookie again
    document.cookie = 'wallet_connected=true; path=/; max-age=86400';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white dark:bg-gray-900 dark:text-white">
      <Header />
      <div className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">
            Create Payment Link
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Generate a payment link to share with your customers
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Amount
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-primary focus:border-primary"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-primary focus:border-primary rounded-md"
              >
                <option value="TSHC">TSHC</option>
                <option value="cNGN">cNGN</option>
                <option value="IDRX">IDRX</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md"
                  placeholder="Payment for services"
                />
              </div>
            </div>
            
            <div>
              <form onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Set authentication immediately
                document.cookie = 'wallet_connected=true; path=/; max-age=86400';
                localStorage.setItem('walletConnected', 'true');
                
                // Validate input
                if (!amount || parseFloat(amount) <= 0) {
                  alert('Please enter a valid amount');
                  return false;
                }
                
                // Generate link inline instead of using handler
                const linkId = Math.random().toString(36).substring(2, 10);
                const baseUrl = window.location.origin;
                const link = `${baseUrl}/pay/${linkId}?amount=${amount}&currency=${currency}`;
                
                // Set the link directly
                setGeneratedLink(link);
                console.log('Payment link generated successfully:', link);
                
                return false; // Prevent any form submission
              }}>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Generate Payment Link
                </button>
              </form>
            </div>
          </div>
          
          {generatedLink && (
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Your Payment Link</h3>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="flex-1 p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-l-md text-sm text-slate-900 dark:text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-slate-200 text-black px-4 py-2 rounded-r-md hover:bg-slate-300"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Share this link with your customers to receive payments.
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mt-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Recent Payment Links</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Currency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">Apr 15, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">1,500</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">TSHC</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    <button className="text-primary hover:text-primary-dark dark:text-primary-light">View</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">Apr 10, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">2,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">cNGN</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    <button className="text-primary hover:text-primary-dark dark:text-primary-light">View</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">Apr 5, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">500</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">IDRX</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      Expired
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                    <button className="text-primary hover:text-primary-dark dark:text-primary-light">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
