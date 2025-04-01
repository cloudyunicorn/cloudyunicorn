"use client";

import React, { useEffect, useState } from "react";
import { Calendar as BigCalendar, View, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Settings, CalendarIcon, MessageSquare, Image, Video, X } from "lucide-react";
import { AiFillLinkedin } from "react-icons/ai";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  platform: "twitter" | "linkedin";
  content: string;
}

const SocialMediaCalendar = () => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // Custom Event Component for calendar events.
  const Event = ({ event }: { event: CalendarEvent }) => (
    <div className="flex items-start p-1 bg-background rounded border border-muted">
      <div className={`w-2 h-full rounded-l ${event.platform === "twitter" ? "bg-blue-500" : "bg-[#0A66C2]"}`} />
      <div className="pl-2 flex-1">
        <div className="flex items-center gap-2">
          {event.platform === "twitter" ? (
            <X className="h-4 w-4 text-blue-500" />
          ) : (
            <AiFillLinkedin className="h-4 w-4 text-[#0A66C2]" />
          )}
          <span className="text-sm font-medium">{event.platform}</span>
        </div>
        <p className="text-sm truncate">{event.content}</p>
      </div>
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

  // Dummy fetch function; replace with your actual API call.
  useEffect(() => {
    async function fetchEvents() {
      // Dummy data for demonstration.
      const posts: CalendarEvent[] = [
        {
          id: "1",
          title: "Scheduled: Meeting",
          start: new Date("2025-04-10T10:00:00Z"),
          end: new Date(new Date("2025-04-10T10:00:00Z").getTime() + 60 * 60 * 1000),
          platform: "twitter",
          content: "Team meeting announcement",
        },
        {
          id: "2",
          title: "Posted: Event Recap",
          start: new Date("2025-04-05T14:00:00Z"),
          end: new Date(new Date("2025-04-05T14:00:00Z").getTime() + 60 * 60 * 1000),
          platform: "linkedin",
          content: "Recap of our recent event",
        },
      ];
      setEvents(posts);
    }
    fetchEvents();
  }, []);

  const headerLabel =
    view === Views.MONTH
      ? moment(date).format("MMMM YYYY")
      : view === Views.WEEK
      ? `Week of ${moment(date).format("MMMM Do, YYYY")}`
      : moment(date).format("dddd, MMMM Do, YYYY");

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Main Calendar Area */}
      <div className="flex-1 p-6">
        <Card>
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
              <Button className="ml-4" onClick={() => setShowSidebar(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Post
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              style={{ height: "70vh" }}
              components={{
                event: Event,
              }}
              eventPropGetter={(event) => ({
                className: "!bg-background !border-muted hover:border-primary cursor-pointer",
              })}
              toolbar={false}
              className="rounded-lg border bg-background"
            />
          </CardContent>
        </Card>
      </div>

      {/* Scheduling Sidebar */}
      {showSidebar && (
        <div className="w-96 border-l bg-background p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Schedule New Post</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-blue-500" />
                    Twitter
                  </div>
                </SelectItem>
                <SelectItem value="linkedin">
                  <div className="flex items-center gap-2">
                    <AiFillLinkedin className="h-4 w-4 text-[#0A66C2]" />
                    LinkedIn
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-24">
                <MessageSquare className="mr-2 h-4 w-4" />
                Text
              </Button>
              <Button variant="outline" className="h-24">
                <Image className="mr-2 h-4 w-4" />
                Image
              </Button>
              <Button variant="outline" className="h-24">
                <Video className="mr-2 h-4 w-4" />
                Video
              </Button>
            </div>

            <Input placeholder="Write your post content..." className="h-32" />

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="date"
                  value={date.toISOString().substring(0, 10)}
                  onChange={(e) => setDate(new Date(e.target.value))}
                  className="p-2 border rounded"
                />
              </div>
              <Button className="flex-1">Schedule Post</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaCalendar;
