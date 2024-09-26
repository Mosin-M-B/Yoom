// hooks/useMeetingDate.ts

import { Call, CallRecording } from '@stream-io/video-react-sdk';

export const useMeetingTime = (meeting: Call | CallRecording) => {
  const date = 
    (meeting as Call)?.state?.startsAt ||
    (meeting as CallRecording)?.start_time;
  
  return date ? new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  }) : '';
};
