"use client";

import React, { useEffect, useState } from "react";
import { Calendar as BigCalendar, View, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useData } from "@/context/DataContext";

const localizer = momentLocalizer(moment);

import { PostDialog } from "./PostDialog";

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  scheduledAt: Date
  platform: string
  content: string
  status: string
  postedAt?: Date
  events?: CalendarEvent[] // For grouped events
}

const SocialMediaCalendar = () => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());
  const { scheduledPosts, twitterStatus, refreshData } = useData();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isLoading = twitterStatus === null;
  const hasNoTwitter = twitterStatus === false;

  // Convert scheduled posts to calendar events
  useEffect(() => {
    const calendarEvents = scheduledPosts.map((post) => ({
      id: post.id,
      title: post.content,
      start: new Date(post.scheduledAt),
      end: new Date(new Date(post.scheduledAt).getTime() + 30 * 60 * 1000), // 30 min duration
      scheduledAt: new Date(post.scheduledAt),
      platform: post.platform,
      content: post.content,
      status: post.status,
      postedAt: post.postedAt ? new Date(post.postedAt) : undefined
    }));
    setEvents(calendarEvents);
  }, [scheduledPosts]);

  // Refresh data when Twitter status changes
  useEffect(() => {
    refreshData();
  }, [twitterStatus, refreshData]);

  // Group events by time period based on current view
  const groupEvents = () => {
    const groups: Record<string, CalendarEvent[]> = {};
    
    events.forEach(event => {
      let key;
      if (view === Views.MONTH) {
        // Group by day for month view
        key = event.start.toISOString().split('T')[0];
      } else if (view === Views.WEEK) {
        // Group by day for week view
        key = `${event.start.getDate()}-${event.start.getMonth()}`;
      } else {
        // Group by hour for day view
        key = `${event.start.getHours()}`;
      }
      
      groups[key] = groups[key] || [];
      groups[key].push(event);
    });
    
    return Object.entries(groups).map(([key, events]) => ({
      id: key,
      title: `${events.length} posts`,
      start: events[0].start,
      end: events[0].end,
      events,
      platform: 'group',
      content: '',
      status: 'group',
      scheduledAt: events[0].scheduledAt
    }));
  };

  // Custom Event Component showing post counts
  const EventCount = ({ event }: { event: CalendarEvent }) => (
    <div 
        className="
          flex justify-center items-center 
          p-1 rounded-full text-sm
          bg-primary/10 hover:bg-primary/20
          transition-colors cursor-pointer
          min-w-[24px] min-h-[24px]
          overflow-visible
          whitespace-nowrap
        "
      onClick={(e) => {
        e.stopPropagation();
        setSelectedPosts(event.events || []);
        setIsDialogOpen(true);
      }}
    >
      <span className="font-medium">
        {event.title}
      </span>
    </div>
  );

  // Navigation helper function
  const navigateCalendar = (direction: "prev" | "next") => {
    let newDate = new Date(date);
    if (view === Views.DAY) {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (view === Views.WEEK) {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (view === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setDate(newDate);
  };

  const goToToday = () => {
    setDate(new Date());
  };

  // Poll for published posts and refresh data
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        // Check for published posts
        const response = await fetch('/api/posts/scheduled', {
          method: 'PUT'
        });
        
        if (response.ok) {
          const { results } = await response.json();
          if (results && results.length > 0) {
            refreshData(); // Refresh if any posts were processed
          }
        }
      } catch (error) {
        console.error('Error polling for published posts:', error);
      }
    }, 60000); // Check every minute

    // Initial refresh
    refreshData();

    return () => clearInterval(pollInterval);
  }, [refreshData]);

  const headerLabel =
    view === Views.MONTH
      ? moment(date).format("MMMM YYYY")
      : view === Views.WEEK
      ? `Week of ${moment(date).format("MMMM Do, YYYY")}`
      : moment(date).format("dddd, MMMM Do, YYYY");

  return (
    <div className="flex h-full">
      {/* Main Calendar Area */}
      <div className="flex-1 p-4">
        <Card className="border-none shadow-none">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-2">
            <div className="mb-2 md:mb-0">
              <CardTitle className="text-lg font-semibold">Content Calendar</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => navigateCalendar("prev")}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateCalendar("next")}>
                  Next
                </Button>
              </div>
            </div>
            {/* Center Label */}
            <div className="hidden md:block text-lg font-semibold">{headerLabel}</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setView(Views.DAY)}>
                Day
              </Button>
              <Button variant="outline" size="sm" onClick={() => setView(Views.WEEK)}>
                Week
              </Button>
              <Button variant="outline" size="sm" onClick={() => setView(Views.MONTH)}>
                Month
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[70vh] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="lg" />
                    <span>Loading scheduled posts...</span>
                  </div>
                </div>
              ) : (
                <BigCalendar
                localizer={localizer}
                events={groupEvents()}
                components={{
                  event: EventCount,
                }}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                eventPropGetter={(event) => ({
                  style: {
                    cursor: 'pointer'
                  }
                })}
                toolbar={false}
                className="
                  rounded-lg 
                  [&_.rbc-header]:border-muted/80 [&_.rbc-header]:bg-transparent
                  [&_.rbc-month-view]:border-muted/80
                  [&_.rbc-time-view]:border-muted/30
                  [&_.rbc-agenda-view]:border-muted/30
                  [&_.rbc-today]:bg-accent/50
                  [&_.rbc-event-content]:min-h-[24px] [&_.rbc-event-content]:flex [&_.rbc-event-content]:items-center [&_.rbc-event-content]:justify-center
                  [&_.rbc-event]:min-h-[24px] [&_.rbc-event]:overflow-visible
                "
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedPosts.length > 0 && (
        <PostDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          posts={selectedPosts}
        />
      )}
    </div>
  );
};

export default SocialMediaCalendar;
