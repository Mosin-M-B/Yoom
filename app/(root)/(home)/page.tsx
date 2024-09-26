"use client";
import MeetingTypeList from '@/components/MeetingTypeList';
import { useGetCalls } from '@/hooks/useGetCalls';
import { useMeetingTime } from '@/hooks/useMeetingDate';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useCallback, useEffect, useState } from 'react';

const Home = () => {
  const { upcomingCalls } = useGetCalls();
  const [closestMeeting, setClosestMeeting] = useState<Call | CallRecording | null>(null);

  const now = new Date();

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

  const findClosestMeeting = useCallback((): Call | CallRecording | null => {
    if (!upcomingCalls || upcomingCalls.length === 0) return null;
  
    // Ensure you're using valid fields from the Call type
    const sortedMeetings = upcomingCalls
      .filter((meeting) => {
        // Filter out meetings with invalid times
        const startsAt = meeting.state?.startsAt;
        return startsAt && !isNaN(new Date(startsAt).getTime());
      })
      .sort((a, b) => {
        const timeA = new Date(a.state?.startsAt).getTime();
        const timeB = new Date(b.state?.startsAt).getTime();
        return timeA - timeB;
      });
  
    const futureMeetings = sortedMeetings.filter((meeting) => {
      const meetingTime = new Date(meeting.state?.startsAt).getTime();
      return meetingTime > now.getTime(); // Only future meetings
    });
  
    return futureMeetings[0] || null;
  }, [upcomingCalls, now]);
  
  
  

  useEffect(() => {
    const closest = findClosestMeeting();
    setClosestMeeting(closest);
  }, [findClosestMeeting, now]); // Include 'now' if necessary

  const upcomingMeetingTime = useMeetingTime(closestMeeting);

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
