"use client";
import MeetingTypeList from '@/components/MeetingTypeList';
import { useMeetingTime } from '@/hooks/useMeetingDate';
import { useGetCalls } from '@/hooks/useGetCalls'; // Assuming this is where you get meetings
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Call, CallRecording } from '@stream-io/video-client'; // Adjust the import based on your setup

const Home = () => {
  const { upcomingCalls } = useGetCalls(); // Fetch upcoming calls
  const [closestMeeting, setClosestMeeting] = useState<Call | CallRecording | null>(null);

  // Memoized current time
  const now = useMemo(() => new Date(), []);

  // Get the current time and date in the Indian time zone (Asia/Kolkata)
  const currentTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  const currentDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  // Type guard to differentiate between Call and CallRecording
  const isCall = (obj: Call | CallRecording): obj is Call => {
    return (obj as Call).state !== undefined;
  };

  // Memoized function to find the closest upcoming meeting
  const findClosestMeeting = useCallback(() => {
    if (!upcomingCalls || upcomingCalls.length === 0) return null;

    // Sort meetings by time and find the closest one
    const sortedMeetings = upcomingCalls.sort((a: Call | CallRecording, b: Call | CallRecording) => {
      // Handle 'a'
      const timeA = isCall(a)
        ? new Date(a.state?.startsAt ?? new Date().toISOString()).getTime() // Fallback to current time if undefined
        : new Date(a.start_time ?? new Date().toISOString()).getTime(); // Fallback to current time if undefined

      // Handle 'b'
      const timeB = isCall(b)
        ? new Date(b.state?.startsAt ?? new Date().toISOString()).getTime() // Fallback to current time if undefined
        : new Date(b.start_time ?? new Date().toISOString()).getTime(); // Fallback to current time if undefined

      return timeA - timeB;
    });

    // Filter meetings that are in the future and find the closest
    const futureMeetings = sortedMeetings.filter((meeting: Call | CallRecording) => {
      const meetingTime = isCall(meeting)
        ? new Date(meeting.state?.startsAt ?? new Date().toISOString()).getTime() // Fallback to current time if undefined
        : new Date(meeting.start_time ?? new Date().toISOString()).getTime(); // Fallback to current time if undefined

      return meetingTime > now.getTime(); // Only future meetings
    });

    return futureMeetings[0] || null; // Return the closest future meeting or null
  }, [upcomingCalls, now]); // Include `upcomingCalls` and `now` as dependencies

  // Set the closest meeting when upcomingCalls updates
  useEffect(() => {
    const closest = findClosestMeeting();
    setClosestMeeting(closest);
  }, [findClosestMeeting]); // Include `findClosestMeeting` in dependencies

  // Always call useMeetingTime to adhere to hooks rules, but handle null case later
  const upcomingMeetingTime = useMeetingTime(closestMeeting || ({} as Call | CallRecording));

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            {upcomingMeetingTime ? (
              <h2>Upcoming Meeting at: {upcomingMeetingTime}</h2>
            ) : (
              <h2>No Upcoming Meetings</h2>
            )}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{currentTime}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{currentDate}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
