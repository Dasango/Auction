import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, TrendingUp, Users, Clock } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Active Auctions" 
          value="12" 
          icon={<Gavel className="h-4 w-4 text-muted-foreground" />} 
          description="+2 from yesterday"
        />
        <StatsCard 
          title="Total Bids" 
          value="156" 
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} 
          description="+12% since last week"
        />
        <StatsCard 
          title="Watchlist" 
          value="24" 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
          description="5 items ending soon"
        />
        <StatsCard 
          title="Avg. Response" 
          value="1.2s" 
          icon={<Clock className="h-4 w-4 text-muted-foreground" />} 
          description="Real-time bidding active"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <ActivityItem 
                user="Alice Smith" 
                action="placed a bid on" 
                item="Vintage Rolex Submariner" 
                time="2 minutes ago" 
              />
              <ActivityItem 
                user="Bob Jones" 
                action="outbid you on" 
                item="Rare 1st Edition Charizard" 
                time="15 minutes ago" 
              />
              <ActivityItem 
                user="Charlie Brown" 
                action="started an auction for" 
                item="Leica M6 Body" 
                time="1 hour ago" 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Auctions Ending Soon</CardTitle>
            <CardDescription>Don't miss out on these items.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <EndingSoonItem item="MacBook Pro M3 Max" price="$2,400" timeLeft="45m" />
              <EndingSoonItem item="Herman Miller Aeron" price="$450" timeLeft="1h 20m" />
              <EndingSoonItem item="Sony A7R V" price="$3,100" timeLeft="3h 15m" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function StatsCard({ title, value, icon, description }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ user, action, item, time }: any) {
  return (
    <div className="flex items-center">
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">
          <span className="font-bold">{user}</span> {action} <span className="text-primary italic">{item}</span>
        </p>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

function EndingSoonItem({ item, price, timeLeft }: any) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0">
      <div>
        <p className="text-sm font-medium">{item}</p>
        <p className="text-xs text-muted-foreground">Current: {price}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-destructive">{timeLeft}</p>
      </div>
    </div>
  );
}

export default Dashboard;