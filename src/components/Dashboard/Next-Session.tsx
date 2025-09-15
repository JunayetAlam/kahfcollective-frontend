import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar } from 'lucide-react';

export default function NextSessions() {
  const sessions = [
    {
      id: 1,
      title: "Foundations of Faith - Live Q&A",
      time: "Tomorrow at 8:00 PM",
      participants: 89
    },
    {
      id: 2,
      title: "Foundations of Faith - Live Q&A",
      time: "Tomorrow at 8:00 PM",
      participants: 89
    },
    {
      id: 3,
      title: "Foundations of Faith - Live Q&A",
      time: "Tomorrow at 8:00 PM",
      participants: 89
    }
  ];

  return (
    <div className="py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Next Sessions</h1>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="space-y-3">
        {sessions.map((session) => (
          <Card key={session.id} className="w-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">
                    {session.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {session.time}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground ml-4">
                  <Users className="w-4 h-4" />
                  <span>{session.participants}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button variant="outline" className="w-full">
        <Calendar className="w-4 h-4 mr-2" />
        View Schedule
      </Button>
    </div>
  );
}