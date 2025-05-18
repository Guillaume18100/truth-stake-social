
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import ScoreBadge from '@/components/ScoreBadge';
import ReputationChip from '@/components/ReputationChip';
import { useUIStore } from '@/store/ui';
import { getMockNews, getXrplExplorerLink, formatAddress } from '@/lib/utils';
import WalletButton from '@/components/WalletButton';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [news, setNews] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);
  const { openStakeModal, openWitnessModal, openVictimEnroll } = useUIStore();
  
  // Mock connecting wallet
  const handleConnectWallet = () => {
    const mockAddress = 'rNa3BKePPaKxCFhaCRTRzXKGh4XkTYvATT';
    setWalletAddress(mockAddress);
    toast({
      title: 'Wallet connected',
      description: 'Your wallet has been connected successfully.',
    });
  };

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get mock news data
        const mockNews = getMockNews(15);
        const foundNews = mockNews.find(item => item.id === id);
        
        if (foundNews) {
          // Add additional details for the detail page
          setNews({
            ...foundNews,
            content: {
              summary: "This article contains misleading claims about economic statistics that are not supported by official data sources. The author makes several assertions that contradict reports from the Bureau of Economic Analysis.",
              evidenceLinks: [
                "https://example.com/official-report",
                "https://example.com/fact-check"
              ]
            },
            witnesses: Array.from({ length: 3 }).map((_, i) => ({
              id: `witness-${i+1}`,
              name: `Witness${i+1}`,
              reputation: Math.floor(Math.random() * 100),
              statement: "I can confirm that the data presented in this article contradicts official records that I have access to through my professional role.",
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000)
            })),
            xrplScores: {
              trueStakes: 2500000, // in drops (2.5 XRP)
              falseStakes: 1800000, // in drops (1.8 XRP)
              transactions: [
                {
                  txHash: "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0",
                  amount: 1000000, // in drops (1 XRP)
                  prediction: "TRUE",
                  timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
                },
                {
                  txHash: "Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0",
                  amount: 500000, // in drops (0.5 XRP)
                  prediction: "FALSE",
                  timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
                },
                {
                  txHash: "A9Z8Y7X6W5V4U3T2S1R0Q9P8O7N6M5L4K3J2I1H0",
                  amount: 800000, // in drops (0.8 XRP)
                  prediction: "TRUE",
                  timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
                }
              ]
            }
          });
        } else {
          // Handle not found
          toast({
            title: "News not found",
            description: "The requested news item could not be found.",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching news details:", error);
        toast({
          title: "Error loading news",
          description: "Failed to load the news details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    }
  }, [id, navigate, toast]);

  // Function to format XRP amounts from drops
  const formatXrp = (drops: number) => {
    return (drops / 1000000).toFixed(6);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col">
        <header className="py-6 px-6 border-b border-border">
          <h1 className="text-2xl font-bold text-white">FakeNews <span className="text-orange">Litigation</span></h1>
        </header>
        <main className="flex-1 py-8 px-6 flex justify-center items-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-64 bg-muted rounded w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">FakeNews <span className="text-orange">Litigation</span></h1>
          <p className="text-sm text-muted-foreground">Social platform for fake news accountability</p>
        </div>
        <WalletButton address={walletAddress} onConnect={handleConnectWallet} />
      </header>
      
      {/* Main content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mb-6 text-muted-foreground hover:text-white"
          >
            &larr; Back to Feed
          </Button>
          
          <Card className="bg-navy-light border-muted mb-8">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{news.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>Reported {formatDistanceToNow(news.createdAt)} ago</span>
                    <span>•</span>
                    <span>By: {news.submittedBy.name}</span>
                    <ReputationChip score={news.submittedBy.reputation} className="ml-1" />
                  </div>
                </div>
                <ScoreBadge 
                  aiScore={news.aiScore} 
                  crowdScore={news.crowdScore} 
                  className="self-start flex-shrink-0"
                />
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Source</h2>
                <a 
                  href={news.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  {news.url}
                </a>
              </div>
              
              <Separator className="my-6" />
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Summary</h2>
                <p className="text-muted-foreground">{news.content.summary}</p>
                
                {news.content.evidenceLinks && news.content.evidenceLinks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium text-white mb-2">Evidence Links</h3>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {news.content.evidenceLinks.map((link: string, index: number) => (
                        <li key={index}>
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <Separator className="my-6" />
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">Actions</h2>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => openStakeModal(news.id)}
                    className="bg-orange hover:bg-orange-light"
                  >
                    Stake XRP
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => openWitnessModal(news.id)}
                  >
                    Submit Witness Testimony
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => openVictimEnroll(news.id)}
                  >
                    Enroll as Victim
                  </Button>
                  <Button 
                    variant="ghost"
                    className="border border-dashed border-muted"
                  >
                    Download Evidence PDF
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <Tabs defaultValue="witnesses" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="witnesses">Witness Statements</TabsTrigger>
                  <TabsTrigger value="xrpl">XRPL Proofs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="witnesses" className="pt-4">
                  {news.witnesses && news.witnesses.length > 0 ? (
                    <div className="space-y-4">
                      {news.witnesses.map((witness: any) => (
                        <div key={witness.id} className="border border-muted rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{witness.name}</span>
                              <ReputationChip score={witness.reputation} />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(witness.createdAt)} ago
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">{witness.statement}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No witness statements yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => openWitnessModal(news.id)}
                      >
                        Be the first witness
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="xrpl" className="pt-4">
                  {news.xrplScores ? (
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-navy rounded-lg p-4 text-center">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">TRUE Stakes</h3>
                          <p className="text-xl font-bold text-white">{formatXrp(news.xrplScores.trueStakes)} XRP</p>
                        </div>
                        <div className="bg-navy rounded-lg p-4 text-center">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">FALSE Stakes</h3>
                          <p className="text-xl font-bold text-white">{formatXrp(news.xrplScores.falseStakes)} XRP</p>
                        </div>
                      </div>
                      
                      <h3 className="text-md font-medium text-white mb-3">Recent Transactions</h3>
                      <div className="space-y-3">
                        {news.xrplScores.transactions.map((tx: any, index: number) => (
                          <div key={index} className="border border-muted rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge 
                                  variant="outline" 
                                  className={tx.prediction === 'TRUE' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}
                                >
                                  {tx.prediction}
                                </Badge>
                                <span className="text-sm font-medium text-white">{formatXrp(tx.amount)} XRP</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(tx.timestamp)} ago
                              </p>
                            </div>
                            <a
                              href={getXrplExplorerLink(tx.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:underline"
                            >
                              View on XRPL Explorer
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No XRPL transactions yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => openStakeModal(news.id)}
                      >
                        Make the first stake
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 FakeNews Litigation Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-white">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-white">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-white">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsDetail;
