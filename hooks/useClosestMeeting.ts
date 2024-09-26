import { useState, useEffect, useCallback } from 'react';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useGetCalls } from '@/hooks/useGetCalls'; // Assuming you fetch upcoming calls here

const useClosestMeeting = () => {
  const { upcomingCalls } = useGetCalls(); // Fetch upcoming calls
  const [closestMeeting, setClosestMeeting] = useState<Call | CallRecording | null>(null);

  const now = new Date();

  const findClosestMeeting = useCallback((): Call | CallRecording | null => {
    if (!upcomingCalls || upcomingCalls.length === 0) return null;

    // Sort meetings by time and find the closest one
    const sortedMeetings = upcomingCalls.sort((a: Call | CallRecording, b: Call | CallRecording) => {
      const timeA = a instanceof Call
        ? new Date(a.state?.startsAt).getTime()  // `Call` uses `state.startsAt`
        : new Date(a.start_time).getTime();      // `CallRecording` uses `start_time`

      const timeB = b instanceof Call
        ? new Date(b.state?.startsAt).getTime()
        : new Date(b.start_time).getTime();

      return timeA - timeB;
    });

    // Filter meetings that are in the future and find the closest
    const futureMeetings = sortedMeetings.filter((meeting: Call | CallRecording) => {
      const meetingTime = meeting instanceof Call
        ? new Date(meeting.state?.startsAt).getTime()
        : new Date(meeting.start_time).getTime();

      return meetingTime > now.getTime(); // Only future meetings
    });

    return futureMeetings[0] || null; // The closest future meeting
  }, [upcomingCalls, now]);

  useEffect(() => {
    const closest = findClosestMeeting();
    setClosestMeeting(closest);
  }, [findClosestMeeting]);

  return closestMeeting;
};

export default useClosestMeeting;
