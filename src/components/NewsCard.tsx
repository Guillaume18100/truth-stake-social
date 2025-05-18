
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ScoreBadge from './ScoreBadge';
import ReputationChip from './ReputationChip';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  id: string;
  title: string;
  url: string;
  submittedBy: {
    name: string;
    reputation: number;
  };
  aiScore: number;
  crowdScore: number;
  createdAt: Date;
  className?: string;
}

const NewsCard = ({
  id,
  title,
  url,
  submittedBy,
  aiScore,
  crowdScore,
  createdAt,
  className
}: NewsCardProps) => {
  // Extract domain from URL for display
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.startsWith('www.') ? domain.substring(4) : domain;
    } catch (e) {
      return url;
    }
  };

  return (
    <Card className="w-full bg-card hover:border-orange transition-all duration-200 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-white">
            {title}
          </CardTitle>
          <ScoreBadge aiScore={aiScore} crowdScore={crowdScore} />
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {getDomain(url)}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>By: {submittedBy.name}</span>
            <ReputationChip score={submittedBy.reputation} />
          </div>
          <span>{formatDistanceToNow(createdAt)} ago</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/news/${id}`}>View Details</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            Witness
          </Button>
          <Button variant="ghost" size="sm" className="text-orange hover:text-orange-light">
            Stake
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
