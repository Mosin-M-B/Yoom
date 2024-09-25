import MeetingTypeList from "../../../components/MeetingTypeList";


const Home = () => {
  const now = new Date();

  // Get time in the Indian time zone (Asia/Kolkata)
  const time = now.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZone: 'Asia/Kolkata' 
  });
  
  // Get date in the Indian time zone (Asia/Kolkata)
  const date = now.toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    timeZone: 'Asia/Kolkata' 
  });
  
  console.log(`Date: ${date}, Time: ${time}`);
  

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            Upcoming Meeting at: 12:30 PM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      < MeetingTypeList/>
    </section>
  );
};

export default Home;