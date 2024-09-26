"use client";
import MeetingTypeList from '@/components/MeetingTypeList';
import { useMeetingTime } from '@/hooks/useMeetingDate';
import { useGetCalls } from '@/hooks/useGetCalls'; // Assuming this is where you get meetings
import { useState, useEffect } from 'react';

const Home = () => {
  const { upcomingCalls } = useGetCalls(); // Fetch upcoming calls
  const [closestMeeting, setClosestMeeting] = useState(null);

  // Get the current time
  const now = new Date();

  // Get the current time and date in the Indian time zone (Asia/Kolkata)
  const currentTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });

  const currentDate = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata'
  });

  // Function to find the closest upcoming meeting
  const findClosestMeeting = () => {
    if (!upcomingCalls || upcomingCalls.length === 0) return null;

    // Sort meetings by time and find the closest one
    const sortedMeetings = upcomingCalls.sort((a: any, b: any) => {
      const timeA = new Date(a.state?.startsAt || a.start_time).getTime();
      const timeB = new Date(b.state?.startsAt || b.start_time).getTime();
      return timeA - timeB;
    });

    // Filter meetings that are in the future and find the closest
    const futureMeetings = sortedMeetings.filter((meeting: any) => {
      const meetingTime = new Date(meeting.state?.startsAt || meeting.start_time).getTime();
      return meetingTime > now.getTime(); // Only future meetings
    });

    return futureMeetings[0]; // The closest future meeting
  };

  // Set the closest meeting when upcomingCalls updates
  useEffect(() => {
    const closest = findClosestMeeting();
    setClosestMeeting(closest);
  }, [upcomingCalls]);

  // Get only the time for the closest meeting
  const upcomingMeetingTime = useMeetingTime(closestMeeting);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
           
            {
              upcomingMeetingTime ? (
                <h2>
                  Upcoming Meeting at: {upcomingMeetingTime}
                </h2>
              ):(
                  <h2>
                    No Upcoming Meetings
                  </h2>
              )
            }
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