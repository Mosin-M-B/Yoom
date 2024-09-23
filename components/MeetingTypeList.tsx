"use client";
import { useToast } from "@/hooks/use-toast"
import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

const MeetingTypeList = () => {
  const { toast } = useToast()
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);

  const [values , setValues]= useState({
    dateTime : new Date(),
    description : '',
    link :''
  });
  const [callDetails, setCallDetails] = useState<Call>()
  const {user} = useUser();
  const client = useStreamVideoClient()
  const createMeeting = async()=>{
    if(!client|| !user)return;

    try {
      if(!values.dateTime){
        toast({title: "Pleas Select a Date And Time"});
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default',id);
      if(!call)throw new Error('Failed to create call');

      const startsAt = values.dateTime.toISOString() || 
      new Date (Date.now()).toDateString();
      const description = values.description || 'Instant meeting';
      await call.getOrCreate({
        data:{
          starts_at:startsAt,
          custom:{
            description
          }
        }
      })
      setCallDetails(call);

      if(!values.description){
        router.push(`/meeting/${call.id}`)
      }
      toast({title: "Meeting Created"})
    } catch (error) {
      console.log(error);
    
        toast({title: "Failed create meeting!!"})
      
    }
  }
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        className="bg-orange-1"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-blue-1"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-purple-1"
        handleClick={() => router.push("/recordings")}
      />

      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-yellow-1"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />
      <MeetingModal
      isOpen={meetingState==='isInstantMeeting'}
      onClose={()=>setMeetingState(undefined)}
      title="Start an Instant Meeting"
      className="text-center"
      buttonText="Start Meeting"
      handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
